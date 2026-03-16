# users/models.py

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _

# We can remove the custom manager if we don't need complex creation logic
# for this specific setup. AbstractUser will suffice.

class User(AbstractUser):
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('faculty', 'Faculty'),
        ('admin', 'Admin'),
    )
    
    # Make email the login field and ensure it's unique
    email = models.EmailField(_('email address'), unique=True)
    
    # The default username field is no longer needed for login, but Django's
    # AbstractUser requires it. We can leave it but rely on email.
    
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='student')
    
    # Department is optional, as it only applies to faculty
    department = models.CharField(max_length=100, blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    verification_code = models.CharField(max_length=6, blank=True, null=True)
    verification_code_expires_at = models.DateTimeField(blank=True, null=True)

    # Tell Django to use the 'email' field as the unique identifier
    USERNAME_FIELD = 'email'
    
    # 'username' is still required by AbstractUser, so we list it here.
    # When creating a user via createsuperuser, it will be prompted for.
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    def __str__(self):
        return self.email

    def mark_verified(self):
        self.is_verified = True
        self.verification_code = None
        self.verification_code_expires_at = None
        self.is_active = True


class DepartmentConfig(models.Model):
    """
    Configuration for department subjects by branch and semester.
    Used for tracking no-dues requirements per subject.
    """
    branch = models.CharField(max_length=100)
    semester = models.IntegerField()
    subject_name = models.CharField(max_length=255)
    
    class Meta:
        unique_together = ('branch', 'semester', 'subject_name')
    
    def __str__(self):
        return f"{self.branch} - Sem {self.semester} - {self.subject_name}"


class NoDuesSubject(models.Model):
    """Faculty-created no-dues subjects visible to filtered student groups."""

    faculty = models.ForeignKey(User, on_delete=models.CASCADE, related_name='no_dues_subjects')
    subject_name = models.CharField(max_length=255)
    department = models.CharField(max_length=100)
    class_year = models.CharField(max_length=20, blank=True, null=True)
    semester = models.IntegerField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.subject_name} ({self.department})"


class NoDuesApplication(models.Model):
    """Student application against a faculty-created no-dues subject."""

    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
    )

    subject = models.ForeignKey(NoDuesSubject, on_delete=models.CASCADE, related_name='applications')
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='no_dues_applications')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING')
    remark = models.TextField(blank=True, null=True)
    applied_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(blank=True, null=True)
    reviewed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='reviewed_no_dues_applications')

    class Meta:
        unique_together = ('subject', 'student')
        ordering = ['-applied_at']

    def __str__(self):
        return f"{self.student.email} -> {self.subject.subject_name} ({self.status})"