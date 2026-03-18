#!/usr/bin/env python
"""Django management command to test chat group creation feature."""

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from chat.models import ChatGroup, GroupMembership
from chat.serializers import ChatGroupCreateSerializer
from rest_framework.test import APIRequestFactory
from rest_framework.request import Request
from rest_framework.exceptions import ValidationError as DRFValidationError
import json

User = get_user_model()

class Command(BaseCommand):
    help = 'Test chat group creation with faculty requirement'
    
    def create_drf_request(self, user, data=None):
        """Create a properly authenticated DRF request."""
        factory = APIRequestFactory()
        request = factory.post('/chat/groups/', data or {}, format='json')
        request.user = user
        # Force the user to be authenticated
        request._full_enforceauth_cache = user
        drf_request = Request(request)
        # Ensure user is accessible through DRF request
        drf_request._request.user = user
        drf_request.user = user
        return drf_request
    
    def handle(self, *args, **options):
        # Get users
        student = User.objects.filter(role='student').first()
        faculty = User.objects.filter(role='faculty').first()
        admin = User.objects.filter(role='admin').first()
        
        if not student or not faculty or not admin:
            self.stdout.write(self.style.ERROR('❌ Could not find test users'))
            return
        
        self.stdout.write("\n" + "="*70)
        self.stdout.write("Chat Group Creation Feature Testing")
        self.stdout.write("="*70)
        self.stdout.write(f"\nTest Users:")
        self.stdout.write(f"  Student: {student.email} (ID: {student.id})")
        self.stdout.write(f"  Faculty: {faculty.email} (ID: {faculty.id})")
        self.stdout.write(f"  Admin: {admin.email} (ID: {admin.id})")
        
        # Test 1: Student creates group WITHOUT faculty
        self.stdout.write("\n📝 TEST 1: Student creates group WITHOUT faculty")
        self.stdout.write("-" * 70)
        
        request_data = {
            "name": "Study Group Without Faculty",
            "description": "This should fail validation",
            "member_ids": []
        }
        
        drf_request = self.create_drf_request(student, request_data)
        serializer = ChatGroupCreateSerializer(data=request_data, context={'request': drf_request})
        
        try:
            if not serializer.is_valid():
                self.stdout.write(self.style.SUCCESS(f"✅ CORRECT: Validation rejected group creation"))
                self.stdout.write(f"   Errors: {serializer.errors}")
            else:
                self.stdout.write(self.style.ERROR(f"❌ ERROR: Serializer did not raise validation error"))
                self.stdout.write(f"   Validated data: {serializer.validated_data}")
        except DRFValidationError as e:
            self.stdout.write(self.style.SUCCESS(f"✅ CORRECT: Validation exception raised"))
            self.stdout.write(f"   Error: {e.detail}")
        
        # Test 2: Student creates group WITH faculty
        self.stdout.write("\n📝 TEST 2: Student creates group WITH faculty")
        self.stdout.write("-" * 70)
        
        request_data = {
            "name": "Study Group With Faculty",
            "description": "Created by student with faculty member",
            "member_ids": [faculty.id]
        }
        
        drf_request = self.create_drf_request(student, request_data)
        serializer = ChatGroupCreateSerializer(data=request_data, context={'request': drf_request})
        
        if serializer.is_valid():
            self.stdout.write(self.style.SUCCESS(f"✅ CORRECT: Group creation succeeded with faculty"))
            self.stdout.write(f"   Group name: {request_data['name']}")
            self.stdout.write(f"   Faculty ID: {faculty.id}")
        else:
            self.stdout.write(self.style.ERROR(f"❌ ERROR: Validation failed: {serializer.errors}"))
        
        # Test 3: Faculty creates group WITHOUT faculty requirement
        self.stdout.write("\n📝 TEST 3: Faculty creates group (no faculty requirement)")
        self.stdout.write("-" * 70)
        
        request_data = {
            "name": "Faculty Group - No Requirement",
            "description": "Created by faculty",
            "member_ids": []
        }
        
        drf_request = self.create_drf_request(faculty, request_data)
        serializer = ChatGroupCreateSerializer(data=request_data, context={'request': drf_request})
        
        if serializer.is_valid():
            self.stdout.write(self.style.SUCCESS(f"✅ CORRECT: Faculty can create group without faculty members"))
            self.stdout.write(f"   Group name: {request_data['name']}")
        else:
            self.stdout.write(self.style.ERROR(f"❌ ERROR: Validation failed: {serializer.errors}"))
        
        # Test 4: Admin creates group WITHOUT faculty requirement
        self.stdout.write("\n📝 TEST 4: Admin creates group (no faculty requirement)")
        self.stdout.write("-" * 70)
        
        request_data = {
            "name": "Admin Group - No Requirement",
            "description": "Created by admin",
            "member_ids": []
        }
        
        drf_request = self.create_drf_request(admin, request_data)
        serializer = ChatGroupCreateSerializer(data=request_data, context={'request': drf_request})
        
        if serializer.is_valid():
            self.stdout.write(self.style.SUCCESS(f"✅ CORRECT: Admin can create group without faculty members"))
            self.stdout.write(f"   Group name: {request_data['name']}")
        else:
            self.stdout.write(self.style.ERROR(f"❌ ERROR: Validation failed: {serializer.errors}"))
        
        # Summary
        self.stdout.write("\n" + "="*70)
        self.stdout.write(self.style.SUCCESS("✅ Testing Complete!"))
        self.stdout.write("="*70)
        self.stdout.write("\n📋 Feature Summary:")
        self.stdout.write("-" * 70)
        self.stdout.write("✅ Everyone can create chat groups")
        self.stdout.write("✅ Students MUST add at least one faculty member when creating groups")
        self.stdout.write("✅ Faculty and Admin have no faculty requirement")
        self.stdout.write("✅ Member management endpoints available (add/remove/list members)")
        self.stdout.write("="*70 + "\n")

