import re
from django.db import transaction
from rest_framework import serializers
from .models import Comment, Idea, PublicComment, Tag
from apps.accounts.serializers import resolve_avatar_url


def get_context_language(context) -> str:
    lang = context.get('lang') or 'en'
    if isinstance(lang, str) and ',' in lang:
        lang = lang.split(',', 1)[0]
    lang = lang.strip().lower()
    return lang[:2] if len(lang) >= 2 else 'en'


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ('id', 'name')


class TagsField(serializers.ListField):
    child = serializers.CharField()

    def to_representation(self, value):
        if hasattr(value, 'all'):
            return [tag.name for tag in value.all()]
        return [tag.name if hasattr(tag, 'name') else str(tag) for tag in value]

    def to_internal_value(self, data):
        print(f"DEBUG TAGS DATA: {type(data)} - {data}")
        if data in (None, ''):
            return []
        if isinstance(data, str):
            data = [param.strip() for param in data.split(',') if param.strip()]

        if not isinstance(data, list):
            raise serializers.ValidationError('Tags must be a list of strings.')

        if len(data) > 10:
            raise serializers.ValidationError('You can add at most 10 tags.')

        clean_tags = []
        tag_pattern = re.compile(r'^[a-zA-Z0-9-_\s]+$')

        for item in data:
            tag = str(item).strip()
            if not tag:
                continue
            if len(tag) > 50:
                raise serializers.ValidationError(f'Tag "{tag}" is too long. Maximum length is 50 characters.')
            if not tag_pattern.match(tag):
                raise serializers.ValidationError(f'Tag "{tag}" can only contain letters, numbers, hyphens, underscores, and spaces.')
            clean_tags.append(tag)

        return clean_tags


