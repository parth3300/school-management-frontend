import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import API_ENDPOINTS from '../../api/endpoints';
import { capitalizeFirst } from '../../components/common/constants';
import { baseURL } from '../../api/axios';
import axios from 'axios';

// Helper function to format auth errors
const formatAuthErrors = (errorData) => {
  if (errorData.detail) {
    return { non_field_errors: [errorData.detail] };
  }
  if (errorData.non_field_errors) {
    return errorData;
  }
  
  const formattedErrors = {};
  Object.entries(errorData).forEach(([field, errors]) => {
    formattedErrors[field] = Array.isArray(errors) ? errors : [errors];
  });
  
  return formattedErrors;
};

// REGISTER thunk
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const role = localStorage.getItem('role') || 'Visitor';
      const capitalizedRole = capitalizeFirst(role);

      const payload = {
        role: capitalizedRole,
        email: userData.email,
        name: userData.name,
        password: userData.password,
        school: localStorage.getItem('school_id')

      };

      const response = await axios.post(baseURL + API_ENDPOINTS.auth.register, payload);
      console.log('Register API success:', response.data);
      return response.data;  
    } catch (err) {
      console.log('Register API error:', err.response?.data || err.message);
      if (err.response && err.response.data) {
        return rejectWithValue(formatAuthErrors(err.response.data));
      }
      return rejectWithValue({ detail: 'Registration failed. Please try again.' });
    }
  }
);

// LOGIN thunk
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    console.log('login thunk started');
    try {
      console.log('Sending login request with:', credentials);

      const tokenResponse = await axios.post(baseURL + API_ENDPOINTS.auth.jwt_create, {
        email: credentials.email,
        password: credentials.password,
        role: credentials.user_type,
        school: localStorage.getItem('school_id')
      });
      console.log('Login response:', tokenResponse);

      // Example manual error check here:
      if (tokenResponse.data.detail) {
        console.log('Login error detail found:', tokenResponse.data.detail);
        return rejectWithValue({ non_field_errors: [tokenResponse.data.detail] });
      }

      const { access, refresh } = tokenResponse.data;
      console.log('Got tokens:', access, refresh);

      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      const userResponse = await axios.get(baseURL + API_ENDPOINTS.auth.login, {
        headers: { Authorization: `JWT ${access}` },
      });
      console.log('User info:', userResponse.data);

      return {
        access,
        refresh,
        user: userResponse.data,
      };
    } catch (err) {
      console.error("Login error:", err);
      if (err.response?.data) {
        return rejectWithValue(formatAuthErrors(err.response.data));
      }
      return rejectWithValue({ 
        non_field_errors: ['Login failed. Please try again.'] 
      });
    }
  }
);


// REFRESH TOKEN thunk
export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const refresh = localStorage.getItem('refresh_token');
      if (!refresh) throw new Error('No refresh token available');

      const response = await axios.post(baseURL + API_ENDPOINTS.auth.jwt_refresh, { refresh });
      const newAccessToken = response.data.access;
      localStorage.setItem('access_token', newAccessToken);

      const userResponse = await api.get(API_ENDPOINTS.auth.login, {
        headers: { Authorization: `JWT ${newAccessToken}` },
      });

      console.log('Refresh Token API success:', userResponse.data);
      return {
        access: newAccessToken,
        user: userResponse.data,
      };
    } catch (err) {
      console.log('Refresh Token API error:', err.response?.data || err.message);
      return rejectWithValue(
        formatAuthErrors(err.response?.data || { non_field_errors: ['Session expired. Please login again.'] })
      );
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  registrationSuccess: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      console.log('Reducer: logout');
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.registrationSuccess = false;
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      localStorage.removeItem('school_id');
    },
    clearAuthError(state) {
      console.log('Reducer: clearAuthError');
      state.error = null;
    },
    resetRegistrationStatus(state) {
      console.log('Reducer: resetRegistrationStatus');
      state.registrationSuccess = false;
    },
    setAuthenticated(state, action) {
      console.log('Reducer: setAuthenticated', action.payload);
      state.isAuthenticated = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // REGISTER cases
      .addCase(register.pending, (state) => {
        console.log('ExtraReducer: register.pending');
        state.loading = true;
        state.error = null;
        state.registrationSuccess = false;
      })
      .addCase(register.fulfilled, (state, action) => {
        console.log('ExtraReducer: register.fulfilled');
        state.loading = false;
        state.registrationSuccess = true;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        console.log('ExtraReducer: register.rejected', action.payload);
        state.loading = false;
        state.registrationSuccess = false;
        state.error = action.payload || { detail: 'Registration failed.' };
      })

      // LOGIN cases
      .addCase(login.pending, (state) => {
        console.log('ExtraReducer: login.pending');
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        console.log('ExtraReducer: login.fulfilled');
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        console.log('ExtraReducer: login.rejected', action.payload);
        state.loading = false;
        state.error = action.payload || { detail: 'Login failed.' };
      })

      // REFRESH TOKEN cases
      .addCase(refreshToken.pending, (state) => {
        console.log('ExtraReducer: refreshToken.pending');
        state.loading = true;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        console.log('ExtraReducer: refreshToken.fulfilled');
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(refreshToken.rejected, (state, action) => {
        console.log('ExtraReducer: refreshToken.rejected', action.payload);
        state.loading = false;
        state.error = action.payload || { detail: 'Session expired.' };
      });
  },
});

export const { logout, clearAuthError, resetRegistrationStatus, setAuthenticated } = authSlice.actions;

export const selectAuth = (state) => state.auth;

export default authSlice.reducer;
