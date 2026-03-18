from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Q
from django.utils import timezone
from datetime import datetime, timedelta
import logging
from .models import (
    Course, CourseEnrollment, AttendanceSession,
    AttendanceRecord, FaceProfile, AttendanceLog
)
from .serializers import (
    CourseSerializer, CourseEnrollmentSerializer, AttendanceSessionSerializer,
    AttendanceRecordSerializer, FaceProfileSerializer, AttendanceLogSerializer
)

logger = logging.getLogger(__name__)


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Course.objects.all()
        
        if user.role == 'faculty':
            queryset = queryset.filter(faculty=user)
        elif user.role == 'student':
            queryset = queryset.filter(enrollments__student=user)
        else:
            return Course.objects.none()
        
        # Filter by branch if provided
        branch = self.request.query_params.get('branch')
        if branch:
            queryset = queryset.filter(branch=branch)
        
        # Filter by semester if provided
        semester = self.request.query_params.get('semester')
        if semester:
            queryset = queryset.filter(semester=semester)
        
        return queryset.distinct()

    @action(detail=False, methods=['get'])
    def available_branches(self, request):
        """Get all available branches for course creation"""
        branches = Course.BRANCH_CHOICES
        return Response({
            'branches': [{'value': code, 'label': label} for code, label in branches]
        })

    @action(detail=True, methods=['get'])
    def sessions(self, request, pk=None):
        """Get all sessions for a course"""
        course = self.get_object()
        sessions = course.attendance_sessions.all()
        serializer = AttendanceSessionSerializer(sessions, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def create_session(self, request, pk=None):
        """Create a new attendance session for the course"""
        course = self.get_object()
        
        if request.user != course.faculty and request.user.role != 'admin':
            return Response(
                {'error': 'Only the course faculty can create sessions'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = AttendanceSessionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(course=course, faculty=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def add_students(self, request, pk=None):
        course = self.get_object()
        student_ids = request.data.get('student_ids', [])
        for student_id in student_ids:
            CourseEnrollment.objects.get_or_create(
                course=course,
                student_id=student_id
            )
        return Response({'status': 'Students added'})

    @action(detail=True, methods=['get'])
    def enrolled_students(self, request, pk=None):
        course = self.get_object()
        enrollments = course.enrollments.all()
        serializer = CourseEnrollmentSerializer(enrollments, many=True)
        return Response(serializer.data)


class CourseEnrollmentViewSet(viewsets.ModelViewSet):
    queryset = CourseEnrollment.objects.all()
    serializer_class = CourseEnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        course_id = self.request.query_params.get('course')
        if course_id:
            return CourseEnrollment.objects.filter(course_id=course_id)
        return CourseEnrollment.objects.all()


class AttendanceSessionViewSet(viewsets.ModelViewSet):
    queryset = AttendanceSession.objects.all()
    serializer_class = AttendanceSessionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = AttendanceSession.objects.all()
        
        if user.role == 'faculty':
            queryset = queryset.filter(faculty=user)
            
            # Filter by course if provided
            course_id = self.request.query_params.get('course_id')
            if course_id:
                queryset = queryset.filter(course_id=course_id)
        else:
            return AttendanceSession.objects.none()
        
        return queryset

    @action(detail=True, methods=['get'])
    def enrolled_students(self, request, pk=None):
        """Get all enrolled students for this session's course"""
        session = self.get_object()
        enrollments = session.course.enrollments.all()
        serializer = CourseEnrollmentSerializer(enrollments, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def attendance_records(self, request, pk=None):
        """Get all attendance records for this session"""
        session = self.get_object()
        records = session.records.all()
        serializer = AttendanceRecordSerializer(records, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def mark_attendance_batch(self, request, pk=None):
        """Mark attendance for multiple students in this session"""
        session = self.get_object()
        
        if request.user != session.faculty and request.user.role != 'admin':
            return Response(
                {'error': 'Only the session faculty can mark attendance'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        attendance_data = request.data.get('attendance', [])
        
        if not attendance_data:
            return Response(
                {'error': 'attendance array required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        created_records = []
        errors = []
        
        for entry in attendance_data:
            student_id = entry.get('student_id')
            status_val = entry.get('status')
            
            if not student_id or not status_val:
                errors.append({'error': 'student_id and status required for each entry'})
                continue
            
            try:
                record, created = AttendanceRecord.objects.update_or_create(
                    session=session,
                    student_id=student_id,
                    defaults={
                        'status': status_val,
                        'detection_source': 'manual_entry'
                    }
                )
                
                AttendanceLog.objects.create(
                    record=record,
                    action='batch_mark_attendance',
                    performed_by=request.user,
                    details=f"Status set to {status_val}"
                )
                
                created_records.append(record)
            except Exception as e:
                errors.append({'student_id': student_id, 'error': str(e)})
        
        serializer = AttendanceRecordSerializer(created_records, many=True)
        return Response({
            'message': f'Attendance marked for {len(created_records)} students',
            'records': serializer.data,
            'errors': errors
        }, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def upload_image(self, request, pk=None):
        session = self.get_object()
        images = request.FILES.getlist('images')
        
        if not images:
            return Response(
                {'error': 'No images provided'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        return Response(
            {'message': f'Received {len(images)} images'},
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['post'])
    def process_session(self, request, pk=None):
        session = self.get_object()
        session.is_processed = True
        session.save()
        return Response({'status': 'Session processed'})


class AttendanceRecordViewSet(viewsets.ModelViewSet):
    queryset = AttendanceRecord.objects.all()
    serializer_class = AttendanceRecordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        course_id = self.request.query_params.get('course_id')
        
        if user.role == 'student':
            return AttendanceRecord.objects.filter(student=user)
        elif user.role == 'faculty':
            return AttendanceRecord.objects.filter(session__faculty=user)
        return AttendanceRecord.objects.none()

    @action(detail=False, methods=['get'])
    def my_attendance(self, request):
        user = request.user
        if user.role != 'student':
            return Response(
                {'error': 'Only students can access their attendance'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        records = AttendanceRecord.objects.filter(student=user).select_related('session__course')
        serializer = self.get_serializer(records, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def course_attendance(self, request):
        course_id = request.query_params.get('course_id')
        if not course_id:
            return Response({'error': 'course_id required'}, status=status.HTTP_400_BAD_REQUEST)
        
        records = AttendanceRecord.objects.filter(
            session__course_id=course_id
        ).select_related('session__course', 'student')
        
        serializer = self.get_serializer(records, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def manual_mark(self, request):
        session_id = request.data.get('session_id')
        attendance_data = request.data.get('attendance', [])
        
        if not session_id or not attendance_data:
            return Response(
                {'error': 'session_id and attendance data required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            session = AttendanceSession.objects.get(id=session_id)
        except AttendanceSession.DoesNotExist:
            return Response(
                {'error': 'Session not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        created_records = []
        for entry in attendance_data:
            student_id = entry.get('student_id')
            status_val = entry.get('status')
            
            record, created = AttendanceRecord.objects.update_or_create(
                session=session,
                student_id=student_id,
                defaults={
                    'status': status_val,
                    'detection_source': 'manual_entry'
                }
            )
            
            AttendanceLog.objects.create(
                record=record,
                action='manual_mark',
                performed_by=request.user,
                details=f"Status set to {status_val}"
            )
            
            created_records.append(record)
        
        serializer = AttendanceRecordSerializer(created_records, many=True)
        return Response(
            {'message': 'Attendance marked', 'records': serializer.data},
            status=status.HTTP_201_CREATED
        )


class FaceProfileViewSet(viewsets.ModelViewSet):
    queryset = FaceProfile.objects.all()
    serializer_class = FaceProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'student':
            return FaceProfile.objects.filter(user=user)
        return FaceProfile.objects.none()

    @action(detail=False, methods=['get'])
    def me(self, request):
        try:
            profile = FaceProfile.objects.get(user=request.user)
            serializer = self.get_serializer(profile)
            return Response(serializer.data)
        except FaceProfile.DoesNotExist:
            return Response(
                {'error': 'Profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['post'])
    def upload_profile_photo(self, request):
        user = request.user
        photo = request.FILES.get('photo')
        
        if not photo:
            return Response(
                {'error': 'No photo provided'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            profile, created = FaceProfile.objects.get_or_create(user=user)
            profile.profile_photo = photo
            profile.save()
            
            serializer = self.get_serializer(profile)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error processing face profile: {str(e)}")
            return Response(
                {'error': f'Error processing photo: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
