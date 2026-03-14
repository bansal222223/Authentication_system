from django.urls import path
from .views import RegisterView, VerifyOTPView, LoginView, RefreshTokenView, LogoutView

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('verify-otp/', VerifyOTPView.as_view()),
    path('login/', LoginView.as_view()),
    path('refresh/', RefreshTokenView.as_view()),   # new access token
    path('logout/', LogoutView.as_view()),          # logout user
]