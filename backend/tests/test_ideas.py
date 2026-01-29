import pytest
from apps.accounts.models import Follow
from apps.ideas.models import IdeaLike
from apps.notifications.models import Notification


@pytest.mark.django_db
def test_like_toggling(auth_client, idea, user):
    url = f'/api/ideas/{idea.id}/like'

    response = auth_client.post(url, format='json')
    assert response.status_code == 200
    assert IdeaLike.objects.filter(idea=idea, user=user).exists()

    response = auth_client.post(url, format='json')
    assert response.status_code == 200
    assert not IdeaLike.objects.filter(idea=idea, user=user).exists()


@pytest.mark.django_db
def test_idea_edit_delete_permissions(auth_client, other_auth_client, idea):
    patch_url = f'/api/ideas/{idea.id}'
    delete_url = f'/api/ideas/{idea.id}'

    response = auth_client.patch(patch_url, {'title': 'Nope'}, format='json')
    assert response.status_code == 403

    response = auth_client.delete(delete_url)
    assert response.status_code == 403

    response = other_auth_client.patch(patch_url, {'title': 'Updated'}, format='json')
    assert response.status_code == 200


@pytest.mark.django_db
def test_comment_nesting_rule(auth_client, idea):
    list_url = f'/api/ideas/{idea.id}/comments'

    response = auth_client.post(list_url, {'body': 'Top level'}, format='json')
    assert response.status_code == 201
    parent_id = response.data['id']

    response = auth_client.post(list_url, {'body': 'Reply', 'parent': parent_id}, format='json')
    assert response.status_code == 201
    reply_id = response.data['id']

    response = auth_client.post(list_url, {'body': 'Too deep', 'parent': reply_id}, format='json')
    assert response.status_code == 400


@pytest.mark.django_db
def test_notification_created_on_comment(auth_client, idea):
    url = f'/api/ideas/{idea.id}/comments'

    response = auth_client.post(url, {'body': 'Nice idea'}, format='json')
    assert response.status_code == 201
    assert Notification.objects.filter(user=idea.author, idea=idea, notification_type='comment').exists()


@pytest.mark.django_db
def test_notification_created_on_like(auth_client, idea):
    url = f'/api/ideas/{idea.id}/like'

    response = auth_client.post(url, format='json')
    assert response.status_code == 200
    assert Notification.objects.filter(user=idea.author, idea=idea, notification_type='like').exists()


@pytest.mark.django_db
def test_follow_toggle_and_notification(auth_client, other_user, user):
    url = f'/api/users/{other_user.id}/follow'

    response = auth_client.post(url, format='json')
    assert response.status_code == 200
    assert Follow.objects.filter(follower=user, following=other_user).exists()
    assert Notification.objects.filter(user=other_user, notification_type='follow').exists()

    response = auth_client.post(url, format='json')
    assert response.status_code == 200
    assert not Follow.objects.filter(follower=user, following=other_user).exists()
