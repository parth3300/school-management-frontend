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
  getSchedule: API_ENDPOINTS.exams.schedule.base // Only keeping schedule
};

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
  extraReducers: (builder) => {
    // Custom thunk for fetching exam schedule
    const fetchExamSchedule = createAsyncThunk(
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
      })
      .addCase(fetchExamSchedule.rejected, (state, action) => {
        state.scheduleLoading = false;
        state.scheduleError = action.payload || action.error.message;
      });

    return {
      ...actions,
      fetchExamSchedule
    };
  }
});

// Selectors
export const selectExamSchedule = (state) => state.exams.schedule;
export const selectUpcomingExams = (state) => state.exams.upcomingExams;
export const selectScheduleLoading = (state) => state.exams.scheduleLoading;
export const selectScheduleError = (state) => state.exams.scheduleError;

export const {
  fetch: fetchExams,
  create: createExam,
  update: updateExam,
  delete: deleteExam,
  fetchExamSchedule
} = actions;

export default reducer;
