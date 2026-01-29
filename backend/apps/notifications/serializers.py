from rest_framework import serializers
from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    actor = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = ('id', 'message', 'is_read', 'created_at', 'idea', 'notification_type', 'actor')

    def get_actor(self, obj):
        if not obj.actor_id:
            return None
        return {
            'id': obj.actor_id,
            'username': obj.actor.username,
        }
