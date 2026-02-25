from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import ChatGroup, ChatMessage, GroupMembership
from .serializers import (
    ChatGroupDetailSerializer,
    ChatGroupListSerializer,
    ChatMessageSerializer,
    ChatMessageCreateSerializer,
    ChatGroupCreateSerializer,
    GroupMembershipSerializer
)
from users.models import User


class ChatGroupViewSet(viewsets.ModelViewSet):
    """ViewSet for managing chat groups and messages."""
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ChatGroupCreateSerializer
        elif self.action == 'retrieve':
            return ChatGroupDetailSerializer
        else:
            return ChatGroupListSerializer
    
    def get_queryset(self):
        """Return groups that the user is a member of."""
        return ChatGroup.objects.filter(
            memberships__user=self.request.user,
            is_active=True
        ).distinct()
    
    def create(self, request, *args, **kwargs):
        """Create a new chat group."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        group = ChatGroup.objects.create(
            name=serializer.validated_data['name'],
            description=serializer.validated_data.get('description', ''),
            created_by=request.user
        )
        
        # Add creator as admin member
        GroupMembership.objects.create(
            group=group,
            user=request.user,
            is_admin=True
        )
        
        return Response(
            ChatGroupListSerializer(group).data,
            status=status.HTTP_201_CREATED
        )
    
    @action(detail=True, methods=['post'])
    def send_message(self, request, pk=None):
        """Send a message to a chat group."""
        group = self.get_object()
        
        # Verify user is member of group
        if not group.memberships.filter(user=request.user).exists():
            return Response(
                {'error': 'You are not a member of this group'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = ChatMessageCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        message = ChatMessage.objects.create(
            group=group,
            sender=request.user,
            content=serializer.validated_data['content']
        )
        
        # Update group's updated_at timestamp
        group.save()
        
        return Response(
            ChatMessageSerializer(message).data,
            status=status.HTTP_201_CREATED
        )
    
    @action(detail=True, methods=['get'])
    def messages(self, request, pk=None):
        """Get all messages in a chat group."""
        group = self.get_object()
        
        # Verify user is member of group
        if not group.memberships.filter(user=request.user).exists():
            return Response(
                {'error': 'You are not a member of this group'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        messages = group.messages.all()
        serializer = ChatMessageSerializer(messages, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def add_member(self, request, pk=None):
        """Add a member to the chat group."""
        group = self.get_object()
        
        # Verify request user is admin of group
        membership = group.memberships.filter(user=request.user).first()
        if not membership or not membership.is_admin:
            return Response(
                {'error': 'You do not have permission to add members'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        user_email = request.data.get('user_email')
        if not user_email:
            return Response(
                {'error': 'user_email is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user = User.objects.get(email=user_email)
        except User.DoesNotExist:
            return Response(
                {'error': f'User with email {user_email} not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if already member
        if group.memberships.filter(user=user).exists():
            return Response(
                {'error': 'User is already a member of this group'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        membership = GroupMembership.objects.create(
            group=group,
            user=user,
            is_admin=False
        )
        
        return Response(
            GroupMembershipSerializer(membership).data,
            status=status.HTTP_201_CREATED
        )
    
    @action(detail=True, methods=['post'])
    def remove_member(self, request, pk=None):
        """Remove a member from the chat group."""
        group = self.get_object()
        
        # Verify request user is admin of group
        membership = group.memberships.filter(user=request.user).first()
        if not membership or not membership.is_admin:
            return Response(
                {'error': 'You do not have permission to remove members'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        user_id = request.data.get('user_id')
        if not user_id:
            return Response(
                {'error': 'user_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            member_membership = group.memberships.get(user_id=user_id)
            member_membership.delete()
            return Response(
                {'message': 'Member removed successfully'},
                status=status.HTTP_200_OK
            )
        except GroupMembership.DoesNotExist:
            return Response(
                {'error': 'Member not found in this group'},
                status=status.HTTP_404_NOT_FOUND
            )
