from django.urls import path
from rest_framework.routers import SimpleRouter
from .views import TimetableViewSet, LectureViewSet

router = SimpleRouter()
router.register(r'timetables', TimetableViewSet, basename='timetable')
router.register(r'lectures', LectureViewSet, basename='lecture')

urlpatterns = router.urls
