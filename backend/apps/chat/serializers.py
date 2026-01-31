from rest_framework import serializers
from django.core.cache import cache
from .models import ChatRoom, Message, ChatRoomMembership, Call


class MessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source='sender.username', read_only=True)
    sender_id = serializers.IntegerField(source='sender.id', read_only=True)
    image_url = serializers.SerializerMethodField()
    video_url = serializers.SerializerMethodField()
    audio_url = serializers.SerializerMethodField()
    file_url = serializers.SerializerMethodField()
    reply_to_preview = serializers.SerializerMethodField()
    is_edited = serializers.BooleanField(read_only=True)

    class Meta:
        model = Message
        fields = (
            'id',
            'room',
            'sender',
            'sender_username',
            'sender_id',
            'reply_to',
            'reply_to_preview',
            'body',
            'image_url',
            'video_url',
            'audio_url',
            'audio_duration',
            'audio_size',
            'file_url',
            'file_name',
            'file_size',
            'created_at',
            'updated_at',
            'is_read',
            'is_deleted',
            'is_edited',
        )
        read_only_fields = ('sender', 'room', 'created_at')

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        if obj.image:
            return obj.image.url
        return None

    def get_video_url(self, obj):
        request = self.context.get('request')
        if obj.video and request:
            return request.build_absolute_uri(obj.video.url)
        if obj.video:
            return obj.video.url
        return None

    def get_audio_url(self, obj):
        request = self.context.get('request')
        if obj.audio and request:
            return request.build_absolute_uri(obj.audio.url)
        if obj.audio:
            return obj.audio.url
        return None

    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)
        if obj.file:
            return obj.file.url
        return None

    def get_reply_to_preview(self, obj):
        if not obj.reply_to:
            return None
        reply = obj.reply_to
        return {
            'id': reply.id,
            'sender_id': reply.sender_id,
            'sender_username': reply.sender.username,
            'body': reply.body,
            'is_deleted': reply.is_deleted,
        }

class ChatRoomSerializer(serializers.ModelSerializer):
    last_message = serializers.SerializerMethodField()
    other_user = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()
    membership = serializers.SerializerMethodField()
    member_count = serializers.SerializerMethodField()

    class Meta:
        model = ChatRoom
        fields = (
            'id',
            'participants',
            'created_at',
            'updated_at',
            'last_message',
            'other_user',
            'unread_count',
            'is_group',
            'name',
            'description',
            'is_private',
            'created_by',
            'avatar_url',
            'membership',
            'member_count',
        )
        read_only_fields = ('created_at', 'updated_at')

    def get_last_message(self, obj):
        last_msg = obj.messages.last()
        if last_msg:
            return {
                'body': last_msg.body,
                'sender': last_msg.sender.username,
                'created_at': last_msg.created_at,
            }
        return None

    def get_other_user(self, obj):
        request = self.context.get('request')
        if obj.is_group:
            return None
        if request and request.user:
            other = obj.participants.exclude(id=request.user.id).first()
            if other:
                cache_key = f"user:presence:{other.id}"
                is_online = bool(cache.get(cache_key))
                last_seen = cache.get(f"user:last_seen:{other.id}")
                if other.avatar_url:
                    avatar_url = other.avatar_url
                elif other.avatar_file and request:
                    avatar_url = request.build_absolute_uri(other.avatar_file.url)
                elif other.avatar_file:
                    avatar_url = other.avatar_file.url
                else:
                    avatar_url = None
                return {
                    'id': other.id,
                    'username': other.username,
                    'avatar_url': avatar_url,
                    'is_online': is_online,
                    'last_seen': last_seen,
                }
        return None

    def get_unread_count(self, obj):
        request = self.context.get('request')
        if request and request.user:
            if obj.is_group:
                membership = ChatRoomMembership.objects.filter(room=obj, user=request.user).first()
                last_read_at = membership.last_read_at if membership else None
                queryset = obj.messages.exclude(sender=request.user)
                if last_read_at:
                    queryset = queryset.filter(created_at__gt=last_read_at)
                return queryset.count()
            cache_key = f"chat:room:{obj.id}:unread:{request.user.id}"
            cached = cache.get(cache_key)
            if cached is not None:
                return cached
            count = obj.messages.filter(is_read=False).exclude(sender=request.user).count()
            cache.set(cache_key, count, timeout=3600)
            return count
        return 0

    def get_membership(self, obj):
        request = self.context.get('request')
        if not request or not request.user or not obj.is_group:
            return None
        membership = ChatRoomMembership.objects.filter(room=obj, user=request.user).first()
        if not membership:
            return None
        return {
            'role': membership.role,
            'can_delete_messages': membership.can_delete_messages,
            'can_kick': membership.can_kick,
            'can_invite': membership.can_invite,
            'can_manage_admins': membership.can_manage_admins,
        }

    def get_member_count(self, obj):
        return obj.participants.count()


class CallParticipantSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    username = serializers.CharField()
    avatar_url = serializers.CharField(allow_null=True, required=False)


class CallSerializer(serializers.ModelSerializer):
    caller = serializers.SerializerMethodField()
    callee = serializers.SerializerMethodField()
    room_id = serializers.IntegerField(source='room.id', read_only=True)

    class Meta:
        model = Call
        fields = (
            'id',
            'room_id',
            'caller',
            'callee',
            'call_type',
            'status',
            'agora_channel',
            'agora_token',
            'started_at',
            'ended_at',
            'duration',
            'created_at',
        )
        read_only_fields = ('id', 'created_at', 'agora_channel', 'agora_token')

    def get_caller(self, obj):
        request = self.context.get('request')
        avatar_url = None
        if obj.caller.avatar_url:
            avatar_url = obj.caller.avatar_url
        elif obj.caller.avatar_file and request:
            avatar_url = request.build_absolute_uri(obj.caller.avatar_file.url)
        return {
            'id': obj.caller.id,
            'username': obj.caller.username,
            'avatar_url': avatar_url,
        }

    def get_callee(self, obj):
        request = self.context.get('request')
        avatar_url = None
        if obj.callee.avatar_url:
            avatar_url = obj.callee.avatar_url
        elif obj.callee.avatar_file and request:
            avatar_url = request.build_absolute_uri(obj.callee.avatar_file.url)
        return {
            'id': obj.callee.id,
            'username': obj.callee.username,
            'avatar_url': avatar_url,
        }


class StartCallSerializer(serializers.Serializer):
    room_id = serializers.IntegerField()
    callee_id = serializers.IntegerField()
    call_type = serializers.ChoiceField(choices=['voice', 'video'])
