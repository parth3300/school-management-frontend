import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import API_ENDPOINTS from '../../api/endpoints';

// Thunk to fetch exam schedule
export const fetchExamSchedule = createAsyncThunk(
  'examSchedule/fetch',
  async ({ classId, dateRange }, { rejectWithValue }) => {
    try {
      const response = await api.get(API_ENDPOINTS.exams.schedule.base, {
        params: {
          class_id: classId,
          ...dateRange
        }
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const examScheduleSlice = createSlice({
  name: 'examSchedule',
  initialState: {
    schedule: [],
    upcomingExams: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExamSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExamSchedule.fulfilled, (state, action) => {
        state.loading = false;
        state.schedule = action.payload;
        state.upcomingExams = action.payload.filter(
          exam => new Date(exam.date) > new Date()
        );
      })
      .addCase(fetchExamSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  }
});

// Selectors
export const selectExamSchedule = (state) => state.examSchedule.schedule;
export const selectUpcomingExams = (state) => state.examSchedule.upcomingExams;
export const selectScheduleLoading = (state) => state.examSchedule.loading;
export const selectScheduleError = (state) => state.examSchedule.error;

export default examScheduleSlice.reducer;
