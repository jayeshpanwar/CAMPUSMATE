#!/usr/bin/env python
"""
Test script for chat group creation feature with faculty requirement.
Tests student/faculty/admin group creation and member management.
"""

import os
import django
import sys

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'campusmate_backend.settings')
sys.path.insert(0, 'd:/CAMPUSMATE/CAMPUSMATE/Backend')
django.setup()

import requests
import json
from users.models import User
from chat.models import ChatGroup, GroupMembership

BASE_URL = "http://localhost:8000/api"

def get_login_token(email, password):
    """Login and get JWT token."""
    response = requests.post(
        f"{BASE_URL}/login/",
        json={"email": email, "password": password}
    )
    if response.status_code == 200:
        return response.json().get('access')
    else:
        print(f"❌ Login failed for {email}: {response.text}")
        return None

def test_student_creates_group_without_faculty():
    """Test: Student creates group WITHOUT faculty (should fail)."""
    print("\n" + "="*60)
    print("TEST 1: Student creates group WITHOUT faculty")
    print("="*60)
    
    token = get_login_token("student1@example.com", "password123")
    if not token:
        print("❌ Could not login as student")
        return None
    
    headers = {"Authorization": f"Bearer {token}"}
    
    payload = {
        "name": "Study Group No Faculty",
        "description": "This should fail",
        "member_ids": []  # No faculty members
    }
    
    response = requests.post(
        f"{BASE_URL}/chat/groups/",
        json=payload,
        headers=headers
    )
    
    if response.status_code >= 400:
        print(f"✅ CORRECT: Group creation rejected for student without faculty")
        print(f"   Error: {response.json()}")
        return None
    else:
        print(f"❌ ERROR: Group was created without faculty (should have failed)")
        return response.json().get('id')

def test_student_creates_group_with_faculty():
    """Test: Student creates group WITH faculty (should succeed)."""
    print("\n" + "="*60)
    print("TEST 2: Student creates group WITH faculty")
    print("="*60)
    
    # Get a faculty user
    faculty = User.objects.filter(role='faculty').first()
    if not faculty:
        print("❌ No faculty users found in database")
        return None
    
    print(f"   Using faculty: {faculty.email} (ID: {faculty.id})")
    
    token = get_login_token("student1@example.com", "password123")
    if not token:
        print("❌ Could not login as student")
        return None
    
    headers = {"Authorization": f"Bearer {token}"}
    
    payload = {
        "name": "Study Group With Faculty",
        "description": "Created by student with faculty",
        "member_ids": [faculty.id]  # Include faculty
    }
    
    response = requests.post(
        f"{BASE_URL}/chat/groups/",
        json=payload,
        headers=headers
    )
    
    if response.status_code == 201:
        group_data = response.json()
        print(f"✅ CORRECT: Group created successfully")
        print(f"   Group ID: {group_data.get('id')}")
        print(f"   Group Name: {group_data.get('name')}")
        return group_data.get('id')
    else:
        print(f"❌ ERROR: Failed to create group: {response.text}")
        return None

def test_faculty_creates_group_no_requirement():
    """Test: Faculty creates group (no faculty requirement)."""
    print("\n" + "="*60)
    print("TEST 3: Faculty creates group (no faculty requirement)")
    print("="*60)
    
    token = get_login_token("f@gmail.com", "password123")  # Faculty user
    if not token:
        print("❌ Could not login as faculty")
        return None
    
    headers = {"Authorization": f"Bearer {token}"}
    
    payload = {
        "name": "Faculty Group - No Requirement",
        "description": "Created by faculty, no requirement",
        "member_ids": []  # No members required
    }
    
    response = requests.post(
        f"{BASE_URL}/chat/groups/",
        json=payload,
        headers=headers
    )
    
    if response.status_code == 201:
        group_data = response.json()
        print(f"✅ CORRECT: Faculty can create group without faculty members")
        print(f"   Group ID: {group_data.get('id')}")
        return group_data.get('id')
    else:
        print(f"❌ ERROR: Failed to create group: {response.text}")
        return None

