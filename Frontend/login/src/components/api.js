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

// --- REGISTRATION CALLS (DEFINITIVE FIX) ---
// These functions now target the exact paths defined in your Django urls.py.

// Calls /api/register/student/
export const registerStudent = (userData) => {
  return apiClient.post('register/student/', userData); 
};

// Calls /api/register/faculty/
export const registerFaculty = (userData) => {
  return apiClient.post('register/faculty/', userData);
};

// Calls /api/register/admin/
export const registerAdmin = (userData) => {
  return apiClient.post('register/admin/', userData);
};


// --- PROTECTED DATA CALLS ---

export const getProfile = () => {
    return apiClient.get('profile/');
};

export default apiClient;