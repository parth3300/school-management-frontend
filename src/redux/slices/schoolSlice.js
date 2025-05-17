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
// Define custom thunks at top-level
export const uploadLogo = createAsyncThunk(
  'school/uploadLogo',
  async ({ schoolId, file }) => {
    const formData = new FormData();
    formData.append('logo', file);
    const response = await api.post(schoolEndpoints.uploadLogo(schoolId), formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.logoUrl;
  }
);


export const fetchStats = createAsyncThunk(
  'school/fetchStats',
  async () => {
    const response = await api.get(API_ENDPOINTS.school.getStats);
    return response.data;
  }
);

const { reducer, actions } = createApiSlice({
  name: 'school',
  api,
  endpoints: {
    getAll: API_ENDPOINTS.school.getAll,
    get: API_ENDPOINTS.school.get,
    create: API_ENDPOINTS.school.create,
    update: API_ENDPOINTS.school.update
  },
  initialState: {
    data: null,
    stats: {
      totalStudents: 0,
      totalTeachers: 0,
      totalClasses: 0
    },
    logoUploading: false
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadLogo.pending, (state) => {
        state.logoUploading = true;
      })
      .addCase(uploadLogo.fulfilled, (state, action) => {
        state.logoUploading = false;
        // Proper immutable update
        if (state.data) {
          state.data = state.data.map(school => 
            school.id === action.meta.arg.schoolId 
              ? { ...school, logoUrl: action.payload }
              : school
          );
        }
      })
      .addCase(uploadLogo.rejected, (state, action) => {
        state.logoUploading = false;
        state.error = action.error.message;
      })
      .addCase(fetchStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});
export const { 
  fetch: fetchSchools, 
  create: createSchool, 
  update: updateSchool,
  reset 
} = actions;


export const selectSchool = (state) => state.school.data;
export const selectSchoolStats = (state) => state.school.stats;
export const selectLogoUploading = (state) => state.school.logoUploading;

export default reducer;
