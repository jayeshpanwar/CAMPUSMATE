from rest_framework import serializers
from .models import Timetable, Lecture
from users.models import User


class UserBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name']


class LectureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lecture
        fields = [
            'id', 'day_of_week', 'start_time', 'end_time',
            'course_code', 'course_name', 'lecture_type',
            'room_number', 'building', 'is_online', 'meeting_link',
            'batch', 'department', 'semester', 'capacity', 'notes',
            'created_at', 'updated_at'
        ]


class TimetableDetailSerializer(serializers.ModelSerializer):
    faculty = UserBasicSerializer(read_only=True)
    lectures = LectureSerializer(many=True, read_only=True)
    
    class Meta:
        model = Timetable
        fields = ['id', 'faculty', 'lectures', 'created_at', 'updated_at']


class TimetableListSerializer(serializers.ModelSerializer):
    faculty = UserBasicSerializer(read_only=True)
    lecture_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Timetable
        fields = ['id', 'faculty', 'lecture_count', 'created_at', 'updated_at']
    
    def get_lecture_count(self, obj):
        return obj.lectures.count()


class LectureCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lecture
        fields = [
            'day_of_week', 'start_time', 'end_time',
            'course_code', 'course_name', 'lecture_type',
            'room_number', 'building', 'is_online', 'meeting_link',
            'batch', 'department', 'semester', 'capacity', 'notes'
        ]
