import axios from 'axios';

const clearAuthStorage = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

const getAccessToken = () => localStorage.getItem('access_token') || localStorage.getItem('accessToken');
const getRefreshToken = () => localStorage.getItem('refresh_token') || localStorage.getItem('refreshToken');

const persistTokens = ({ access, refresh }) => {
  if (access) {
    localStorage.setItem('access_token', access);
    localStorage.setItem('accessToken', access);
  }
  if (refresh) {
    localStorage.setItem('refresh_token', refresh);
    localStorage.setItem('refreshToken', refresh);
  }
};

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  timeout: 5000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
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

let refreshPromise = null;

const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await publicApiClient.post('token/refresh/', {
    refresh: refreshToken,
  });

  persistTokens({
    access: response.data?.access,
    refresh: response.data?.refresh,
  });

  return response.data?.access;
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error?.response?.status;

    if (!originalRequest || status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (String(originalRequest.url || '').includes('token/refresh/')) {
      clearAuthStorage();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }

      const newAccessToken = await refreshPromise;
      if (!newAccessToken) {
        clearAuthStorage();
        return Promise.reject(error);
      }

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      clearAuthStorage();
      return Promise.reject(refreshError);
    }
  }
);


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

// --- NOTICE CALLS ---

export const getNotices = () => {
  return apiClient.get('notices/');
};

export const getFacultyNotices = () => {
  return apiClient.get('notices/faculty/');
};

export const createFacultyNotice = (payload) => {
  return apiClient.post('notices/faculty/', payload);
};

// --- NO-DUES CALLS ---

export const getNoDuesSubjects = (params = {}) => {
  return apiClient.get('no-dues/subjects/', { params });
};

export const createNoDuesSubject = (payload) => {
  return apiClient.post('no-dues/subjects/', payload);
};

export const getNoDuesApplications = () => {
  return apiClient.get('no-dues/applications/');
};

export const applyNoDues = (subjectId, remark = '') => {
  return apiClient.post('no-dues/applications/', { subject_id: subjectId, remark });
};

export const reviewNoDuesApplication = (applicationId, payload) => {
  return apiClient.patch(`no-dues/applications/${applicationId}/decision/`, payload);
};

export default apiClient;