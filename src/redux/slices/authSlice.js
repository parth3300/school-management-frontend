import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import API_ENDPOINTS from '../../api/endpoints';

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {

      const profileEndpoint = userData.user_type === 'teacher' 
        ? API_ENDPOINTS.teachers 
        : API_ENDPOINTS.students;

      const user = {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        first_name: userData.first_name,
        last_name: userData.last_name
      }
      const profileData = {
        ...(userData.user_type === 'teacher' ? {
          user,
          phone: userData.phone,
          address: userData.address,
          date_of_birth: userData.date_of_birth,
          joining_date: userData.joining_date,
          qualification: userData.qualification,
        } : {
          user,
          current_class_id: userData.current_class,
          date_of_birth: userData.date_of_birth,
          gender: userData.gender,
          address: userData.address,
          phone: userData.phone,
          parent_name: userData.parent_name,
          parent_phone: userData.parent_phone,
          admission_date: new Date().toISOString().split('T')[0],
        })
      };

      const profileResponse = await api.post(profileEndpoint, profileData);

      return {
        profile: profileResponse.data
      };
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Registration failed');
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      console.log("Attempting login with credentials:", credentials);
      
      // First try the standard login endpoint
      try {
        const response = await api.post(API_ENDPOINTS.auth.login, credentials);
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        
        const userResponse = await api.get('/auth/user/');
        return userResponse.data;
      } catch (firstError) {
        console.log("Standard login failed, trying custom endpoint:", firstError);
        
        // If standard login fails, try the custom endpoint
        try {
          const response = await api.post(API_ENDPOINTS.auth.custom, credentials);
          localStorage.setItem('access_token', response.data.access);
          localStorage.setItem('refresh_token', response.data.refresh);
          
          const userResponse = await api.get('/auth/user/');
          return userResponse.data;
        } catch (secondError) {
          console.log("Custom login also failed:", secondError);
          
          // Both endpoints failed, construct detailed error message
          const firstErrorMsg = firstError.response?.data?.detail || 
                              firstError.message || 
                              'Standard login endpoint failed';
          const secondErrorMsg = secondError.response?.data?.detail || 
                               secondError.message || 
                               'Custom login endpoint failed';
          
          const combinedError = {
            message: 'Both login endpoints failed',
            details: {
              standardEndpoint: API_ENDPOINTS.auth.login,
              standardError: firstErrorMsg,
              customEndpoint: API_ENDPOINTS.auth.custom,
              customError: secondErrorMsg
            }
          };
          
          return rejectWithValue(combinedError);
        }
      }
    } catch (err) {
      // Catch any unexpected errors
      console.error("Unexpected error during login:", err);
      return rejectWithValue({
        message: 'Login process failed',
        error: err.message || 'Unknown error occurred'
      });
    }
  }
);


const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export const selectAuth = (state) => state.auth;
export default authSlice.reducer;