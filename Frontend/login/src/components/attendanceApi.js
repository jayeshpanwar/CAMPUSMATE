import axios from 'axios';

const API_ROOT_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api').replace(/\/$/, '');
const API_BASE_URL = `${API_ROOT_URL}/attendance`;

const getAccessToken = () =>
  localStorage.getItem('access_token') ||
  localStorage.getItem('accessToken') ||
  localStorage.getItem('token');

const getRefreshToken = () =>
  localStorage.getItem('refresh_token') ||
  localStorage.getItem('refreshToken');

const clearAuthStorage = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

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

const attendanceApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const publicApiClient = axios.create({
  baseURL: `${API_ROOT_URL}/`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
attendanceApi.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
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

attendanceApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error?.response?.status;

    if (!originalRequest || status !== 401 || originalRequest._retry) {
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
      return attendanceApi(originalRequest);
    } catch (refreshError) {
      clearAuthStorage();
      return Promise.reject(refreshError);
    }
  }
);

export const courseApi = {
  // Get all courses
  getAllCourses: () => attendanceApi.get('/courses/'),
  
  // Get my courses (for faculty) or enrolled courses (for students)
  // Backend filters automatically based on user role
  getMyCourses: () => attendanceApi.get('/courses/'),
  
  // Alias for clarity
  getEnrolledCourses: () => attendanceApi.get('/courses/'),
  
  // Create a new course
  createCourse: (courseData) => attendanceApi.post('/courses/', courseData),
  
  // Get course details
  getCourseDetail: (courseId) => attendanceApi.get(`/courses/${courseId}/`),
  
  // Update course
  updateCourse: (courseId, courseData) => attendanceApi.patch(`/courses/${courseId}/`, courseData),
  
  // Delete course
  deleteCourse: (courseId) => attendanceApi.delete(`/courses/${courseId}/`),
  
  // Add students to course
  addStudents: (courseId, studentIds) => 
    attendanceApi.post(`/courses/${courseId}/add_students/`, { student_ids: studentIds }),
  
  // Get enrolled students
  getEnrolledStudents: (courseId) => 
    attendanceApi.get(`/courses/${courseId}/enrolled_students/`),

  // Get students that can still be enrolled in course
  getAvailableStudents: (courseId, query = '') =>
    attendanceApi.get(`/courses/${courseId}/available_students/`, {
      params: query ? { q: query } : {},
    }),
};

export const sessionApi = {
  // Get all sessions
  getAllSessions: () => attendanceApi.get('/sessions/'),
  
  // Get sessions for a course
  getCourseSessions: (courseId) => 
    attendanceApi.get('/sessions/', { params: { course_id: courseId } }),
  
  // Create a new session
  createSession: (sessionData) => attendanceApi.post('/sessions/', sessionData),
  
  // Get session details
  getSessionDetail: (sessionId) => attendanceApi.get(`/sessions/${sessionId}/`),
  
  // Update session
  updateSession: (sessionId, sessionData) => attendanceApi.patch(`/sessions/${sessionId}/`, sessionData),
  
  // Get attendance records for session
  getSessionAttendance: (sessionId) => 
    attendanceApi.get(`/sessions/${sessionId}/attendance_records/`),
  
  // Mark attendance for multiple students
  markAttendance: (sessionId, attendanceData) => 
    attendanceApi.post(`/sessions/${sessionId}/mark_attendance_batch/`, { attendance: attendanceData }),
};

export const recordApi = {
  // Get all records
  getAllRecords: () => attendanceApi.get('/records/'),
  
  // Get my attendance
  getMyAttendance: (courseId = null) => {
    const params = courseId ? { course_id: courseId } : {};
    return attendanceApi.get('/records/my_attendance/', { params });
  },
  
  // Get course attendance
  getCourseAttendance: (courseId) => 
    attendanceApi.get('/records/course_attendance/', { params: { course_id: courseId } }),
  
  // Manually mark or update attendance
  manualMark: (recordId, markData) => 
    attendanceApi.patch(`/records/${recordId}/manual_mark/`, markData),
};

export const profileApi = {
  // Get my face profile
  getMyProfile: () => attendanceApi.get('/profiles/my_profile/'),
  
  // Update profile photo
  uploadProfilePhoto: (formData) => 
    attendanceApi.post('/profiles/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  // Get all profiles (for faculty)
  getAllProfiles: () => attendanceApi.get('/profiles/'),
  
  // Get profile by student id
  getProfileById: (profileId) => attendanceApi.get(`/profiles/${profileId}/`),
};

export const logApi = {
  // Get attendance logs
  getLogs: (pageSize = 20) => attendanceApi.get('/logs/', { params: { page_size: pageSize } }),
};

export default attendanceApi;
