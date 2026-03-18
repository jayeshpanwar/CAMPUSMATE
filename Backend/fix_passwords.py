import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'campusmate_backend.settings')
django.setup()

from users.models import User

STUDENTS = [
    'adi@gmail.com',
    'aditya.reddy@campusmate.in',
    'admin@cdgi.edu.in',
    'ananya.verma@campusmate.in',
    'arjun.singh@campusmate.in',
    'ashu@gmail.com',
    'divya.nair@campusmate.in',
    'jayditya.0832cs221089@cdgi.edu.in',
    'jayesh.0832cs221090@cdgi.edu.in',
    'kartik.iyer@campusmate.in',
    'mayur.0832cs221118@cdgi.edu.in',
    'mayur.0832cs221119@cdgi.edu.in',
    'mayur.0832cs221119@cgdi.edu.in',
    'mayur.0832cs22119@cdgi.edu.in',
    'namanrege2@gmail.com',
    'neha.gupta@campusmate.in',
    'priya.sharma@campusmate.in',
    'rohan.patel@campusmate.in',
    'sasu1@gmail.com',
    'shreya.desai@campusmate.in',
    't@gmail.com',
    'tester123@gmail.com',
    'teststudent@campusmate.com',
    'vasu1@gmail.com',
    'vijay.kumar@campusmate.in',
]

FACULTY = [
    'f@gmail.com',
    'faculty1@campusmate.com',
    'manoj.jain@campusmate.in',
    'paras.bhanopiya@campusmate.in',
    'paras@campusmate.com',
    'radheshyam.kacholiya@campusmate.in',
    'savi.jain@campusmate.in',
    'sumeet.kothari@campusmate.in',
    'sweet@gmail.com',
    'vikrant.sharma@campusmate.edu',
]

ADMIN = [
    'admin@campusmate.com',
]

count = 0

# Fix student passwords
for email in STUDENTS:
    try:
        user = User.objects.get(email=email)
        password = 'TempPass!2026' if email == 'jayditya.0832cs221089@cdgi.edu.in' else 'password123'
        user.set_password(password)
        user.save()
        count += 1
        print(f'✓ Fixed password for student: {email}')
    except User.DoesNotExist:
        print(f'✗ Student not found: {email}')

# Fix faculty passwords
for email in FACULTY:
    try:
        user = User.objects.get(email=email)
        user.set_password('password123')
        user.save()
        count += 1
        print(f'✓ Fixed password for faculty: {email}')
    except User.DoesNotExist:
        print(f'✗ Faculty not found: {email}')

# Fix admin passwords
for email in ADMIN:
    try:
        user = User.objects.get(email=email)
        user.set_password('password123')
        user.save()
        count += 1
        print(f'✓ Fixed password for admin: {email}')
    except User.DoesNotExist:
        print(f'✗ Admin not found: {email}')

print(f'\n✅ Password fix complete! Updated {count} users.')

# Test a login
from django.contrib.auth import authenticate
test_auth = authenticate(username='adi@gmail.com', password='password123')
print(f'\nTest authentication: {"SUCCESS ✓" if test_auth else "FAILED ✗"}')
