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


// --- AUTHENTICATION CALLS ---

export const loginUser = (credentials) => {
  return apiClient.post('login/', credentials);
};

// Calls /api/register/faculty/
export const registerFaculty = (userData) => {
  return apiClient.post('register/faculty/', userData);
};

// Calls /api/register/admin/
export const registerAdmin = (userData) => {
  return apiClient.post('register/admin/', userData);
};

// --- VERIFICATION CALLS ---

export const initiateStudentVerification = (payload) => {
  return apiClient.post('verify/student/initiate/', payload);
};

export const confirmStudentVerification = (payload) => {
  return apiClient.post('verify/student/confirm/', payload);
};


// --- PROTECTED DATA CALLS ---

export const getProfile = () => {
    return apiClient.get('profile/');
};

export default apiClient;