"""Serializers for the users app."""

import secrets
from datetime import timedelta

from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone
from rest_framework import serializers

from .models import User, NoDuesSubject, NoDuesApplication


def _generate_unique_username(email):
    """Generate a unique username from the email local part by appending
    a numeric suffix if needed to avoid username collisions."""
    base = email.split('@')[0]
    username = base
    suffix = 1
    while User.objects.filter(username=username).exists():
        username = f"{base}{suffix}"
        suffix += 1
    return username

# ✅ ADD THIS CLASS
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # These are the fields that will be returned when fetching user data.
        # We exclude the password for security.
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'department']


class StudentVerificationInitiateSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        try:
            user = User.objects.get(email=value)
        except User.DoesNotExist as exc:
            raise serializers.ValidationError("Account not found for the provided email.") from exc

        if user.role != 'student':
            raise serializers.ValidationError("Only student accounts can be verified here.")

        if user.is_verified:
            raise serializers.ValidationError("Account is already verified. Try logging in.")

        self.context['user'] = user
        return value

    def create(self, validated_data):
        user = self.context['user']
        code = f"{secrets.randbelow(10**6):06d}"
        user.verification_code = code
        user.verification_code_expires_at = timezone.now() + timedelta(minutes=10)
        user.save(update_fields=['verification_code', 'verification_code_expires_at'])

        subject = "CampusMate Student Verification"
        message = (
            "Use the following one-time password to verify your CampusMate account: "
            f"{code}. This code expires in 10 minutes."
        )

        send_mail(
            subject=subject,
            message=message,
            from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', None),
            recipient_list=[user.email],
            fail_silently=True,
        )

        return validated_data


class StudentVerificationConfirmSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)
    password = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True, min_length=8)

    def validate(self, attrs):
        email = attrs.get('email')
        otp = attrs.get('otp')

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist as exc:
            raise serializers.ValidationError({"email": "Account not found for the provided email."}) from exc

        if user.role != 'student':
            raise serializers.ValidationError({"email": "Only student accounts can be verified here."})

        if user.is_verified:
            raise serializers.ValidationError({"email": "Account is already verified."})

        if not user.verification_code or not user.verification_code_expires_at:
            raise serializers.ValidationError({"otp": "No active verification request found. Please request a new code."})

        if user.verification_code != otp:
            raise serializers.ValidationError({"otp": "Invalid verification code."})

        if timezone.now() > user.verification_code_expires_at:
            raise serializers.ValidationError({"otp": "Verification code has expired."})

        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Passwords do not match."})

        self.context['user'] = user
        return attrs

    def create(self, validated_data):
        user = self.context['user']
        password = validated_data['password']
        user.set_password(password)
        user.mark_verified()
        user.save(update_fields=['password', 'is_verified', 'verification_code', 'verification_code_expires_at', 'is_active'])
        return validated_data

# --- Your existing serializers below ---

# A base serializer for handling password confirmation
class PasswordConfirmationSerializer(serializers.ModelSerializer):
    # ... (rest of this class is unchanged)
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return data

# --- Role-Specific Registration Serializers ---

class StudentRegisterSerializer(PasswordConfirmationSerializer):
    # ... (this class is unchanged)
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'password', 'password2']
    
    def create(self, validated_data):
        validated_data.pop('password2')
        username = _generate_unique_username(validated_data['email'])
        user = User.objects.create_user(
            username=username,
            role='student',
            **validated_data
        )
        return user


class FacultyRegisterSerializer(PasswordConfirmationSerializer):
    # ... (this class is unchanged)
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'department', 'password', 'password2']
        
    def create(self, validated_data):
        validated_data.pop('password2')
        username = _generate_unique_username(validated_data['email'])
        user = User.objects.create_user(
            username=username,
            role='faculty',
            **validated_data
        )
        return user


class AdminRegisterSerializer(PasswordConfirmationSerializer):
    # ... (this class is unchanged)
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'password', 'password2']

    def create(self, validated_data):
        validated_data.pop('password2')
        username = _generate_unique_username(validated_data['email'])
        user = User.objects.create_user(
            username=username,
            role='admin',
            is_staff=True,
            **validated_data
        )
        return user


class NoDuesSubjectSerializer(serializers.ModelSerializer):
    faculty_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = NoDuesSubject
        fields = [
            'id',
            'subject_name',
            'department',
            'class_year',
            'semester',
            'description',
            'is_active',
            'created_at',
            'updated_at',
            'faculty',
            'faculty_name',
        ]
        read_only_fields = ['faculty', 'created_at', 'updated_at']

    def get_faculty_name(self, obj):
        full_name = obj.faculty.get_full_name()
        return full_name if full_name else obj.faculty.email


class NoDuesApplicationSerializer(serializers.ModelSerializer):
    subject = NoDuesSubjectSerializer(read_only=True)
    subject_id = serializers.PrimaryKeyRelatedField(
        queryset=NoDuesSubject.objects.filter(is_active=True),
        source='subject',
        write_only=True,
    )
    student_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = NoDuesApplication
        fields = [
            'id',
            'subject',
            'subject_id',
            'student',
            'student_name',
            'status',
            'remark',
            'applied_at',
            'reviewed_at',
            'reviewed_by',
        ]
        read_only_fields = ['student', 'applied_at', 'reviewed_at', 'reviewed_by']

    def get_student_name(self, obj):
        full_name = obj.student.get_full_name()
        return full_name if full_name else obj.student.email