from django.contrib import admin
from .models import StudentTask, TaskAssignment, TaskSubmission


@admin.register(StudentTask)
class StudentTaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_by', 'due_date', 'priority', 'target_audience')
    list_filter = ('priority', 'target_audience', 'department', 'due_date', 'created_at')
    search_fields = ('title', 'description', 'created_by__email', 'course_code')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Task Info', {
            'fields': ('title', 'description', 'created_by')
        }),
        ('Assignment', {
            'fields': ('target_audience', 'department', 'batch', 'semester', 'course_code')
        }),
        ('Details', {
            'fields': ('priority', 'is_graded', 'max_marks')
        }),
        ('Resources', {
            'fields': ('attachment', 'external_link')
        }),
        ('Dates', {
            'fields': ('due_date', 'created_at', 'updated_at')
        }),
    )


@admin.register(TaskAssignment)
class TaskAssignmentAdmin(admin.ModelAdmin):
    list_display = ('task', 'student', 'status', 'assigned_at')
    list_filter = ('status', 'assigned_at', 'task__created_by')
    search_fields = ('student__email', 'task__title')
    readonly_fields = ('assigned_at', 'updated_at')
    fieldsets = (
        ('Assignment', {
            'fields': ('task', 'student', 'status')
        }),
        ('Submission', {
            'fields': ('submission_date', 'marks_obtained', 'feedback')
        }),
        ('Dates', {
            'fields': ('assigned_at', 'updated_at')
        }),
    )


@admin.register(TaskSubmission)
class TaskSubmissionAdmin(admin.ModelAdmin):
    list_display = ('assignment', 'submitted_at', 'is_late')
    list_filter = ('is_late', 'submitted_at')
    search_fields = ('assignment__task__title', 'assignment__student__email')
    readonly_fields = ('submitted_at', 'updated_at')
    fieldsets = (
        ('Assignment', {
            'fields': ('assignment',)
        }),
        ('Content', {
            'fields': ('content', 'submission_file', 'submission_link')
        }),
        ('Status', {
            'fields': ('is_late',)
        }),
        ('Dates', {
            'fields': ('submitted_at', 'updated_at')
        }),
    )
