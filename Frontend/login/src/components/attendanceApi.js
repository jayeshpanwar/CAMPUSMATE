import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/attendance';

const attendanceApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
attendanceApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
};

export const sessionApi = {
  // Get all sessions
  getAllSessions: () => attendanceApi.get('/sessions/'),
  
  // Get sessions for a course
  getCourseSessions: (courseId) => 
    attendanceApi.get('/sessions/', { params: { course: courseId } }),
  
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
    attendanceApi.post(`/sessions/${sessionId}/mark_attendance/`, { attendance: attendanceData }),
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
