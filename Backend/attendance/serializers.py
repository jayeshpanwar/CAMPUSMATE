from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import (
    Course, CourseEnrollment, AttendanceSession, 
    AttendanceRecord, FaceProfile, AttendanceLog
)

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='get_full_name', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'full_name']


class CourseSerializer(serializers.ModelSerializer):
    faculty_name = serializers.CharField(source='faculty.get_full_name', read_only=True)
    sessions_count = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = ['id', 'title', 'code', 'faculty', 'faculty_name', 'description', 
                  'branch', 'semester', 'start_date', 'end_date', 'sessions_count', 'created_at', 'updated_at']
        read_only_fields = ['faculty', 'faculty_name', 'sessions_count', 'created_at', 'updated_at']
    
    def get_sessions_count(self, obj):
        return obj.attendance_sessions.count()


class CourseEnrollmentSerializer(serializers.ModelSerializer):
    student = UserSerializer(read_only=True)
    student_id = serializers.IntegerField(write_only=True, required=False)
    course_code = serializers.CharField(source='course.code', read_only=True)

    class Meta:
        model = CourseEnrollment
        fields = ['id', 'course', 'student', 'student_id', 'course_code', 'enrolled_at']


class AttendanceSessionSerializer(serializers.ModelSerializer):
    course_code = serializers.CharField(source='course.code', read_only=True)
    course_title = serializers.CharField(source='course.title', read_only=True)
    course_branch = serializers.CharField(source='course.branch', read_only=True)
    faculty_name = serializers.CharField(source='faculty.get_full_name', read_only=True)
    attendance_count = serializers.SerializerMethodField()

    class Meta:
        model = AttendanceSession
        fields = ['id', 'course', 'course_code', 'course_title', 'course_branch', 'faculty', 'faculty_name', 
                  'title', 'date', 'start_time', 'end_time', 'is_processed', 'attendance_count', 'created_at', 'updated_at']
        read_only_fields = ['faculty', 'faculty_name', 'attendance_count', 'is_processed', 'created_at', 'updated_at']
    
    def get_attendance_count(self, obj):
        return obj.records.count()


class AttendanceRecordSerializer(serializers.ModelSerializer):
    student_email = serializers.CharField(source='student.email', read_only=True)
    student_name = serializers.CharField(source='student.get_full_name', read_only=True)
    course_code = serializers.CharField(source='session.course.code', read_only=True)
    session_date = serializers.DateField(source='session.date', read_only=True)

    class Meta:
        model = AttendanceRecord
        fields = [
            'id', 'session', 'student', 'student_email', 'student_name',
            'status', 'detection_source', 'confidence_score', 'course_code',
            'session_date', 'created_at', 'updated_at'
        ]


class AttendanceLogSerializer(serializers.ModelSerializer):
    performed_by_name = serializers.CharField(source='performed_by.get_full_name', read_only=True)

    class Meta:
        model = AttendanceLog
        fields = ['id', 'record', 'action', 'performed_by', 'performed_by_name', 'timestamp', 'details']


class FaceProfileSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = FaceProfile
        fields = ['id', 'user', 'user_email', 'profile_photo', 'created_at', 'updated_at']
        read_only_fields = ['face_encoding']
