/* ────────────────────────────────────────────────────────────────
   api.js — centralised Axios instance with token-refresh support
   (console-only version)
──────────────────────────────────────────────────────────────── */

import axios from 'axios';
import { store } from '../redux/store';
import { logout, refreshToken } from '../redux/slices/authSlice';

/* ----------------------------------------------------------------
 * 1. BASE CONFIGURATION
 * ---------------------------------------------------------------- */
export const baseURL = 'http://127.0.0.1:8000/school_management';
// export const baseURL = 'https://school-management-backend-pd.vercel.app/school_management/';

const api = axios.create({ baseURL });

/* ----------------------------------------------------------------
 * 2. TOKEN-REFRESH STATE
 * ---------------------------------------------------------------- */
let isRefreshing = false;
let failedQueue  = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else       prom.resolve(token);
  });
  failedQueue = [];
};

/* ----------------------------------------------------------------
 * 3. REQUEST INTERCEPTOR
 * ---------------------------------------------------------------- */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');

    // Public endpoints that don’t need auth
    const publicEndpoints = [
      { url: '/schools/',     method: 'get'  },
      { url: '/schools',      method: 'get'  },
      { url: '/school/login', method: 'post' },
      { url: '/school/login/',method: 'post' },
    ];

    const isPublic = publicEndpoints.some(
      (ep) => config.url.includes(ep.url) && config.method === ep.method
    );

    if (!isPublic && token) {
      config.headers.Authorization = `JWT ${token}`;
      console.log(`🔐 Added JWT to ${config.method.toUpperCase()} ${config.url}`);
    } else {
      console.log(`🌐 Public request: ${config.method.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error) => {
    console.error('❌ Request config error:', error);
    return Promise.reject(error);
  }
);

/* ----------------------------------------------------------------
 * 4. RESPONSE INTERCEPTOR
 * ---------------------------------------------------------------- */
api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.config.url} → ${response.status}`);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // ── Handle 401 (token expired) ───────────────────────────────
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      console.warn('⚠️ 401 received — attempting token refresh');
      originalRequest._retry = true;

      // If a refresh is already running, queue the request
      if (isRefreshing) {
        console.log('🔄 Refresh in progress; queuing request');
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `JWT ${token}`;
              resolve(api(originalRequest));
            },
            reject,
          });
        });
      }

      isRefreshing = true;

      try {
        const result = await store.dispatch(refreshToken());

        if (refreshToken.fulfilled.match(result)) {
          const newToken = result.payload.access;
          localStorage.setItem('access_token', newToken);
          console.log('🔄 Token refreshed successfully');

          originalRequest.headers.Authorization = `JWT ${newToken}`;
          processQueue(null, newToken);
          return api(originalRequest);
        } else {
          console.error('❌ Token refresh failed — logging out');
          store.dispatch(logout());
          processQueue(result.error, null);
          window.location.href = '/';
        }
      } catch (err) {
        console.error('❌ Token refresh error — logging out', err);
        store.dispatch(logout());
        processQueue(err, null);
        window.location.href = '/';
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    console.error(`❌ Response error ${error.response?.status}:`, error);
    return Promise.reject(error);
  }
);

export default api;
