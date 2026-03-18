from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db.models import Q
from .models import StudentTask, TaskAssignment, TaskSubmission
from .serializers import (
    StudentTaskListSerializer,
    StudentTaskDetailSerializer,
    StudentTaskCreateSerializer,
    TaskAssignmentSerializer,
    TaskSubmissionSerializer,
    TaskSubmissionCreateSerializer
)
from users.models import User


class StudentTaskViewSet(viewsets.ViewSet):
    """ViewSet for managing student tasks"""
    permission_classes = [permissions.IsAuthenticated]
    
    def list(self, request):
        """List tasks"""
        if request.user.role == 'faculty':
            # Faculty sees their created tasks
            tasks = StudentTask.objects.filter(created_by=request.user)
        else:
            # Students see tasks assigned to them
            tasks = StudentTask.objects.filter(
                Q(target_audience='all_students') |
                Q(target_audience='department', department=request.user.department) |
                Q(assignments__student=request.user)
            ).distinct()
        
        serializer = StudentTaskListSerializer(tasks, many=True)
        return Response(serializer.data)
    
    def create(self, request):
        """Create a new task (faculty only)"""
        if request.user.role != 'faculty':
            return Response(
                {'error': 'Only faculty can create tasks'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = StudentTaskCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        task = StudentTask.objects.create(
            created_by=request.user,
            **serializer.validated_data
        )
        
        # Auto-assign to students based on target audience
        self._assign_task(task)
        
        return Response(
            StudentTaskDetailSerializer(task).data,
            status=status.HTTP_201_CREATED
        )
    
    def retrieve(self, request, pk=None):
        """Get a specific task"""
        task = get_object_or_404(StudentTask, id=pk)
        
        # Check permissions
        if request.user.role == 'student':
            # Students can only view tasks assigned to them
            if not task.assignments.filter(student=request.user).exists() and task.target_audience != 'all_students':
                raise PermissionDenied('You cannot view this task')
        
        serializer = StudentTaskDetailSerializer(task)
        return Response(serializer.data)
    
    def update(self, request, pk=None):
        """Update a task (faculty only)"""
        task = get_object_or_404(StudentTask, id=pk)
        
        if request.user.role != 'faculty' or task.created_by != request.user:
            raise PermissionDenied('You can only update your own tasks')
        
        serializer = StudentTaskCreateSerializer(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        
        for attr, value in serializer.validated_data.items():
            setattr(task, attr, value)
        task.save()
        
        return Response(StudentTaskDetailSerializer(task).data)
    
    def destroy(self, request, pk=None):
        """Delete a task (faculty only)"""
        task = get_object_or_404(StudentTask, id=pk)
        
        if request.user.role != 'faculty' or task.created_by != request.user:
            raise PermissionDenied('You can only delete your own tasks')
        
        task.delete()
        return Response({'detail': 'Task deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    
    def _assign_task(self, task):
        """Automatically assign task to students based on target audience"""
        if task.target_audience == 'all_students':
            students = User.objects.filter(role='student')
        elif task.target_audience == 'department':
            students = User.objects.filter(role='student', department=task.department)
        elif task.target_audience == 'batch':
            students = User.objects.filter(role='student')  # TODO: Add batch field to User model
        elif task.target_audience == 'course':
            # Assign to students enrolled in the course
            students = User.objects.filter(role='student')  # Would filter by course enrollments
        else:
            return
        
        for student in students:
            TaskAssignment.objects.get_or_create(
                task=task,
                student=student,
                defaults={'status': 'assigned'}
            )
    
    @action(detail=False, methods=['get'])
    def my_assignments(self, request):
        """Get my task assignments (student view)"""
        if request.user.role != 'student':
            return Response(
                {'error': 'Only students can view their assignments'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        assignments = TaskAssignment.objects.filter(student=request.user).prefetch_related('task')
        serializer = TaskAssignmentSerializer(assignments, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def submissions(self, request, pk=None):
        """Get all submissions for a task (faculty only)"""
        task = get_object_or_404(StudentTask, id=pk)
        
        if request.user.role != 'faculty' or task.created_by != request.user:
            raise PermissionDenied('You can only view submissions for your tasks')
        
        assignments = task.assignments.all()
        serializer = TaskAssignmentSerializer(assignments, many=True)
        return Response(serializer.data)


class TaskSubmissionViewSet(viewsets.ViewSet):
    """ViewSet for managing task submissions"""
    permission_classes = [permissions.IsAuthenticated]
    
    def create(self, request):
        """Submit a task (student only)"""
        if request.user.role != 'student':
            return Response(
                {'error': 'Only students can submit tasks'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        assignment_id = request.data.get('assignment_id')
        if not assignment_id:
            return Response(
                {'error': 'assignment_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        assignment = get_object_or_404(TaskAssignment, id=assignment_id, student=request.user)
        
        serializer = TaskSubmissionCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Check if submission already exists
        if hasattr(assignment, 'submission'):
            submission = assignment.submission
            for attr, value in serializer.validated_data.items():
                setattr(submission, attr, value)
        else:
            submission = TaskSubmission.objects.create(
                assignment=assignment,
                **serializer.validated_data
            )
        
        submission.submitted_at = timezone.now()
        submission.is_late = submission.submitted_at > assignment.task.due_date
        submission.save()
        
        # Update assignment status
        assignment.status = 'submitted'
        assignment.submission_date = submission.submitted_at
        assignment.save()
        
        return Response(
            TaskSubmissionSerializer(submission).data,
            status=status.HTTP_201_CREATED
        )
    
    def retrieve(self, request, pk=None):
        """Get a specific submission"""
        submission = get_object_or_404(TaskSubmission, id=pk)
        
        # Check permissions
        if request.user.role == 'student' and submission.assignment.student != request.user:
            raise PermissionDenied('You can only view your own submissions')
        elif request.user.role == 'faculty' and submission.assignment.task.created_by != request.user:
            raise PermissionDenied('You can only view submissions for your tasks')
        
        serializer = TaskSubmissionSerializer(submission)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def grade(self, request, pk=None):
        """Grade a submission (faculty only)"""
        submission = get_object_or_404(TaskSubmission, id=pk)
        
        if request.user.role != 'faculty' or submission.assignment.task.created_by != request.user:
            raise PermissionDenied('You can only grade submissions for your tasks')
        
        marks = request.data.get('marks')
        feedback = request.data.get('feedback', '')
        
        if marks is None:
            return Response(
                {'error': 'marks field is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        assignment = submission.assignment
        assignment.marks_obtained = marks
        assignment.feedback = feedback
        assignment.status = 'graded'
        assignment.save()
        
        return Response(
            TaskAssignmentSerializer(assignment).data
        )
