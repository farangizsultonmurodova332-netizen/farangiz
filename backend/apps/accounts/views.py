from datetime import timedelta
import random

from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password, make_password
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.core.mail import send_mail
from django.core.cache import cache
from django.db.models import BooleanField, Count, Exists, F, OuterRef, Value
from django.db.models.functions import Coalesce
from django.utils import timezone
from rest_framework import generics, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import FormParser, MultiPartParser, JSONParser
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from apps.ideas.models import Comment
from apps.ideas.serializers import CommentSerializer
from apps.notifications.models import Notification
from .models import Follow, PasswordResetOTP
from .serializers import (
    AdminUserSerializer,
    RegisterSerializer,
    UserMeSerializer,
    UserProfileSerializer,
    UserSerializer,
    UserUpdateSerializer,
)

User = get_user_model()

OTP_EXPIRY_MINUTES = int(getattr(settings, 'PASSWORD_OTP_EXPIRY_MINUTES', 10))
OTP_RESEND_COOLDOWN_SECONDS = int(getattr(settings, 'PASSWORD_OTP_RESEND_COOLDOWN_SECONDS', 60))
OTP_MAX_ATTEMPTS = int(getattr(settings, 'PASSWORD_OTP_MAX_ATTEMPTS', 5))


def set_refresh_cookie(response: Response, refresh_token: str) -> None:
    response.set_cookie(
        settings.REFRESH_COOKIE_NAME,
        refresh_token,
        httponly=True,
        secure=settings.REFRESH_COOKIE_SECURE,
        samesite=settings.REFRESH_COOKIE_SAMESITE,
        domain=settings.REFRESH_COOKIE_DOMAIN,
        max_age=60 * 60 * 24 * int(getattr(settings, 'JWT_REFRESH_DAYS', 7)),
    )


def clear_refresh_cookie(response: Response) -> None:
    response.delete_cookie(
        settings.REFRESH_COOKIE_NAME,
        domain=settings.REFRESH_COOKIE_DOMAIN,
        samesite=settings.REFRESH_COOKIE_SAMESITE,
        path="/",
    )


def should_include_refresh(request) -> bool:
    value = request.data.get('include_refresh')
    if isinstance(value, bool):
        return value
    if isinstance(value, str):
        return value.lower() in ('1', 'true', 'yes', 'on')
    return False


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
    parser_classes = [MultiPartParser, FormParser, JSONParser]


class LoginView(TokenObtainPairView):
    serializer_class = TokenObtainPairSerializer
    throttle_scope = 'login'

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == status.HTTP_200_OK:
            refresh = response.data.get('refresh')
            if refresh:
                if should_include_refresh(request):
                    return response
                set_refresh_cookie(response, refresh)
                response.data.pop('refresh', None)
        return response


class RefreshView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        refresh_token = request.data.get('refresh') or request.COOKIES.get(settings.REFRESH_COOKIE_NAME)
        serializer = TokenRefreshSerializer(data={'refresh': refresh_token})
        serializer.is_valid(raise_exception=True)
        response = Response(serializer.validated_data, status=status.HTTP_200_OK)
        if 'refresh' in serializer.validated_data:
            if should_include_refresh(request):
                return response
            set_refresh_cookie(response, serializer.validated_data['refresh'])
            response.data.pop('refresh', None)
        return response


class LogoutView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        response = Response({'detail': 'Signed out.'}, status=status.HTTP_200_OK)
        if request.user and request.user.is_authenticated:
            cache.set(f"user:presence:{request.user.id}", False, timeout=90)
        clear_refresh_cookie(response)
        return response


class PasswordOTPRequestView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        now = timezone.now()
        active_otp = PasswordResetOTP.objects.filter(
            user=user,
            used_at__isnull=True,
            expires_at__gt=now,
        ).order_by('-created_at').first()

        if active_otp and (now - active_otp.created_at).total_seconds() < OTP_RESEND_COOLDOWN_SECONDS:
            remaining = int(OTP_RESEND_COOLDOWN_SECONDS - (now - active_otp.created_at).total_seconds())
            return Response(
                {'detail': 'Please wait before requesting a new code.', 'retry_after': remaining},
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )

        PasswordResetOTP.objects.filter(user=user, used_at__isnull=True).update(used_at=now)

        code = f"{random.randint(0, 999999):06d}"
        expires_at = now + timedelta(minutes=OTP_EXPIRY_MINUTES)
        PasswordResetOTP.objects.create(
            user=user,
            code_hash=make_password(code),
            expires_at=expires_at,
        )

        message = (
            f"Your password change code is {code}. "
            f"It expires in {OTP_EXPIRY_MINUTES} minutes."
        )
        send_mail(
            subject="Your password change code",
            message=message,
            from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', None),
            recipient_list=[user.email],
            fail_silently=False,
        )

        return Response({'detail': 'OTP sent.'}, status=status.HTTP_200_OK)


