import axios from 'axios';
import {store} from '../redux/store'; // assuming you have the redux store setup
import { logout, refreshToken } from '../redux/slices/authSlice';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/school_management/', // Your Django backend URL
});

// Request interceptor for adding the JWT token
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('access_token');
//     if (token) {
//       config.headers.Authorization = `JWT ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// let isRefreshing = false;
// let failedQueue = [];

// const processQueue = (error, token = null) => {
//   failedQueue.forEach((prom) => {
//     if (error) {
//       prom.reject(error);
//     } else {
//       prom.resolve(token);
//     }
//   });

//   failedQueue = [];
// };

// // Response interceptor
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (
//       error.response &&
//       error.response.status === 401 &&
//       !originalRequest._retry
//     ) {
//       originalRequest._retry = true;

//       // If a request is already in progress to refresh the token
//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({
//             resolve: (token) => {
//               originalRequest.headers.Authorization = 'JWT ' + token;
//               resolve(api(originalRequest));
//             },
//             reject: (err) => {
//               reject(err);
//             },
//           });
//         });
//       }

//       isRefreshing = true;

//       try {
//         // Attempt to refresh the token
//         const result = await store.dispatch(refreshToken());

//         if (refreshToken.fulfilled.match(result)) {
//           const newToken = result.payload.access;
//           originalRequest.headers.Authorization = 'JWT ' + newToken;
//           localStorage.setItem('access_token', newToken); // Store new access token
//           processQueue(null, newToken); // Resolve failed requests with the new token
//           return api(originalRequest); // Retry the original request with the new token
//         } else {
          
//           // If refresh failed, logout user
//           store.dispatch(logout());
//           processQueue(result.error, null); // Reject all queued requests
//           window.location.href = '/login'; // Redirect to login
//         }
//       } catch (err) {
//         processQueue(err, null); // Reject all queued requests
//         store.dispatch(logout());
//         window.location.href = '/login'; // Redirect to login
//         return Promise.reject(err);
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     return Promise.reject(error);
//   }
// );

export default api;
