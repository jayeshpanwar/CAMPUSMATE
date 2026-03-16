from django.urls import path
from .views import (
    FacultyRegisterView,
    AdminRegisterView,
    StudentRegisterView,
    ProfileView,
    StudentOnlyView,
    FacultyOnlyView,
    AdminOnlyView,
    CustomLoginView,
    StudentVerificationInitiateView,
    StudentVerificationConfirmView,
    NoDuesSubjectView,
    NoDuesApplicationView,
    NoDuesDecisionView,
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # --- Registration URLs ---
    path('register/faculty/', FacultyRegisterView.as_view(), name='register-faculty'),
    path('register/admin/', AdminRegisterView.as_view(), name='register-admin'),
    path('register/student/', StudentRegisterView.as_view(), name='register-student'),

    # --- Login/Auth URLs ---
    path('login/', CustomLoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # --- Verification URLs ---
    path('verify/student/initiate/', StudentVerificationInitiateView.as_view(), name='student-verify-initiate'),
    path('verify/student/confirm/', StudentVerificationConfirmView.as_view(), name='student-verify-confirm'),
    
    # --- Protected Data URLs ---
    path('profile/', ProfileView.as_view(), name='profile'),
    path('student-only/', StudentOnlyView.as_view(), name='student-only'),
    path('faculty-only/', FacultyOnlyView.as_view(), name='faculty-only'),
    path('admin-only/', AdminOnlyView.as_view(), name='admin-only'),

    # --- No-Dues URLs ---
    path('no-dues/subjects/', NoDuesSubjectView.as_view(), name='no-dues-subjects'),
    path('no-dues/applications/', NoDuesApplicationView.as_view(), name='no-dues-applications'),
    path('no-dues/applications/<int:application_id>/decision/', NoDuesDecisionView.as_view(), name='no-dues-decision'),
]