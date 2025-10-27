from django.urls import path
from .views import NoticeListView # Import other views if you add them

urlpatterns = [
    path('', NoticeListView.as_view(), name='notice-list'),
    # Add paths for create/update/delete if needed
    # path('create/', NoticeCreateView.as_view(), name='notice-create'),
]