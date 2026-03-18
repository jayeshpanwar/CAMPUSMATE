from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Q
from .models import Event, Hackathon, EventCategory, EventFetch
from .serializers import EventSerializer, HackathonSerializer, EventCategorySerializer, EventFetchSerializer


class EventCategoryViewSet(viewsets.ModelViewSet):
    queryset = EventCategory.objects.all()
    serializer_class = EventCategorySerializer
    permission_classes = [IsAuthenticated]


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['status', 'event_type', 'category']
    search_fields = ['title', 'description', 'location']
    ordering_fields = ['start_date', 'created_at']
    ordering = ['-start_date']
    
    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        """Get upcoming events"""
        now = timezone.now()
        events = self.queryset.filter(
            start_date__gte=now,
            status__in=['upcoming', 'ongoing']
        ).order_by('start_date')
        serializer = self.get_serializer(events, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get currently active events"""
        now = timezone.now()
        events = self.queryset.filter(
            start_date__lte=now,
            end_date__gte=now,
            status='ongoing'
        )
        serializer = self.get_serializer(events, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured events"""
        events = self.queryset.filter(is_featured=True).order_by('-start_date')[:10]
        serializer = self.get_serializer(events, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_type(self, request):
        """Get events grouped by type"""
        event_type = request.query_params.get('type')
        if event_type:
            events = self.queryset.filter(event_type=event_type)
            serializer = self.get_serializer(events, many=True)
            return Response(serializer.data)
        return Response({"error": "type parameter required"}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """Search events"""
        query = request.query_params.get('q', '')
        if query:
            events = self.queryset.filter(
                Q(title__icontains=query) | 
                Q(description__icontains=query) |
                Q(location__icontains=query)
            )
            serializer = self.get_serializer(events, many=True)
            return Response(serializer.data)
        return Response({"error": "q parameter required"}, status=status.HTTP_400_BAD_REQUEST)


class HackathonViewSet(viewsets.ModelViewSet):
    queryset = Hackathon.objects.all()
    serializer_class = HackathonSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['status', 'difficulty']
    search_fields = ['title', 'description', 'location']
    ordering_fields = ['start_date', 'created_at']
    ordering = ['-start_date']
    
    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        """Get upcoming hackathons"""
        now = timezone.now()
        hackathons = self.queryset.filter(
            start_date__gte=now,
            status__in=['upcoming', 'ongoing']
        ).order_by('start_date')
        serializer = self.get_serializer(hackathons, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get currently active hackathons"""
        now = timezone.now()
        hackathons = self.queryset.filter(
            start_date__lte=now,
            end_date__gte=now,
            status='ongoing'
        )
        serializer = self.get_serializer(hackathons, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured hackathons"""
        hackathons = self.queryset.filter(is_featured=True).order_by('-start_date')[:10]
        serializer = self.get_serializer(hackathons, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_difficulty(self, request):
        """Get hackathons by difficulty level"""
        difficulty = request.query_params.get('level')
        if difficulty:
            hackathons = self.queryset.filter(difficulty=difficulty)
            serializer = self.get_serializer(hackathons, many=True)
            return Response(serializer.data)
        return Response({"error": "level parameter required"}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """Search hackathons"""
        query = request.query_params.get('q', '')
        if query:
            hackathons = self.queryset.filter(
                Q(title__icontains=query) | 
                Q(description__icontains=query) |
                Q(location__icontains=query)
            )
            serializer = self.get_serializer(hackathons, many=True)
            return Response(serializer.data)
        return Response({"error": "q parameter required"}, status=status.HTTP_400_BAD_REQUEST)


class EventFetchViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = EventFetch.objects.all()
    serializer_class = EventFetchSerializer
    permission_classes = [IsAuthenticated]
    ordering_fields = ['timestamp']
    ordering = ['-timestamp']
