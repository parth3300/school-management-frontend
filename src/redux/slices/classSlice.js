import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import API_ENDPOINTS from '../../api/endpoints';

export const fetchClasses = createAsyncThunk('classes/fetchClasses', async () => {
  const response = await api.get(API_ENDPOINTS.classes);
  return response.data;
});

export const createClass = createAsyncThunk(
  'classes/createClass',
  async (classData) => {
    const response = await api.post(API_ENDPOINTS.classes, classData);
    return response.data;
  }
);

export const updateClass = createAsyncThunk(
  'classes/updateClass',
  async ({ id, data }) => {
    const response = await api.patch(`${API_ENDPOINTS.classes}${id}/`, data);
    return response.data;
  }
);

export const deleteClass = createAsyncThunk(
  'classes/deleteClass',
  async (id) => {
    await api.delete(`${API_ENDPOINTS.classes}${id}/`);
    return id;
  }
);

const classSlice = createSlice({
  name: 'classes',
  initialState: {
    classes: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClasses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = action.payload;
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createClass.fulfilled, (state, action) => {
        state.classes.push(action.payload);
      })
      .addCase(updateClass.fulfilled, (state, action) => {
        const index = state.classes.findIndex(
          (cls) => cls.id === action.payload.id
        );
        if (index !== -1) {
          state.classes[index] = action.payload;
        }
      })
      .addCase(deleteClass.fulfilled, (state, action) => {
        state.classes = state.classes.filter(
          (cls) => cls.id !== action.payload
        );
      });
  },
});

export const selectClasses = (state) => state.classes;

export default classSlice.reducer;