from django.urls import path
from .views import NoticeListView, FacultyNoticeView # Import other views if you add them

urlpatterns = [
    path('', NoticeListView.as_view(), name='notice-list'),
    path('faculty/', FacultyNoticeView.as_view(), name='faculty-notice-list-create'),
    # Add paths for create/update/delete if needed
    # path('create/', NoticeCreateView.as_view(), name='notice-create'),
]