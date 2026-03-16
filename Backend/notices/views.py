from django.db.models import Q
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Notice
from .serializers import NoticeSerializer
from .services import dispatch_due_reminders

class NoticeListView(generics.ListAPIView):
    serializer_class = NoticeSerializer
    permission_classes = [permissions.IsAuthenticated] # Only logged-in users can see notices

    def get_queryset(self):
        dispatch_due_reminders()
        user = self.request.user
        # Show notices targeted at 'all' OR notices targeted specifically at the user's role
        return Notice.objects.filter(
            Q(target_audience='all') | Q(target_audience=user.role)
        ).order_by('-created_at')


class FacultyNoticeView(generics.ListCreateAPIView):
    serializer_class = NoticeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        dispatch_due_reminders()
        user = self.request.user
        if user.role == 'faculty':
            return Notice.objects.filter(created_by=user).order_by('-created_at')
        return Notice.objects.all().order_by('-created_at')

    def create(self, request, *args, **kwargs):
        if request.user.role not in ['faculty', 'admin']:
            return Response({'error': 'Only faculty/admin can publish notices.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(created_by=request.user)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

# Optional: Add Create/Update/Delete views if needed (likely admin/faculty only)
# class NoticeCreateView(generics.CreateAPIView):
#     queryset = Notice.objects.all()
#     serializer_class = NoticeSerializer
#     permission_classes = [permissions.IsAdminUser] # Example: Only Admins can create