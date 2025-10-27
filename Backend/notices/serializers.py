from rest_framework import serializers
from .models import Notice

class NoticeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notice
        fields = ['id', 'title', 'content', 'created_at', 'target_audience'] # Add other fields as needed
        # read_only_fields = ['created_at'] # Good practice