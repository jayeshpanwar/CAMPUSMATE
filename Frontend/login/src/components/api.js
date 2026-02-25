import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  timeout: 5000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Separate client for public endpoints (no auth required)
const publicApiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  timeout: 5000,
});


// --- AUTHENTICATION CALLS ---

export const loginUser = (credentials) => {
  return publicApiClient.post('login/', credentials);
};

// Calls /api/register/faculty/
export const registerFaculty = (userData) => {
  return publicApiClient.post('register/faculty/', userData);
};

// Calls /api/register/admin/
export const registerAdmin = (userData) => {
  return publicApiClient.post('register/admin/', userData);
};

// Calls /api/register/student/
export const registerStudent = (userData) => {
  return publicApiClient.post('register/student/', userData);
};

// --- VERIFICATION CALLS (Public endpoints - no auth required) ---

export const initiateStudentVerification = (payload) => {
  return publicApiClient.post('verify/student/initiate/', payload);
};

export const confirmStudentVerification = (payload) => {
  return publicApiClient.post('verify/student/confirm/', payload);
};


// --- PROTECTED DATA CALLS ---

export const getProfile = () => {
    return apiClient.get('profile/');
};

// --- CHAT CALLS (Centralized group messaging) ---

// Get all chat groups for current user
export const getChatGroups = () => {
  return apiClient.get('chat/groups/');
};

// Get specific group details and messages
export const getChatGroup = (groupId) => {
  return apiClient.get(`chat/groups/${groupId}/`);
};

// Get messages in a group
export const getGroupMessages = (groupId) => {
  return apiClient.get(`chat/groups/${groupId}/messages/`);
};

// Send message to a group
export const sendGroupMessage = (groupId, content) => {
  return apiClient.post(`chat/groups/${groupId}/send_message/`, { content });
};

// Create a new chat group
export const createChatGroup = (name, description = '') => {
  return apiClient.post('chat/groups/', { name, description });
};

// Add member to group
export const addGroupMember = (groupId, userEmail) => {
  return apiClient.post(`chat/groups/${groupId}/add_member/`, { user_email: userEmail });
};

// Remove member from group
export const removeGroupMember = (groupId, userId) => {
  return apiClient.post(`chat/groups/${groupId}/remove_member/`, { user_id: userId });
};

export default apiClient;