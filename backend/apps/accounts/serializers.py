from django.contrib.auth import get_user_model
from urllib.parse import urlparse
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework import serializers

User = get_user_model()

def resolve_avatar_url(obj, request):
    if obj.avatar_url:
        if request:
            parsed = urlparse(obj.avatar_url)
            if parsed.scheme in ('http', 'https') and parsed.netloc in (
                'localhost',
                '127.0.0.1',
                'localhost:8000',
                '127.0.0.1:8000',
            ):
                return f"{request.scheme}://{request.get_host()}{parsed.path}"
            if obj.avatar_url.startswith('/'):
                return request.build_absolute_uri(obj.avatar_url)
        return obj.avatar_url
    if obj.avatar_file and request:
        return request.build_absolute_uri(obj.avatar_file.url)
    if obj.avatar_file:
        return obj.avatar_file.url
    return None


class UserSerializer(serializers.ModelSerializer):
    bio = serializers.CharField(max_length=500, required=False, allow_blank=True)
    avatar_url = serializers.URLField(required=False, allow_blank=True)
    birth_date = serializers.DateField(required=False, allow_null=True)
    phone = serializers.CharField(max_length=30, required=False, allow_blank=True)
    location = serializers.CharField(max_length=255, required=False, allow_blank=True)
    portfolio_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'bio', 'avatar_url', 'birth_date', 'phone', 'location', 'latitude', 'longitude', 'portfolio_url')

    def get_portfolio_url(self, obj):
        request = self.context.get('request')
        if obj.portfolio_file and request:
            return request.build_absolute_uri(obj.portfolio_file.url)
        if obj.portfolio_file:
            return obj.portfolio_file.url
        return None

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['avatar_url'] = resolve_avatar_url(instance, self.context.get('request'))
        return data


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, min_length=8, max_length=128)
    email = serializers.EmailField(required=True, max_length=254)
    username = serializers.CharField(required=True, min_length=3, max_length=150)
    bio = serializers.CharField(max_length=500, required=False, allow_blank=True)
    birth_date = serializers.DateField(required=True)
    phone = serializers.CharField(required=True, max_length=30)
    location = serializers.CharField(required=True, max_length=255)
    portfolio_file = serializers.FileField(required=True, allow_null=False)

    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'email',
            'password',
            'bio',
            'birth_date',
            'phone',
            'location',
            'portfolio_file',
        )

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        if not password:
            raise serializers.ValidationError({'password': 'Password is required.'})
        try:
            validate_password(password)
        except ValidationError as error:
            raise serializers.ValidationError({'password': error.messages[0] if error.messages else 'Invalid password.'})

        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

    def validate_portfolio_file(self, value):
        content_type = getattr(value, 'content_type', '') or ''
        allowed = {
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/zip',
        }
        if content_type not in allowed:
            raise serializers.ValidationError('Portfolio must be a PDF, DOC, DOCX, or ZIP file.')
        return value

    def validate_username(self, value):
        """Validate username format"""
        if not value.replace('_', '').replace('.', '').replace('-', '').replace('+', '').replace('@', '').isalnum():
            raise serializers.ValidationError(
                'Username can only contain letters, numbers, and @/./+/-/_ characters.'
            )
        return value


class UserProfileSerializer(serializers.ModelSerializer):
    followers_count = serializers.IntegerField(read_only=True)
    following_count = serializers.IntegerField(read_only=True)
    total_ideas = serializers.IntegerField(read_only=True)
    total_likes_received = serializers.IntegerField(read_only=True)
    is_following = serializers.BooleanField(read_only=True)
    reputation = serializers.IntegerField(read_only=True)
    avatar_url = serializers.URLField(required=False, allow_blank=True)
    birth_date = serializers.DateField(required=False, allow_null=True)
    phone = serializers.CharField(max_length=30, required=False, allow_blank=True)
    location = serializers.CharField(max_length=255, required=False, allow_blank=True)
    portfolio_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'bio',
            'avatar_url',
            'birth_date',
            'phone',
            'location',
            'portfolio_url',
            'followers_count',
            'following_count',
            'total_ideas',
            'total_likes_received',
            'is_following',
            'reputation',
            'latitude',
            'longitude',
        )

    def get_portfolio_url(self, obj):
        request = self.context.get('request')
        if obj.portfolio_file and request:
            return request.build_absolute_uri(obj.portfolio_file.url)
        if obj.portfolio_file:
            return obj.portfolio_file.url
        return None

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['avatar_url'] = resolve_avatar_url(instance, self.context.get('request'))
        return data