class PasswordOTPVerifyView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        code = str(request.data.get('code', '')).strip()
        password = request.data.get('password', '')

        if not code:
            return Response({'detail': 'Code is required.'}, status=status.HTTP_400_BAD_REQUEST)

        if password:
            try:
                validate_password(password, user=user)
            except ValidationError as error:
                message = error.messages[0] if error.messages else 'Invalid password.'
                return Response({'detail': message}, status=status.HTTP_400_BAD_REQUEST)

        now = timezone.now()
        otp = PasswordResetOTP.objects.filter(
            user=user,
            used_at__isnull=True,
            expires_at__gt=now,
        ).order_by('-created_at').first()

        if not otp:
            return Response({'detail': 'OTP code is invalid or expired.'}, status=status.HTTP_400_BAD_REQUEST)

        if otp.attempt_count >= OTP_MAX_ATTEMPTS:
            otp.used_at = now
            otp.save(update_fields=['used_at'])
            return Response({'detail': 'OTP code expired. Request a new one.'}, status=status.HTTP_400_BAD_REQUEST)

        if not check_password(code, otp.code_hash):
            otp.attempt_count += 1
            if otp.attempt_count >= OTP_MAX_ATTEMPTS:
                otp.used_at = now
            otp.save(update_fields=['attempt_count', 'used_at'])
            return Response({'detail': 'OTP code is invalid.'}, status=status.HTTP_400_BAD_REQUEST)

        if password:
            user.set_password(password)
            user.save(update_fields=['password'])
            otp.used_at = now
            otp.save(update_fields=['used_at'])
            return Response({'detail': 'Password updated.'}, status=status.HTTP_200_OK)

        return Response({'detail': 'OTP verified.'}, status=status.HTTP_200_OK)


