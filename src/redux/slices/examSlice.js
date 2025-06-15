// src/redux/slices/examSlice.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import API_ENDPOINTS from '../../api/endpoints';
import { createApiSlice } from '../../utils/sliceHelpers';

const examEndpoints = {
  getAll: API_ENDPOINTS.exams.getAll,
  create: API_ENDPOINTS.exams.create,
  update: (id) => API_ENDPOINTS.exams.update(id),
  delete: (id) => API_ENDPOINTS.exams.delete(id),
  getSchedule: API_ENDPOINTS.exams.schedule.base
};

// Custom thunk for fetching exam schedule
export const fetchExamSchedule = createAsyncThunk(
  'exams/fetchSchedule',
  async ({ classId, dateRange }, { rejectWithValue }) => {
    try {
      const response = await api.get(examEndpoints.getSchedule, {
        params: {
          class_id: classId,
          ...dateRange
        }
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const { reducer, actions } = createApiSlice({
  name: 'exams',
  api,
  endpoints: examEndpoints,
  initialState: {
    activeExams: 0,
    upcomingExams: [],
    schedule: [],
    scheduleLoading: false,
    scheduleError: null
  },
  reducers: {
    // Add clearExamErrors reducer
    clearExamErrors: (state) => {
      state.error = null;
      state.scheduleError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle exam schedule fetching
      .addCase(fetchExamSchedule.pending, (state) => {
        state.scheduleLoading = true;
        state.scheduleError = null;
      })
      .addCase(fetchExamSchedule.fulfilled, (state, action) => {
        state.scheduleLoading = false;
        state.schedule = action.payload;
        state.upcomingExams = action.payload.filter(
          exam => new Date(exam.date) > new Date()
        );
        // Update active exams count
        state.activeExams = action.payload.filter(
          exam => new Date(exam.start_date) <= new Date() && 
                 new Date(exam.end_date) >= new Date()
        ).length;
      })
      .addCase(fetchExamSchedule.rejected, (state, action) => {
        state.scheduleLoading = false;
        state.scheduleError = action.payload || action.error.message;
      });

    // Add default CRUD operations from createApiSlice
    builder
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/fulfilled'),
        (state) => {
          state.loading = false;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = false;
          state.error = action.payload || action.error.message;
        }
      );
  }
});

// Selectors
export const selectExams = (state) => state.exams.data;
export const selectExamsLoading = (state) => state.exams.loading;
export const selectExamsError = (state) => state.exams.error;
export const selectExamSchedule = (state) => state.exams.schedule;
export const selectUpcomingExams = (state) => state.exams.upcomingExams;
export const selectActiveExams = (state) => state.exams.activeExams;
export const selectScheduleLoading = (state) => state.exams.scheduleLoading;
export const selectScheduleError = (state) => state.exams.scheduleError;

// Actions
export const { 
  fetch: fetchExams, 
  create: createExam, 
  update: updateExam, 
  delete: deleteExam,
  clearExamErrors 
} = actions;

export default reducer;