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
export const createChatGroup = (name, description = '', memberIds = [], memberEmails = []) => {
  return apiClient.post('chat/groups/', {
    name,
    description,
    member_ids: memberIds,
    member_emails: memberEmails,
  });
};

// Get users that can be invited while creating group
export const getAvailableChatUsers = (query = '') => {
  const encoded = encodeURIComponent(query);
  return apiClient.get(`chat/groups/available_users/?q=${encoded}`);
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

// --- MARKS & STUDY PLAN CALLS ---

/** Analyze mid-sem marks → returns analysis + draft study_plan_id */
export const analyzeMidSemMarks = (payload) =>
  apiClient.post('marks/analyze/', payload);

/** Generate Gemini study plan (pass study_plan_id or inline marks, optional weeks_count) */
export const generateStudyPlan = (payload) =>
  apiClient.post('marks/generate-study-plan/', payload);

/** List all study plans belonging to the current student */
export const getMyStudyPlans = () =>
  apiClient.get('marks/my-plans/');

/** Get a single study plan by id */
export const getStudyPlan = (id) =>
  apiClient.get(`marks/plan/${id}/`);

/** Delete a study plan */
export const deleteStudyPlan = (id) =>
  apiClient.delete(`marks/plan/${id}/`);

/** Toggle a task checkbox (task_key + completed boolean) */
export const updateTaskProgress = (planId, taskKey, completed) =>
  apiClient.patch(`marks/plan/${planId}/progress/`, { task_key: taskKey, completed });

/** Faculty: enter a student's marks */
export const enterStudentMarks = (payload) =>
  apiClient.post('marks/faculty/enter/', payload);

/** Faculty: bulk upload marks */
export const bulkEnterStudentMarks = (entries) =>
  apiClient.post('marks/faculty/bulk-enter/', { entries });

/** Faculty: list students for marks entry */
export const getFacultyStudents = () =>
  apiClient.get('marks/faculty/students/');

/** Student: retrieve their raw marks entries (optionally filter by semester) */
export const getMyMarks = (semester = '') =>
  apiClient.get('marks/my-marks/', { params: semester ? { semester } : {} });

// --- FACULTY AVAILABILITY & LEAVE CALLS ---

export const getMyFacultyAvailability = () =>
  apiClient.get('availability/my_availability/');

export const updateMyFacultyAvailability = (payload) =>
  apiClient.patch('availability/update_availability/', payload);

export const getAllFacultyAvailability = () =>
  apiClient.get('availability/all_faculty_availability/');

export const createLeaveRequest = (payload) =>
  apiClient.post('leave-requests/', payload);

export const getMyLeaveRequests = () =>
  apiClient.get('leave-requests/');

export const getActiveLeaveRequests = () =>
  apiClient.get('leave-requests/active_leaves/');

export default apiClient;