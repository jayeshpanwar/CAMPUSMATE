#!/usr/bin/env python
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "campusmate_backend.settings")
django.setup()

from chat.models import ChatGroup, GroupMembership
from users.models import User

print("=== CHAT GROUPS ===")
groups = ChatGroup.objects.all()
print(f"Total groups: {groups.count()}")

for group in groups:
    print(f"  - {group.name}: {group.memberships.count()} members, {group.messages.count()} messages")

print("\n=== USERS ===")
students = User.objects.filter(role='student')
print(f"Total students: {students.count()}")

# Check first student
if students.exists():
    student = students.first()
    print(f"\nFirst student: {student.email} ({student.first_name})")
    memberships = GroupMembership.objects.filter(user=student)
    print(f"Groups via membership: {memberships.count()}")
    for membership in memberships:
        print(f"  - {membership.group.name}")

# Check a faculty
faculty = User.objects.filter(role='faculty').first()
if faculty:
    print(f"\nFirst faculty: {faculty.email} ({faculty.first_name})")
    memberships = GroupMembership.objects.filter(user=faculty)
    print(f"Groups via membership: {memberships.count()}")
    for membership in memberships:
        print(f"  - {membership.group.name}")
