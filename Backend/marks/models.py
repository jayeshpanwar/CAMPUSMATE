# marks/models.py
from django.db import models
from django.conf import settings


MIDSEM_MAX_MARKS = 20.0


class MidSemMarksEntry(models.Model):
    """
    Stores a single subject's mid-semester mark for a student.
    Faculty enters marks; students can only read their own records.
    """
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='midsem_marks',
        limit_choices_to={'role': 'student'},
    )
    entered_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='entered_marks',
        limit_choices_to={'role__in': ['faculty', 'admin']},
    )
    subject = models.CharField(max_length=150)
    marks = models.FloatField()
    max_marks = models.FloatField(default=MIDSEM_MAX_MARKS)
    semester = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        # One entry per student-subject-semester combination
        unique_together = ('student', 'subject', 'semester')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.student.email} | {self.subject} | {self.semester}: {self.marks}/{self.max_marks}"


class StudyPlan(models.Model):
    """
    Stores the AI-generated 6-week study plan for a student.
    midsem_marks, analysis, and study_plan are stored as JSON blobs.
    """
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('completed', 'Completed'),
    ]

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='study_plans',
    )
    semester = models.CharField(max_length=20)
    target_final = models.FloatField(default=80.0)

    # Raw marks dict out of 20: {"Math": 9, "Physics": 14.5, ...}
    midsem_marks = models.JSONField()

    # Analysis output: avg_score, weak_subjects, improvement_needed, etc.
    analysis = models.JSONField(null=True, blank=True)

    # AI-generated plan: {weeks: [{week, daily_tasks, resources}]}
    study_plan = models.JSONField(null=True, blank=True)

    # Per-task completion state: {"w1_d1_t0": true, ...}
    task_progress = models.JSONField(default=dict)

    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.student.email} | {self.semester} | {self.status}"
