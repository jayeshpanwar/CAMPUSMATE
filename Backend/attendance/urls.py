from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CourseViewSet, CourseEnrollmentViewSet, AttendanceSessionViewSet,
    AttendanceRecordViewSet, FaceProfileViewSet
)

router = DefaultRouter()
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'enrollments', CourseEnrollmentViewSet, basename='enrollment')
router.register(r'sessions', AttendanceSessionViewSet, basename='session')
router.register(r'records', AttendanceRecordViewSet, basename='record')
router.register(r'face-profiles', FaceProfileViewSet, basename='face-profile')

urlpatterns = [
    path('', include(router.urls)),
]
