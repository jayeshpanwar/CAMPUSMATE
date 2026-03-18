from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
import logging

User = get_user_model()
logger = logging.getLogger(__name__)


class Course(models.Model):
    BRANCH_CHOICES = [
        ('CSE', 'Computer Science & Engineering'),
        ('ECE', 'Electronics & Communication Engineering'),
        ('MECH', 'Mechanical Engineering'),
        ('CIVIL', 'Civil Engineering'),
        ('EEE', 'Electrical & Electronics Engineering'),
        ('IT', 'Information Technology'),
        ('BT', 'Biotechnology'),
    ]
    
    title = models.CharField(max_length=200)
    code = models.CharField(max_length=50, unique=True)
    faculty = models.ForeignKey(User, on_delete=models.CASCADE, related_name='courses_teaching')
    description = models.TextField(blank=True)
    branch = models.CharField(max_length=50, choices=BRANCH_CHOICES, null=True, blank=True)
    semester = models.IntegerField(default=1, null=True, blank=True)
    start_date = models.DateField(null=True, blank=True, help_text="Course start date for calendar selection")
    end_date = models.DateField(null=True, blank=True, help_text="Course end date for calendar selection")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.code} - {self.title} ({self.branch})"


class CourseEnrollment(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='enrollments')
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='course_enrollments')
    enrolled_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('course', 'student')

    def __str__(self):
        return f"{self.student.get_full_name()} - {self.course.code}"


class AttendanceSession(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='attendance_sessions')
    faculty = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200, null=True, blank=True, help_text="Session title (e.g., Lecture 1, Lab Session 1)")
    date = models.DateField()
    start_time = models.TimeField(null=True, blank=True, help_text="Session start time")
    end_time = models.TimeField(null=True, blank=True)
    is_processed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date']
        unique_together = ('course', 'date', 'start_time')

    def __str__(self):
        return f"{self.course.code} - {self.title} ({self.date})"


class AttendanceRecord(models.Model):
    STATUS_CHOICES = [
        ('present', 'Present'),
        ('absent', 'Absent'),
        ('late', 'Late'),
        ('excused', 'Excused'),
    ]

    DETECTION_SOURCE_CHOICES = [
        ('manual_entry', 'Manual Entry'),
        ('facial_recognition', 'Facial Recognition'),
    ]

    session = models.ForeignKey(AttendanceSession, on_delete=models.CASCADE, related_name='records')
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    detection_source = models.CharField(max_length=20, choices=DETECTION_SOURCE_CHOICES)
    confidence_score = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('session', 'student')

    def __str__(self):
        return f"{self.student.email} - {self.session.date} ({self.status})"


class FaceProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='face_profile')
    face_encoding = models.BinaryField(null=True, blank=True)
    profile_photo = models.ImageField(upload_to='face_profiles/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Face Profile: {self.user.email}"


class AttendanceLog(models.Model):
    record = models.ForeignKey(AttendanceRecord, on_delete=models.CASCADE, related_name='logs')
    action = models.CharField(max_length=100)
    performed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    details = models.TextField(blank=True)

    def __str__(self):
        return f"{self.action} - {self.timestamp}"
