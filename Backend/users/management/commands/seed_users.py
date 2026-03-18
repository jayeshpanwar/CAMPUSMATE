from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

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


class Command(BaseCommand):
    help = 'Seed the database with test users'

    def handle(self, *args, **options):
        created_count = 0
        
        # Create students
        for email in STUDENTS:
            if not User.objects.filter(email=email).exists():
                password = 'TempPass!2026' if email == 'jayditya.0832cs221089@cdgi.edu.in' else 'password123'
                first_name = email.split('.')[0].capitalize() if '.' in email else email.split('@')[0].capitalize()
                last_name = email.split('.')[-1].split('@')[0].capitalize() if '.' in email else ''
                user = User.objects.create_user(
                    email=email,
                    username=email.split('@')[0],
                    password=password,
                    role='student',
                    first_name=first_name,
                    last_name=last_name,
                )
                created_count += 1
                self.stdout.write(self.style.SUCCESS(f'Created student: {email}'))
            else:
                self.stdout.write(self.style.WARNING(f'Student already exists: {email}'))
        
        # Create faculty
        for email in FACULTY:
            if not User.objects.filter(email=email).exists():
                first_name = email.split('.')[0].capitalize() if '.' in email else email.split('@')[0].capitalize()
                last_name = email.split('.')[-1].split('@')[0].capitalize() if '.' in email else ''
                user = User.objects.create_user(
                    email=email,
                    username=email.split('@')[0],
                    password='password123',
                    role='faculty',
                    first_name=first_name,
                    last_name=last_name,
                )
                created_count += 1
                self.stdout.write(self.style.SUCCESS(f'Created faculty: {email}'))
            else:
                self.stdout.write(self.style.WARNING(f'Faculty already exists: {email}'))
        
        # Create admin
        for email in ADMIN:
            if not User.objects.filter(email=email).exists():
                user = User.objects.create_superuser(
                    email=email,
                    username=email.split('@')[0],
                    password='password123',
                    role='admin',
                    first_name='Admin',
                    last_name='User',
                )
                created_count += 1
                self.stdout.write(self.style.SUCCESS(f'Created admin: {email}'))
            else:
                self.stdout.write(self.style.WARNING(f'Admin already exists: {email}'))
        
        self.stdout.write(self.style.SUCCESS(f'\nTotal users created: {created_count}'))
        self.stdout.write(self.style.SUCCESS('✅ Database seeding complete!'))
