import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'campusmate_backend.settings')
django.setup()

from django.contrib.auth import authenticate
from users.models import User

# Check if user exists
user = User.objects.filter(email='adi@gmail.com').first()
print(f'User exists: {user is not None}')
if user:
    print(f'Email: {user.email}')
    print(f'Username: {user.username}')
    print(f'Is active: {user.is_active}')
    print(f'Role: {user.role}')
    
    # Try to authenticate with email
    auth_user = authenticate(username='adi@gmail.com', password='password123')
    print(f'Auth with email worked: {auth_user is not None}')
    
    # Try with username
    auth_user2 = authenticate(username='adi', password='password123')
    print(f'Auth with username worked: {auth_user2 is not None}')
    
    # Check password
    print(f'Check password result: {user.check_password("password123")}')
else:
    print('User not found in database')
    # List all users
    all_users = User.objects.all()
    print(f'Total users in database: {all_users.count()}')
    for u in all_users[:5]:
        print(f'  - {u.email} ({u.username})')
