from django.db import models
from django.utils import timezone


class EventCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    
    class Meta:
        verbose_name_plural = "Event Categories"
    
    def __str__(self):
        return self.name


class Event(models.Model):
    STATUS_CHOICES = [
        ('upcoming', 'Upcoming'),
        ('ongoing', 'Ongoing'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.ForeignKey(EventCategory, on_delete=models.SET_NULL, null=True, blank=True)
    event_type = models.CharField(max_length=50)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    location = models.CharField(max_length=300)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='upcoming')
    is_featured = models.BooleanField(default=False)
    image_url = models.URLField(blank=True, null=True)
    organizer = models.CharField(max_length=200, blank=True)
    registration_link = models.URLField(blank=True, null=True)
    capacity = models.IntegerField(null=True, blank=True)
    current_registrations = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-start_date']
        indexes = [
            models.Index(fields=['status', '-start_date']),
            models.Index(fields=['is_featured', '-start_date']),
        ]
    
    def __str__(self):
        return f"{self.title} - {self.start_date.date()}"


class Hackathon(models.Model):
    DIFFICULTY_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ]
    
    STATUS_CHOICES = [
        ('upcoming', 'Upcoming'),
        ('ongoing', 'Ongoing'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    location = models.CharField(max_length=300)
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='upcoming')
    is_featured = models.BooleanField(default=False)
    image_url = models.URLField(blank=True, null=True)
    organizer = models.CharField(max_length=200, blank=True)
    registration_link = models.URLField(blank=True, null=True)
    prizes = models.JSONField(default=list, blank=True)  # [{"place": 1, "amount": 10000}, ...]
    max_team_size = models.IntegerField(default=5)
    min_team_size = models.IntegerField(default=1)
    team_count = models.IntegerField(default=0)
    participant_count = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-start_date']
        indexes = [
            models.Index(fields=['status', '-start_date']),
            models.Index(fields=['difficulty', '-start_date']),
        ]
    
    def __str__(self):
        return f"{self.title} - {self.start_date.date()}"


class EventFetch(models.Model):
    STATUS_CHOICES = [
        ('success', 'Success'),
        ('error', 'Error'),
        ('partial', 'Partial Success'),
    ]
    
    fetch_type = models.CharField(max_length=50)  # 'events', 'hackathons'
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    total_fetched = models.IntegerField(default=0)
    new_created = models.IntegerField(default=0)
    updated = models.IntegerField(default=0)
    error_message = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-timestamp']
    
    def __str__(self):
        return f"{self.fetch_type} - {self.status} - {self.timestamp}"
