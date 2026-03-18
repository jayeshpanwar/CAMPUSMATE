from rest_framework import serializers
from .models import FacultyAvailability, LeaveRequest
from users.models import User


class UserBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name']


class FacultyAvailabilitySerializer(serializers.ModelSerializer):
    faculty = UserBasicSerializer(read_only=True)
    
    class Meta:
        model = FacultyAvailability
        fields = [
            'id', 'faculty',
            'is_available_on_campus', 'on_campus_start_time', 'on_campus_end_time',
            'on_campus_location', 'on_campus_notes',
            'is_on_leave', 'updated_at'
        ]


class LeaveRequestListSerializer(serializers.ModelSerializer):
    faculty = UserBasicSerializer(read_only=True)
    approved_by = UserBasicSerializer(read_only=True)
    
    class Meta:
        model = LeaveRequest
        fields = [
            'id', 'faculty', 'leave_type', 'start_date', 'end_date',
            'status', 'reason', 'requested_at', 'approved_by', 'updated_at'
        ]


class LeaveRequestDetailSerializer(serializers.ModelSerializer):
    faculty = UserBasicSerializer(read_only=True)
    approved_by = UserBasicSerializer(read_only=True)
    
    class Meta:
        model = LeaveRequest
        fields = [
            'id', 'faculty', 'leave_type', 'start_date', 'end_date',
            'status', 'reason', 'attachment', 'requested_at', 'approved_by',
            'approval_notes', 'approved_at', 'updated_at'
        ]


class LeaveRequestCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaveRequest
        fields = ['leave_type', 'start_date', 'end_date', 'reason', 'attachment']


class LeaveRequestApproveSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=['approved', 'rejected'])
    approval_notes = serializers.CharField(required=False, allow_blank=True)
