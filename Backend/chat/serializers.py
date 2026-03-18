from rest_framework import serializers
from .models import ChatGroup, ChatMessage, GroupMembership
from users.models import User


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='get_full_name', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'full_name', 'role']


class ChatMessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    sender_name = serializers.SerializerMethodField()
    sender_id = serializers.IntegerField(source='sender.id', read_only=True)
    
    class Meta:
        model = ChatMessage
        fields = ['id', 'sender', 'sender_name', 'sender_id', 'content', 'created_at']
    
    def get_sender_name(self, obj):
        if obj.sender:
            full_name = obj.sender.get_full_name()
            return full_name if full_name else obj.sender.email
        return 'Unknown'


class GroupMembershipSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = GroupMembership
        fields = ['id', 'user', 'is_admin', 'joined_at']


class ChatGroupDetailSerializer(serializers.ModelSerializer):
    members = serializers.SerializerMethodField()
    messages = ChatMessageSerializer(many=True, read_only=True)
    created_by = UserSerializer(read_only=True)
    
    class Meta:
        model = ChatGroup
        fields = ['id', 'name', 'description', 'created_by', 'created_at', 'updated_at', 'members', 'messages']
    
    def get_members(self, obj):
        memberships = obj.memberships.all()
        return GroupMembershipSerializer(memberships, many=True).data


class ChatGroupListSerializer(serializers.ModelSerializer):
    member_count = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()
    created_by = UserSerializer(read_only=True)
    memberships = GroupMembershipSerializer(many=True, read_only=True)
    
    class Meta:
        model = ChatGroup
        fields = ['id', 'name', 'description', 'created_by', 'created_at', 'updated_at', 'member_count', 'memberships', 'last_message']
    
    def get_member_count(self, obj):
        return obj.memberships.count()
    
    def get_last_message(self, obj):
        last_msg = obj.messages.last()
        if last_msg:
            return {
                'content': last_msg.content[:50] + '...' if len(last_msg.content) > 50 else last_msg.content,
                'sender': last_msg.sender.email if last_msg.sender else 'Unknown',
                'created_at': last_msg.created_at
            }
        return None


class ChatMessageCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ['content']


class AddGroupMemberSerializer(serializers.Serializer):
    """Serializer for adding a member to a group."""
    user_id = serializers.IntegerField()
    
    def validate_user_id(self, value):
        try:
            User.objects.get(id=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("User does not exist.")
        return value


class RemoveGroupMemberSerializer(serializers.Serializer):
    """Serializer for removing a member from a group."""
    user_id = serializers.IntegerField()


class ChatGroupCreateSerializer(serializers.ModelSerializer):
    member_ids = serializers.ListField(
        child=serializers.IntegerField(),
        required=False,
        allow_empty=True,
        help_text="List of user IDs to add to the group."
    )
    member_emails = serializers.ListField(
        child=serializers.EmailField(),
        required=False,
        allow_empty=True,
        help_text="List of email addresses to invite to the group."
    )
    
    class Meta:
        model = ChatGroup
        fields = ['name', 'description', 'member_ids', 'member_emails']
    
    def validate(self, data):
        """Validate that students include at least one faculty member."""
        request = self.context.get('request')
        if request and hasattr(request, 'user') and request.user and hasattr(request.user, 'role'):
            if request.user.role == 'student':
                member_ids = list({int(member_id) for member_id in data.get('member_ids', [])})
                member_emails = list({email.strip().lower() for email in data.get('member_emails', []) if email})

                if not member_ids and not member_emails:
                    raise serializers.ValidationError(
                        'Student groups must include at least one faculty member.'
                    )

                invited_users = User.objects.filter(id__in=member_ids) | User.objects.filter(email__in=member_emails)
                invited_users = invited_users.distinct()

                if not invited_users.filter(role='faculty').exists():
                    raise serializers.ValidationError(
                        'Student groups must include at least one faculty member.'
                    )

                # Keep normalized values for create flow.
                data['member_ids'] = member_ids
                data['member_emails'] = member_emails
        
        return data
