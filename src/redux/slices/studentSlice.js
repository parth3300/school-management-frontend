import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import API_ENDPOINTS from '../../api/endpoints';

export const fetchStudents = createAsyncThunk('students/fetchStudents', async () => {
  const response = await api.get(API_ENDPOINTS.students);
  return response.data;
});

export const createStudent = createAsyncThunk(
  'students/createStudent',
  async (studentData) => {
    const response = await api.post(API_ENDPOINTS.students, studentData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
);

export const updateStudent = createAsyncThunk(
  'students/updateStudent',
  async ({ id, data }) => {
    const response = await api.patch(`${API_ENDPOINTS.students}${id}/`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
);

export const deleteStudent = createAsyncThunk(
  'students/deleteStudent',
  async (id) => {
    await api.delete(`${API_ENDPOINTS.students}${id}/`);
    return id;
  }
);

const studentSlice = createSlice({
  name: 'students',
  initialState: {
    students: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createStudent.fulfilled, (state, action) => {
        state.students.push(action.payload);
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        const index = state.students.findIndex(
          (student) => student.id === action.payload.id
        );
        if (index !== -1) {
          state.students[index] = action.payload;
        }
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.students = state.students.filter(
          (student) => student.id !== action.payload
        );
      });
  },
});

export const selectStudents = (state) => state.students;

export default studentSlice.reducer;