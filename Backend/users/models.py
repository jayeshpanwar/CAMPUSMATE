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