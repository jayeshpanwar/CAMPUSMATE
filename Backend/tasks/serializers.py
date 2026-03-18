from rest_framework import serializers
from .models import StudentTask, TaskAssignment, TaskSubmission
from users.models import User


class UserBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name']


class StudentTaskListSerializer(serializers.ModelSerializer):
    created_by = UserBasicSerializer(read_only=True)
    assignment_count = serializers.SerializerMethodField()
    
    class Meta:
        model = StudentTask
        fields = [
            'id', 'title', 'description', 'created_by', 'due_date',
            'priority', 'target_audience', 'course_code',
            'assignment_count', 'created_at', 'updated_at'
        ]
    
    def get_assignment_count(self, obj):
        return obj.assignments.count()


class StudentTaskDetailSerializer(serializers.ModelSerializer):
    created_by = UserBasicSerializer(read_only=True)
    assignments = serializers.SerializerMethodField()
    
    class Meta:
        model = StudentTask
        fields = [
            'id', 'title', 'description', 'created_by', 'due_date',
            'priority', 'target_audience', 'department', 'batch',
            'semester', 'course_code', 'is_graded', 'max_marks',
            'attachment', 'external_link', 'assignments', 'created_at'
        ]
    
    def get_assignments(self, obj):
        querySet = obj.assignments.all()
        return TaskAssignmentSerializer(querySet, many=True).data


class StudentTaskCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentTask
        fields = [
            'title', 'description', 'due_date',
            'priority', 'target_audience', 'department', 'batch',
            'semester', 'course_code', 'is_graded', 'max_marks',
            'attachment', 'external_link'
        ]


class TaskAssignmentSerializer(serializers.ModelSerializer):
    student = UserBasicSerializer(read_only=True)
    task = StudentTaskListSerializer(read_only=True)
    submission = serializers.SerializerMethodField()
    
    class Meta:
        model = TaskAssignment
        fields = [
            'id', 'student', 'task', 'status',
            'submission_date', 'marks_obtained', 'feedback',
            'submission', 'assigned_at', 'updated_at'
        ]
    
    def get_submission(self, obj):
        if hasattr(obj, 'submission'):
            return TaskSubmissionSerializer(obj.submission).data
        return None


class TaskSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskSubmission
        fields = [
            'id', 'content', 'submission_file', 'submission_link',
            'submitted_at', 'is_late', 'updated_at'
        ]


class TaskSubmissionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskSubmission
        fields = ['content', 'submission_file', 'submission_link']
