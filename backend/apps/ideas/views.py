from datetime import timedelta
from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank
from django.db.models import BooleanField, Count, Exists, F, OuterRef, Q, Value
from django.db.models.functions import Coalesce
from django.utils import timezone
from django_filters.rest_framework import FilterSet, CharFilter
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.generics import DestroyAPIView, ListCreateAPIView
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.parsers import FormParser, MultiPartParser

from apps.notifications.models import Notification
from .models import Bookmark, Comment, CommentLike, Idea, IdeaLike, PublicComment
from .serializers import CommentSerializer, IdeaSerializer, PublicCommentSerializer


def get_request_language(request) -> str:
    raw = request.headers.get('Accept-Language', 'en')
    if ',' in raw:
        raw = raw.split(',', 1)[0]
    return raw.strip().lower()


class IdeaFilter(FilterSet):
    category = CharFilter(field_name='category', lookup_expr='iexact')
    tag = CharFilter(method='filter_tag')
    author = CharFilter(field_name='author_id')

    class Meta:
        model = Idea
        fields = ('category', 'tag', 'author')

    def filter_tag(self, queryset, name, value):
        return queryset.filter(tags__name__iexact=value)


class IsAuthorOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.author_id == request.user.id


class IdeaViewSet(viewsets.ModelViewSet):
    serializer_class = IdeaSerializer
    filterset_class = IdeaFilter
    parser_classes = [MultiPartParser, FormParser]
    search_fields = ('title', 'short_description', 'full_description')
    ordering_fields = ('created_at', 'like_count')
    ordering = ('-created_at',)

    def get_permissions(self):
        if self.action in ('create', 'like', 'following', 'bookmark', 'my_bookmarks'):
            return [permissions.IsAuthenticated()]
        if self.action in ('update', 'partial_update', 'destroy'):
            return [permissions.IsAuthenticated(), IsAuthorOrReadOnly()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        user = self.request.user if self.request.user.is_authenticated else None
        queryset = (
            Idea.objects.select_related('author')
            .prefetch_related('tags')
            .annotate(
                comment_count=Coalesce(Count('comments', distinct=True), 0),
                like_count=Coalesce(Count('likes', distinct=True), 0),
            )
        )

        # Full-text search if search query is provided
        search_query = self.request.query_params.get('search')
        if search_query:
            search_vector = SearchVector('title', weight='A') + \
                          SearchVector('short_description', weight='B') + \
                          SearchVector('full_description', weight='C')
            query = SearchQuery(search_query)
            queryset = queryset.annotate(
                rank=SearchRank(search_vector, query)
            ).filter(rank__gte=0.01).order_by('-rank')

        if user:
            queryset = queryset.annotate(
                user_liked=Exists(IdeaLike.objects.filter(idea=OuterRef('pk'), user=user)),
                user_bookmarked=Exists(Bookmark.objects.filter(idea=OuterRef('pk'), user=user))
            )
        else:
            queryset = queryset.annotate(
                user_liked=Value(False, output_field=BooleanField()),
                user_bookmarked=Value(False, output_field=BooleanField())
            )
        return queryset

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['lang'] = get_request_language(self.request)
        return context

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Increment view count
        Idea.objects.filter(pk=instance.pk).update(views_count=F('views_count') + 1)
        # Refresh from database to get updated view count
        instance.refresh_from_db()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        idea = self.get_object()
        like, created = IdeaLike.objects.get_or_create(idea=idea, user=request.user)
        if not created:
            like.delete()
            return Response({'detail': 'Like removed.'}, status=status.HTTP_200_OK)
        if idea.author_id != request.user.id:
            Notification.objects.create(
                user=idea.author,
                actor=request.user,
                notification_type='like',
                idea=idea,
                message=f'{request.user.username} liked your idea.',
            )
            
            # Send Push Notification
            if idea.author.expo_push_token:
                from apps.notifications.utils import send_push_to_user
                send_push_to_user(
                    idea.author,
                    title="New Like",
                    message=f"{request.user.username} liked your idea: {idea.title}",
                    data={"ideaId": idea.id}
                )
        return Response({'detail': 'Liked.'}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='trending')
    def trending(self, request):
        days = int(request.query_params.get('days', '7'))
        if days < 1:
            days = 7
        since = timezone.now() - timedelta(days=days)
        queryset = (
            self.get_queryset()
            .filter(created_at__gte=since)
            .annotate(likes_recent=Coalesce(Count('likes', filter=Q(likes__created_at__gte=since), distinct=True), 0))
            .order_by('-likes_recent', '-created_at')
        )
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='following')
    def following(self, request):
        queryset = self.get_queryset().filter(author__followers__follower=request.user)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def bookmark(self, request, pk=None):
        """Add or remove bookmark for an idea"""
        idea = self.get_object()
        bookmark, created = Bookmark.objects.get_or_create(idea=idea, user=request.user)
        if not created:
            bookmark.delete()
            return Response({'detail': 'Bookmark removed.', 'bookmarked': False}, status=status.HTTP_200_OK)
        return Response({'detail': 'Bookmarked.', 'bookmarked': True}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='bookmarks')
    def my_bookmarks(self, request):
        """Get list of user's bookmarked ideas"""
        bookmark_ids = Bookmark.objects.filter(user=request.user).values_list('idea_id', flat=True)
        queryset = self.get_queryset().filter(id__in=bookmark_ids)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class IdeaCommentsView(ListCreateAPIView):
    serializer_class = CommentSerializer
    pagination_class = None
    parser_classes = [MultiPartParser, FormParser]

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        user = self.request.user if self.request.user.is_authenticated else None
        queryset = Comment.objects.select_related('author').filter(idea_id=self.kwargs['idea_id']).annotate(
            like_count=Coalesce(Count('likes', distinct=True), 0)
        )
        if user:
            queryset = queryset.annotate(user_liked=Exists(CommentLike.objects.filter(comment=OuterRef('pk'), user=user)))
        else:
            queryset = queryset.annotate(user_liked=Value(False, output_field=BooleanField()))
        return queryset.order_by('-is_pinned', '-created_at')

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['idea_id'] = int(self.kwargs['idea_id'])
        context['lang'] = get_request_language(self.request)
        return context

    def perform_create(self, serializer):
        comment = serializer.save(idea_id=self.kwargs['idea_id'], author=self.request.user)
        if comment.idea.author_id != self.request.user.id:
            Notification.objects.create(
                user=comment.idea.author,
                actor=self.request.user,
                notification_type='comment',
                message=f'New comment on "{comment.idea.title}"',
                idea=comment.idea,
            )


