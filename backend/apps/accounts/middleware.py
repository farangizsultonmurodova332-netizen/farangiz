from django.core.cache import cache
from django.utils import timezone


class PresenceMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        user = getattr(request, "user", None)
        if user and user.is_authenticated:
            cache.set(f"user:presence:{user.id}", True, timeout=90)
            cache.set(f"user:last_seen:{user.id}", timezone.now().isoformat(), timeout=60 * 60 * 24)
        return response
