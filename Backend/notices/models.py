from django.db import models
from django.conf import settings # To link to your custom User model if needed

class Notice(models.Model):
    ROLE_CHOICES = (
        ('all', 'All'),
        ('student', 'Students Only'),
        ('faculty', 'Faculty Only'),
        # Add more specific roles if needed
    )

    title = models.CharField(max_length=200)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='created_notices')

    # Optional: Target audience for the notice
    target_audience = models.CharField(max_length=20, choices=ROLE_CHOICES, default='all')

    end_time = models.DateTimeField(null=True, blank=True)
    remind_before_minutes = models.PositiveIntegerField(default=30)
    reminder_sent = models.BooleanField(default=False)
    target_group = models.ForeignKey('chat.ChatGroup', on_delete=models.SET_NULL, null=True, blank=True, related_name='notices')

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at'] # Show newest notices first