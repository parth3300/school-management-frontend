// src/redux/slices/attendanceSlice.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import API_ENDPOINTS from '../../api/endpoints';
import { createApiSlice } from '../../utils/sliceHelpers';

const attendanceEndpoints = {
  getAll: API_ENDPOINTS.attendance.getAll,
  create: API_ENDPOINTS.attendance.create,
  update: (id) => API_ENDPOINTS.attendance.update(id),
  delete: (id) => API_ENDPOINTS.attendance.delete(id),
  getByDate: API_ENDPOINTS.attendance.getByDate,
  getByStudent: (studentId) => API_ENDPOINTS.attendance.getByStudent(studentId),
  bulkUpdate: API_ENDPOINTS.attendance.bulkUpdate
};

const { reducer, actions } = createApiSlice({
  name: 'attendance',
  api,
  endpoints: attendanceEndpoints,
  initialState: {
    // Attendance-specific initial state
    todayAttendance: [],
    studentAttendance: {},
    monthlyStats: {},
    bulkUpdating: false
  },
  extraReducers: (builder) => {
    // Custom thunk for fetching today's attendance
    const fetchTodayAttendance = createAsyncThunk(
      'attendance/fetchToday',
      async (date) => {
        const response = await api.get(attendanceEndpoints.getByDate, {
          params: { date }
        });
        return response.data;
      }
    );

    // Custom thunk for fetching student attendance
    const fetchStudentAttendance = createAsyncThunk(
      'attendance/fetchStudent',
      async (studentId) => {
        const response = await api.get(attendanceEndpoints.getByStudent(studentId));
        return { studentId, data: response.data };
      }
    );

    // Custom thunk for bulk attendance update
    const bulkUpdateAttendance = createAsyncThunk(
      'attendance/bulkUpdate',
      async ({ classId, date, records }) => {
        const response = await api.post(attendanceEndpoints.bulkUpdate, {
          classId,
          date,
          records
        });
        return response.data;
      }
    );

    // Custom thunk for monthly stats
    const fetchMonthlyStats = createAsyncThunk(
      'attendance/fetchMonthlyStats',
      async ({ month, year }) => {
        const response = await api.get(API_ENDPOINTS.attendance.monthlyStats, {
          params: { month, year }
        });
        return response.data;
      }
    );

    builder
      // Handle today's attendance
      .addCase(fetchTodayAttendance.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTodayAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.todayAttendance = action.payload;
      })
      .addCase(fetchTodayAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Handle student attendance
      .addCase(fetchStudentAttendance.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStudentAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.studentAttendance[action.payload.studentId] = action.payload.data;
      })
      
      // Handle bulk update
      .addCase(bulkUpdateAttendance.pending, (state) => {
        state.bulkUpdating = true;
      })
      .addCase(bulkUpdateAttendance.fulfilled, (state, action) => {
        state.bulkUpdating = false;
        // Update today's attendance with the new records
        state.todayAttendance = state.todayAttendance.map(record => {
          const updatedRecord = action.payload.find(r => r.id === record.id);
          return updatedRecord || record;
        });
      })
      .addCase(bulkUpdateAttendance.rejected, (state, action) => {
        state.bulkUpdating = false;
        state.error = action.error.message;
      })
      
      // Handle monthly stats
      .addCase(fetchMonthlyStats.fulfilled, (state, action) => {
        state.monthlyStats = action.payload;
      });

    return { 
      ...actions, 
      fetchToday: fetchTodayAttendance,
      fetchStudent: fetchStudentAttendance,
      bulkUpdate: bulkUpdateAttendance,
      fetchMonthlyStats
    };
  }
});

// Selectors
export const selectTodayAttendance = (state) => state.attendance.todayAttendance;
export const selectStudentAttendance = (studentId) => (state) => 
  state.attendance.studentAttendance[studentId] || [];
export const selectMonthlyStats = (state) => state.attendance.monthlyStats;
export const selectBulkUpdating = (state) => state.attendance.bulkUpdating;

export const { 
  fetch: fetchAttendance, 
  create: createAttendance, 
  update: updateAttendance,
  delete: deleteAttendance,
  fetchToday: fetchTodayAttendance,
  fetchStudent: fetchStudentAttendance,
  bulkUpdate: bulkUpdateAttendance,
  fetchMonthlyStats,
  reset 
} = actions;

export default reducer;