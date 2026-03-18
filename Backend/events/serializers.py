from rest_framework import serializers
from .models import Event, Hackathon, EventCategory, EventFetch


class EventCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = EventCategory
        fields = ['id', 'name', 'description']


class EventSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Event
        fields = [
            'id', 'title', 'description', 'category', 'category_name',
            'event_type', 'start_date', 'end_date', 'location', 'status',
            'is_featured', 'image_url', 'organizer', 'registration_link',
            'capacity', 'current_registrations', 'created_at', 'updated_at'
        ]


class HackathonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hackathon
        fields = [
            'id', 'title', 'description', 'start_date', 'end_date',
            'location', 'difficulty', 'status', 'is_featured', 'image_url',
            'organizer', 'registration_link', 'prizes', 'max_team_size',
            'min_team_size', 'team_count', 'participant_count', 'created_at', 'updated_at'
        ]


class EventFetchSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventFetch
        fields = [
            'id', 'fetch_type', 'status', 'total_fetched', 'new_created',
            'updated', 'error_message', 'timestamp'
        ]
