import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from apps.ideas.models import Idea


@pytest.fixture()
def api_client():
    return APIClient()


@pytest.fixture()
def user(db):
    User = get_user_model()
    return User.objects.create_user(username='alice', email='alice@example.com', password='password123')


@pytest.fixture()
def other_user(db):
    User = get_user_model()
    return User.objects.create_user(username='bob', email='bob@example.com', password='password123')


@pytest.fixture()
def idea(db, other_user):
    return Idea.objects.create(
        title='Test Idea',
        short_description='Short desc',
        full_description='Full description',
        category='General',
        author=other_user,
    )


@pytest.fixture()
def auth_client(api_client, user):
    client = APIClient()
    client.force_authenticate(user=user)
    return client


@pytest.fixture()
def other_auth_client(api_client, other_user):
    client = APIClient()
    client.force_authenticate(user=other_user)
    return client
