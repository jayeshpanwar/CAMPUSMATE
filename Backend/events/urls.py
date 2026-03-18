from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EventViewSet, HackathonViewSet, EventCategoryViewSet, EventFetchViewSet

router = DefaultRouter()
router.register(r'events', EventViewSet, basename='event')
router.register(r'hackathons', HackathonViewSet, basename='hackathon')
router.register(r'categories', EventCategoryViewSet, basename='event-category')
router.register(r'fetch-logs', EventFetchViewSet, basename='event-fetch')

urlpatterns = [
    path('', include(router.urls)),
]