class UserMeSerializer(UserProfileSerializer):
    email = serializers.EmailField(required=False)

    class Meta(UserProfileSerializer.Meta):
        fields = UserProfileSerializer.Meta.fields + ('email', 'is_staff')


class UserUpdateSerializer(serializers.ModelSerializer):
    bio = serializers.CharField(max_length=500, required=False, allow_blank=True)
    avatar_url = serializers.URLField(required=False, allow_blank=True)
    email = serializers.EmailField(required=False)
    username = serializers.CharField(required=False, min_length=3, max_length=150)
    birth_date = serializers.DateField(required=False, allow_null=True)
    phone = serializers.CharField(max_length=30, required=False, allow_blank=True)
    location = serializers.CharField(max_length=255, required=False, allow_blank=True)
    location = serializers.CharField(max_length=255, required=False, allow_blank=True)
    portfolio_file = serializers.FileField(required=False, allow_null=True)
    avatar_file = serializers.FileField(required=False, allow_null=True)
    expo_push_token = serializers.CharField(max_length=255, required=False, allow_blank=True)
    latitude = serializers.FloatField(required=False, allow_null=True)
    longitude = serializers.FloatField(required=False, allow_null=True)

    class Meta:
        model = User
        fields = (
            'username',
            'email',
            'bio',
            'avatar_url',
            'birth_date',
            'phone',
            'location',
            'location',
            'portfolio_file',
            'avatar_file',
            'expo_push_token',
            'latitude',
            'longitude',
        )

    def update(self, instance, validated_data):
        # If a new avatar file is provided, clear the external avatar_url
        # so that the resolve_avatar_url function prioritizes the file.
        if 'avatar_file' in validated_data and validated_data['avatar_file']:
            instance.avatar_url = ''
            
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

    def validate_portfolio_file(self, value):
        content_type = getattr(value, 'content_type', '') or ''
        allowed = {
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/zip',
        }
        if content_type not in allowed:
            raise serializers.ValidationError('Portfolio must be a PDF, DOC, DOCX, or ZIP file.')
        return value


class AdminUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, min_length=10, max_length=128)
    birth_date = serializers.DateField(required=False, allow_null=True)

    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'bio',
            'avatar_url',
            'birth_date',
            'phone',
            'location',
            'portfolio_file',
            'is_active',
            'is_staff',
            'is_superuser',
            'last_login',
            'date_joined',
            'password',
        )
        read_only_fields = ('last_login', 'date_joined')

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        if password:
            validate_password(password, user=user)
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            validate_password(password, user=instance)
            instance.set_password(password)
        instance.save()
        return instance


from .models import UserDevice

class UserDeviceSerializer(serializers.ModelSerializer):
    refresh_token = serializers.CharField(write_only=True, required=False, allow_blank=True)
    is_current = serializers.SerializerMethodField()

    class Meta:
        model = UserDevice
        fields = ('id', 'device_id', 'device_name', 'last_active', 'is_active', 'created_at', 'refresh_token', 'is_current')
        read_only_fields = ('id', 'last_active', 'is_active', 'created_at')

    def get_is_current(self, obj):
        request = self.context.get('request')
        if not request:
            return False
        current_device_id = request.query_params.get('current_device_id', '')
        return obj.device_id == current_device_id if current_device_id else False

