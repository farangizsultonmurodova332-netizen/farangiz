from django.conf import settings
from django.core.validators import RegexValidator, MaxLengthValidator
from django.db import models


tag_validator = RegexValidator(
    regex=r'^[a-zA-Z0-9-_]+$',
    message='Tag can only contain letters, numbers, hyphens, and underscores'
)


class Tag(models.Model):
    name = models.CharField(
        max_length=50,
        unique=True,
        db_index=True,
        validators=[tag_validator]
    )

    def __str__(self) -> str:
        return self.name


class Idea(models.Model):
    title = models.CharField(max_length=120)
    title_i18n = models.JSONField(default=dict, blank=True)
    short_description = models.CharField(max_length=280)
    short_description_i18n = models.JSONField(default=dict, blank=True)
    full_description = models.TextField()
    full_description_i18n = models.JSONField(default=dict, blank=True)
    category = models.CharField(max_length=80, db_index=True)
    category_i18n = models.JSONField(default=dict, blank=True)
    tags = models.ManyToManyField(Tag, blank=True, related_name='ideas')
    image = models.ImageField(upload_to='idea-images/', blank=True, null=True)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='ideas', db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)
    views_count = models.PositiveIntegerField(default=0, db_index=True)

    class Meta:
        indexes = [
            models.Index(fields=['-created_at']),
            models.Index(fields=['-views_count']),
        ]

    def __str__(self) -> str:
        return self.title


class IdeaLike(models.Model):
    idea = models.ForeignKey(Idea, on_delete=models.CASCADE, related_name='likes')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='idea_likes')
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        unique_together = ('idea', 'user')


class Comment(models.Model):
    idea = models.ForeignKey(Idea, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='comments')
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE, related_name='replies')
    body = models.TextField()
    body_i18n = models.JSONField(default=dict, blank=True)
    image = models.FileField(upload_to='comment-images/', blank=True, null=True)
    is_pinned = models.BooleanField(default=False, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    def __str__(self) -> str:
        return f'Comment {self.id} on {self.idea_id}'


class CommentLike(models.Model):
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, related_name='likes')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='comment_likes')
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        unique_together = ('comment', 'user')


class PublicComment(models.Model):
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='public_comments')
    body = models.TextField(max_length=1000)
    body_i18n = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['-created_at']),
        ]

    def __str__(self) -> str:
        return f'Public comment {self.id} by {self.author.username}'


class Bookmark(models.Model):
    """User's saved/bookmarked ideas"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bookmarks')
    idea = models.ForeignKey(Idea, on_delete=models.CASCADE, related_name='bookmarks')
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        unique_together = ('user', 'idea')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['-created_at']),
        ]

    def __str__(self) -> str:
        return f'{self.user.username} bookmarked {self.idea.title}'

