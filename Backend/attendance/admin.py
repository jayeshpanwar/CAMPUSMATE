from django.contrib import admin
from .models import Course, CourseEnrollment, AttendanceSession, AttendanceRecord, FaceProfile, AttendanceLog

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('code', 'title', 'faculty', 'branch', 'semester', 'start_date', 'end_date', 'created_at')
    search_fields = ('code', 'title', 'faculty__email')
    list_filter = ('branch', 'semester', 'created_at')

@admin.register(CourseEnrollment)
class CourseEnrollmentAdmin(admin.ModelAdmin):
    list_display = ('student', 'course', 'enrolled_at')
    search_fields = ('student__email', 'course__code')
    list_filter = ('enrolled_at',)

@admin.register(AttendanceSession)
class AttendanceSessionAdmin(admin.ModelAdmin):
    list_display = ('course', 'title', 'faculty', 'date', 'start_time', 'end_time', 'is_processed')
    search_fields = ('course__code', 'faculty__email', 'title')
    list_filter = ('date', 'is_processed', 'course__branch')

@admin.register(AttendanceRecord)
class AttendanceRecordAdmin(admin.ModelAdmin):
    list_display = ('student', 'session', 'status', 'detection_source', 'confidence_score')
    search_fields = ('student__email', 'session__course__code')
    list_filter = ('status', 'detection_source', 'created_at')

@admin.register(FaceProfile)
class FaceProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'created_at', 'updated_at')
    search_fields = ('user__email',)
    list_filter = ('created_at',)

@admin.register(AttendanceLog)
class AttendanceLogAdmin(admin.ModelAdmin):
    list_display = ('record', 'action', 'performed_by', 'timestamp')
    search_fields = ('record__student__email', 'action')
    list_filter = ('timestamp', 'action')
