from django.contrib.auth import authenticate  # <--- CRITICAL IMPORT ADDED
from django.conf import settings
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken 

from .permissions import IsStudent, IsFaculty, IsAdminRole
from .models import User, DepartmentConfig
from .serializers import (
    StudentRegisterSerializer,
    FacultyRegisterSerializer,
    AdminRegisterSerializer,
    UserSerializer,
    StudentVerificationInitiateSerializer,
    StudentVerificationConfirmSerializer,
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

            if (
                getattr(settings, 'STUDENT_VERIFICATION_REQUIRED', False)
                and not user.is_verified
                and user.role in ['student', 'faculty']
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
                "first_name": user.first_name
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