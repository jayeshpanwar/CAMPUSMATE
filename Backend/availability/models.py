from django.db import models
from django.conf import settings
from django.utils import timezone


class FacultyAvailability(models.Model):
    """Faculty availability status (on campus or on leave)"""
    faculty = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='availability',
        limit_choices_to={'role': 'faculty'}
    )
    
    # On-campus availability
    is_available_on_campus = models.BooleanField(default=True)
    on_campus_start_time = models.TimeField(blank=True, null=True, help_text="Daily start time for on-campus availability")
    on_campus_end_time = models.TimeField(blank=True, null=True, help_text="Daily end time for on-campus availability")
    on_campus_location = models.CharField(max_length=200, blank=True, null=True, help_text="Office location or room number")
    on_campus_notes = models.TextField(blank=True, help_text="Additional notes for on-campus availability")
    
    # Active leave status
    is_on_leave = models.BooleanField(default=False)
    
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='availability_updates',
        editable=False
    )
    
    class Meta:
        verbose_name_plural = "Faculty Availability"
        ordering = ['-updated_at']
    
    def __str__(self):
        return f"Availability for {self.faculty.email}"


class LeaveRequest(models.Model):
    """Faculty leave request"""
    LEAVE_TYPE_CHOICES = [
        ('medical', 'Medical Leave'),
        ('casual', 'Casual Leave'),
        ('earned', 'Earned Leave'),
        ('maternity', 'Maternity Leave'),
        ('sabbatical', 'Sabbatical'),
        ('conference', 'Conference Leave'),
        ('other', 'Other Leave'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('cancelled', 'Cancelled'),
    ]
    
    faculty = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='leave_requests',
        limit_choices_to={'role': 'faculty'}
    )
    
    # Leave dates
    leave_type = models.CharField(max_length=20, choices=LEAVE_TYPE_CHOICES)
    start_date = models.DateField()
    end_date = models.DateField()
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Details
    reason = models.TextField(blank=True)
    attachment = models.FileField(upload_to='leave_attachments/', blank=True, null=True)
    
    # Approval workflow
    requested_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='my_leave_requests',
        editable=False
    )
    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='approved_leave_requests'
    )
    approval_notes = models.TextField(blank=True)
    
    requested_at = models.DateTimeField(auto_now_add=True)
    approved_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-requested_at']
        indexes = [
            models.Index(fields=['faculty', '-start_date']),
            models.Index(fields=['status', '-requested_at']),
        ]
    
    def __str__(self):
        return f"{self.faculty.email} - {self.leave_type} ({self.start_date} to {self.end_date})"
    
    def save(self, *args, **kwargs):
        if not self.requested_by_id:
            # This should be set during creation
            pass
        super().save(*args, **kwargs)
