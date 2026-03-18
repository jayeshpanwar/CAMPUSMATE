# campusmate_backend/settings.py

from pathlib import Path
from datetime import timedelta # Import this
import os
import sys
from django.core.exceptions import ImproperlyConfigured

BASE_DIR = Path(__file__).resolve().parent.parent
PROJECT_ROOT = BASE_DIR.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))
SECRET_KEY = 'django-insecure-your-secret-key-goes-here'
DEBUG = True
ALLOWED_HOSTS = []

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # 3rd Party Apps
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',

    # ✅ This line MUST be here
    'users.apps.UsersConfig', 
    'testapp',
    'chat',
    'notices',
    'marks.apps.MarksConfig',
    'attendance.apps.AttendanceConfig',
    'events.apps.EventsConfig',
    'timetable.apps.TimetableConfig',
    'availability.apps.AvailabilityConfig',
    'tasks.apps.TasksConfig',
    
]

# Gemini API key (set via environment variable)
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', '')
STUDY_PLAN_MODEL_PATH = os.getenv('STUDY_PLAN_MODEL_PATH', str(PROJECT_ROOT / 'AI' / 'models' / 'study_plan_allocator.joblib'))
USE_LOCAL_STUDY_PLAN_MODEL = os.getenv('USE_LOCAL_STUDY_PLAN_MODEL', 'True') == 'True'
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    # ✅ CorsMiddleware must be here, before CommonMiddleware
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'campusmate_backend.urls'

TEMPLATES = [ #... (rest of the template settings remain the same)
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'campusmate_backend.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# ... (AUTH_PASSWORD_VALIDATORS remain the same)

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True
STATIC_URL = 'static/'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Use your custom User model
AUTH_USER_MODEL = 'users.User' # Changed from 'users.CustomUser' to match your model name

# Configure Django REST Framework to use JWT authentication
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
}

# Feature flag: enforce OTP verification once backend verification is ready
STUDENT_VERIFICATION_REQUIRED = True

# Configure Simple JWT settings
# campusmate_backend/settings.py
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=5), # <-- Only lasts 5 minutes
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
}

# Email configuration
# Use environment variables in production. Defaults to console backend in DEBUG.
if os.getenv('EMAIL_BACKEND'):
    EMAIL_BACKEND = os.getenv('EMAIL_BACKEND')
else:
    # In development, print emails to console so you can read OTPs locally
    EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# SMTP settings (used when EMAIL_BACKEND is set to smtp backend)
EMAIL_HOST = os.getenv('EMAIL_HOST', 'smtp.gmail.com')
EMAIL_PORT = int(os.getenv('EMAIL_PORT', 587))
EMAIL_USE_TLS = os.getenv('EMAIL_USE_TLS', 'True') == 'True'
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER', '')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD', '')
DEFAULT_FROM_EMAIL = os.getenv('DEFAULT_FROM_EMAIL', EMAIL_HOST_USER or 'no-reply@campusmate.local')

if not DEBUG and EMAIL_BACKEND.endswith('smtp.EmailBackend'):
    # In production require credentials
    if not EMAIL_HOST_USER or not EMAIL_HOST_PASSWORD:
        raise ImproperlyConfigured('EMAIL_HOST_USER and EMAIL_HOST_PASSWORD must be set in production')

# Whitelist your React app's URL (Vite default is 5173)
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",   # ✅ Add this new line
    "http://127.0.0.1:5174",
]