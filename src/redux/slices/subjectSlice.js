import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import API_ENDPOINTS from '../../api/endpoints';
import { createApiSlice } from '../../utils/sliceHelpers';

const subjectEndpoints = {
  getAll: API_ENDPOINTS.subjects.getAll,
  create: API_ENDPOINTS.subjects.create,
  update: (id) => API_ENDPOINTS.subjects.update(id),
  delete: (id) => API_ENDPOINTS.subjects.delete(id),
  getTeachers: API_ENDPOINTS.subjects.teachers.bySubject,
  getClasses: API_ENDPOINTS.subjects.classes.base
};

// Custom thunk for fetching subject teachers
export const fetchSubjectTeachers = createAsyncThunk(
  'subjects/fetchTeachers',
  async (subjectId, { rejectWithValue }) => {
    try {
      const response = await api.get(subjectEndpoints.getTeachers.get, {
        params: { subject_id: subjectId }
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Custom thunk for fetching classes offering the subject
export const fetchSubjectClasses = createAsyncThunk(
  'subjects/fetchClasses',
  async (subjectId, { rejectWithValue }) => {
    try {
      const response = await api.get(subjectEndpoints.getClasses, {
        params: { subject_id: subjectId }
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Custom thunk for fetching subject curriculum
export const fetchSubjectCurriculum = createAsyncThunk(
  'subjects/fetchCurriculum',
  async (subjectId, { rejectWithValue }) => {
    try {
      const response = await api.get(`${subjectEndpoints.getAll}/${subjectId}/curriculum`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const initialState = {
  data: [],
  loading: false,
  error: null,
  subjectTeachers: [],
  subjectClasses: [],
  curriculum: [],
  teachersLoading: false,
  classesLoading: false,
  curriculumLoading: false,
  teachersError: null,
  classesError: null,
  curriculumError: null
};

const subjectSlice = createApiSlice({
  name: 'subjects',
  api,
  endpoints: subjectEndpoints,
  initialState,
  reducers: {
    // Add clearSubjectDetails reducer
    clearSubjectDetails: (state) => {
      state.subjectTeachers = [];
      state.subjectClasses = [];
      state.curriculum = [];
      state.teachersLoading = false;
      state.classesLoading = false;
      state.curriculumLoading = false;
      state.teachersError = null;
      state.classesError = null;
      state.curriculumError = null;
    }
  },
  extraReducers: (builder) => {
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
        state.teachersError = action.payload;
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
        state.classesError = action.payload;
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
        state.curriculumError = action.payload;
      });
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

// Export actions including the new clearSubjectDetails
export const { 
  fetch: fetchSubjects, 
  create: createSubject, 
  update: updateSubject, 
  delete: deleteSubject,
  reset
} = subjectSlice.actions;

export default subjectSlice.reducer;