from django.contrib import admin
from .models import Comment, Idea, IdeaLike, Tag


@admin.register(Idea)
class IdeaAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'category', 'author', 'created_at')
    search_fields = ('title', 'short_description', 'full_description')
    list_filter = ('category',)


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    search_fields = ('name',)


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('id', 'idea', 'author', 'parent', 'created_at')


@admin.register(IdeaLike)
class IdeaLikeAdmin(admin.ModelAdmin):
    list_display = ('id', 'idea', 'user', 'created_at')
