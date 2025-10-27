import json
from channels.generic.websocket import AsyncWebsocketConsumer

# We need the User model to check roles and the related user for direct messages
from users.models import User 
from channels.db import database_sync_to_async

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # The room name will determine the group (e.g., 'dm_user1_user2' or 'group_CSE_VII_B')
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name
        self.user = self.scope['user']

        # --- AUTHENTICATION CHECK ---
        if not self.user or self.user.is_anonymous:
            await self.close(code=4001) # 4001: Unauthorized
            return

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        data = json.loads(text_data)
        message_text = data.get('message', '')
        recipient_id = data.get('recipient_id') # Used for DM validation

        # --- 1. ENFORCE MESSAGING PERMISSIONS (CRITICAL STEP) ---
        can_send = await self.check_permissions(recipient_id)

        if not can_send:
            # Send an error back to the user
            await self.send(text_data=json.dumps({
                'type': 'chat_message',
                'message': 'Error: You do not have permission to message this user/group.',
                'sender': 'System'
            }))
            return

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message_text,
                'sender_role': self.user.role,
                'sender_name': self.user.username,
            }
        )

    # Receive message from room group
    async def chat_message(self, event):
        # Send message to WebSocket
        await self.send(text_data=json.dumps(event))

    @database_sync_to_async
    def check_permissions(self, recipient_id=None):
        sender_role = self.user.role

        # 1. FACULTY/ADMIN: Can message anyone (direct and group creation allowed)
        if sender_role in ['faculty', 'admin']:
            return True

        # 2. STUDENT: Only allowed to message Faculty or Admin (No student-to-student chat)
        if sender_role == 'student':
            if not recipient_id:
                # Allow messaging in pre-created groups (like 'CSE VII B')
                # For direct messages, recipient_id must be present.
                return True 
                
            try:
                recipient = User.objects.get(id=recipient_id)
                # Check if the recipient is a Faculty or Admin
                if recipient.role in ['faculty', 'admin']:
                    return True
                else:
                    return False # Student cannot message another student
            except User.DoesNotExist:
                return False # Recipient not found

        return False # Default deny
