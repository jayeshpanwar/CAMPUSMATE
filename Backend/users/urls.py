# users/urls.py

from django.urls import path
from .views import (
    StudentRegisterView,
    FacultyRegisterView,
    AdminRegisterView,
    ProfileView,
    StudentOnlyView,
    FacultyOnlyView,
    AdminOnlyView
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # --- Registration URLs ---
    path('register/student/', StudentRegisterView.as_view(), name='register-student'),
    path('register/faculty/', FacultyRegisterView.as_view(), name='register-faculty'),
    path('register/admin/', AdminRegisterView.as_view(), name='register-admin'),

    # --- Login/Auth URLs ---
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # --- Protected Data URLs ---
    path('profile/', ProfileView.as_view(), name='profile'),
    path('student-only/', StudentOnlyView.as_view(), name='student-only'),
    path('faculty-only/', FacultyOnlyView.as_view(), name='faculty-only'),
    path('admin-only/', AdminOnlyView.as_view(), name='admin-only'),
]