// subjectSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchSubjects = createAsyncThunk('subject/fetchSubjects', async () => {
  const response = await axios.get('/api/subjects/');
  return response.data;
});

export const createSubject = createAsyncThunk('subject/createSubject', async (subject) => {
  const response = await axios.post('/api/subjects/', subject);
  return response.data;
});

export const updateSubject = createAsyncThunk('subject/updateSubject', async ({ id, data }) => {
  const response = await axios.put(`/api/subjects/${id}/`, data);
  return response.data;
});

export const deleteSubject = createAsyncThunk('subject/deleteSubject', async (id) => {
  await axios.delete(`/api/subjects/${id}/`);
  return id;
});

const subjectSlice = createSlice({
  name: 'subject',
  initialState: {
    subjects: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects = action.payload;
      })
      .addCase(fetchSubjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Include reducers for other actions too...
      .addCase(createSubject.fulfilled, (state, action) => {
        state.subjects.push(action.payload);
      })
      .addCase(updateSubject.fulfilled, (state, action) => {
        const index = state.subjects.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.subjects[index] = action.payload;
        }
      })
      .addCase(deleteSubject.fulfilled, (state, action) => {
        state.subjects = state.subjects.filter(s => s.id !== action.payload);
      });
  },
});

export default subjectSlice.reducer;
