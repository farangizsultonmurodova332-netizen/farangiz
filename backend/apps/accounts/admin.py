from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin
from .models import Follow, User


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    fieldsets = DjangoUserAdmin.fieldsets + (
        ('Profile', {'fields': ('bio',)}),
    )
    add_fieldsets = DjangoUserAdmin.add_fieldsets + (
        ('Profile', {'fields': ('bio',)}),
    )
    list_display = ('id', 'username', 'email', 'is_staff')


@admin.register(Follow)
class FollowAdmin(admin.ModelAdmin):
    list_display = ('id', 'follower', 'following', 'created_at')
