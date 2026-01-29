from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    email = models.EmailField(unique=True)
    bio = models.TextField(blank=True)
    avatar_url = models.URLField(blank=True)
    avatar_file = models.FileField(upload_to='avatars/', blank=True, null=True)
    birth_date = models.DateField(null=True, blank=True)
    phone = models.CharField(max_length=30, blank=True)
    location = models.CharField(max_length=255, blank=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    portfolio_file = models.FileField(upload_to='portfolios/', blank=True, null=True)
    expo_push_token = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self) -> str:
        return self.username


class Follow(models.Model):
    follower = models.ForeignKey('User', on_delete=models.CASCADE, related_name='following')
    following = models.ForeignKey('User', on_delete=models.CASCADE, related_name='followers')
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        unique_together = ('follower', 'following')


class PasswordResetOTP(models.Model):
    user = models.ForeignKey('User', on_delete=models.CASCADE, related_name='password_otps')
    code_hash = models.CharField(max_length=128)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(db_index=True)
    used_at = models.DateTimeField(null=True, blank=True)
    attempt_count = models.PositiveIntegerField(default=0)

    class Meta:
        indexes = [
            models.Index(fields=['user', 'expires_at']),
        ]


class UserDevice(models.Model):
    user = models.ForeignKey('User', on_delete=models.CASCADE, related_name='devices')
    device_id = models.CharField(max_length=255, unique=True, help_text="Unique device identifier (e.g. from react-native-device-info)")
    device_name = models.CharField(max_length=255, help_text="e.g. iPhone 13, Samsung Galaxy S21")
    fcm_token = models.CharField(max_length=255, blank=True, null=True, help_text="Firebase Cloud Messaging token for push notifications")
    refresh_token = models.TextField(blank=True, null=True, help_text="JWT refresh token for this device session")
    
    last_active = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.device_name}"