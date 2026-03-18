from django.contrib import admin
from .models import FacultyAvailability, LeaveRequest


@admin.register(FacultyAvailability)
class FacultyAvailabilityAdmin(admin.ModelAdmin):
    list_display = ('faculty', 'is_available_on_campus', 'is_on_leave', 'updated_at')
    list_filter = ('is_available_on_campus', 'is_on_leave', 'updated_at')
    search_fields = ('faculty__email',)
    readonly_fields = ('updated_at', 'updated_by')
    fieldsets = (
        ('Faculty', {
            'fields': ('faculty',)
        }),
        ('On-Campus Availability', {
            'fields': ('is_available_on_campus', 'on_campus_start_time', 'on_campus_end_time', 'on_campus_location', 'on_campus_notes')
        }),
        ('Leave Status', {
            'fields': ('is_on_leave',)
        }),
        ('Update Info', {
            'fields': ('updated_at', 'updated_by'),
            'classes': ('collapse',)
        }),
    )


@admin.register(LeaveRequest)
class LeaveRequestAdmin(admin.ModelAdmin):
    list_display = ('faculty', 'leave_type', 'start_date', 'end_date', 'status', 'requested_at')
    list_filter = ('status', 'leave_type', 'start_date', 'requested_at')
    search_fields = ('faculty__email', 'reason')
    readonly_fields = ('requested_at', 'approved_at', 'requested_by')
    fieldsets = (
        ('Faculty', {
            'fields': ('faculty', 'requested_by')
        }),
        ('Leave Details', {
            'fields': ('leave_type', 'start_date', 'end_date', 'reason', 'attachment')
        }),
        ('Approval', {
            'fields': ('status', 'approved_by', 'approval_notes')
        }),
        ('Timestamps', {
            'fields': ('requested_at', 'approved_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
