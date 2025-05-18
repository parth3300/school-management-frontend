import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import API_ENDPOINTS from '../../api/endpoints';
import { capitalizeFirst } from '../../components/common/constants';


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
        re_password: userData.re_password
      };

      await api.post(API_ENDPOINTS.auth.register, payload);
      
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);


export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      // Step 1: Get JWT tokens
      console.log(credentials);
      
      const tokenResponse = await api.post(API_ENDPOINTS.auth.jwt_create, {
        email: credentials.email,
        password: credentials.password
      });

      const { access, refresh } = tokenResponse.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      // Step 2: Get user details
      const userResponse = await api.get(API_ENDPOINTS.auth.login, {
        headers: {
          Authorization: `JWT ${access}`
        }
      });

      return {
        access,
        refresh,
        user: userResponse.data
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

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const refresh = localStorage.getItem('refresh_token');
      if (!refresh) {
        throw new Error('No refresh token available');
      }

      const response = await api.post(API_ENDPOINTS.auth.jwt_refresh, { refresh });
      const newAccessToken = response.data.access;
      localStorage.setItem('access_token', newAccessToken);

      // Fetch user details with new token
      const userResponse = await api.get(API_ENDPOINTS.auth.login, {
        headers: {
          Authorization: `JWT ${newAccessToken}`
        }
      });

      return {
        access: newAccessToken,
        user: userResponse.data
      };

    } catch (err) {
      return rejectWithValue(formatAuthErrors(err.response?.data || { 
        non_field_errors: ['Session expired. Please login again.'] 
      }));
    }
  }
);

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
      state.error = null;
    },
    resetRegistrationStatus(state) {
      state.registrationSuccess = false;
    },
    setAuthenticated(state, action) {
      state.isAuthenticated = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Registration cases
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.registrationSuccess = false;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
        state.registrationSuccess = true;
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(register.rejected, (state, action) => {        
        state.loading = false;
        state.registrationSuccess = false;
        state.error = action.payload.response.data;
      })
      
      // Login cases
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        
        state.loading = false;
        state.error = action.payload;
      })
      
      // Token refresh cases
      .addCase(refreshToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // Note: We don't automatically set isAuthenticated to false here
        // Let the protected routes handle the redirect logic
      });
  },
});

export const { 
  logout, 
  clearAuthError, 
  resetRegistrationStatus,
  setAuthenticated
} = authSlice.actions;
export const selectAuth = (state) => state.auth;
export default authSlice.reducer;