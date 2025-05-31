import axios from 'axios';
import { store } from '../redux/store'; // Your Redux store
import { logout, refreshToken } from '../redux/slices/authSlice';

export const baseURL = 'http://127.0.0.1:8000/school_management';
// const baseURL = 'https://school-management-backend-pd.vercel.app/school_management/';

const api = axios.create({
  baseURL: baseURL,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// ✅ Intercept Requests: Add token if not public
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');

    // Define public endpoints (no token needed)
    const publicEndpoints = [
      { url: '/schools/', method: 'get' },
      { url: '/schools', method: 'get' },
      { url: '/school/login', method: 'post' },
      { url: '/school/login/', method: 'post' },
    ];

    const isPublic = publicEndpoints.some(
      (endpoint) =>
        config.url.includes(endpoint.url) && config.method === endpoint.method
    );

    if (!isPublic && token) {
      config.headers.Authorization = `JWT ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Intercept Responses: Handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = 'JWT ' + token;
              resolve(api(originalRequest));
            },
            reject: (err) => reject(err),
          });
        });
      }

      isRefreshing = true;

      try {
        const result = await store.dispatch(refreshToken());

        if (refreshToken.fulfilled.match(result)) {
          const newToken = result.payload.access;
          localStorage.setItem('access_token', newToken);
          originalRequest.headers.Authorization = 'JWT ' + newToken;
          processQueue(null, newToken);
          return api(originalRequest);
        } else {
          store.dispatch(logout());
          processQueue(result.error, null);
          window.location.href = '/'; // Redirect to login/home
        }
      } catch (err) {
        store.dispatch(logout());
        processQueue(err, null);
        window.location.href = '/';
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
