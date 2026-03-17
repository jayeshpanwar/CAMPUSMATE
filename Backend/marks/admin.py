from django.contrib import admin
from .models import StudyPlan, MidSemMarksEntry

@admin.register(StudyPlan)
class StudyPlanAdmin(admin.ModelAdmin):
    list_display = ('student', 'semester', 'target_final', 'status', 'created_at')
    list_filter = ('status', 'semester')
    search_fields = ('student__email', 'student__first_name')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(MidSemMarksEntry)
class MidSemMarksEntryAdmin(admin.ModelAdmin):
    list_display = ('student', 'subject', 'marks', 'max_marks', 'semester', 'entered_by', 'created_at')
    list_filter = ('semester',)
    search_fields = ('student__email', 'subject')
