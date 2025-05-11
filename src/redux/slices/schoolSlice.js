// src/redux/slices/schoolSlice.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import API_ENDPOINTS from '../../api/endpoints';
import { createApiSlice } from '../../utils/sliceHelpers';

const schoolEndpoints = {
  getAll: API_ENDPOINTS.school.getAll,
  get: API_ENDPOINTS.school.get,
  create: API_ENDPOINTS.school.create,
  update: API_ENDPOINTS.school.update,
  uploadLogo: API_ENDPOINTS.school.uploadLogo,
  getStats: API_ENDPOINTS.school.getStats
};

const { reducer, actions } = createApiSlice({
  name: 'school',
  api,
  endpoints: schoolEndpoints,
  initialState: {
    // School-specific initial state
    data: null, // Single school object instead of array
    stats: {
      totalStudents: 0,
      totalTeachers: 0,
      totalClasses: 0
    },
    logoUploading: false
  },
  extraReducers: (builder) => {
    // Custom thunk for uploading school logo
    const uploadLogo = createAsyncThunk(
      'school/uploadLogo',
      async (file) => {
        const formData = new FormData();
        formData.append('logo', file);
        const response = await api.post(schoolEndpoints.uploadLogo, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        return response.data.logoUrl;
      }
    );

    // Custom thunk for fetching school stats
    const fetchStats = createAsyncThunk(
      'school/fetchStats',
      async () => {
        const response = await api.get(schoolEndpoints.getStats);
        return response.data;
      }
    );

    builder
      // Handle logo upload
      .addCase(uploadLogo.pending, (state) => {
        state.logoUploading = true;
      })
      .addCase(uploadLogo.fulfilled, (state, action) => {
        state.logoUploading = false;
        if (state.data) {
          state.data.logoUrl = action.payload;
        }
      })
      .addCase(uploadLogo.rejected, (state, action) => {
        state.logoUploading = false;
        state.error = action.error.message;
      })
      
      // Handle stats fetching
      .addCase(fetchStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });

    return { 
      ...actions, 
      uploadLogo, 
      fetchStats,
      // Override fetch since we use get instead of getAll
      fetch: createAsyncThunk(
        'school/fetch',
        async () => {
          const response = await api.get(schoolEndpoints.get);
          return response.data;
        }
      )
    };
  }
});

// Custom selectors
export const selectSchool = (state) => state.school.data;
export const selectSchoolStats = (state) => state.school.stats;
export const selectLogoUploading = (state) => state.school.logoUploading;

export const { 
  fetch: fetchSchools, 
  create: createSchool, 
  update: updateSchool,
  uploadLogo,
  fetchStats,
  reset 
} = actions;
console.log("schools",actions);

export default reducer;