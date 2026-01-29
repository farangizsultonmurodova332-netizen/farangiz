from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    LoginView,
    LogoutView,
    MeView,
    PasswordOTPRequestView,
    PasswordOTPVerifyView,
    RefreshView,
    RegisterView,
    AdminUserViewSet,
    UserViewSet,
    DeviceViewSet,
)

router = DefaultRouter(trailing_slash=False)
router.register('users', UserViewSet, basename='user')
router.register('admin/users', AdminUserViewSet, basename='admin-user')
router.register('devices', DeviceViewSet, basename='device')

urlpatterns = [
    path('auth/register', RegisterView.as_view(), name='auth-register'),
    path('auth/login', LoginView.as_view(), name='auth-login'),
    path('auth/logout', LogoutView.as_view(), name='auth-logout'),
    path('auth/refresh', RefreshView.as_view(), name='auth-refresh'),
    path('auth/me', MeView.as_view(), name='auth-me'),
    path('auth/me/', MeView.as_view(), name='auth-me-slash'),
    path('auth/password-otp/request', PasswordOTPRequestView.as_view(), name='auth-password-otp-request'),
    path('auth/password-otp/verify', PasswordOTPVerifyView.as_view(), name='auth-password-otp-verify'),
]

urlpatterns += router.urls
