from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    AdminCommentViewSet,
    AdminIdeaViewSet,
    CommentDeleteView,
    CommentViewSet,
    IdeaCommentsView,
    IdeaViewSet,
    PublicCommentView,
    PublicCommentDeleteView,
)

router = DefaultRouter(trailing_slash=False)
router.register('ideas', IdeaViewSet, basename='idea')
router.register('comments', CommentViewSet, basename='comment')
router.register('admin/ideas', AdminIdeaViewSet, basename='admin-idea')
router.register('admin/comments', AdminCommentViewSet, basename='admin-comment')

urlpatterns = [
    path('ideas/<int:idea_id>/comments', IdeaCommentsView.as_view(), name='idea-comments'),
    path('comments/<int:pk>', CommentDeleteView.as_view(), name='comment-delete'),
    path('comments/public/', PublicCommentView.as_view(), name='public-comments'),
    path('comments/public/<int:pk>/', PublicCommentDeleteView.as_view(), name='public-comment-delete'),
]

urlpatterns += router.urls
