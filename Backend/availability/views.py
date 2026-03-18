from rest_framework import viewsets, permissions, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from django.utils import timezone
from .models import FacultyAvailability, LeaveRequest
from .serializers import (
    FacultyAvailabilitySerializer,
    LeaveRequestListSerializer,
    LeaveRequestDetailSerializer,
    LeaveRequestCreateSerializer,
    LeaveRequestApproveSerializer
)


class FacultyAvailabilityViewSet(viewsets.ViewSet):
    """ViewSet for managing faculty availability"""
    permission_classes = [permissions.IsAuthenticated]
    
    def _get_availability(self, request):
        """Get or create availability for current user"""
        if request.user.role != 'faculty':
            raise PermissionDenied('Only faculty can manage availability')
        availability, _ = FacultyAvailability.objects.get_or_create(faculty=request.user)
        return availability
    
    @action(detail=False, methods=['get'])
    def my_availability(self, request):
        """Get current user's availability"""
        availability = self._get_availability(request)
        serializer = FacultyAvailabilitySerializer(availability)
        return Response(serializer.data)
    
    @action(detail=False, methods=['put', 'patch'])
    def update_availability(self, request):
        """Update current user's availability"""
        availability = self._get_availability(request)
        serializer = FacultyAvailabilitySerializer(availability, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save(updated_by=request.user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['put'])
    def set_on_campus(self, request):
        """Set faculty as available on campus"""
        availability = self._get_availability(request)
        availability.is_available_on_campus = True
        availability.is_on_leave = False
        availability.on_campus_start_time = request.data.get('start_time')
        availability.on_campus_end_time = request.data.get('end_time')
        availability.on_campus_location = request.data.get('location', '')
        availability.on_campus_notes = request.data.get('notes', '')
        availability.updated_by = request.user
        availability.save()
        return Response(FacultyAvailabilitySerializer(availability).data)
    
    @action(detail=False, methods=['put'])
    def set_on_leave(self, request):
        """Set faculty as on leave"""
        availability = self._get_availability(request)
        availability.is_on_leave = True
        availability.is_available_on_campus = False
        availability.updated_by = request.user
        availability.save()
        return Response(FacultyAvailabilitySerializer(availability).data)
    
    @action(detail=False, methods=['get'])
    def all_faculty_availability(self, request):
        """Get availability for all faculty"""
        availabilities = FacultyAvailability.objects.all()
        serializer = FacultyAvailabilitySerializer(availabilities, many=True)
        return Response(serializer.data)


class LeaveRequestViewSet(viewsets.ViewSet):
    """ViewSet for managing leave requests"""
    permission_classes = [permissions.IsAuthenticated]
    
    def list(self, request):
        """Get leave requests"""
        if request.user.role == 'faculty':
            # Faculty sees their own leave requests
            leave_requests = LeaveRequest.objects.filter(requested_by=request.user)
        elif request.user.role == 'admin':
            # Admin sees all leave requests
            leave_requests = LeaveRequest.objects.all()
        else:
            leave_requests = LeaveRequest.objects.none()
        
        serializer = LeaveRequestListSerializer(leave_requests, many=True)
        return Response(serializer.data)
    
    def create(self, request):
        """Create a new leave declaration for faculty."""
        if request.user.role != 'faculty':
            return Response(
                {'error': 'Only faculty can request leave'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = LeaveRequestCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        leave_request = LeaveRequest.objects.create(
            faculty=request.user,
            requested_by=request.user,
            status='approved',
            approved_by=request.user,
            approved_at=timezone.now(),
            **serializer.validated_data
        )

        # Keep faculty availability in sync so students immediately see leave status.
        availability, _ = FacultyAvailability.objects.get_or_create(faculty=request.user)
        availability.is_on_leave = True
        availability.is_available_on_campus = False
        availability.updated_by = request.user
        availability.save()
        
        return Response(
            LeaveRequestDetailSerializer(leave_request).data,
            status=status.HTTP_201_CREATED
        )

    @action(detail=False, methods=['get'])
    def active_leaves(self, request):
        """List approved active/upcoming leaves for visibility in student panel."""
        today = timezone.localdate()
        leave_requests = LeaveRequest.objects.filter(
            status='approved',
            end_date__gte=today
        ).order_by('start_date', 'faculty__first_name', 'faculty__last_name')

        serializer = LeaveRequestListSerializer(leave_requests, many=True)
        return Response(serializer.data)
    
    def retrieve(self, request, pk=None):
        """Get a specific leave request"""
        leave_request = get_object_or_404(LeaveRequest, id=pk)
        
        # Check permissions
        if request.user.role == 'faculty' and leave_request.requested_by != request.user:
            raise PermissionDenied('You can only view your own leave requests')
        
        serializer = LeaveRequestDetailSerializer(leave_request)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approve a leave request (admin only)"""
        if request.user.role != 'admin':
            return Response(
                {'error': 'Only admin can approve leave requests'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        leave_request = get_object_or_404(LeaveRequest, id=pk)
        serializer = LeaveRequestApproveSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        leave_request.status = serializer.validated_data['status']
        leave_request.approved_by = request.user
        leave_request.approval_notes = serializer.validated_data.get('approval_notes', '')
        leave_request.approved_at = timezone.now()
        leave_request.save()
        
        # Update availability if approved
        if leave_request.status == 'approved':
            availability, _ = FacultyAvailability.objects.get_or_create(faculty=leave_request.faculty)
            availability.is_on_leave = True
            availability.is_available_on_campus = False
            availability.updated_by = request.user
            availability.save()
        
        return Response(LeaveRequestDetailSerializer(leave_request).data)
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel a leave request"""
        leave_request = get_object_or_404(LeaveRequest, id=pk)
        
        # Check permissions
        if request.user.role == 'faculty' and leave_request.requested_by != request.user:
            raise PermissionDenied('You can only cancel your own leave requests')
        
        if leave_request.status != 'pending':
            return Response(
                {'error': 'Can only cancel pending leave requests'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        leave_request.status = 'cancelled'
        leave_request.save()
        
        return Response(LeaveRequestDetailSerializer(leave_request).data)
