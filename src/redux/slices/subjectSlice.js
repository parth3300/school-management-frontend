// src/redux/slices/subjectSlice.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import API_ENDPOINTS from '../../api/endpoints';
import { createApiSlice } from '../../utils/sliceHelpers';

const subjectEndpoints = {
  getAll: API_ENDPOINTS.subjects.getAll,
  create: API_ENDPOINTS.subjects.create,
  update: (id) => API_ENDPOINTS.subjects.update(id),
  delete: (id) => API_ENDPOINTS.subjects.delete(id),
  getTeachers: API_ENDPOINTS.subjects.teachers.base, // For fetching subject teachers
  getClasses: API_ENDPOINTS.subjects.classes.base // For fetching classes offering the subject
};

const { reducer, actions } = createApiSlice({
  name: 'subjects',
  api,
  endpoints: subjectEndpoints,
  initialState: {
    // Subject-specific initial state
    activeSubjects: 0,
    subjectTeachers: [],
    subjectClasses: [],
    teachersLoading: false,
    classesLoading: false,
    teachersError: null,
    classesError: null,
    curriculum: [] // For subject curriculum/syllabus
  },
  extraReducers: (builder) => {
    // Custom thunk for fetching subject teachers
    const fetchSubjectTeachers = createAsyncThunk(
      'subjects/fetchTeachers',
      async (subjectId, { rejectWithValue }) => {
        try {
          const response = await api.get(subjectEndpoints.getTeachers, {
            params: { subject_id: subjectId }
          });
          return response.data;
        } catch (err) {
          return rejectWithValue(err.response.data);
        }
      }
    );

    // Custom thunk for fetching classes offering the subject
    const fetchSubjectClasses = createAsyncThunk(
      'subjects/fetchClasses',
      async (subjectId, { rejectWithValue }) => {
        try {
          const response = await api.get(subjectEndpoints.getClasses, {
            params: { subject_id: subjectId }
          });
          return response.data;
        } catch (err) {
          return rejectWithValue(err.response.data);
        }
      }
    );

    // Custom thunk for fetching subject curriculum
    const fetchSubjectCurriculum = createAsyncThunk(
      'subjects/fetchCurriculum',
      async (subjectId, { rejectWithValue }) => {
        try {
          const response = await api.get(`${subjectEndpoints.getAll}/${subjectId}/curriculum`);
          return response.data;
        } catch (err) {
          return rejectWithValue(err.response.data);
        }
      }
    );

    builder
      // Handle subject teachers fetching
      .addCase(fetchSubjectTeachers.pending, (state) => {
        state.teachersLoading = true;
        state.teachersError = null;
      })
      .addCase(fetchSubjectTeachers.fulfilled, (state, action) => {
        state.teachersLoading = false;
        state.subjectTeachers = action.payload;
      })
      .addCase(fetchSubjectTeachers.rejected, (state, action) => {
        state.teachersLoading = false;
        state.teachersError = action.payload || action.error.message;
      })
      
      // Handle subject classes fetching
      .addCase(fetchSubjectClasses.pending, (state) => {
        state.classesLoading = true;
        state.classesError = null;
      })
      .addCase(fetchSubjectClasses.fulfilled, (state, action) => {
        state.classesLoading = false;
        state.subjectClasses = action.payload;
      })
      .addCase(fetchSubjectClasses.rejected, (state, action) => {
        state.classesLoading = false;
        state.classesError = action.payload || action.error.message;
      })
      
      // Handle subject curriculum fetching
      .addCase(fetchSubjectCurriculum.pending, (state) => {
        state.curriculumLoading = true;
        state.curriculumError = null;
      })
      .addCase(fetchSubjectCurriculum.fulfilled, (state, action) => {
        state.curriculumLoading = false;
        state.curriculum = action.payload;
      })
      .addCase(fetchSubjectCurriculum.rejected, (state, action) => {
        state.curriculumLoading = false;
        state.curriculumError = action.payload || action.error.message;
      });

    return { 
      ...actions, 
      fetchSubjectTeachers,
      fetchSubjectClasses,
      fetchSubjectCurriculum
    };
  }
});

// Selectors
export const selectSubjectTeachers = (state) => state.subjects.subjectTeachers;
export const selectSubjectClasses = (state) => state.subjects.subjectClasses;
export const selectSubjectCurriculum = (state) => state.subjects.curriculum;
export const selectTeachersLoading = (state) => state.subjects.teachersLoading;
export const selectClassesLoading = (state) => state.subjects.classesLoading;
export const selectCurriculumLoading = (state) => state.subjects.curriculumLoading;
export const selectTeachersError = (state) => state.subjects.teachersError;
export const selectClassesError = (state) => state.subjects.classesError;
export const selectCurriculumError = (state) => state.subjects.curriculumError;

export const { 
  fetch: fetchSubjects, 
  create: createSubject, 
  update: updateSubject, 
  delete: deleteSubject,
  fetchSubjectTeachers,
  fetchSubjectClasses,
  fetchSubjectCurriculum
} = actions;

export default reducer;