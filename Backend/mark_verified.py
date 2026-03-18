import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'campusmate_backend.settings')
django.setup()

from users.models import User

# Mark all users as verified
users = User.objects.all()
for user in users:
    user.is_verified = True
    user.save()

print(f'✅ Marked {users.count()} users as verified')

# Test login again
from django.contrib.auth import authenticate
auth = authenticate(username='adi@gmail.com', password='password123')
print(f'Django auth test: {"SUCCESS ✓" if auth else "FAILED ✗"}')
