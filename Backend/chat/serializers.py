from rest_framework import serializers
from .models import ChatGroup, ChatMessage, GroupMembership
from users.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'role']


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


class ChatGroupCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatGroup
        fields = ['name', 'description']
