from django.contrib.auth import authenticate  # <--- CRITICAL IMPORT ADDED
from django.conf import settings
from django.db.models import Q
from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken 

from .permissions import IsStudent, IsFaculty, IsAdminRole
from .models import User, DepartmentConfig, NoDuesSubject, NoDuesApplication
from .serializers import (
    StudentRegisterSerializer,
    FacultyRegisterSerializer,
    AdminRegisterSerializer,
    UserSerializer,
    StudentVerificationInitiateSerializer,
    StudentVerificationConfirmSerializer,
    NoDuesSubjectSerializer,
    NoDuesApplicationSerializer,
)

# --- CUSTOM LOGIN VIEW (The Fix) ---

class CustomLoginView(APIView):
    """
    Logs in a user, generates JWT tokens, AND returns user info (ID, Role, Name).
    """
    authentication_classes = [] # Disable global auth checks for this view
    permission_classes = [AllowAny] # Allow anyone to access

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        # Check credentials
        user = authenticate(username=email, password=password)

        if user:
            if not user.is_active:
                return Response({"error": "Account is disabled. Contact support."}, status=status.HTTP_403_FORBIDDEN)

            # only enforce verification for non-admin accounts
            if (
                getattr(settings, 'STUDENT_VERIFICATION_REQUIRED', False)
                and not user.is_verified
                and user.role != 'admin'
            ):
                return Response({"error": "Account pending verification."}, status=status.HTTP_403_FORBIDDEN)

            # Generate JWT Tokens
            refresh = RefreshToken.for_user(user)
            
            return Response({
                "status": "success",
                # The Tokens
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                # The User Data (Needed for your Dashboard)
                "user_id": user.id,
                "email": user.email,
                "role": user.role, 
                "first_name": user.first_name,
                "last_name": user.last_name,
                "department": getattr(user, 'department', '')
            }, status=200)
        else:
            return Response({"error": "Invalid Email or Password"}, status=401)


class StudentVerificationInitiateView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = StudentVerificationInitiateSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"detail": "Verification code sent to your institutional email."}, status=status.HTTP_200_OK)


class StudentVerificationConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = StudentVerificationConfirmSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"detail": "Account verified successfully. You can now log in."}, status=status.HTTP_200_OK)


# --- Registration Views ---

class StudentRegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = StudentRegisterSerializer
    permission_classes = [permissions.AllowAny]

class FacultyRegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = FacultyRegisterSerializer
    permission_classes = [permissions.AllowAny]

class AdminRegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = AdminRegisterSerializer
    permission_classes = [permissions.AllowAny]


# --- Protected Data Views ---

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class StudentOnlyView(APIView):
    permission_classes = [IsAuthenticated, IsStudent]
    
    def get(self, request):
        return Response({"message": f"Hello Student {request.user.first_name}"})

class FacultyOnlyView(APIView):
    permission_classes = [IsAuthenticated, IsFaculty]
    
    def get(self, request):
        return Response({"message": f"Hello Faculty {request.user.first_name}"})

class AdminOnlyView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]
    
    def get(self, request):
        return Response({"message": f"Hello Admin {request.user.first_name}"})


# --- No Dues Views ---

class NoDuesView(APIView):
    def get(self, request):
        items = DepartmentConfig.objects.filter(branch=request.GET["branch"], semester=request.GET["semester"])
        data = [{"configId": i.id, "name": i.subject_name, "category": "Academic", "status": "NOT_APPLIED", "remark": ""} for i in items]
        return Response(data)

    def post(self, request):
        # create/update no_dues_requests & approval_checklist as needed
        return Response(status=201)


class NoDuesSubjectView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        queryset = NoDuesSubject.objects.filter(is_active=True)
        department = request.query_params.get('department')
        class_year = request.query_params.get('class_year')
        semester = request.query_params.get('semester')

        if request.user.role == 'faculty':
            queryset = queryset.filter(faculty=request.user)
        elif request.user.role == 'student':
            if department:
                queryset = queryset.filter(department__iexact=department)
            if class_year:
                queryset = queryset.filter(Q(class_year=class_year) | Q(class_year__isnull=True) | Q(class_year=''))
            if semester:
                queryset = queryset.filter(Q(semester=semester) | Q(semester__isnull=True))
        else:
            if department:
                queryset = queryset.filter(department__iexact=department)

        serializer = NoDuesSubjectSerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        if request.user.role not in ['faculty', 'admin']:
            return Response({'error': 'Only faculty/admin can create no-dues subjects.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = NoDuesSubjectSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(faculty=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class NoDuesApplicationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role == 'student':
            queryset = NoDuesApplication.objects.filter(student=request.user)
        elif request.user.role == 'faculty':
            queryset = NoDuesApplication.objects.filter(subject__faculty=request.user)
        else:
            queryset = NoDuesApplication.objects.all()

        serializer = NoDuesApplicationSerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        if request.user.role != 'student':
            return Response({'error': 'Only students can apply for no-dues.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = NoDuesApplicationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        subject = serializer.validated_data['subject']

        existing = NoDuesApplication.objects.filter(subject=subject, student=request.user).first()
        if existing:
            if existing.status == 'REJECTED':
                existing.status = 'PENDING'
                existing.remark = request.data.get('remark', '')
                existing.reviewed_at = None
                existing.reviewed_by = None
                existing.save(update_fields=['status', 'remark', 'reviewed_at', 'reviewed_by'])
                return Response(NoDuesApplicationSerializer(existing).data, status=status.HTTP_200_OK)
            return Response({'error': 'Application already exists for this subject.'}, status=status.HTTP_400_BAD_REQUEST)

        application = serializer.save(student=request.user)
        return Response(NoDuesApplicationSerializer(application).data, status=status.HTTP_201_CREATED)


class NoDuesDecisionView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, application_id):
        if request.user.role not in ['faculty', 'admin']:
            return Response({'error': 'Only faculty/admin can review applications.'}, status=status.HTTP_403_FORBIDDEN)

        try:
            application = NoDuesApplication.objects.select_related('subject').get(id=application_id)
        except NoDuesApplication.DoesNotExist:
            return Response({'error': 'Application not found.'}, status=status.HTTP_404_NOT_FOUND)

        if request.user.role == 'faculty' and application.subject.faculty_id != request.user.id:
            return Response({'error': 'You can review only your own subject requests.'}, status=status.HTTP_403_FORBIDDEN)

        next_status = request.data.get('status')
        if next_status not in ['PENDING', 'APPROVED', 'REJECTED']:
            return Response({'error': 'Invalid status.'}, status=status.HTTP_400_BAD_REQUEST)

        application.status = next_status
        application.remark = request.data.get('remark', application.remark)
        application.reviewed_at = timezone.now()
        application.reviewed_by = request.user
        application.save(update_fields=['status', 'remark', 'reviewed_at', 'reviewed_by'])

        return Response(NoDuesApplicationSerializer(application).data)