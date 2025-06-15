// src/redux/slices/academicYearSlice.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import API_ENDPOINTS from '../../api/endpoints';
import { createApiSlice } from '../../utils/sliceHelpers';

// Define endpoints for academic years
const academicYearEndpoints = {
  getAll: API_ENDPOINTS.academicYears.getAll,
  get: API_ENDPOINTS.academicYears.get,
  create: API_ENDPOINTS.academicYears.create,
  update: (id) => API_ENDPOINTS.academicYears.update(id),
  delete: (id) => API_ENDPOINTS.academicYears.delete(id),
  active: API_ENDPOINTS.academicYears.active, // e.g., /api/academic-years/active/
};

// Optional custom thunk for fetching active academic year
export const fetchActiveAcademicYear = createAsyncThunk(
  'academicYears/fetchActive',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(academicYearEndpoints.active);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create the slice using helper
const { reducer, actions } = createApiSlice({
  name: 'academicYears',
  api,
  endpoints: academicYearEndpoints,
  initialState: {
    data: [],
    activeAcademicYear: null,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActiveAcademicYear.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveAcademicYear.fulfilled, (state, action) => {
        state.loading = false;
        state.activeAcademicYear = action.payload;
      })
      .addCase(fetchActiveAcademicYear.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });

    return {
      ...actions,
      fetchActive: fetchActiveAcademicYear,
    };
  }
});

export const selectAllAcademicYears = (state) => state.academicYears.data || [];

export const selectActiveAcademicYear = (state) => state.academicYears.activeAcademicYear;

export const selectAcademicYearLoading = (state) => state.academicYears.loading;

export const selectAcademicYearError = (state) => state.academicYears.error;

export const {
  fetch: fetchAcademicYears,
  create: createAcademicYear,
  update: updateAcademicYear,
  delete: deleteAcademicYear,
  reset,
} = actions;

export default reducer;
