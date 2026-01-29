import pytest
from rest_framework import status


@pytest.mark.django_db
class TestRegistrationValidation:
    """Test registration validation logic"""

    def test_register_without_password(self, api_client):
        """User cannot register without password"""
        url = '/api/auth/register'
        data = {
            'username': 'testuser',
            'email': 'test@example.com'
            # No password provided
        }
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'password' in str(response.data).lower()

    def test_register_with_empty_password(self, api_client):
        """User cannot register with empty password"""
        url = '/api/auth/register'
        data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': ''
        }
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_register_with_short_password(self, api_client):
        """Password must be at least 8 characters"""
        url = '/api/auth/register'
        data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'short'
        }
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_register_with_invalid_username(self, api_client):
        """Username must only contain valid characters"""
        url = '/api/auth/register'
        data = {
            'username': 'test user!',  # Space and ! are invalid
            'email': 'test@example.com',
            'password': 'password123'
        }
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_register_with_short_username(self, api_client):
        """Username must be at least 3 characters"""
        url = '/api/auth/register'
        data = {
            'username': 'ab',  # Too short
            'email': 'test@example.com',
            'password': 'password123'
        }
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
class TestIdeaValidation:
    """Test idea creation validation"""

    def test_create_idea_without_title(self, auth_client):
        """Cannot create idea without title"""
        url = '/api/ideas'
        data = {
            'short_description': 'Test description',
            'full_description': 'Full description',
            'category': 'Tech'
        }
        response = auth_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_create_idea_with_empty_title(self, auth_client):
        """Cannot create idea with empty title"""
        url = '/api/ideas'
        data = {
            'title': '',
            'short_description': 'Test description',
            'full_description': 'Full description',
            'category': 'Tech'
        }
        response = auth_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_create_idea_without_required_fields(self, auth_client):
        """All required fields must be provided"""
        url = '/api/ideas'
        data = {
            'title': 'Test Idea'
            # Missing short_description, full_description, category
        }
        response = auth_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_create_idea_with_too_long_title(self, auth_client):
        """Title cannot exceed 120 characters"""
        url = '/api/ideas'
        data = {
            'title': 'x' * 121,  # 121 characters
            'short_description': 'Test description',
            'full_description': 'Full description',
            'category': 'Tech'
        }
        response = auth_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_create_idea_with_invalid_tags(self, auth_client):
        """Tags must only contain valid characters"""
        url = '/api/ideas'
        data = {
            'title': 'Test Idea',
            'short_description': 'Test description',
            'full_description': 'Full description',
            'category': 'Tech',
            'tags': ['valid-tag', 'invalid tag!']  # Space and ! are invalid
        }
        response = auth_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_create_idea_with_too_many_tags(self, auth_client):
        """Cannot have more than 10 tags"""
        url = '/api/ideas'
        data = {
            'title': 'Test Idea',
            'short_description': 'Test description',
            'full_description': 'Full description',
            'category': 'Tech',
            'tags': [f'tag{i}' for i in range(11)]  # 11 tags
        }
        response = auth_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_update_idea_preserves_tags_if_not_provided(self, other_auth_client, idea):
        """Tags should not be cleared if not provided in update"""
        from apps.ideas.models import Tag

        # Add tags to idea first
        tag1 = Tag.objects.create(name='tag1')
        tag2 = Tag.objects.create(name='tag2')
        idea.tags.set([tag1, tag2])

        # Update without tags field
        url = f'/api/ideas/{idea.id}'
        data = {
            'title': 'Updated Title'
        }
        response = other_auth_client.patch(url, data, format='json')
        assert response.status_code == status.HTTP_200_OK

        # Tags should still be there
        idea.refresh_from_db()
        assert idea.tags.count() == 2


@pytest.mark.django_db
class TestCommentValidation:
    """Test comment validation"""

    def test_create_comment_without_body(self, auth_client, idea):
        """Cannot create comment without body"""
        url = f'/api/ideas/{idea.id}/comments'
        data = {}
        response = auth_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_create_comment_with_empty_body(self, auth_client, idea):
        """Cannot create comment with empty body"""
        url = f'/api/ideas/{idea.id}/comments'
        data = {'body': ''}
        response = auth_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_create_comment_with_too_long_body(self, auth_client, idea):
        """Comment body cannot exceed 1000 characters"""
        url = f'/api/ideas/{idea.id}/comments'
        data = {'body': 'x' * 1001}
        response = auth_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
class TestViewCountLogic:
    """Test view count increment logic"""

    def test_view_count_increments_on_retrieve(self, api_client, idea):
        """View count should increment when idea is retrieved"""
        initial_views = idea.views_count
        url = f'/api/ideas/{idea.id}'

        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK

        # Check that view count incremented
        idea.refresh_from_db()
        assert idea.views_count == initial_views + 1

        # Check that response includes updated view count
        assert response.data['views_count'] == initial_views + 1

    def test_view_count_increments_multiple_times(self, api_client, idea):
        """View count should increment on each retrieve"""
        url = f'/api/ideas/{idea.id}'

        # View 3 times
        for i in range(3):
            api_client.get(url)

        idea.refresh_from_db()
        assert idea.views_count == 3
