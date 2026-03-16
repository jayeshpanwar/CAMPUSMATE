from rest_framework import serializers
from .models import Notice

class NoticeSerializer(serializers.ModelSerializer):
    created_by_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Notice
        fields = [
            'id',
            'title',
            'content',
            'created_at',
            'updated_at',
            'target_audience',
            'created_by',
            'created_by_name',
            'target_group',
            'end_time',
            'remind_before_minutes',
            'reminder_sent',
        ]
        read_only_fields = ['created_at', 'updated_at', 'created_by', 'reminder_sent']

    def get_created_by_name(self, obj):
        if not obj.created_by:
            return None
        full_name = obj.created_by.get_full_name()
        return full_name if full_name else obj.created_by.email