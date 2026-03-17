# marks/urls.py
from django.urls import path
from .views import (
    AnalyzeMidSemMarksView,
    GenerateStudyPlanView,
    MyStudyPlansView,
    StudyPlanDetailView,
    UpdateTaskProgressView,
    FacultyEnterMarksView,
    FacultyStudentsView,
    FacultyBulkEnterMarksView,
    StudentMarksView,
)

urlpatterns = [
    # Student: analyze already-stored or inline marks → returns analysis JSON
    path('analyze-midsem-marks/', AnalyzeMidSemMarksView.as_view(), name='analyze-midsem-marks-alias'),
    path('analyze/', AnalyzeMidSemMarksView.as_view(), name='analyze-midsem-marks'),

    # Student/Faculty: generate Gemini study plan for a plan record or inline marks
    path('generate-study-plan/', GenerateStudyPlanView.as_view(), name='generate-study-plan'),

    # Student: list all their study plans
    path('my-plans/', MyStudyPlansView.as_view(), name='my-study-plans'),

    # Student: retrieve or delete a specific plan
    path('plan/<int:pk>/', StudyPlanDetailView.as_view(), name='study-plan-detail'),

    # Student: update per-task completion checkboxes
    path('plan/<int:pk>/progress/', UpdateTaskProgressView.as_view(), name='update-task-progress'),

    # Faculty: enter a student's marks
    path('faculty/enter/', FacultyEnterMarksView.as_view(), name='faculty-enter-marks'),

    # Faculty: bulk upload marks for multiple students
    path('faculty/bulk-enter/', FacultyBulkEnterMarksView.as_view(), name='faculty-bulk-enter-marks'),

    # Faculty: list students for marks entry form
    path('faculty/students/', FacultyStudentsView.as_view(), name='faculty-students-list'),

    # Student: see their own raw marks entries
    path('my-marks/', StudentMarksView.as_view(), name='student-marks'),
]
