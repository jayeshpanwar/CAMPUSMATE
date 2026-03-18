from django.db import models
from django.conf import settings


class StudentTask(models.Model):
    """Task assigned by faculty to students"""
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    
    STATUS_CHOICES = [
        ('not_started', 'Not Started'),
        ('in_progress', 'In Progress'),
        ('submitted', 'Submitted'),
        ('completed', 'Completed'),
        ('graded', 'Graded'),
    ]
    
    # Task info
    title = models.CharField(max_length=200)
    description = models.TextField()
    
    # Creator
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_tasks',
        limit_choices_to={'role': 'faculty'}
    )
    
    # Dates
    created_at = models.DateTimeField(auto_now_add=True)
    due_date = models.DateTimeField()
    updated_at = models.DateTimeField(auto_now=True)
    
    # Assignment scope
    department = models.CharField(max_length=100, blank=True, null=True)
    batch = models.CharField(max_length=50, blank=True, null=True)
    semester = models.IntegerField(blank=True, null=True)
    course_code = models.CharField(max_length=50, blank=True, null=True)
    target_audience = models.CharField(
        max_length=50,
        choices=[
            ('all_students', 'All Students'),
            ('department', 'Department'),
            ('batch', 'Batch'),
            ('course', 'Course'),
            ('specific', 'Specific Students'),
        ],
        default='all_students'
    )
    
    # Task properties
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    is_graded = models.BooleanField(default=False)
    max_marks = models.FloatField(blank=True, null=True)
    
    # Additional resources
    attachment = models.FileField(upload_to='task_attachments/', blank=True, null=True)
    external_link = models.URLField(blank=True, null=True)
    
    class Meta:
        ordering = ['-due_date', '-created_at']
        indexes = [
            models.Index(fields=['created_by', '-due_date']),
            models.Index(fields=['target_audience', '-due_date']),
        ]
    
    def __str__(self):
        return f"{self.title} - Due: {self.due_date}"


class TaskAssignment(models.Model):
    """Track task assignment to individual students"""
    task = models.ForeignKey(StudentTask, on_delete=models.CASCADE, related_name='assignments')
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='task_assignments',
        limit_choices_to={'role': 'student'}
    )
    
    # Status
    status = models.CharField(
        max_length=20,
        choices=[
            ('assigned', 'Assigned'),
            ('in_progress', 'In Progress'),
            ('submitted', 'Submitted'),
            ('graded', 'Graded'),
            ('late', 'Late'),
        ],
        default='assigned'
    )
    
    # Submission details
    submission_date = models.DateTimeField(blank=True, null=True)
    marks_obtained = models.FloatField(blank=True, null=True)
    feedback = models.TextField(blank=True)
    
    assigned_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('task', 'student')
        ordering = ['-assigned_at']
        indexes = [
            models.Index(fields=['student', '-assigned_at']),
            models.Index(fields=['status', '-assigned_at']),
        ]
    
    def __str__(self):
        return f"{self.student.email} - {self.task.title} ({self.status})"


class TaskSubmission(models.Model):
    """Student task submission"""
    assignment = models.OneToOneField(
        TaskAssignment,
        on_delete=models.CASCADE,
        related_name='submission'
    )
    
    # Submission content
    content = models.TextField(blank=True)
    submission_file = models.FileField(upload_to='task_submissions/', blank=True, null=True)
    submission_link = models.URLField(blank=True, null=True)
    
    # Timestamps
    submitted_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Late submission flag
    is_late = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-submitted_at']
        indexes = [
            models.Index(fields=['assignment', '-submitted_at']),
        ]
    
    def __str__(self):
        return f"Submission for {self.assignment.task.title} by {self.assignment.student.email}"
