// src/redux/slices/teacherSlice.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import API_ENDPOINTS from '../../api/endpoints';
import { createApiSlice } from '../../utils/sliceHelpers';

const teacherEndpoints = {
  getAll: API_ENDPOINTS.teachers.getAll,
  create: API_ENDPOINTS.teachers.create,
  update: (id) => API_ENDPOINTS.teachers.update(id),
  delete: (id) => API_ENDPOINTS.teachers.delete(id),
  getClasses: API_ENDPOINTS.teachers.classes.base // Add this line
};

// Custom thunk for fetching teacher's classes
export const fetchTeacherClasses = createAsyncThunk(
  'teachers/fetchClasses',
  async (teacherId, { rejectWithValue }) => {
    try {
      const response = await api.get(teacherEndpoints.getClasses, {
        params: { teacher_id: teacherId }
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const { reducer, actions } = createApiSlice({
  name: 'teachers',
  api,
  endpoints: teacherEndpoints,
  initialState: {
    // Teacher-specific initial state
    activeTeachers: 0,
    teacherClasses: [], // Add this for storing teacher's classes
    classesLoading: false, // Add loading state
    classesError: null // Add error state
  },
  extraReducers: (builder) => {

    builder
      // Handle teacher classes fetching
      .addCase(fetchTeacherClasses.pending, (state) => {
        state.classesLoading = true;
        state.classesError = null;
      })
      .addCase(fetchTeacherClasses.fulfilled, (state, action) => {
        state.classesLoading = false;
        state.teacherClasses = action.payload;
      })
      .addCase(fetchTeacherClasses.rejected, (state, action) => {
        state.classesLoading = false;
        state.classesError = action.payload || action.error.message;
      });

    return { 
      ...actions, 
      fetchTeacherClasses // Add the custom thunk to exported actions
    };
  }
});

// Selectors
export const selectTeacherClasses = (state) => state.teachers.teacherClasses;
export const selectCurrentTeacher = (state) => state.teachers.data;
export const selectClassesLoading = (state) => state.teachers.classesLoading;
export const selectClassesError = (state) => state.teachers.classesError;

export const { 
  fetch: fetchTeachers, 
  create: createTeacher, 
  update: updateTeacher, 
  delete: deleteTeacher
} = actions;

export default reducer;