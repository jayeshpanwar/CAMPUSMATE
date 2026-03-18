from django.contrib import admin
from .models import Timetable, Lecture


@admin.register(Timetable)
class TimetableAdmin(admin.ModelAdmin):
    list_display = ('faculty', 'created_at', 'updated_at')
    list_filter = ('created_at', 'updated_at')
    search_fields = ('faculty__email',)
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Lecture)
class LectureAdmin(admin.ModelAdmin):
    list_display = ('course_name', 'day_of_week', 'start_time', 'end_time', 'lecture_type')
    list_filter = ('day_of_week', 'lecture_type', 'department', 'timetable__faculty')
    search_fields = ('course_name', 'course_code', 'room_number')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Schedule', {
            'fields': ('timetable', 'day_of_week', 'start_time', 'end_time')
        }),
        ('Course Info', {
            'fields': ('course_code', 'course_name', 'lecture_type')
        }),
        ('Location', {
            'fields': ('room_number', 'building', 'is_online', 'meeting_link')
        }),
        ('Class Info', {
            'fields': ('batch', 'department', 'semester', 'capacity')
        }),
        ('Notes', {
            'fields': ('notes',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