class IdeaSerializer(serializers.ModelSerializer):
    title = serializers.CharField(required=True, min_length=1, max_length=120)
    title_i18n = serializers.JSONField(required=False)
    short_description = serializers.CharField(required=True, min_length=1, max_length=280)
    short_description_i18n = serializers.JSONField(required=False)
    full_description = serializers.CharField(required=True, min_length=1, max_length=5000)
    full_description_i18n = serializers.JSONField(required=False)
    category = serializers.CharField(required=True, min_length=1, max_length=80)
    category_i18n = serializers.JSONField(required=False)
    tags = TagsField(required=False)
    image = serializers.ImageField(required=False, allow_null=True)
    image_url = serializers.SerializerMethodField()
    author = serializers.SerializerMethodField()
    comment_count = serializers.IntegerField(read_only=True)
    like_count = serializers.IntegerField(read_only=True)
    user_liked = serializers.BooleanField(read_only=True)
    user_bookmarked = serializers.BooleanField(read_only=True)
    views_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Idea
        fields = (
            'id',
            'title',
            'title_i18n',
            'short_description',
            'short_description_i18n',
            'full_description',
            'full_description_i18n',
            'category',
            'category_i18n',
            'tags',
            'image',
            'image_url',
            'created_at',
            'updated_at',
            'author',
            'comment_count',
            'like_count',
            'user_liked',
            'user_bookmarked',
            'views_count',
        )

    def get_author(self, obj):
        request = self.context.get('request')
        is_following = False
        if request and request.user.is_authenticated:
            from apps.accounts.models import Follow

            is_following = Follow.objects.filter(follower=request.user, following_id=obj.author_id).exists()
        return {
            'id': obj.author_id,
            'username': obj.author.username,
            'avatar_url': resolve_avatar_url(obj.author, request),
            'is_following': is_following,
        }

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        if obj.image:
            return obj.image.url
        return None

    def to_representation(self, instance):
        data = super().to_representation(instance)
        lang = get_context_language(self.context)
        for base, field in (
            ('title', 'title_i18n'),
            ('short_description', 'short_description_i18n'),
            ('full_description', 'full_description_i18n'),
            ('category', 'category_i18n'),
        ):
            translations = data.get(field) or {}
            if isinstance(translations, dict) and translations.get(lang):
                data[base] = translations[lang]
        return data

    @transaction.atomic
    def create(self, validated_data):
        lang = get_context_language(self.context)
        tags = validated_data.pop('tags', [])
        title_i18n = validated_data.pop('title_i18n', None) or {}
        short_i18n = validated_data.pop('short_description_i18n', None) or {}
        full_i18n = validated_data.pop('full_description_i18n', None) or {}
        category_i18n = validated_data.pop('category_i18n', None) or {}

        if validated_data.get('title'):
            title_i18n.setdefault(lang, validated_data['title'])
        if validated_data.get('short_description'):
            short_i18n.setdefault(lang, validated_data['short_description'])
        if validated_data.get('full_description'):
            full_i18n.setdefault(lang, validated_data['full_description'])
        if validated_data.get('category'):
            category_i18n.setdefault(lang, validated_data['category'])

        validated_data['title_i18n'] = title_i18n
        validated_data['short_description_i18n'] = short_i18n
        validated_data['full_description_i18n'] = full_i18n
        validated_data['category_i18n'] = category_i18n

        idea = Idea.objects.create(**validated_data)
        if tags:
            clean_tags = [name.strip() for name in tags if name.strip()]
            tag_objs = [Tag.objects.get_or_create(name=name)[0] for name in clean_tags]
            idea.tags.set(tag_objs)
        return idea

    @transaction.atomic
    def update(self, instance, validated_data):
        lang = get_context_language(self.context)
        # Only pop tags if explicitly provided in the request
        tags = validated_data.pop('tags', '__NOT_PROVIDED__')
        title_i18n = validated_data.pop('title_i18n', None)
        short_i18n = validated_data.pop('short_description_i18n', None)
        full_i18n = validated_data.pop('full_description_i18n', None)
        category_i18n = validated_data.pop('category_i18n', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if title_i18n is not None:
            instance.title_i18n = {**(instance.title_i18n or {}), **title_i18n}
        if short_i18n is not None:
            instance.short_description_i18n = {**(instance.short_description_i18n or {}), **short_i18n}
        if full_i18n is not None:
            instance.full_description_i18n = {**(instance.full_description_i18n or {}), **full_i18n}
        if category_i18n is not None:
            instance.category_i18n = {**(instance.category_i18n or {}), **category_i18n}

        if validated_data.get('title'):
            instance.title_i18n = {**(instance.title_i18n or {}), lang: validated_data['title']}
        if validated_data.get('short_description'):
            instance.short_description_i18n = {
                **(instance.short_description_i18n or {}),
                lang: validated_data['short_description'],
            }
        if validated_data.get('full_description'):
            instance.full_description_i18n = {
                **(instance.full_description_i18n or {}),
                lang: validated_data['full_description'],
            }
        if validated_data.get('category'):
            instance.category_i18n = {**(instance.category_i18n or {}), lang: validated_data['category']}

        instance.save()

        # Only update tags if they were explicitly provided
        if tags != '__NOT_PROVIDED__':
            if tags:  # If tags list is provided and not empty
                clean_tags = [name.strip() for name in tags if name.strip()]
                tag_objs = [Tag.objects.get_or_create(name=name)[0] for name in clean_tags]
                instance.tags.set(tag_objs)
            else:  # If empty list provided, clear all tags
                instance.tags.clear()
        # If tags == '__NOT_PROVIDED__', don't touch tags at all

        return instance


class CommentSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField()
    idea_detail = serializers.SerializerMethodField()
    body = serializers.CharField(required=False, allow_blank=True, max_length=1000)
    body_i18n = serializers.JSONField(required=False)
    image = serializers.FileField(required=False, allow_null=True)
    image_url = serializers.SerializerMethodField()
    like_count = serializers.IntegerField(read_only=True)
    user_liked = serializers.BooleanField(read_only=True)
    is_pinned = serializers.BooleanField(read_only=True)

    class Meta:
        model = Comment
        fields = (
            'id',
            'idea',
            'idea_detail',
            'author',
            'parent',
            'body',
            'body_i18n',
            'image',
            'image_url',
            'is_pinned',
            'created_at',
            'like_count',
            'user_liked',
        )
        read_only_fields = ('idea',)

    def get_author(self, obj):
        return {
            'id': obj.author_id,
            'username': obj.author.username,
            'avatar_url': resolve_avatar_url(obj.author, self.context.get('request')),
        }

    def get_idea_detail(self, obj):
        lang = get_context_language(self.context)
        title = obj.idea.title_i18n.get(lang) if isinstance(obj.idea.title_i18n, dict) else None
        return {
            'id': obj.idea_id,
            'title': title or obj.idea.title,
        }

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        if obj.image:
            return obj.image.url
        return None

    def validate_parent(self, parent):
        if parent and parent.parent_id:
            raise serializers.ValidationError('Only one level of replies is allowed.')
        return parent

    def validate(self, attrs):
        parent = attrs.get('parent')
        body = attrs.get('body', '')
        body_i18n = attrs.get('body_i18n') or {}
        image = attrs.get('image')
        idea_id = self.context.get('idea_id')
        if parent and idea_id and parent.idea_id != idea_id:
            raise serializers.ValidationError('Parent comment must belong to the same idea.')
        has_existing_image = bool(getattr(self.instance, 'image', None))
        has_i18n_body = isinstance(body_i18n, dict) and any(value.strip() for value in body_i18n.values() if value)
        if not body.strip() and not has_i18n_body and not image and not has_existing_image:
            raise serializers.ValidationError('Comment must include text or an image.')
        if image and hasattr(image, 'content_type') and not image.content_type.startswith('image/'):
            raise serializers.ValidationError('Comment image must be an image file.')
        return attrs

    def create(self, validated_data):
        lang = get_context_language(self.context)
        body_i18n = validated_data.pop('body_i18n', None) or {}
        if validated_data.get('body'):
            body_i18n.setdefault(lang, validated_data['body'])
        validated_data['body_i18n'] = body_i18n
        return Comment.objects.create(**validated_data)

    def update(self, instance, validated_data):
        lang = get_context_language(self.context)
        body_i18n = validated_data.pop('body_i18n', None)
        if body_i18n is not None:
            instance.body_i18n = {**(instance.body_i18n or {}), **body_i18n}
        if validated_data.get('body'):
            instance.body_i18n = {**(instance.body_i18n or {}), lang: validated_data['body']}
        return super().update(instance, validated_data)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        lang = get_context_language(self.context)
        translations = data.get('body_i18n') or {}
        if isinstance(translations, dict) and translations.get(lang):
            data['body'] = translations[lang]
        return data


class PublicCommentSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField()
    body_i18n = serializers.JSONField(required=False)

    class Meta:
        model = PublicComment
        fields = ('id', 'author', 'body', 'body_i18n', 'created_at')
        read_only_fields = ('author',)

    def get_author(self, obj):
        return {
            'id': obj.author_id,
            'username': obj.author.username,
        }

    def to_representation(self, instance):
        data = super().to_representation(instance)
        lang = get_context_language(self.context)
        translations = data.get('body_i18n') or {}
        if isinstance(translations, dict) and translations.get(lang):
            data['body'] = translations[lang]
        return data

    def create(self, validated_data):
        lang = get_context_language(self.context)
        body_i18n = validated_data.pop('body_i18n', None) or {}
        if validated_data.get('body'):
            body_i18n.setdefault(lang, validated_data['body'])
        validated_data['body_i18n'] = body_i18n
        return super().create(validated_data)

    def update(self, instance, validated_data):
        lang = get_context_language(self.context)
        body_i18n = validated_data.pop('body_i18n', None)
        if body_i18n is not None:
            instance.body_i18n = {**(instance.body_i18n or {}), **body_i18n}
        if validated_data.get('body'):
            instance.body_i18n = {**(instance.body_i18n or {}), lang: validated_data['body']}
        return super().update(instance, validated_data)
