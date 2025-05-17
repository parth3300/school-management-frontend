import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import API_ENDPOINTS from '../../api/endpoints';
import { createApiSlice } from '../../utils/sliceHelpers';

const studentEndpoints = {
  getAll: API_ENDPOINTS.students.getAll,
  create: API_ENDPOINTS.students.create,
  update: (id) => API_ENDPOINTS.students.update(id),
  delete: (id) => API_ENDPOINTS.students.delete(id),
  getCourses: API_ENDPOINTS.students.courses.base,
  getAttendance: API_ENDPOINTS.students.attendance.base,
};

// Async thunk to fetch student courses
export const fetchStudentCourses = createAsyncThunk(
  'students/fetchCourses',
  async (studentId, { rejectWithValue }) => {
    try {
      const response = await api.get(studentEndpoints.getCourses, {
        params: { student_id: studentId }
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Async thunk to fetch student attendance
export const fetchStudentAttendance = createAsyncThunk(
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
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const initialState = {
  data: [],
  loading: false,
  error: null,
  activeStudents: 0,
  studentCourses: [],
  studentAttendance: [],
  coursesLoading: false,
  attendanceLoading: false,
  coursesError: null,
  attendanceError: null
};

const { reducer, actions } = createApiSlice({
  name: 'students',
  api,
  endpoints: studentEndpoints,
  initialState,
  extraReducers: (builder) => {
    // Handle fetchStudentCourses lifecycle
    builder
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
        state.coursesError = action.payload;
      });

    // Handle fetchStudentAttendance lifecycle
    builder
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
        state.attendanceError = action.payload;
      });
  }
});

// Selectors
export const selectStudents = (state) => state.students.data;
export const selectLoading = (state) => state.students.loading;
export const selectError = (state) => state.students.error;

export const selectStudentCourses = (state) => state.students.studentCourses;
export const selectCoursesLoading = (state) => state.students.coursesLoading;
export const selectCoursesError = (state) => state.students.coursesError;

export const selectStudentAttendance = (state) => state.students.studentAttendance;
export const selectAttendanceLoading = (state) => state.students.attendanceLoading;
export const selectAttendanceError = (state) => state.students.attendanceError;

// Export your normal CRUD actions from createApiSlice
export const {
  fetch: fetchStudents,
  create: createStudent,
  update: updateStudent,
  delete: deleteStudent,
} = actions;



export default reducer;
