from django.urls import path
from rest_framework.routers import SimpleRouter
from .views import FacultyAvailabilityViewSet, LeaveRequestViewSet

router = SimpleRouter()
router.register(r'availability', FacultyAvailabilityViewSet, basename='availability')
router.register(r'leave-requests', LeaveRequestViewSet, basename='leave-request')

urlpatterns = router.urls
