from django.contrib import admin
from .models import ChatRoom, Message, Call


@admin.register(ChatRoom)
class ChatRoomAdmin(admin.ModelAdmin):
    list_display = ('id', 'get_participants', 'created_at', 'updated_at')
    list_filter = ('created_at', 'updated_at')
    search_fields = ('participants__username',)
    filter_horizontal = ('participants',)

    def get_participants(self, obj):
        return ', '.join([user.username for user in obj.participants.all()])
    get_participants.short_description = 'Participants'


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'room', 'sender', 'body_preview', 'created_at', 'is_read')
    list_filter = ('created_at', 'is_read')
    search_fields = ('sender__username', 'body')
    readonly_fields = ('created_at',)

    def body_preview(self, obj):
        return obj.body[:50] + '...' if len(obj.body) > 50 else obj.body
    body_preview.short_description = 'Message'


@admin.register(Call)
class CallAdmin(admin.ModelAdmin):
    list_display = ('id', 'room', 'caller', 'callee', 'call_type', 'status', 'duration', 'created_at')
    list_filter = ('call_type', 'status', 'created_at')
    search_fields = ('caller__username', 'callee__username', 'agora_channel')
    readonly_fields = ('created_at', 'agora_channel', 'agora_token')
