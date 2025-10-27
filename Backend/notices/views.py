from rest_framework import generics, permissions
from .models import Notice
from .serializers import NoticeSerializer
from django.db.models import Q # For complex filtering

class NoticeListView(generics.ListAPIView):
    serializer_class = NoticeSerializer
    permission_classes = [permissions.IsAuthenticated] # Only logged-in users can see notices

    def get_queryset(self):
        user = self.request.user
        # Show notices targeted at 'all' OR notices targeted specifically at the user's role
        return Notice.objects.filter(
            Q(target_audience='all') | Q(target_audience=user.role)
        ).order_by('-created_at')

# Optional: Add Create/Update/Delete views if needed (likely admin/faculty only)
# class NoticeCreateView(generics.CreateAPIView):
#     queryset = Notice.objects.all()
#     serializer_class = NoticeSerializer
#     permission_classes = [permissions.IsAdminUser] # Example: Only Admins can create