class CommentViewSet(viewsets.GenericViewSet):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Comment.objects.select_related('author').annotate(
            like_count=Coalesce(Count('likes', distinct=True), 0),
            user_liked=Exists(CommentLike.objects.filter(comment=OuterRef('pk'), user=user))
        )
        return queryset

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['lang'] = get_request_language(self.request)
        return context

    @action(detail=True, methods=['post'], url_path='like')
    def like(self, request, pk=None):
        comment = self.get_object()
        like, created = CommentLike.objects.get_or_create(comment=comment, user=request.user)
        if not created:
            like.delete()
            return Response({'detail': 'Like removed.'}, status=status.HTTP_200_OK)
        if comment.author_id != request.user.id:
            Notification.objects.create(
                user=comment.author,
                actor=request.user,
                notification_type='like',
                message=f'{request.user.username} liked your comment.',
            )
        return Response({'detail': 'Liked.'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], url_path='pin')
    def pin(self, request, pk=None):
        comment = self.get_object()
        if not (request.user.is_staff or comment.idea.author_id == request.user.id):
            raise PermissionDenied('Only the idea author can pin comments.')
        comment.is_pinned = not comment.is_pinned
        comment.save(update_fields=['is_pinned'])
        return Response({'is_pinned': comment.is_pinned}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['patch'], url_path='edit')
    def edit(self, request, pk=None):
        comment = self.get_object()
        if comment.author_id != request.user.id:
            raise PermissionDenied('You can only edit your own comments.')

        serializer = self.get_serializer(comment, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    @action(detail=True, methods=['delete'], url_path='delete')
    def delete(self, request, pk=None):
        comment = self.get_object()
        if comment.author_id != request.user.id:
            raise PermissionDenied('You can only delete your own comments.')
        comment.delete()
        return Response({'detail': 'Comment deleted.'}, status=status.HTTP_204_NO_CONTENT)


class AdminIdeaViewSet(viewsets.ModelViewSet):
    serializer_class = IdeaSerializer
    permission_classes = [permissions.IsAdminUser]
    search_fields = ('title', 'short_description', 'full_description', 'author__username')
    ordering_fields = ('created_at', 'like_count', 'comment_count')
    ordering = ('-created_at',)

    def get_queryset(self):
        return (
            Idea.objects.select_related('author')
            .prefetch_related('tags')
            .annotate(
                comment_count=Coalesce(Count('comments', distinct=True), 0),
                like_count=Coalesce(Count('likes', distinct=True), 0),
            )
        )

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['lang'] = get_request_language(self.request)
        return context


class AdminCommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAdminUser]
    search_fields = ('body', 'author__username', 'idea__title')
    ordering_fields = ('created_at',)
    ordering = ('-created_at',)

    def get_queryset(self):
        return Comment.objects.select_related('author', 'idea').annotate(
            like_count=Coalesce(Count('likes', distinct=True), 0)
        )

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['lang'] = get_request_language(self.request)
        return context


class CommentDeleteView(DestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_destroy(self, instance):
        if instance.author_id != self.request.user.id:
            raise PermissionDenied('You can only delete your own comments.')
        instance.delete()


class PublicCommentView(ListCreateAPIView):
    serializer_class = PublicCommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return PublicComment.objects.select_related('author').all()

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['lang'] = get_request_language(self.request)
        return context

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class PublicCommentDeleteView(DestroyAPIView):
    queryset = PublicComment.objects.all()
    serializer_class = PublicCommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_destroy(self, instance):
        if instance.author_id != self.request.user.id:
            raise PermissionDenied('You can only delete your own comments.')
        instance.delete()
