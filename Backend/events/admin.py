from django.contrib import admin
from .models import Event, Hackathon, EventCategory, EventFetch


@admin.register(EventCategory)
class EventCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'description']
    search_fields = ['name']


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ['title', 'event_type', 'status', 'start_date', 'is_featured']
    list_filter = ['status', 'event_type', 'is_featured', 'start_date']
    search_fields = ['title', 'description', 'location']
    fieldsets = (
        ('Basic Info', {
            'fields': ('title', 'description', 'category', 'event_type')
        }),
        ('Dates & Location', {
            'fields': ('start_date', 'end_date', 'location')
        }),
        ('Status & Featured', {
            'fields': ('status', 'is_featured')
        }),
        ('Media & Links', {
            'fields': ('image_url', 'registration_link')
        }),
        ('Registration', {
            'fields': ('capacity', 'current_registrations')
        }),
        ('Metadata', {
            'fields': ('organizer', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Hackathon)
class HackathonAdmin(admin.ModelAdmin):
    list_display = ['title', 'difficulty', 'status', 'start_date', 'team_count']
    list_filter = ['status', 'difficulty', 'is_featured', 'start_date']
    search_fields = ['title', 'description', 'location']
    fieldsets = (
        ('Basic Info', {
            'fields': ('title', 'description', 'difficulty')
        }),
        ('Dates & Location', {
            'fields': ('start_date', 'end_date', 'location')
        }),
        ('Status & Featured', {
            'fields': ('status', 'is_featured')
        }),
        ('Teams & Participants', {
            'fields': ('max_team_size', 'min_team_size', 'team_count', 'participant_count')
        }),
        ('Prizes & Links', {
            'fields': ('prizes', 'registration_link')
        }),
        ('Media', {
            'fields': ('image_url',)
        }),
        ('Metadata', {
            'fields': ('organizer', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    readonly_fields = ['created_at', 'updated_at']


@admin.register(EventFetch)
class EventFetchAdmin(admin.ModelAdmin):
    list_display = ['fetch_type', 'status', 'total_fetched', 'new_created', 'timestamp']
    list_filter = ['status', 'fetch_type', 'timestamp']
    search_fields = ['error_message']
    readonly_fields = ['fetch_type', 'status', 'total_fetched', 'new_created', 'updated', 'error_message', 'timestamp']
    
    def has_add_permission(self, request):
        return False
    
    def has_change_permission(self, request, obj=None):
        return False
    
    def has_delete_permission(self, request, obj=None):
        return False
