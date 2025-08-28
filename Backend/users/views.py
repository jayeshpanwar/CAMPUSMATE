from rest_framework import generics, permissions # ✅ 1. Make sure permissions is imported
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .permissions import IsStudent, IsFaculty, IsAdminRole
from .models import User
from .serializers import (
    StudentRegisterSerializer,
    FacultyRegisterSerializer,
    AdminRegisterSerializer,
    UserSerializer
)

# --- Registration Views ---

class StudentRegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = StudentRegisterSerializer
    permission_classes = [permissions.AllowAny] # ✅ 2. Add this line

class FacultyRegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = FacultyRegisterSerializer
    permission_classes = [permissions.AllowAny] # ✅ 2. Add this line

class AdminRegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = AdminRegisterSerializer
    permission_classes = [permissions.AllowAny] # ✅ 2. Add this line

# --- Protected Data Views (These remain unchanged) ---

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    # ... (rest of the view)


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