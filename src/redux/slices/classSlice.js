// src/redux/slices/classSlice.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import API_ENDPOINTS from '../../api/endpoints';
import { createApiSlice } from '../../utils/sliceHelpers';

const classEndpoints = {
  getAll: API_ENDPOINTS.classes.getAll,
  get: API_ENDPOINTS.classes.get,
  create: API_ENDPOINTS.classes.create,
  update: (id) => API_ENDPOINTS.classes.update(id),
  delete: (id) => API_ENDPOINTS.classes.delete(id),
  getStudents: (classId) => API_ENDPOINTS.classes.getStudents(classId)
};

// Custom thunk for getting students in a class
export const fetchClassStudents = createAsyncThunk(
  'classes/fetchStudents',
  async (classId, { rejectWithValue }) => {
    try {
      const response = await api.get(classEndpoints.getStudents(classId));
      return { classId, students: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const { reducer, actions } = createApiSlice({
  name: 'classes',
  api,
  endpoints: classEndpoints,
  initialState: {
    data: [], // Default data from createApiSlice
    currentClassStudents: [],
    loading: false,
    error: null
  },
  extraReducers: (builder) => {

    builder
      .addCase(fetchClassStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClassStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.currentClassStudents = action.payload.students;
      })
      .addCase(fetchClassStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });

    return {
      ...actions,
      fetchStudents: fetchClassStudents
    };
  }
});

// Selectors
export const selectClasses = (state) => state.classes.data || [];
export const selectActiveClasses = (state) =>
  (state.classes.data || []).filter(cls => !cls.isArchived);
export const selectArchivedClasses = (state) =>
  (state.classes.data || []).filter(cls => cls.isArchived);
export const selectCurrentClassStudents = (state) => state.classes.currentClassStudents;
export const selectClassesLoading = (state) => state.classes.loading;
export const selectClassesError = (state) => state.classes.error;

// Actions
export const {
  fetch: fetchClasses,
  create: createClass,
  update: updateClass,
  delete: deleteClass,
  reset
} = actions;

export default reducer;
