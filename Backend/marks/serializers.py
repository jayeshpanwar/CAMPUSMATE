# marks/serializers.py
from rest_framework import serializers
from .models import StudyPlan, MidSemMarksEntry


MIDSEM_MAX_MARKS = 20.0


class MidSemMarksEntrySerializer(serializers.ModelSerializer):
    student_email = serializers.EmailField(source='student.email', read_only=True)
    entered_by_email = serializers.EmailField(source='entered_by.email', read_only=True)

    class Meta:
        model = MidSemMarksEntry
        fields = [
            'id', 'student', 'student_email',
            'entered_by', 'entered_by_email',
            'subject', 'marks', 'max_marks', 'semester',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'entered_by', 'created_at', 'updated_at']


class StudyPlanSerializer(serializers.ModelSerializer):
    student_email = serializers.EmailField(source='student.email', read_only=True)
    student_name = serializers.SerializerMethodField()

    class Meta:
        model = StudyPlan
        fields = [
            'id', 'student', 'student_email', 'student_name',
            'semester', 'target_final', 'midsem_marks',
            'analysis', 'study_plan', 'task_progress',
            'status', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'student', 'analysis', 'study_plan', 'created_at', 'updated_at']

    def get_student_name(self, obj):
        return f"{obj.student.first_name} {obj.student.last_name}".strip()


class AnalyzeMarksInputSerializer(serializers.Serializer):
    """Validates the /analyze-midsem-marks request body."""
    marks = serializers.DictField(
        child=serializers.FloatField(min_value=0, max_value=MIDSEM_MAX_MARKS),
        allow_empty=False,
    )
    semester = serializers.CharField(max_length=20)
    target_final = serializers.FloatField(min_value=0, max_value=100, default=80.0)

    def validate_marks(self, value):
        if len(value) == 0:
            raise serializers.ValidationError("Marks dictionary cannot be empty.")
        return value


class GenerateStudyPlanInputSerializer(serializers.Serializer):
    """Validates the /generate-study-plan request body."""
    study_plan_id = serializers.IntegerField(required=False)
    marks = serializers.DictField(
        child=serializers.FloatField(min_value=0, max_value=MIDSEM_MAX_MARKS),
        allow_empty=False,
        required=False,
    )
    semester = serializers.CharField(max_length=20, required=False)
    target_final = serializers.FloatField(min_value=0, max_value=100, default=80.0, required=False)


class TaskProgressUpdateSerializer(serializers.Serializer):
    """Validates a task progress update payload."""
    task_key = serializers.CharField(max_length=50)  # e.g. "w1_d2_t0"
    completed = serializers.BooleanField()
