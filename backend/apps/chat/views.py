import time
from django.db.models import Q, Max
from django.utils import timezone
from django.conf import settings
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework.parsers import FormParser, MultiPartParser, JSONParser
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.core.cache import cache

from .models import ChatRoom, Message, ChatRoomMembership, Call
from .serializers import ChatRoomSerializer, MessageSerializer, CallSerializer, StartCallSerializer

User = get_user_model()


class ChatRoomViewSet(viewsets.ModelViewSet):
    serializer_class = ChatRoomSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Return chat rooms for the current user"""
        return ChatRoom.objects.filter(participants=self.request.user).prefetch_related('participants', 'messages')

    def destroy(self, request, *args, **kwargs):
        room = self.get_object()
        if room.is_group:
            if room.created_by != request.user:
                return Response({'error': 'Only the group creator can delete this group.'}, status=status.HTTP_403_FORBIDDEN)
        elif not room.participants.filter(id=request.user.id).exists():
            return Response({'error': 'Not a participant'}, status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)

    @action(detail=False, methods=['post'], url_path='get-or-create')
    def get_or_create_room(self, request):
        """Get or create a chat room with another user"""
        other_user_id = request.data.get('other_user_id')
        if not other_user_id:
            return Response({'error': 'other_user_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            other_user = User.objects.get(id=other_user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        if other_user.id == request.user.id:
            return Response({'error': 'Cannot chat with yourself'}, status=status.HTTP_400_BAD_REQUEST)

        # Find existing room with exactly these two participants
        rooms = ChatRoom.objects.filter(participants=request.user).filter(participants=other_user)
        room = rooms.first()

        if not room:
            # Create new room
            room = ChatRoom.objects.create(created_by=request.user)
            room.participants.add(request.user, other_user)

        serializer = self.get_serializer(room)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def messages(self, request, pk=None):
        """Get all messages in a chat room"""
        room = self.get_object()

        # Verify user is participant
        if not room.participants.filter(id=request.user.id).exists():
            return Response({'error': 'Not a participant'}, status=status.HTTP_403_FORBIDDEN)

        # Mark messages as read
        if room.is_group:
            ChatRoomMembership.objects.filter(room=room, user=request.user).update(last_read_at=timezone.now())
        else:
            unread_qs = room.messages.filter(is_read=False).exclude(sender=request.user)
            if unread_qs.exists():
                # Notify participants via WebSocket
                channel_layer = get_channel_layer()
                async_to_sync(channel_layer.group_send)(
                    f'chat_{room.id}',
                    {
                        'type': 'chat_message_read',
                        'room_id': room.id,
                        'reader_id': request.user.id,
                    }
                )
                
                unread_qs.update(is_read=True)
                cache.set(f"chat:room:{room.id}:unread:{request.user.id}", 0, timeout=3600)
                cache.delete(f"chat:room:{room.id}:messages")

        cache_key = f"chat:room:{room.id}:messages"
        cached = cache.get(cache_key)
        if cached is not None:
            return Response(cached)

        messages = room.messages.all().order_by('created_at')
        serializer = MessageSerializer(messages, many=True, context={'request': request})
        cache.set(cache_key, serializer.data, timeout=30)

        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def send_message(self, request, pk=None):
        """Send a message to a chat room"""
        room = self.get_object()

        # Verify user is participant
        if not room.participants.filter(id=request.user.id).exists():
            return Response({'error': 'Not a participant'}, status=status.HTTP_403_FORBIDDEN)

        body = request.data.get('body', '').strip()
        image = request.FILES.get('image')
        audio = request.FILES.get('audio')
        file = request.FILES.get('file')
        reply_to_id = request.data.get('reply_to')
        reply_to = None

        if not body and not image and not audio and not file:
            return Response({'error': 'Message body, image, audio, or file is required'}, status=status.HTTP_400_BAD_REQUEST)

        if body and len(body) > 2000:
            return Response({'error': 'Message too long (max 2000 characters)'}, status=status.HTTP_400_BAD_REQUEST)

        if image and hasattr(image, 'content_type') and not image.content_type.startswith('image/'):
            return Response({'error': 'Image must be a valid image file'}, status=status.HTTP_400_BAD_REQUEST)

        if audio and hasattr(audio, 'content_type') and not audio.content_type.startswith('audio/'):
            return Response({'error': 'Audio must be a valid audio file'}, status=status.HTTP_400_BAD_REQUEST)

        # Validate file type (allow common document types)
        ALLOWED_FILE_EXTENSIONS = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.zip', '.rar']
        file_name = ""
        file_size = None
        if file:
            file_name = file.name
            file_size = file.size
            import os
            ext = os.path.splitext(file.name)[1].lower()
            if ext not in ALLOWED_FILE_EXTENSIONS:
                return Response({'error': f'File type not allowed. Allowed: {", ".join(ALLOWED_FILE_EXTENSIONS)}'}, status=status.HTTP_400_BAD_REQUEST)
            if file_size > 50 * 1024 * 1024:  # 50MB limit
                return Response({'error': 'File too large (max 50MB)'}, status=status.HTTP_400_BAD_REQUEST)

        if reply_to_id:
            try:
                reply_to = room.messages.get(id=reply_to_id)
            except Message.DoesNotExist:
                return Response({'error': 'Reply message not found'}, status=status.HTTP_400_BAD_REQUEST)

        # Calculate audio metadata if audio file is provided
        audio_duration = None
        audio_size = None
        if audio:
            audio_size = audio.size

            # First, check if frontend sent audio_duration
            frontend_duration = request.data.get('audio_duration')
            if frontend_duration:
                try:
                    audio_duration = float(frontend_duration)
                except (ValueError, TypeError):
                    pass

            # If no duration from frontend, try to get duration using mutagen
            if audio_duration is None:
                try:
                    import tempfile
                    import os
                    import logging
                    from mutagen import File as MutagenFile

                    # Write to temp file so mutagen can read it
                    # Use .m4a as default fallback since that's what Expo usually sends
                    suffix = os.path.splitext(audio.name)[1] if audio.name else '.m4a'
                    if not suffix:
                        suffix = '.m4a'

                    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
                        for chunk in audio.chunks():
                            tmp.write(chunk)
                        tmp_path = tmp.name

                    try:
                        audio_file = MutagenFile(tmp_path)
                        if audio_file and audio_file.info:
                            audio_duration = audio_file.info.length
                    finally:
                        os.unlink(tmp_path)  # Clean up temp file

                    audio.seek(0)  # Reset file position for saving
                except Exception as e:
                    import logging
                    logging.getLogger('apps.chat').warning(f"Could not read audio duration: {e}")
                    audio.seek(0)

        message = Message.objects.create(
            room=room,
            sender=request.user,
            reply_to=reply_to,
            body=body,
            image=image,
            audio=audio,
            audio_duration=audio_duration,
            audio_size=audio_size,
            file=file,
            file_name=file_name,
            file_size=file_size
        )

        serializer = MessageSerializer(message, context={'request': request})
        cache.delete(f"chat:room:{room.id}:messages")
        participant_ids = list(room.participants.values_list('id', flat=True))
        if not room.is_group:
            for participant_id in participant_ids:
                cache_key = f"chat:room:{room.id}:unread:{participant_id}"
                if participant_id == request.user.id:
                    cache.set(cache_key, 0, timeout=3600)
                else:
                    try:
                        cache.incr(cache_key)
                    except ValueError:
                        cache.set(cache_key, 1, timeout=3600)

        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'chat_{room.id}',
            {
                'type': 'chat_message',
                'message': serializer.data,
            }
        )

        # Send push notification to other participants
        from apps.notifications.utils import send_push_to_user
        
        # Format notification body
        if message.image and message.body:
            msg_body = f"📷 {message.body[:50]}..." if len(message.body) > 50 else f"📷 {message.body}"
        elif message.image:
            msg_body = "📷 Photo"
        elif message.audio:
            duration_str = ""
            if message.audio_duration:
                mins = int(message.audio_duration // 60)
                secs = int(message.audio_duration % 60)
                duration_str = f" ({mins}:{secs:02d})"
            msg_body = f"🎤 Voice message{duration_str}"
        elif message.file:
            msg_body = f"📎 {message.file_name}" if message.file_name else "📎 File"
        elif message.body and message.body.strip():
            # Truncate long messages
            msg_body = message.body[:100] + "..." if len(message.body) > 100 else message.body
        else:
            msg_body = "New message"

        if room.is_group:
            # Group chat - send to all participants except sender
            for participant in room.participants.exclude(id=request.user.id):
                if participant.expo_push_token:
                    send_push_to_user(
                        participant,
                        title=f"{room.name}",
                        message=f"{request.user.username}: {msg_body}",
                        data={"roomId": room.id, "isGroup": True}
                    )
        else:
            # 1-on-1 chat
            other_user = room.participants.exclude(id=request.user.id).first()
            if other_user and other_user.expo_push_token:
                send_push_to_user(
                    other_user,
                    title=request.user.username,
                    message=msg_body,
                    data={"roomId": room.id, "isGroup": False}
                )

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    send_message.parser_classes = [MultiPartParser, FormParser, JSONParser]

    @action(detail=True, methods=['patch', 'delete'], url_path='messages/(?P<message_id>[^/.]+)')
    def message_detail(self, request, pk=None, message_id=None):
        """Edit or delete a message in a chat room"""
        room = self.get_object()
        try:
            message = room.messages.get(id=message_id)
        except Message.DoesNotExist:
            return Response({'error': 'Message not found'}, status=status.HTTP_404_NOT_FOUND)

        if message.sender != request.user:
            if room.is_group:
                membership = ChatRoomMembership.objects.filter(room=room, user=request.user).first()
                allowed = membership and (
                    membership.role == ChatRoomMembership.ROLE_OWNER or membership.can_delete_messages
                )
                if not allowed:
                    return Response({'error': 'Not allowed to modify this message'}, status=status.HTTP_403_FORBIDDEN)
            else:
                return Response({'error': 'Not allowed to modify this message'}, status=status.HTTP_403_FORBIDDEN)

        if request.method.lower() == 'delete':
            message.body = ''
            message.image = None
            message.audio = None
            message.is_deleted = True
            message.save(update_fields=['body', 'image', 'audio', 'is_deleted', 'updated_at'])

            serializer = MessageSerializer(message, context={'request': request})
            cache.delete(f"chat:room:{room.id}:messages")

            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                f'chat_{room.id}',
                {
                    'type': 'chat_message_delete',
                    'message': serializer.data,
                }
            )
            return Response(serializer.data)

        if message.is_deleted:
            return Response({'error': 'Cannot edit a deleted message'}, status=status.HTTP_400_BAD_REQUEST)

        body = request.data.get('body', '').strip()
        if not body and not message.image and not message.audio:
            return Response({'error': 'Message body is required'}, status=status.HTTP_400_BAD_REQUEST)
        if body and len(body) > 2000:
            return Response({'error': 'Message too long (max 2000 characters)'}, status=status.HTTP_400_BAD_REQUEST)

        message.body = body
        message.is_edited = True
        message.save(update_fields=['body', 'is_edited', 'updated_at'])

        serializer = MessageSerializer(message, context={'request': request})
        cache.delete(f"chat:room:{room.id}:messages")

        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'chat_{room.id}',
            {
                'type': 'chat_message_update',
                'message': serializer.data,
            }
        )
        return Response(serializer.data)

    @action(detail=False, methods=['post'], url_path='create-group')
    def create_group(self, request):
        name = request.data.get('name', '').strip()
        description = request.data.get('description', '').strip()
        is_private = bool(request.data.get('is_private', False))
        member_ids = request.data.get('member_ids', []) or []

        if not name:
            return Response({'error': 'Group name is required'}, status=status.HTTP_400_BAD_REQUEST)

        room = ChatRoom.objects.create(
            is_group=True,
            name=name,
            description=description,
            is_private=is_private,
            created_by=request.user,
        )
        room.participants.add(request.user)
        ChatRoomMembership.objects.create(
            room=room,
            user=request.user,
            role=ChatRoomMembership.ROLE_OWNER,
            can_delete_messages=True,
            can_kick=True,
            can_invite=True,
            can_manage_admins=True,
            last_read_at=timezone.now(),
        )

        if isinstance(member_ids, list):
            users = User.objects.filter(id__in=member_ids)
            for member in users:
                if member == request.user:
                    continue
                room.participants.add(member)
                ChatRoomMembership.objects.create(room=room, user=member, last_read_at=timezone.now())

        serializer = self.get_serializer(room)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'], url_path='groups')
    def groups(self, request):
        search = request.query_params.get('search', '').strip()
        queryset = ChatRoom.objects.filter(is_group=True, is_private=False)
        if search:
            queryset = queryset.filter(name__icontains=search)
        serializer = self.get_serializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def join(self, request, pk=None):
        room = self.get_object()
        if not room.is_group:
            return Response({'error': 'Not a group'}, status=status.HTTP_400_BAD_REQUEST)
        if room.is_private:
            return Response({'error': 'This group is private'}, status=status.HTTP_403_FORBIDDEN)
        room.participants.add(request.user)
        ChatRoomMembership.objects.update_or_create(
            room=room,
            user=request.user,
            defaults={'last_read_at': timezone.now()},
        )
        serializer = self.get_serializer(room)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def leave(self, request, pk=None):
        room = self.get_object()
        if not room.is_group:
            return Response({'error': 'Not a group'}, status=status.HTTP_400_BAD_REQUEST)
        if room.created_by == request.user:
            return Response({'error': 'Owner cannot leave the group'}, status=status.HTTP_400_BAD_REQUEST)
        room.participants.remove(request.user)
        
        # Create system message
        Message.objects.create(
            room=room,
            sender=request.user,
            body=f"{request.user.username} left the group",
            message_type=Message.MESSAGE_TYPE_SYSTEM
        )

        ChatRoomMembership.objects.filter(room=room, user=request.user).delete()
        return Response({'detail': 'Left group.'})

    @action(detail=True, methods=['get'])
    def members(self, request, pk=None):
        room = self.get_object()
        if not room.is_group:
            return Response({'error': 'Not a group'}, status=status.HTTP_400_BAD_REQUEST)
        memberships = ChatRoomMembership.objects.filter(room=room).select_related('user')
        data = [
            {
                'id': m.user.id,
                'username': m.user.username,
                'avatar_url': m.user.avatar_url,
                'role': m.role,
                'can_delete_messages': m.can_delete_messages,
                'can_kick': m.can_kick,
                'can_invite': m.can_invite,
                'can_manage_admins': m.can_manage_admins,
            }
            for m in memberships
        ]
        return Response(data)

    @action(detail=True, methods=['post'])
    def kick(self, request, pk=None):
        room = self.get_object()
        if not room.is_group:
            return Response({'error': 'Not a group'}, status=status.HTTP_400_BAD_REQUEST)
        target_id = request.data.get('user_id')
        if not target_id:
            return Response({'error': 'user_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        if str(target_id) == str(request.user.id):
            return Response({'error': 'Cannot kick yourself'}, status=status.HTTP_400_BAD_REQUEST)
        membership = ChatRoomMembership.objects.filter(room=room, user=request.user).first()
        allowed = membership and (
            membership.role == ChatRoomMembership.ROLE_OWNER or membership.can_kick
        )
        if not allowed:
            return Response({'error': 'Not allowed to kick users'}, status=status.HTTP_403_FORBIDDEN)
        room.participants.remove(target_id)
        
        # Create system message
        target_user = User.objects.get(id=target_id)
        Message.objects.create(
            room=room,
            sender=request.user, 
            body=f"{target_user.username} was removed from the group",
            message_type=Message.MESSAGE_TYPE_SYSTEM
        )

        ChatRoomMembership.objects.filter(room=room, user_id=target_id).delete()
        return Response({'detail': 'User removed.'})

    @action(detail=True, methods=['post'], url_path='add-member')
    def add_member(self, request, pk=None):
        room = self.get_object()
        if not room.is_group:
            return Response({'error': 'Not a group'}, status=status.HTTP_400_BAD_REQUEST)
        membership = ChatRoomMembership.objects.filter(room=room, user=request.user).first()
        allowed = membership and (
            membership.role == ChatRoomMembership.ROLE_OWNER or membership.can_invite
        )
        if not allowed:
            return Response({'error': 'Not allowed to invite users'}, status=status.HTTP_403_FORBIDDEN)
        target_id = request.data.get('user_id')
        if not target_id:
            return Response({'error': 'user_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        room.participants.add(target_id)
        ChatRoomMembership.objects.update_or_create(
            room=room,
            user_id=target_id,
            defaults={'last_read_at': timezone.now()},
        )
        return Response({'detail': 'User added.'})

    @action(detail=True, methods=['post'], url_path='set-admin')
    def set_admin(self, request, pk=None):
        room = self.get_object()
        if not room.is_group:
            return Response({'error': 'Not a group'}, status=status.HTTP_400_BAD_REQUEST)
        target_id = request.data.get('user_id')
        if not target_id:
            return Response({'error': 'user_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        membership = ChatRoomMembership.objects.filter(room=room, user=request.user).first()
        if not membership or not (membership.role == ChatRoomMembership.ROLE_OWNER or membership.can_manage_admins):
            return Response({'error': 'Not allowed to manage admins'}, status=status.HTTP_403_FORBIDDEN)
        target_membership, _ = ChatRoomMembership.objects.get_or_create(room=room, user_id=target_id)
        if request.data.get('remove_admin'):
            if target_membership.role == ChatRoomMembership.ROLE_OWNER:
                return Response({'error': 'Cannot demote owner'}, status=status.HTTP_400_BAD_REQUEST)
            target_membership.role = ChatRoomMembership.ROLE_MEMBER
            target_membership.can_delete_messages = False
            target_membership.can_kick = False
            target_membership.can_invite = False
            target_membership.can_manage_admins = False
            target_membership.save()
            return Response({'detail': 'Admin removed.'})
        is_full = bool(request.data.get('is_full_admin', False))
        if is_full:
            target_membership.role = ChatRoomMembership.ROLE_ADMIN
            target_membership.can_delete_messages = True
            target_membership.can_kick = True
            target_membership.can_invite = True
            target_membership.can_manage_admins = True
        else:
            target_membership.role = ChatRoomMembership.ROLE_ADMIN
            target_membership.can_delete_messages = bool(request.data.get('can_delete_messages', False))
            target_membership.can_kick = bool(request.data.get('can_kick', False))
            target_membership.can_invite = bool(request.data.get('can_invite', False))
            target_membership.can_manage_admins = False
        target_membership.save()
        return Response({'detail': 'Admin updated.'})


class CallViewSet(viewsets.ViewSet):
    """
    API endpoints for voice/video calls
    """
    permission_classes = [permissions.IsAuthenticated]

    def _generate_agora_token(self, channel_name, uid):
        """
        Generate Agora RTC token for secure mode.
        Returns empty string if App Certificate is not configured.
        """
        app_id = getattr(settings, 'AGORA_APP_ID', '')
        app_certificate = getattr(settings, 'AGORA_APP_CERTIFICATE', '')

        if not app_certificate:
            # No certificate configured, return empty (works with testing mode)
            return ''

        try:
            from agora_token_builder import RtcTokenBuilder

            # Token expires in 24 hours
            expiration_time = int(time.time()) + 86400
            
            # Role_Publisher = 1
            role = 1

            token = RtcTokenBuilder.buildTokenWithUid(
                app_id,
                app_certificate,
                channel_name,
                uid,
                role,
                expiration_time
            )
            return token
        except Exception as e:
            import logging
            logging.getLogger('apps.chat').error(f"Failed to generate Agora token: {e}")
            return ''

    @action(detail=False, methods=['post'], url_path='start')
    def start_call(self, request):
        """Start a new call"""
        serializer = StartCallSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        room_id = serializer.validated_data['room_id']
        callee_id = serializer.validated_data['callee_id']
        call_type = serializer.validated_data['call_type']

        # Verify room exists and user is participant
        try:
            room = ChatRoom.objects.get(id=room_id)
        except ChatRoom.DoesNotExist:
            return Response({'error': 'Room not found'}, status=status.HTTP_404_NOT_FOUND)

        if not room.participants.filter(id=request.user.id).exists():
            return Response({'error': 'Not a participant'}, status=status.HTTP_403_FORBIDDEN)

        # Verify callee is participant
        try:
            callee = User.objects.get(id=callee_id)
        except User.DoesNotExist:
            return Response({'error': 'Callee not found'}, status=status.HTTP_404_NOT_FOUND)

        if not room.participants.filter(id=callee_id).exists():
            return Response({'error': 'Callee is not a participant'}, status=status.HTTP_403_FORBIDDEN)

        # Check if there's an active call in this room
        active_call = Call.objects.filter(
            room=room,
            status__in=[Call.STATUS_PENDING, Call.STATUS_RINGING, Call.STATUS_CONNECTING, Call.STATUS_CONNECTED]
        ).first()

        if active_call:
            # If the SAME caller is trying again, assume previous call is dead/stale.
            # OR if call has no token
            # OR if call is old active state
            is_stale = False
            
            if active_call.caller == request.user:
                is_stale = True
            elif not active_call.agora_token:
                is_stale = True
            elif active_call.status in [Call.STATUS_PENDING, Call.STATUS_RINGING]:
                 # Always replace pending calls if a new one is forced
                 is_stale = True
            
            if is_stale:
                active_call.status = Call.STATUS_ENDED
                active_call.ended_at = timezone.now()
                active_call.save(update_fields=['status', 'ended_at'])
            else:
                 # Even if logically "active", if the user forces a new call, we must clear the way.
                 # Log it, but allow it.
                 active_call.status = Call.STATUS_ENDED
                 active_call.ended_at = timezone.now()
                 active_call.save(update_fields=['status', 'ended_at'])

        # Generate unique channel name
        import uuid
        channel_name = f"call_{room_id}_{uuid.uuid4().hex[:8]}"
        agora_token = self._generate_agora_token(channel_name, request.user.id)

        # Create call record
        call = Call.objects.create(
            room=room,
            caller=request.user,
            callee=callee,
            call_type=call_type,
            status=Call.STATUS_RINGING,
            agora_channel=channel_name,
            agora_token=agora_token,
        )

        # Create chat message for the call
        call_msg_body = "Incoming Video Call" if call_type == 'video' else "Incoming Voice Call"
        Message.objects.create(
            room=room,
            sender=request.user,
            body=call_msg_body,
            message_type=Message.MESSAGE_TYPE_CALL
        )

        # Send call signal via WebSocket to callee
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'chat_{room.id}',
            {
                'type': 'call_signal',
                'signal': {
                    'type': 'call_offer',
                    'call_id': str(call.id),
                    'room_id': room.id,
                    'caller_id': request.user.id,
                    'caller_username': request.user.username,
                    'caller_avatar': request.user.avatar_url or (
                        request.build_absolute_uri(request.user.avatar_file.url) if request.user.avatar_file else None
                    ),
                    'callee_id': callee.id,
                    'call_type': call_type,
                    'call_type': call_type,
                    'agora_channel': channel_name,
                    # 'agora_token': agora_token, # DO NOT SEND TOKEN to callee in offer. Callee gets their own token on answer.
                }
            }
        )

        # Send push notification to callee
        from apps.notifications.utils import send_push_to_user
        if callee.expo_push_token:
            call_type_display = "Video" if call_type == 'video' else "Voice"
            send_push_to_user(
                callee,
                title=f"Incoming {call_type_display} Call",
                message=f"{request.user.username} is calling you",
                data={"roomId": room.id, "callId": call.id, "callType": call_type}
            )

        call_serializer = CallSerializer(call, context={'request': request})
        return Response({
            'call_id': str(call.id),
            'agora_channel': channel_name,
            'agora_token': agora_token,
            'call': call_serializer.data,
        }, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], url_path='answer')
    def answer_call(self, request, pk=None):
        """Answer an incoming call"""
        try:
            call = Call.objects.get(id=pk)
        except Call.DoesNotExist:
            return Response({'error': 'Call not found'}, status=status.HTTP_404_NOT_FOUND)

        if call.callee != request.user:
            return Response({'error': 'You are not the callee'}, status=status.HTTP_403_FORBIDDEN)

        # Allow answering if status is calling, ringing, or already connecting (idempotent)
        allowed_statuses = [Call.STATUS_PENDING, Call.STATUS_RINGING, Call.STATUS_CONNECTING]
        if call.status not in allowed_statuses:
            return Response({'error': f'Call cannot be answered (status: {call.status})'}, status=status.HTTP_400_BAD_REQUEST)

        # Only update if not already connecting (handle duplicate requests gracefully)
        if call.status != Call.STATUS_CONNECTING:
            call.status = Call.STATUS_CONNECTING
            call.started_at = timezone.now()
            call.save(update_fields=['status', 'started_at'])

        # Generate fresh token for the callee
        callee_token = self._generate_agora_token(call.agora_channel, request.user.id)

        # Notify caller that call was answered
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'chat_{call.room_id}',
            {
                'type': 'call_signal',
                'signal': {
                    'type': 'call_answer',
                    'call_id': str(call.id),
                    'room_id': call.room_id,
                    'caller_id': call.caller_id,
                    'callee_id': call.callee_id,
                    'agora_channel': call.agora_channel,
                    'agora_token': call.agora_token, # Caller keeps their own token
                }
            }
        )

        serializer = CallSerializer(call, context={'request': request})
        data = serializer.data
        data['agora_token'] = callee_token # Override for the answering user
        return Response(data)

    @action(detail=True, methods=['post'], url_path='reject')
    def reject_call(self, request, pk=None):
        """Reject an incoming call"""
        try:
            call = Call.objects.get(id=pk)
        except Call.DoesNotExist:
            return Response({'error': 'Call not found'}, status=status.HTTP_404_NOT_FOUND)

        if call.callee != request.user:
            return Response({'error': 'You are not the callee'}, status=status.HTTP_403_FORBIDDEN)

        # If call is already past the rejection stage (connecting, connected, ended, etc.)
        # just return success - this handles race conditions gracefully
        terminal_statuses = [Call.STATUS_CONNECTING, Call.STATUS_CONNECTED, Call.STATUS_ENDED, 
                            Call.STATUS_REJECTED, Call.STATUS_MISSED, Call.STATUS_FAILED]
        if call.status in terminal_statuses:
            return Response({'detail': 'Call already processed'})

        if call.status not in [Call.STATUS_PENDING, Call.STATUS_RINGING]:
            return Response({'error': f'Call cannot be rejected (status: {call.status})'}, status=status.HTTP_400_BAD_REQUEST)

        call.status = Call.STATUS_REJECTED
        call.ended_at = timezone.now()
        call.save(update_fields=['status', 'ended_at'])

        # Notify caller
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'chat_{call.room_id}',
            {
                'type': 'call_signal',
                'signal': {
                    'type': 'call_reject',
                    'call_id': str(call.id),
                    'room_id': call.room_id,
                    'caller_id': call.caller_id,
                    'callee_id': call.callee_id,
                }
            }
        )

        return Response({'detail': 'Call rejected'})

    @action(detail=True, methods=['post'], url_path='end')
    def end_call(self, request, pk=None):
        """End an active call"""
        try:
            call = Call.objects.get(id=pk)
        except Call.DoesNotExist:
            return Response({'error': 'Call not found'}, status=status.HTTP_404_NOT_FOUND)

        if request.user not in [call.caller, call.callee]:
            return Response({'error': 'You are not a participant'}, status=status.HTTP_403_FORBIDDEN)

        reason = request.data.get('reason', 'ended')

        # Calculate duration if call was connected
        duration = None
        if call.started_at:
            duration = int((timezone.now() - call.started_at).total_seconds())

        call.status = reason if reason in ['ended', 'failed', 'missed', 'busy'] else Call.STATUS_ENDED
        call.ended_at = timezone.now()
        call.duration = duration
        call.save(update_fields=['status', 'ended_at', 'duration'])

        # Notify other participant
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'chat_{call.room_id}',
            {
                'type': 'call_signal',
                'signal': {
                    'type': 'call_end',
                    'call_id': str(call.id),
                    'room_id': call.room_id,
                    'caller_id': call.caller_id,
                    'callee_id': call.callee_id,
                    'reason': call.status,
                    'duration': duration,
                }
            }
        )

        serializer = CallSerializer(call, context={'request': request})
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='active')
    def get_active_call(self, request):
        """Get the current active call for the user"""
        call = Call.objects.filter(
            Q(caller=request.user) | Q(callee=request.user),
            status__in=[Call.STATUS_PENDING, Call.STATUS_RINGING, Call.STATUS_CONNECTING, Call.STATUS_CONNECTED]
        ).select_related('caller', 'callee').first()

        if not call:
            return Response(None)

        # Generate/regenerate token if missing
        agora_token = call.agora_token
        if not agora_token:
            agora_token = self._generate_agora_token(call.agora_channel, request.user.id)
        
        serializer = CallSerializer(call, context={'request': request})
        data = serializer.data
        # Generate fresh token for session restore
        fresh_token = self._generate_agora_token(call.agora_channel, request.user.id)
        data['agora_token'] = fresh_token
        
        return Response(data)

    @action(detail=False, methods=['get'], url_path='history')
    def call_history(self, request):
        """Get call history for the current user"""
        calls = Call.objects.filter(
            Q(caller=request.user) | Q(callee=request.user)
        ).order_by('-created_at')[:50]

        serializer = CallSerializer(calls, many=True, context={'request': request})
        return Response(serializer.data)
