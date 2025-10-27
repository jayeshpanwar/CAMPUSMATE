from django.urls import re_path
from . import consumers

# Defines the WebSocket URL patterns
websocket_urlpatterns = [
    # This route will handle all chat rooms (direct messages, groups, etc.)
    re_path(r'ws/chat/(?P<room_name>\w+)/$', consumers.ChatConsumer.as_asgi()),
]
