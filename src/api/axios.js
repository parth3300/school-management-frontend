import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/school_management/', // Your Django backend URL
});

// const api = axios.create({
//   baseURL: 'https://school-management-backend-pd.vercel.app/', // Your Django backend URL
// });

// Request interceptor for adding the JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `JWT ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Check current pathname
      const currentPath = window.location.pathname;

      // Prevent redirect if already on login or register page
      const isAuthPage = ['/login', '/register'].includes(currentPath);

      if (!isAuthPage) {
        localStorage.removeItem('access_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;