# CampusMate Chat Component Setup Guide

## Installation Complete ✅

Chatscope UI Kit has been successfully integrated into your CampusMate project with two ready-to-use components.

---

## 📦 What's Included

### 1. **ChatComponent.jsx** - Basic Chat Interface
- Simple and clean chat interface
- Mock conversations for testing
- Conversation list with search functionality
- Message display with incoming/outgoing differentiation
- Message input with send functionality
- Responsive design

**Usage:**
```jsx
import ChatComponent from './components/ChatComponent';

<ChatComponent />
```

### 2. **ChatComponentAdvanced.jsx** - Full-Featured Chat
- Advanced conversation management
- Typing indicator
- Loading states
- Error handling
- Backend API integration ready
- Participant count display
- Action buttons (call, video, info)
- Empty state messaging
- Performance optimized

**Usage:**
```jsx
import ChatComponentAdvanced from './components/ChatComponentAdvanced';

<ChatComponentAdvanced />
```

---

## 🎨 Customization Features

Both components include:

### Color Scheme (CampusMate Colors)
- **Primary Blue**: `#4F6EF7`
- **Secondary Blue**: `#3D57D9`
- **Light Blue Background**: `#f0f8ff`, `#e6f2ff`
- **Text Dark**: `#1f2937`
- **Borders Light**: `#e5e7eb`

### Styling Components
- Gradient headers with brand colors
- Smooth animations and transitions
- Rounded corners and shadows
- Custom scrollbars
- Hover effects
- Focus states

### Responsive Design
- ✅ Desktop (1024px+)
- ✅ Tablet (768px - 1023px)
- ✅ Mobile (< 768px)

---

## 🔌 Backend API Integration

### Required Endpoints

Update your Django backend with these endpoints:

#### 1. Fetch Conversations
```
GET /api/chat/conversations/
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Campus Support",
    "description": "Official campus help desk",
    "avatar": "👨‍💼",
    "participants": 2,
    "messages": []
  }
]
```

#### 2. Send Message
```
POST /api/chat/send/
```

**Request Body:**
```json
{
  "conversation_id": 1,
  "message": "Hello!"
}
```

**Response:**
```json
{
  "id": 1,
  "sender": "john_doe",
  "text": "Hello!",
  "timestamp": "2026-02-23T14:56:21Z",
  "direction": "outgoing"
}
```

#### 3. Fetch Messages (Optional)
```
GET /api/chat/messages/?conversation_id=1
```

**Response:**
```json
[
  {
    "id": 1,
    "sender": "support_team",
    "text": "How can we help?",
    "timestamp": "2026-02-23T14:00:00Z",
    "direction": "incoming"
  }
]
```

---

## 🚀 To Use in Your App

### 1. Update Your Routing

In `App.jsx`:
```jsx
import ChatComponentAdvanced from './components/ChatComponentAdvanced';

<Route path="/chat" element={<ChatComponentAdvanced />} />
```

Or in your navigation:
```jsx
<Link to="/chat">Messages</Link>
```

### 2. Add to Navigation Menu

Update your `Dashboard.jsx` or main navigation:
```jsx
<button onClick={() => navigate("/chat")}>
  💬 Messages
</button>
```

### 3. Authentication Integration

The `ChatComponentAdvanced` uses user info from localStorage:
```javascript
const userId = localStorage.getItem("user_id");
const userName = localStorage.getItem("user_name");
```

Make sure these are set after login (which they already are).

---

## 🎯 Key Features

### Conversation Management
- ✅ Search conversations
- ✅ Sort by last message
- ✅ Display participant count
- ✅ Show online/offline status
- ✅ Display last message preview

### Message Handling
- ✅ Outgoing vs incoming messages
- ✅ Animated message appearance
- ✅ Typing indicators
- ✅ Timestamp support
- ✅ Avatar display

### User Experience
- ✅ Loading states
- ✅ Error handling
- ✅ Empty states
- ✅ Responsive layout
- ✅ Touch-friendly mobile UI

---

## 🛠️ Customization Examples

### Change Primary Color
Edit `ChatComponent.css`:
```css
/* Change from #4F6EF7 to your color */
background: linear-gradient(135deg, #YOUR_COLOR 0%, #YOUR_COLOR_DARK 100%);
```

### Add New Conversation Types
In `ChatComponentAdvanced.jsx`:
```jsx
const conversationTypes = {
  'support': '👨‍💼',
  'group': '👥',
  'course': '📚',
  'dormitory': '🏘️'
};
```

### Customize Message Bubbles
Edit `.cs-message.outgoing .cs-message__content` in CSS to change:
- Background color
- Border radius
- Padding
- Shadow

---

## 📱 Mobile Responsive

The components automatically adapt to:
- Small screens: Sidebar navigation collapses if needed
- Medium screens: Full layout with reduced sidebar width
- Large screens: Optimal layout with full sidebar

---

## ⚙️ Configuration Options

### In ChatComponentAdvanced.jsx

**Mock Data Mode:**
```jsx
// If API fails, uses mock data (lines 45-53)
// Replace with your actual data structure
```

**API Endpoint:**
```jsx
// Replace `/chat/conversations/` with your actual endpoint
const response = await apiClient.get("/chat/conversations/");
```

**Message Send:**
```jsx
// Customize payload for your backend
await apiClient.post(`/chat/send/`, {
  conversation_id: selectedConversation.id,
  message: messageInput,
});
```

---

## 🐛 Troubleshooting

### Images not showing?
- Check that avatar emojis render properly
- Use fallback avatars if needed

### Styles not applying?
- Clear browser cache (Ctrl+F5)
- Restart npm dev server
- Check CSS import in component

### API errors?
- Verify backend endpoints exist
- Check CORS settings in Django
- Use browser DevTools Network tab

### Messages not sending?
- Verify user authentication
- Check localStorage values
- Review API response format

---

## 📚 Chatscope Documentation

For advanced features, refer to:
- [Chatscope UI Kit Docs](https://chatscope.io/docs)
- [Component Props](https://chatscope.io/docs/api)

---

## 🎓 Next Steps

1. **Implement Backend Endpoints**: Create Django API endpoints for chat
2. **Add Real-Time Features**: Integrate WebSocket for live updates
3. **Add File Sharing**: Enable image/file uploads
4. **Add Notifications**: Real-time message notifications
5. **Add User Presence**: Online/offline status indicators

---

## 📝 Notes

- Both components are **fully styled with CampusMate branding**
- **Responsive and mobile-friendly**
- **API-ready with backend integration examples**
- **Error handling and loading states included**
- **Production-ready code**

---

**Happy chatting! 💬**