class MeView(generics.RetrieveAPIView):
    serializer_class = UserMeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        user_id = self.request.user.id
        return User.objects.annotate(
            followers_count=Coalesce(Count('followers', distinct=True), 0),
            following_count=Coalesce(Count('following', distinct=True), 0),
            total_ideas=Coalesce(Count('ideas', distinct=True), 0),
            total_likes_received=Coalesce(Count('ideas__likes', distinct=True), 0),
            is_following=Value(False, output_field=BooleanField()),
            reputation=F('followers_count') + F('total_likes_received'),
        ).get(id=user_id)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.AllowAny]
    search_fields = ('username',)

    def get_queryset(self):
        user = self.request.user if self.request.user.is_authenticated else None
        search = self.request.query_params.get('search')
        queryset = (
            User.objects.all()
            .annotate(
                followers_count=Coalesce(Count('followers', distinct=True), 0),
                following_count=Coalesce(Count('following', distinct=True), 0),
                total_ideas=Coalesce(Count('ideas', distinct=True), 0),
                total_likes_received=Coalesce(Count('ideas__likes', distinct=True), 0),
                comments_count=Coalesce(Count('comments', distinct=True), 0),
            )
        )
        if search:
            queryset = queryset.filter(username__icontains=search)
        if user:
            queryset = queryset.annotate(
                is_following=Exists(
                    Follow.objects.filter(follower=user, following=OuterRef('pk'))
                )
            )
        else:
            queryset = queryset.annotate(is_following=Value(False, output_field=BooleanField()))
        queryset = queryset.annotate(
            reputation=F('followers_count') + F('total_likes_received') + F('comments_count')
        )
        return queryset

    @action(
        detail=False,
        methods=['get', 'patch'],
        permission_classes=[permissions.IsAuthenticated],
        parser_classes=[MultiPartParser, FormParser, JSONParser],
    )
    def me(self, request):
        if request.method == 'PATCH':
            serializer = UserUpdateSerializer(request.user, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
        user = self.get_queryset().get(id=request.user.id)
        serializer = UserMeSerializer(user, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def follow(self, request, pk=None):
        target = self.get_object()
        if target.id == request.user.id:
            return Response({'detail': 'You cannot follow yourself.'}, status=status.HTTP_400_BAD_REQUEST)
        follow, created = Follow.objects.get_or_create(follower=request.user, following=target)
        if not created:
            follow.delete()
            return Response({'detail': 'Unfollowed.'}, status=status.HTTP_200_OK)
        Notification.objects.create(
            user=target,
            actor=request.user,
            notification_type='follow',
            message=f'{request.user.username} followed you.',
        )
        return Response({'detail': 'Followed.'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get'], url_path='comments')
    def comments(self, request, pk=None):
        target = self.get_object()
        queryset = Comment.objects.select_related('author', 'idea').filter(author=target).annotate(
            like_count=Coalesce(Count('likes', distinct=True), 0)
        ).order_by('-created_at')

        if request.user.is_authenticated:
            from apps.ideas.models import CommentLike
            queryset = queryset.annotate(
                user_liked=Exists(CommentLike.objects.filter(comment=OuterRef('pk'), user=request.user))
            )
        else:
            queryset = queryset.annotate(user_liked=Value(False, output_field=BooleanField()))

        serializer = CommentSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)

    @action(
        detail=False,
        methods=['post'],
        url_path='me/avatar',
        permission_classes=[permissions.IsAuthenticated],
        parser_classes=[MultiPartParser, FormParser],
    )
    def avatar(self, request):
        avatar = request.FILES.get('avatar')
        if not avatar:
            return Response({'detail': 'Avatar file is required.'}, status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        user.avatar_file = avatar
        user.save(update_fields=['avatar_file'])
        if user.avatar_file:
            user.avatar_url = request.build_absolute_uri(user.avatar_file.url)
            user.save(update_fields=['avatar_url'])

        return Response({'avatar_url': user.avatar_url}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get'], url_path='followers')
    def followers(self, request, pk=None):
        target = self.get_object()
        queryset = self.get_queryset().filter(following__following=target)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'], url_path='following')
    def following(self, request, pk=None):
        target = self.get_object()
        queryset = self.get_queryset().filter(followers__follower=target)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class AdminUserViewSet(viewsets.ModelViewSet):
    serializer_class = AdminUserSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = User.objects.all().order_by('-date_joined')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    ordering_fields = ('date_joined', 'last_login', 'username', 'email')


from .models import UserDevice
from .serializers import UserDeviceSerializer

class DeviceViewSet(viewsets.ModelViewSet):
    serializer_class = UserDeviceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def get_queryset(self):
        return UserDevice.objects.filter(user=self.request.user, is_active=True).order_by('-last_active')

    def create(self, request, *args, **kwargs):
        device_id = request.data.get('device_id')
        device_name = request.data.get('device_name', '')
        refresh_token = request.data.get('refresh_token', '')

        if not device_id:
            return Response({'detail': 'device_id is required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Use update_or_create to handle existing devices
        device, created = UserDevice.objects.update_or_create(
            device_id=device_id,
            defaults={
                'user': request.user,
                'device_name': device_name,
                'refresh_token': refresh_token,
                'is_active': True,
                'last_active': timezone.now(),
            }
        )

        serializer = self.get_serializer(device)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def terminate(self, request, pk=None):
        device = self.get_object()

        # Blacklist the refresh token if it exists
        if device.refresh_token:
            try:
                from rest_framework_simplejwt.tokens import RefreshToken
                from rest_framework_simplejwt.exceptions import TokenError
                token = RefreshToken(device.refresh_token)
                token.blacklist()
            except (TokenError, Exception):
                # Token may already be invalid or expired
                pass

        device.is_active = False
        device.refresh_token = None
        device.save()

        # Send WebSocket notification to all user's devices to refresh their list
        try:
            from channels.layers import get_channel_layer
            from asgiref.sync import async_to_sync
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                f"user_{request.user.id}",
                {
                    "type": "device_terminated",
                    "device_id": device.device_id,
                    "device_name": device.device_name,
                }
            )
        except Exception:
            pass  # WebSocket notification is best-effort

        return Response({'detail': 'Device terminated and logged out.'})

    @action(detail=False, methods=['post'])
    def deactivate(self, request):
        """Deactivate the current device on logout."""
        device_id = request.data.get('device_id')
        if not device_id:
            return Response({'detail': 'device_id is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            device = UserDevice.objects.get(device_id=device_id, user=request.user, is_active=True)
            device.is_active = False
            device.refresh_token = None
            device.save()
            return Response({'detail': 'Device deactivated.'})
        except UserDevice.DoesNotExist:
            return Response({'detail': 'Device not found.'}, status=status.HTTP_404_NOT_FOUND)

