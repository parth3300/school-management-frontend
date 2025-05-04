// src/redux/slices/examResultsSlice.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import API_ENDPOINTS from '../../api/endpoints';
import { createApiSlice } from '../../utils/sliceHelpers';

const examResultsEndpoints = {
  getAll: API_ENDPOINTS.examResults.getAll,
  create: API_ENDPOINTS.examResults.create,
  update: (id) => API_ENDPOINTS.examResults.update(id),
  delete: (id) => API_ENDPOINTS.examResults.delete(id),
  getSummary: API_ENDPOINTS.examResults.summary, // Added summary endpoint
  getByClass: API_ENDPOINTS.teacher.examResults.byClass // Added byClass endpoint
};

const { reducer, actions } = createApiSlice({
  name: 'examResults',
  api,
  endpoints: examResultsEndpoints,
  initialState: {
    // Exam results specific state
    summary: null,
    classResults: {},
    loadingSummary: false,
    summaryError: null,
    loadingClassResults: false,
    classResultsError: null
  },
  extraReducers: (builder) => {
    // Custom thunk for fetching exam results summary
    const fetchExamResultsSummary = createAsyncThunk(
      'examResults/fetchSummary',
      async ({ examId, classId }, { rejectWithValue }) => {
        try {
          const response = await api.get(examResultsEndpoints.getSummary, {
            params: { exam_id: examId, class_id: classId }
          });
          return response.data;
        } catch (err) {
          return rejectWithValue(err.response?.data || err.message);
        }
      }
    );

    // Custom thunk for fetching exam results by class
    const fetchExamResultsByClass = createAsyncThunk(
      'examResults/fetchByClass',
      async (classId, { rejectWithValue }) => {
        try {
          const response = await api.get(examResultsEndpoints.getByClass, {
            params: { class_id: classId }
          });
          return { classId, data: response.data };
        } catch (err) {
          return rejectWithValue(err.response?.data || err.message);
        }
      }
    );

    builder
      // Handle exam results summary
      .addCase(fetchExamResultsSummary.pending, (state) => {
        state.loadingSummary = true;
        state.summaryError = null;
      })
      .addCase(fetchExamResultsSummary.fulfilled, (state, action) => {
        state.loadingSummary = false;
        state.summary = action.payload;
      })
      .addCase(fetchExamResultsSummary.rejected, (state, action) => {
        state.loadingSummary = false;
        state.summaryError = action.payload;
      })
      
      // Handle exam results by class
      .addCase(fetchExamResultsByClass.pending, (state) => {
        state.loadingClassResults = true;
        state.classResultsError = null;
      })
      .addCase(fetchExamResultsByClass.fulfilled, (state, action) => {
        state.loadingClassResults = false;
        state.classResults[action.payload.classId] = action.payload.data;
      })
      .addCase(fetchExamResultsByClass.rejected, (state, action) => {
        state.loadingClassResults = false;
        state.classResultsError = action.payload;
      });

    return { 
      ...actions,
      fetchExamResultsSummary,
      fetchExamResultsByClass
    };
  }
});

// Selectors
export const selectExamResultsSummary = (state) => state.examResults.summary;
export const selectSummaryLoading = (state) => state.examResults.loadingSummary;
export const selectSummaryError = (state) => state.examResults.summaryError;
export const selectClassResults = (classId) => (state) => 
  state.examResults.classResults[classId] || [];
export const selectClassResultsLoading = (state) => state.examResults.loadingClassResults;
export const selectClassResultsError = (state) => state.examResults.classResultsError;

export const { 
  fetch: fetchExamResults,
  create: createExamResult,
  update: updateExamResult,
  delete: deleteExamResult,
  fetchExamResultsSummary,
  fetchExamResultsByClass
} = actions;

export default reducer;