from django.db import models
from django.conf import settings
from apps.chat.models import ChatRoom

class Call(models.Model):
    # Status constants
    STATUS_PENDING = 'calling'
    STATUS_RINGING = 'ringing'
    STATUS_CONNECTING = 'connecting'
    STATUS_CONNECTED = 'connected'
    STATUS_ENDED = 'ended'
    STATUS_REJECTED = 'rejected'
    STATUS_MISSED = 'missed'
    STATUS_BUSY = 'busy'
    STATUS_FAILED = 'failed'

    CALL_TYPES = (
        ('voice', 'Voice'),
        ('video', 'Video'),
    )
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
    caller = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='calls_made')
    callee = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='calls_received')
    call_type = models.CharField(max_length=10, choices=CALL_TYPES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='calling')
    agora_channel = models.CharField(max_length=100, blank=True, null=True)
    agora_token = models.TextField(blank=True, null=True)
    started_at = models.DateTimeField(auto_now_add=True)
    ended_at = models.DateTimeField(null=True, blank=True)
    duration = models.IntegerField(default=0)

    class Meta:
        ordering = ['-started_at']
