// src/redux/slices/studentSlice.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import API_ENDPOINTS from '../../api/endpoints';
import { createApiSlice } from '../../utils/sliceHelpers';

const studentEndpoints = {
  getAll: API_ENDPOINTS.students.getAll,
  create: API_ENDPOINTS.students.create,
  update: (id) => API_ENDPOINTS.students.update(id),
  delete: (id) => API_ENDPOINTS.students.delete(id),
  getCourses: API_ENDPOINTS.students.courses.base, // For fetching student's courses
  getAttendance: API_ENDPOINTS.students.attendance.base // For fetching student's attendance
};

const { reducer, actions } = createApiSlice({
  name: 'students',
  api,
  endpoints: studentEndpoints,
  initialState: {
    // Student-specific initial state
    activeStudents: 0,
    studentCourses: [],
    studentAttendance: [],
    coursesLoading: false,
    attendanceLoading: false,
    coursesError: null,
    attendanceError: null
  },
  extraReducers: (builder) => {
    // Custom thunk for fetching student's courses
    const fetchStudentCourses = createAsyncThunk(
      'students/fetchCourses',
      async (studentId, { rejectWithValue }) => {
        try {
          const response = await api.get(studentEndpoints.getCourses, {
            params: { student_id: studentId }
          });
          return response.data;
        } catch (err) {
          return rejectWithValue(err.response.data);
        }
      }
    );

    // Custom thunk for fetching student's attendance
    const fetchStudentAttendance = createAsyncThunk(
      'students/fetchAttendance',
      async ({ studentId, dateRange }, { rejectWithValue }) => {
        try {
          const response = await api.get(studentEndpoints.getAttendance, {
            params: { 
              student_id: studentId,
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
      // Handle student courses fetching
      .addCase(fetchStudentCourses.pending, (state) => {
        state.coursesLoading = true;
        state.coursesError = null;
      })
      .addCase(fetchStudentCourses.fulfilled, (state, action) => {
        state.coursesLoading = false;
        state.studentCourses = action.payload;
      })
      .addCase(fetchStudentCourses.rejected, (state, action) => {
        state.coursesLoading = false;
        state.coursesError = action.payload || action.error.message;
      })
      
      // Handle student attendance fetching
      .addCase(fetchStudentAttendance.pending, (state) => {
        state.attendanceLoading = true;
        state.attendanceError = null;
      })
      .addCase(fetchStudentAttendance.fulfilled, (state, action) => {
        state.attendanceLoading = false;
        state.studentAttendance = action.payload;
      })
      .addCase(fetchStudentAttendance.rejected, (state, action) => {
        state.attendanceLoading = false;
        state.attendanceError = action.payload || action.error.message;
      });

    return { 
      ...actions, 
      fetchStudentCourses,
      fetchStudentAttendance
    };
  }
});

// Selectors
export const selectStudentCourses = (state) => state.students.studentCourses;
export const selectStudentAttendance = (state) => state.students.studentAttendance;
export const selectCoursesLoading = (state) => state.students.coursesLoading;
export const selectAttendanceLoading = (state) => state.students.attendanceLoading;
export const selectCoursesError = (state) => state.students.coursesError;
export const selectAttendanceError = (state) => state.students.attendanceError;

export const { 
  fetch: fetchStudents, 
  create: createStudent, 
  update: updateStudent, 
  delete: deleteStudent,
  fetchStudentCourses,
  fetchStudentAttendance
} = actions;

export default reducer;