from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator


class Timetable(models.Model):
    """Faculty timetable/schedule"""
    faculty = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='timetable',
        limit_choices_to={'role': 'faculty'}
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-updated_at']
    
    def __str__(self):
        return f"Timetable for {self.faculty.email}"


class Lecture(models.Model):
    """Individual lecture/class session in the timetable"""
    DAY_CHOICES = [
        ('monday', 'Monday'),
        ('tuesday', 'Tuesday'),
        ('wednesday', 'Wednesday'),
        ('thursday', 'Thursday'),
        ('friday', 'Friday'),
        ('saturday', 'Saturday'),
        ('sunday', 'Sunday'),
    ]
    
    LECTURE_TYPE_CHOICES = [
        ('theory', 'Theory'),
        ('practical', 'Practical'),
        ('lab', 'Lab'),
        ('tutorial', 'Tutorial'),
        ('seminar', 'Seminar'),
        ('invigilation', 'Invigilation'),
        ('mentorship', 'Mentorship'),
        ('office_hours', 'Office Hours'),
        ('other', 'Other'),
    ]
    
    timetable = models.ForeignKey(Timetable, on_delete=models.CASCADE, related_name='lectures')
    
    # Schedule info
    day_of_week = models.CharField(max_length=10, choices=DAY_CHOICES)
    start_time = models.TimeField()
    end_time = models.TimeField()
    
    # Course/Class info
    course_code = models.CharField(max_length=50, blank=True)
    course_name = models.CharField(max_length=200)
    lecture_type = models.CharField(max_length=20, choices=LECTURE_TYPE_CHOICES, default='theory')
    
    # Location
    room_number = models.CharField(max_length=50, blank=True, null=True)
    building = models.CharField(max_length=100, blank=True, null=True)
    is_online = models.BooleanField(default=False)
    meeting_link = models.URLField(blank=True, null=True)
    
    # Batch/Class info
    batch = models.CharField(max_length=50, blank=True, null=True, help_text="e.g., 2023-B1")
    department = models.CharField(max_length=100, blank=True, null=True)
    semester = models.IntegerField(blank=True, null=True, validators=[MinValueValidator(1), MaxValueValidator(8)])
    
    # Capacity
    capacity = models.IntegerField(blank=True, null=True)
    
    # Additional notes
    notes = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['day_of_week', 'start_time']
        unique_together = ('timetable', 'day_of_week', 'start_time', 'end_time', 'course_code')
    
    def __str__(self):
        return f"{self.course_name} - {self.day_of_week} {self.start_time}"
