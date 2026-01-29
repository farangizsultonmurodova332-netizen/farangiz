from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


class ChatRoom(models.Model):
    """
    Chat room between users (direct or group)
    """
    participants = models.ManyToManyField(User, related_name='chat_rooms')
    is_group = models.BooleanField(default=False)
    name = models.CharField(max_length=120, blank=True)
    description = models.TextField(blank=True)
    is_private = models.BooleanField(default=False)
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='created_chat_rooms'
    )
    avatar_url = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']
        indexes = [
            models.Index(fields=['-updated_at']),
        ]

    def __str__(self):
        if self.is_group and self.name:
            return f"Group: {self.name}"
        usernames = ', '.join([user.username for user in self.participants.all()[:2]])
        return f"Chat: {usernames}"


class ChatRoomMembership(models.Model):
    ROLE_OWNER = 'owner'
    ROLE_ADMIN = 'admin'
    ROLE_MEMBER = 'member'
    ROLE_CHOICES = (
        (ROLE_OWNER, 'Owner'),
        (ROLE_ADMIN, 'Admin'),
        (ROLE_MEMBER, 'Member'),
    )

    room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name='memberships')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chat_memberships')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=ROLE_MEMBER)
    can_delete_messages = models.BooleanField(default=False)
    can_kick = models.BooleanField(default=False)
    can_invite = models.BooleanField(default=False)
    can_manage_admins = models.BooleanField(default=False)
    joined_at = models.DateTimeField(auto_now_add=True)
    last_read_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('room', 'user')


class Message(models.Model):
    """
    Individual message in a chat room
    """
    room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    reply_to = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='replies'
    )
    body = models.TextField(max_length=2000)
    image = models.FileField(upload_to='chat-images/', blank=True, null=True)
    audio = models.FileField(upload_to='chat-audio/', blank=True, null=True)
    audio_duration = models.FloatField(null=True, blank=True)  # seconds
    audio_size = models.PositiveIntegerField(null=True, blank=True)  # bytes
    file = models.FileField(upload_to='chat-files/', blank=True, null=True)
    file_name = models.CharField(max_length=255, blank=True)  # Original filename
    file_size = models.PositiveIntegerField(null=True, blank=True)  # bytes
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_edited = models.BooleanField(default=False)
    is_read = models.BooleanField(default=False, db_index=True)
    is_deleted = models.BooleanField(default=False)

    class Meta:
        ordering = ['created_at']
        indexes = [
            models.Index(fields=['room', 'created_at']),
            models.Index(fields=['room', 'is_read']),
        ]

    def __str__(self):
        return f"{self.sender.username}: {self.body[:50]}"


class Call(models.Model):
    """
    Voice/Video call between users
    """
    CALL_TYPE_VOICE = 'voice'
    CALL_TYPE_VIDEO = 'video'
    CALL_TYPE_CHOICES = (
        (CALL_TYPE_VOICE, 'Voice'),
        (CALL_TYPE_VIDEO, 'Video'),
    )

    STATUS_PENDING = 'calling'
    STATUS_RINGING = 'ringing'
    STATUS_CONNECTING = 'connecting'
    STATUS_CONNECTED = 'connected'
    STATUS_ENDED = 'ended'
    STATUS_REJECTED = 'rejected'
    STATUS_MISSED = 'missed'
    STATUS_BUSY = 'busy'
    STATUS_FAILED = 'failed'
    STATUS_CHOICES = (
        (STATUS_PENDING, 'Calling'),
        (STATUS_RINGING, 'Ringing'),
        (STATUS_CONNECTING, 'Connecting'),
        (STATUS_CONNECTED, 'Connected'),
        (STATUS_ENDED, 'Ended'),
        (STATUS_REJECTED, 'Rejected'),
        (STATUS_MISSED, 'Missed'),
        (STATUS_BUSY, 'Busy'),
        (STATUS_FAILED, 'Failed'),
    )

    room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name='calls')
    caller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='outgoing_calls')
    callee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='incoming_calls')
    call_type = models.CharField(max_length=10, choices=CALL_TYPE_CHOICES, default=CALL_TYPE_VOICE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
    agora_channel = models.CharField(max_length=255, blank=True)
    agora_token = models.CharField(max_length=512, blank=True)
    started_at = models.DateTimeField(null=True, blank=True)
    ended_at = models.DateTimeField(null=True, blank=True)
    duration = models.PositiveIntegerField(null=True, blank=True)  # seconds
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['room', '-created_at']),
            models.Index(fields=['caller', 'status']),
            models.Index(fields=['callee', 'status']),
        ]

    def __str__(self):
        return f"{self.caller.username} -> {self.callee.username} ({self.call_type})"
