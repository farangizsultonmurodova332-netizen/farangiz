import json
from django.utils import timezone
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from django.core.cache import cache

from .models import ChatRoom, Message, ChatRoomMembership

User = get_user_model()


class ChatConsumer(AsyncWebsocketConsumer):
    def _presence_key(self, user_id):
        return f"user:presence:{user_id}"

    def _last_seen_key(self, user_id):
        return f"user:last_seen:{user_id}"

    def _set_presence(self, user_id, is_online):
        cache.set(self._presence_key(user_id), is_online, timeout=90)
        cache.set(self._last_seen_key(user_id), timezone.now().isoformat(), timeout=60 * 60 * 24)
    def _base_url(self):
        headers = dict(self.scope.get("headers", []))
        host = headers.get(b"host", b"").decode()
        scheme = self.scope.get("scheme") or "http"
        if scheme in ("wss", "https"):
            scheme = "https"
        else:
            scheme = "http"
        if not host:
            return ""
        return f"{scheme}://{host}"

    def _absolute_media_url(self, path):
        if not path:
            return None
        base = self._base_url()
        if base and path.startswith("/"):
            return f"{base}{path}"
        return f"{base}/{path}" if base else path

    async def connect(self):
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = f'chat_{self.room_id}'
        self.user = self.scope['user']

        # Verify user is authenticated
        if not self.user.is_authenticated:
            await self.close()
            return

        # Verify user is participant in this room
        is_participant = await self.check_participant()
        if not is_participant:
            await self.close()
            return

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()
        self._set_presence(self.user.id, True)

        # Mark messages as read
        await self.mark_messages_read()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        self._set_presence(self.user.id, False)

    async def receive(self, text_data):
        """Receive message from WebSocket"""
        data = json.loads(text_data)
        message_type = data.get('type', 'message')
        self._set_presence(self.user.id, True)

        if message_type == 'message':
            body = data.get('body', '').strip()
            if not body or len(body) > 2000:
                return

            # Save message to database
            message, participant_ids = await self.save_message(body)
            await self.bump_unread_cache(participant_ids, self.user.id)
            await self.invalidate_message_cache()

            # Send message to room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': {
                        'id': message.id,
                        'room': message.room_id,
                        'sender': message.sender_id,
                        'sender_username': message.sender.username,
                        'sender_id': message.sender_id,
                        'reply_to': message.reply_to_id,
                        'reply_to_preview': None,
                        'body': message.body,
                        'image_url': self._absolute_media_url(message.image.url) if message.image else None,
                        'audio_url': self._absolute_media_url(message.audio.url) if message.audio else None,
                        'created_at': message.created_at.isoformat(),
                        'updated_at': message.updated_at.isoformat() if message.updated_at else message.created_at.isoformat(),
                        'is_read': message.is_read,
                        'is_deleted': message.is_deleted,
                        'is_edited': False,
                    }
                }
            )

        elif message_type == 'typing':
            # Broadcast typing indicator
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'user_typing',
                    'user_id': self.user.id,
                    'username': self.user.username,
                }
            )

        elif message_type == 'mark_read':
            # Mark all messages in room as read by this user
            await self.mark_messages_read()
            
            # Broadcast read receipt to room
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message_read',
                    'room_id': self.room_id,
                    'reader_id': self.user.id,
                }
            )

    async def chat_message(self, event):
        """Receive message from room group"""
        message = event['message']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'message',
            'message': message
        }))

        # Mark as read if not sender
        if message['sender_id'] != self.user.id:
            await self.mark_message_read(message['id'])

    async def user_typing(self, event):
        """Receive typing indicator from room group"""
        # Don't send typing indicator to the user who's typing
        if event['user_id'] != self.user.id:
            await self.send(text_data=json.dumps({
                'type': 'typing',
                'user_id': event['user_id'],
                'username': event['username'],
            }))

    async def chat_message_update(self, event):
        """Receive updated message from room group"""
        message = event['message']
        await self.send(text_data=json.dumps({
            'type': 'message_updated',
            'message': message
        }))

    async def chat_message_delete(self, event):
        """Receive deleted message from room group"""
        message = event['message']
        await self.send(text_data=json.dumps({
            'type': 'message_deleted',
            'message': message
        }))

    async def chat_message_read(self, event):
        """Receive read status update from room group"""
        await self.send(text_data=json.dumps({
            'type': 'read_receipt',
            'room_id': event['room_id'],
            'reader_id': event['reader_id'],
        }))

    async def call_signal(self, event):
        """Receive call signal from room group"""
        signal = event['signal']
        await self.send(text_data=json.dumps({
            'type': 'call_signal',
            'signal': signal,
        }))

    @database_sync_to_async
    def check_participant(self):
        """Check if user is participant in the room"""
        try:
            room = ChatRoom.objects.get(id=self.room_id)
            return room.participants.filter(id=self.user.id).exists()
        except ChatRoom.DoesNotExist:
            return False

    @database_sync_to_async
    def save_message(self, body):
        """Save message to database"""
        room = ChatRoom.objects.get(id=self.room_id)
        message = Message.objects.create(
            room=room,
            sender=self.user,
            body=body
        )
        participant_ids = list(room.participants.values_list('id', flat=True))
        return message, participant_ids

    @database_sync_to_async
    def bump_unread_cache(self, participant_ids, sender_id):
        for participant_id in participant_ids:
            cache_key = f"chat:room:{self.room_id}:unread:{participant_id}"
            if participant_id == sender_id:
                cache.set(cache_key, 0, timeout=3600)
            else:
                try:
                    cache.incr(cache_key)
                except ValueError:
                    cache.set(cache_key, 1, timeout=3600)

    @database_sync_to_async
    def invalidate_message_cache(self):
        cache.delete(f"chat:room:{self.room_id}:messages")

    @database_sync_to_async
    def mark_messages_read(self):
        """Mark all unread messages in room as read"""
        room = ChatRoom.objects.get(id=self.room_id)
        if room.is_group:
            ChatRoomMembership.objects.filter(room=room, user=self.user).update(last_read_at=timezone.now())
            return
        Message.objects.filter(
            room_id=self.room_id,
            is_read=False
        ).exclude(sender=self.user).update(is_read=True)
        cache.set(f"chat:room:{self.room_id}:unread:{self.user.id}", 0, timeout=3600)

    @database_sync_to_async
    def mark_message_read(self, message_id):
        """Mark specific message as read"""
        room = ChatRoom.objects.get(id=self.room_id)
        if room.is_group:
            ChatRoomMembership.objects.filter(room=room, user=self.user).update(last_read_at=timezone.now())
            return
        Message.objects.filter(
            id=message_id,
            is_read=False
        ).exclude(sender=self.user).update(is_read=True)
        cache_key = f"chat:room:{self.room_id}:unread:{self.user.id}"
        cached = cache.get(cache_key)
        if cached is not None:
            cache.set(cache_key, max(int(cached) - 1, 0), timeout=3600)
        else:
            count = Message.objects.filter(
                room_id=self.room_id,
                is_read=False
            ).exclude(sender=self.user).count()
            cache.set(cache_key, count, timeout=3600)


class UserConsumer(AsyncWebsocketConsumer):
    """User-level WebSocket consumer for notifications like device termination"""
    
    async def connect(self):
        self.user = self.scope['user']
        
        if not self.user.is_authenticated:
            await self.close()
            return
        
        self.user_group_name = f"user_{self.user.id}"
        
        # Join user group
        await self.channel_layer.group_add(
            self.user_group_name,
            self.channel_name
        )
        
        await self.accept()
    
    async def disconnect(self, close_code):
        if hasattr(self, 'user_group_name'):
            await self.channel_layer.group_discard(
                self.user_group_name,
                self.channel_name
            )
    
    async def device_terminated(self, event):
        """Handle device termination notification"""
        await self.send(text_data=json.dumps({
            'type': 'device_terminated',
            'device_id': event.get('device_id'),
            'device_name': event.get('device_name'),
        }))

