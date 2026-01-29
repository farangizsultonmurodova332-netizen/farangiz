from django.contrib import admin
from .models import Notification


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'actor', 'notification_type', 'is_read', 'created_at')
    list_filter = ('is_read',)
