# CampusMate AI Coding Guidelines

## Architecture Overview
- **Backend**: Django 4.2 with Django REST Framework, JWT authentication (5-min access tokens), custom User model with roles (student/faculty/admin)
- **Frontend**: React 19 with Vite, Tailwind CSS, React Router for role-based routing
- **Real-time**: Django Channels for WebSocket chat at `ws/chat/<room_name>/`
- **Database**: SQLite (development), custom User model in `users/models.py`
- **API**: RESTful endpoints under `/api/`, CORS configured for React dev server (ports 5173/5174)

## Key Patterns
- **Authentication**: Email-based login, JWT tokens stored in localStorage, automatic refresh via axios interceptors (`src/components/api.js`)
- **User Roles**: Enforce permissions in views (e.g., `chat/consumers.py` checks sender/recipient roles for messaging)
- **Frontend Routing**: Role-specific login/signup pages, protected dashboard route (`src/App.jsx`)
- **API Structure**: Separate serializers/views for each app (users, notices, chat) under `/api/`

## Development Workflow
- **Backend Setup**: `cd Backend && pip install -r requirements.txt && python manage.py migrate && python manage.py runserver`
- **Frontend Setup**: `cd Frontend/login && npm install && npm run dev`
- **Database**: Run migrations after model changes: `python manage.py makemigrations && python manage.py migrate`
- **WebSocket**: Requires Channels; add `channels` and `channels-redis` to `requirements.txt` if missing

## Conventions
- **Models**: Custom User extends AbstractUser, uses email as USERNAME_FIELD (`users/models.py`)
- **URLs**: App-specific includes in main `urls.py` (e.g., `path('api/notices/', include('notices.urls'))`)
- **Settings**: JWT lifetime short (5 min) for security, CORS origins include React ports
- **Components**: Role-specific login components (StudentLogin, FacultyLogin, etc.) in `src/components/`

## Common Tasks
- **Add API Endpoint**: Create view in app/views.py, add to app/urls.py, update frontend API calls in `api.js`
- **User Permissions**: Check `request.user.role` in views, validate in WebSocket consumers
- **Frontend Auth**: Use `ProtectedRoute` component for authenticated pages, handle token expiry in API client

Reference: `Backend/campusmate_backend/settings.py`, `Frontend/login/src/App.jsx`, `Backend/users/models.py`</content>
<parameter name="filePath">e:\MAJOR\CAMPUSMATE\.github\copilot-instructions.md