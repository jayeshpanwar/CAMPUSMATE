import axios from 'axios';

// Create an axios instance with the correct base URL for your Django API
const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
});

// This "interceptor" automatically attaches your login token to every
// request you make to the backend after you've logged in.
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
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

// Handles login for all roles (student, faculty, admin)
// Expects an object like { email: "...", password: "..." }
export const loginUser = (credentials) => {
  return apiClient.post('/login/', credentials);
};

// --- REGISTRATION CALLS ---

// Handles student signup
export const registerStudent = (userData) => {
  return apiClient.post('/register/student/', userData);
};

// Handles faculty signup
export const registerFaculty = (userData) => {
  return apiClient.post('/register/faculty/', userData);
};

// Handles admin signup
export const registerAdmin = (userData) => {
  return apiClient.post('/register/admin/', userData);
};


// --- PROTECTED DATA CALLS ---

// Fetches the profile of the currently logged-in user
export const getProfile = () => {
    return apiClient.get('/profile/');
};