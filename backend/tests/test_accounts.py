import pytest
from django.contrib.auth import get_user_model
from rest_framework import status

User = get_user_model()


@pytest.mark.django_db
class TestRegistration:
    def test_register_valid_user(self, api_client):
        url = '/api/auth/register'
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'SecurePass123',
            'bio': 'Test bio'
        }
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_201_CREATED
        assert User.objects.filter(username='newuser').exists()
        user = User.objects.get(username='newuser')
        assert user.email == 'newuser@example.com'
        assert user.bio == 'Test bio'
        assert user.check_password('SecurePass123')

    def test_register_duplicate_username(self, api_client, user):
        url = '/api/auth/register'
        data = {
            'username': user.username,
            'email': 'different@example.com',
            'password': 'SecurePass123'
        }
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_register_duplicate_email(self, api_client, user):
        url = '/api/auth/register'
        data = {
            'username': 'different',
            'email': user.email,
            'password': 'SecurePass123'
        }
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_register_short_password(self, api_client):
        url = '/api/auth/register'
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'short'
        }
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_register_invalid_email(self, api_client):
        url = '/api/auth/register'
        data = {
            'username': 'newuser',
            'email': 'not-an-email',
            'password': 'SecurePass123'
        }
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
class TestAuthentication:
    def test_login_success(self, api_client, user):
        url = '/api/auth/login'
        data = {
            'username': 'alice',
            'password': 'password123'
        }
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data
        assert 'refresh_token' in response.cookies

    def test_login_wrong_password(self, api_client, user):
        url = '/api/auth/login'
        data = {
            'username': 'alice',
            'password': 'wrongpassword'
        }
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_login_nonexistent_user(self, api_client):
        url = '/api/auth/login'
        data = {
            'username': 'nonexistent',
            'password': 'password123'
        }
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_token_refresh(self, api_client, user):
        # Login first
        login_url = '/api/auth/login'
        login_data = {
            'username': 'alice',
            'password': 'password123'
        }
        login_response = api_client.post(login_url, login_data, format='json')
        refresh_token = login_response.cookies.get('refresh_token').value

        # Refresh token
        refresh_url = '/api/auth/refresh'
        api_client.cookies['refresh_token'] = refresh_token
        response = api_client.post(refresh_url, format='json')
        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data

    def test_get_current_user(self, auth_client, user):
        url = '/api/auth/me'
        response = auth_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['username'] == user.username
        assert response.data['email'] == user.email

    def test_get_current_user_unauthorized(self, api_client):
        url = '/api/auth/me'
        response = api_client.get(url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class TestUserProfile:
    def test_list_users(self, api_client, user, other_user):
        url = '/api/users'
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) == 2

    def test_get_user_profile(self, api_client, user):
        url = f'/api/users/{user.id}'
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['username'] == user.username
        assert 'followers_count' in response.data
        assert 'following_count' in response.data
        assert 'reputation' in response.data

    def test_get_nonexistent_user(self, api_client):
        url = '/api/users/99999'
        response = api_client.get(url)
        assert response.status_code == status.HTTP_404_NOT_FOUND


@pytest.mark.django_db
class TestFollow:
    def test_follow_user(self, auth_client, other_user, user):
        url = f'/api/users/{other_user.id}/follow'
        response = auth_client.post(url, format='json')
        assert response.status_code == status.HTTP_200_OK
        assert 'Followed' in response.data['detail']

        # Verify follow relationship
        user.refresh_from_db()
        assert user.following.filter(following=other_user).exists()

    def test_unfollow_user(self, auth_client, other_user, user):
        # Follow first
        url = f'/api/users/{other_user.id}/follow'
        auth_client.post(url, format='json')

        # Unfollow
        response = auth_client.post(url, format='json')
        assert response.status_code == status.HTTP_200_OK
        assert 'Unfollowed' in response.data['detail']

        # Verify unfollow
        user.refresh_from_db()
        assert not user.following.filter(following=other_user).exists()

    def test_cannot_follow_self(self, auth_client, user):
        url = f'/api/users/{user.id}/follow'
        response = auth_client.post(url, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'cannot follow yourself' in response.data['detail'].lower()

    def test_follow_requires_auth(self, api_client, other_user):
        url = f'/api/users/{other_user.id}/follow'
        response = api_client.post(url, format='json')
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
