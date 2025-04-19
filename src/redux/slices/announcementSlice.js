import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchAnnouncements = createAsyncThunk(
  'announcements/fetchAnnouncements',
  async () => {
    const response = await api.get('/announcements/');
    return response.data;
  }
);

const announcementSlice = createSlice({
  name: 'announcement',
  initialState: {
    announcements: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnnouncements.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAnnouncements.fulfilled, (state, action) => {
        state.loading = false;
        state.announcements = action.payload;
      })
      .addCase(fetchAnnouncements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default announcementSlice.reducer;