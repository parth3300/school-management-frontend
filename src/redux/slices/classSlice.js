// src/redux/slices/classSlice.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import API_ENDPOINTS from '../../api/endpoints';
import { createApiSlice } from '../../utils/sliceHelpers';

const classEndpoints = {
  getAll: API_ENDPOINTS.classes.getAll,
  create: API_ENDPOINTS.classes.create,
  update: (id) => API_ENDPOINTS.classes.update(id),
  delete: (id) => API_ENDPOINTS.classes.delete(id),
  getStudents: (classId) => API_ENDPOINTS.classes.getStudents(classId)
};

const { reducer, actions } = createApiSlice({
  name: 'classes',
  api,
  endpoints: classEndpoints,
  initialState: {
    // Class-specific initial state
    activeClasses: [],
    archivedClasses: [],
    currentClassStudents: [] // For storing students of a specific class
  },
  extraReducers: (builder, { fetchThunk }) => {
    // Custom reducers for classes
    builder.addCase(fetchThunk.fulfilled, (state, action) => {
      // Separate active and archived classes
      state.activeClasses = action.payload.filter(cls => !cls.isArchived);
      state.archivedClasses = action.payload.filter(cls => cls.isArchived);
      state.data = action.payload; // Still keep all classes in data
    });

    // Additional thunk for getting students in a class
    const fetchClassStudents = createAsyncThunk(
      'classes/fetchStudents',
      async (classId) => {
        const response = await api.get(classEndpoints.getStudents(classId));
        return { classId, students: response.data };
      }
    );

    builder
      .addCase(fetchClassStudents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchClassStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.currentClassStudents = action.payload.students;
      })
      .addCase(fetchClassStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    return { ...actions, fetchStudents: fetchClassStudents };
  }
});

export const { 
  fetch: fetchClasses, 
  create: createClass, 
  update: updateClass, 
  delete: deleteClass,
  fetchStudents: fetchClassStudents,
  reset 
} = actions;

export default reducer;