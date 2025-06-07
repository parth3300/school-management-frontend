// src/redux/slices/attendanceSlice.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { formatISO } from 'date-fns';
import api from '../../api/axios';
import API_ENDPOINTS from '../../api/endpoints';
import { createApiSlice } from '../../utils/sliceHelpers';


// Custom thunk for fetching classes
export const fetchClasses = createAsyncThunk(
  'attendance/fetchClasses',
  async () => {
    const response = await api.get('/classes');
    return response.data;
  }
);

// Custom thunk for fetching students
export const fetchStudents = createAsyncThunk(
  'attendance/fetchStudents',
  async (classId) => {
    const response = await api.get(`/classes/${classId}/students`);
    return response.data;
  }
);

// Custom thunk for fetching attendance by class and date
export const fetchClassAttendance = createAsyncThunk(
  'attendance/fetchClassAttendance',
  async ({ classId, date }) => {
    const isoDate = formatISO(date, { representation: 'date' });
    const response = await api.get(attendanceEndpoints.getByDate, {
      params: { classId, date: isoDate }
    });
    
    // Convert array to object with studentId as keys for easier lookup
    const attendanceObj = {};
    response.data.forEach(record => {
      attendanceObj[record.studentId] = record.status === 'present';
    });
    
    return attendanceObj;
  }
);

// Custom thunk for submitting attendance
export const submitAttendance = createAsyncThunk(
  'attendance/submitAttendance',
  async (_, { getState }) => {
    const state = getState().attendance;
    const isoDate = formatISO(state.selectedDate, { representation: 'date' });
    
    const records = state.students.map(student => ({
      studentId: student.id,
      status: state.attendance[student.id] ? 'present' : 'absent'
    }));
    
    const response = await api.post(attendanceEndpoints.bulkUpdate, {
      classId: state.selectedClass,
      date: isoDate,
      records
    });
    
    return response.data;
  }
);

// Custom thunk for fetching today's attendance
export const fetchTodayAttendance = createAsyncThunk(
  'attendance/fetchToday',
  async (date) => {
    const response = await api.get(attendanceEndpoints.getByDate, {
      params: { date }
    });
    return response.data;
  }
);

// Custom thunk for fetching student attendance
export const fetchStudentAttendance = createAsyncThunk(
  'attendance/fetchStudent',
  async (studentId) => {
    const response = await api.get(attendanceEndpoints.getByStudent(studentId));
    return { studentId, data: response.data };
  }
);

// Custom thunk for bulk attendance update
export const bulkUpdateAttendance = createAsyncThunk(
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
export const fetchMonthlyStats = createAsyncThunk(
    'attendance/fetchMonthlyStats',
    async ({ month, year }) => {
      const response = await api.get(attendanceEndpoints.monthlyStats, {
        params: { month, year }
      });
      return response.data;
    }
  );


const attendanceEndpoints = {
  getAll: API_ENDPOINTS.attendance.getAll,
  create: API_ENDPOINTS.attendance.create,
  update: (id) => API_ENDPOINTS.attendance.update(id),
  delete: (id) => API_ENDPOINTS.attendance.delete(id),
  getByDate: API_ENDPOINTS.attendance.getByDate,
  getByStudent: (studentId) => API_ENDPOINTS.attendance.getByStudent(studentId),
  bulkUpdate: API_ENDPOINTS.attendance.bulkUpdate,
  monthlyStats: API_ENDPOINTS.attendance.monthlyStats
};

const { reducer, actions } = createApiSlice({
  name: 'attendance',
  api,
  endpoints: attendanceEndpoints,
  initialState: {
    // API slice initial state
    data: [],
    single: null,
    loading: false,
    error: null,
    
    // Attendance-specific initial state
    classes: [],
    students: [],
    attendance: {},
    selectedClass: null,
    selectedDate: new Date(),
    todayAttendance: [],
    studentAttendance: {},
    monthlyStats: {},
    bulkUpdating: false,
    loadingStates: {
      classes: false,
      students: false,
      attendance: false,
      submit: false
    },
    success: null
  },
  extraReducers: (builder) => {

    builder
      // Handle classes
      .addCase(fetchClasses.pending, (state) => {
        state.loadingStates.classes = true;
        state.error = null;
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.loadingStates.classes = false;
        state.classes = action.payload;
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.loadingStates.classes = false;
        state.error = action.error.message;
      })
      
      // Handle students
      .addCase(fetchStudents.pending, (state) => {
        state.loadingStates.students = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loadingStates.students = false;
        state.students = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loadingStates.students = false;
        state.error = action.error.message;
      })
      
      // Handle class attendance
      .addCase(fetchClassAttendance.pending, (state) => {
        state.loadingStates.attendance = true;
        state.error = null;
      })
      .addCase(fetchClassAttendance.fulfilled, (state, action) => {
        state.loadingStates.attendance = false;
        state.attendance = action.payload;
      })
      .addCase(fetchClassAttendance.rejected, (state, action) => {
        state.loadingStates.attendance = false;
        state.error = action.error.message;
      })
      
      // Handle submit attendance
      .addCase(submitAttendance.pending, (state) => {
        state.loadingStates.submit = true;
        state.error = null;
      })
      .addCase(submitAttendance.fulfilled, (state) => {
        state.loadingStates.submit = false;
        state.success = 'Attendance saved successfully!';
      })
      .addCase(submitAttendance.rejected, (state, action) => {
        state.loadingStates.submit = false;
        state.error = action.error.message;
      })
      
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
      fetchClasses,
      fetchStudents,
      fetchClassAttendance,
      submitAttendance,
      fetchToday: fetchTodayAttendance,
      fetchStudent: fetchStudentAttendance,
      bulkUpdate: bulkUpdateAttendance,
      fetchMonthlyStats
    };
  }
});

// Custom reducers
const customReducers = {
  setSelectedClass: (state, action) => {
    state.selectedClass = action.payload;
    state.students = [];
    state.attendance = {};
  },
  setSelectedDate: (state, action) => {
    state.selectedDate = action.payload;
    state.attendance = {};
  },
  toggleStudentAttendance: (state, action) => {
    const studentId = action.payload;
    state.attendance[studentId] = !state.attendance[studentId];
  },
  resetStatus: (state) => {
    state.error = null;
    state.success = null;
  }
};

console.log("actions>>>>",actions);

// Merge with existing actions
const mergedActions = {
  ...actions,
  ...customReducers
};

// Selectors
export const selectClasses = (state) => state.attendance.classes;
export const selectStudents = (state) => state.attendance.students;
export const selectAttendance = (state) => state.attendance.attendance;
export const selectSelectedClass = (state) => state.attendance.selectedClass;
export const selectSelectedDate = (state) => state.attendance.selectedDate;
export const selectLoadingStates = (state) => state.attendance.loadingStates;
export const selectError = (state) => state.attendance.error;
export const selectSuccess = (state) => state.attendance.success;
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
  setSelectedClass,
  setSelectedDate,
  toggleStudentAttendance,
  resetStatus,
  reset 
} = mergedActions;

export default reducer;
