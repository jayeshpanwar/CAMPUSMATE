from django.urls import path
from rest_framework.routers import SimpleRouter
from .views import StudentTaskViewSet, TaskSubmissionViewSet

router = SimpleRouter()
router.register(r'tasks', StudentTaskViewSet, basename='task')
router.register(r'submissions', TaskSubmissionViewSet, basename='submission')

urlpatterns = router.urls
