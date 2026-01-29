import pytest
from apps.notifications.models import Notification


@pytest.mark.django_db
class TestNotifications:
    def test_notification_created_on_like(self, auth_client, idea, user):
        """Test that notification is created when someone likes your idea"""
        url = f'/api/ideas/{idea.id}/like'
        response = auth_client.post(url, format='json')
        assert response.status_code == 200

        # Check notification was created for idea author
        assert Notification.objects.filter(
            user=idea.author,
            actor=user,
            notification_type='like',
            idea=idea
        ).exists()

    def test_notification_created_on_comment(self, auth_client, idea, user):
        """Test that notification is created when someone comments on your idea"""
        url = f'/api/ideas/{idea.id}/comments'
        data = {'body': 'Great idea!'}
        response = auth_client.post(url, data, format='json')
        assert response.status_code == 201

        # Check notification was created for idea author
        assert Notification.objects.filter(
            user=idea.author,
            actor=user,
            notification_type='comment',
            idea=idea
        ).exists()

    def test_notification_created_on_follow(self, auth_client, other_user, user):
        """Test that notification is created when someone follows you"""
        url = f'/api/users/{other_user.id}/follow'
        response = auth_client.post(url, format='json')
        assert response.status_code == 200

        # Check notification was created
        assert Notification.objects.filter(
            user=other_user,
            actor=user,
            notification_type='follow'
        ).exists()

    def test_no_self_notification_on_like(self, other_auth_client, idea):
        """Test that users don't get notifications for their own actions"""
        url = f'/api/ideas/{idea.id}/like'
        response = other_auth_client.post(url, format='json')
        assert response.status_code == 200

        # Author shouldn't receive notification for liking their own idea
        # (This tests the condition in views.py that checks if author != user)
        count = Notification.objects.filter(
            user=idea.author,
            actor=idea.author,
            notification_type='like'
        ).count()
        assert count == 0

    def test_list_notifications(self, auth_client, user):
        """Test listing user notifications"""
        # Create some notifications
        Notification.objects.create(
            user=user,
            notification_type='like',
            message='Someone liked your idea'
        )
        Notification.objects.create(
            user=user,
            notification_type='follow',
            message='Someone followed you'
        )

        url = '/api/notifications'
        response = auth_client.get(url)
        assert response.status_code == 200
        assert len(response.data['results']) == 2

    def test_mark_notification_as_read(self, auth_client, user):
        """Test marking a notification as read"""
        notification = Notification.objects.create(
            user=user,
            notification_type='like',
            message='Test notification',
            is_read=False
        )

        url = f'/api/notifications/{notification.id}/read'
        response = auth_client.post(url, format='json')
        assert response.status_code == 200

        # Check notification is marked as read
        notification.refresh_from_db()
        assert notification.is_read is True

    def test_cannot_read_others_notifications(self, auth_client, other_user):
        """Test that users cannot mark other users' notifications as read"""
        notification = Notification.objects.create(
            user=other_user,
            notification_type='like',
            message='Test notification',
            is_read=False
        )

        url = f'/api/notifications/{notification.id}/read'
        response = auth_client.post(url, format='json')
        assert response.status_code == 404  # Should not find notification

    def test_notifications_require_auth(self, api_client):
        """Test that notification endpoints require authentication"""
        url = '/api/notifications'
        response = api_client.get(url)
        assert response.status_code == 401

    def test_notifications_ordered_by_created_at(self, auth_client, user):
        """Test that notifications are ordered by creation time (newest first)"""
        # Create notifications with different timestamps
        notif1 = Notification.objects.create(
            user=user,
            notification_type='like',
            message='First notification'
        )
        notif2 = Notification.objects.create(
            user=user,
            notification_type='follow',
            message='Second notification'
        )

        url = '/api/notifications'
        response = auth_client.get(url)
        assert response.status_code == 200

        # Newest should be first
        results = response.data['results']
        assert results[0]['id'] == notif2.id
        assert results[1]['id'] == notif1.id
