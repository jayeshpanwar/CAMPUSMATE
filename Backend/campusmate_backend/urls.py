# campusmate_backend/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Keep your existing include for users app endpoints (like login, register, profile)
    path('api/', include('users.urls')), 
    
    # ADD THIS LINE: Include notices app endpoints under /api/notices/
    path('api/notices/', include('notices.urls')), 
    path('api/chat/', include('chat.urls')),
]