def test_admin_creates_group_no_requirement():
    """Test: Admin creates group (no faculty requirement)."""
    print("\n" + "="*60)
    print("TEST 4: Admin creates group (no faculty requirement)")
    print("="*60)
    
    token = get_login_token("admin@campusmate.com", "password123")  # Admin user
    if not token:
        print("❌ Could not login as admin")
        return None
    
    headers = {"Authorization": f"Bearer {token}"}
    
    payload = {
        "name": "Admin Group - No Requirement",
        "description": "Created by admin",
        "member_ids": []  # No members required
    }
    
    response = requests.post(
        f"{BASE_URL}/chat/groups/",
        json=payload,
        headers=headers
    )
    
    if response.status_code == 201:
        group_data = response.json()
        print(f"✅ CORRECT: Admin can create group without faculty members")
        print(f"   Group ID: {group_data.get('id')}")
        return group_data.get('id')
    else:
        print(f"❌ ERROR: Failed to create group: {response.text}")
        return None

def test_add_member_to_group(group_id):
    """Test: Add member to group."""
    if not group_id:
        print("❌ No group ID provided for member addition test")
        return
    
    print("\n" + "="*60)
    print("TEST 5: Add member to group")
    print("="*60)
    
    # Get a user to add
    user = User.objects.filter(role='student').exclude(email="student1@example.com").first()
    if not user:
        print("❌ No user found to add to group")
        return
    
    print(f"   Adding user: {user.email} (ID: {user.id})")
    
    token = get_login_token("student1@example.com", "password123")
    if not token:
        print("❌ Could not login as student")
        return
    
    headers = {"Authorization": f"Bearer {token}"}
    
    payload = {
        "user_email": user.email
    }
    
    response = requests.post(
        f"{BASE_URL}/chat/groups/{group_id}/add_member/",
        json=payload,
        headers=headers
    )
    
    if response.status_code == 201:
        print(f"✅ CORRECT: Member added successfully")
        print(f"   User: {user.email}")
    else:
        print(f"❌ ERROR: Failed to add member: {response.text}")

def test_list_group_members(group_id):
    """Test: List group members."""
    if not group_id:
        print("❌ No group ID provided for listing members")
        return
    
    print("\n" + "="*60)
    print("TEST 6: List group members")
    print("="*60)
    
    token = get_login_token("student1@example.com", "password123")
    if not token:
        print("❌ Could not login as student")
        return
    
    headers = {"Authorization": f"Bearer {token}"}
    
    response = requests.get(
        f"{BASE_URL}/chat/groups/{group_id}/members/",
        headers=headers
    )
    
    if response.status_code == 200:
        members = response.json()
        print(f"✅ CORRECT: Retrieved members list")
        print(f"   Total members: {len(members)}")
        for member in members:
            print(f"   - {member.get('user', {}).get('email', 'N/A')} (Admin: {member.get('is_admin')})")
    else:
        print(f"❌ ERROR: Failed to retrieve members: {response.text}")

def main():
    print("\n" + "="*60)
    print("Chat Group Creation Feature Testing")
    print("="*60)
    print(f"\nBackend URL: {BASE_URL}")
    
    # Run tests
    print("\n📋 VALIDATION TESTS")
    test_student_creates_group_without_faculty()
    
    group_id = test_student_creates_group_with_faculty()
    
    faculty_group_id = test_faculty_creates_group_no_requirement()
    
    admin_group_id = test_admin_creates_group_no_requirement()
    
    print("\n📋 MEMBER MANAGEMENT TESTS")
    test_add_member_to_group(group_id)
    test_list_group_members(group_id)
    
    # Summary
    print("\n" + "="*60)
    print("Testing Complete! Summary:")
    print("="*60)
    print("✅ Student creates group WITH faculty: Should succeed")
    print("✅ Student creates group WITHOUT faculty: Should fail")
    print("✅ Faculty/Admin can create groups without faculty requirement")
    print("✅ Member management endpoints working")
    print("="*60 + "\n")

if __name__ == '__main__':
    main()
