from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from .models import Timetable, Lecture
from .serializers import (
    TimetableListSerializer,
    TimetableDetailSerializer,
    LectureSerializer,
    LectureCreateUpdateSerializer
)


class TimetableViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for viewing faculty timetables"""
    permission_classes = [permissions.IsAuthenticated]
    queryset = Timetable.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return TimetableDetailSerializer
        return TimetableListSerializer
    
    @action(detail=False, methods=['get'])
    def my_timetable(self, request):
        """Get current user's timetable if they are faculty"""
        if request.user.role != 'faculty':
            return Response(
                {'error': 'Only faculty can view their timetable'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        timetable, created = Timetable.objects.get_or_create(faculty=request.user)
        serializer = TimetableDetailSerializer(timetable)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def faculty_list(self, request):
        """Get timetables for all faculty"""
        timetables = Timetable.objects.all()
        serializer = TimetableListSerializer(timetables, many=True)
        return Response(serializer.data)


class LectureViewSet(viewsets.ViewSet):
    """ViewSet for managing lectures in a timetable"""
    permission_classes = [permissions.IsAuthenticated]
    
    def _get_timetable(self, request):
        """Get or create timetable for current user"""
        if request.user.role != 'faculty':
            raise PermissionDenied('Only faculty can manage lectures')
        timetable, _ = Timetable.objects.get_or_create(faculty=request.user)
        return timetable
    
    def list(self, request):
        """Get all lectures for current faculty"""
        timetable = self._get_timetable(request)
        lectures = timetable.lectures.all()
        serializer = LectureSerializer(lectures, many=True)
        return Response(serializer.data)
    
    def create(self, request):
        """Create a new lecture"""
        timetable = self._get_timetable(request)
        serializer = LectureCreateUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        lecture = Lecture.objects.create(
            timetable=timetable,
            **serializer.validated_data
        )
        
        return Response(
            LectureSerializer(lecture).data,
            status=status.HTTP_201_CREATED
        )
    
    def retrieve(self, request, pk=None):
        """Get a specific lecture"""
        timetable = self._get_timetable(request)
        lecture = get_object_or_404(Lecture, id=pk, timetable=timetable)
        serializer = LectureSerializer(lecture)
        return Response(serializer.data)
    
    def update(self, request, pk=None):
        """Update a lecture"""
        timetable = self._get_timetable(request)
        lecture = get_object_or_404(Lecture, id=pk, timetable=timetable)
        
        serializer = LectureCreateUpdateSerializer(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        
        for attr, value in serializer.validated_data.items():
            setattr(lecture, attr, value)
        lecture.save()
        
        return Response(LectureSerializer(lecture).data)
    
    def destroy(self, request, pk=None):
        """Delete a lecture"""
        timetable = self._get_timetable(request)
        lecture = get_object_or_404(Lecture, id=pk, timetable=timetable)
        lecture.delete()
        
        return Response({'detail': 'Lecture deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=False, methods=['get'])
    def by_day(self, request):
        """Get lectures for a specific day"""
        timetable = self._get_timetable(request)
        day = request.query_params.get('day')
        
        if not day:
            return Response(
                {'error': 'day parameter is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        lectures = timetable.lectures.filter(day_of_week=day.lower())
        serializer = LectureSerializer(lectures, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_course(self, request):
        """Get lectures for a specific course"""
        timetable = self._get_timetable(request)
        course_code = request.query_params.get('course_code')
        
        if not course_code:
            return Response(
                {'error': 'course_code parameter is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        lectures = timetable.lectures.filter(course_code=course_code)
        serializer = LectureSerializer(lectures, many=True)
        return Response(serializer.data)
