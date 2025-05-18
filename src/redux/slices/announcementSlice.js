// src/redux/slices/announcementSlice.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import API_ENDPOINTS from '../../api/endpoints';
import { createApiSlice } from '../../utils/sliceHelpers';

// API endpoints for announcements
const announcementEndpoints = {
  getAll: API_ENDPOINTS.announcements.getAll,
  create: API_ENDPOINTS.announcements.create,
  update: (id) => API_ENDPOINTS.announcements.update(id),
  delete: (id) => API_ENDPOINTS.announcements.delete(id),
};

// Thunk for fetching the latest announcements
export const fetchLatestAnnouncements = createAsyncThunk(
  'announcements/fetchLatest',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(API_ENDPOINTS.announcements.getAll);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Create the announcements slice using custom helper
const { reducer, actions } = createApiSlice({
  name: 'announcements',
  api,
  endpoints: announcementEndpoints,
  initialState: {
    latestAnnouncements: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLatestAnnouncements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLatestAnnouncements.fulfilled, (state, action) => {
        console.log('latestAnnouncements', action.payload);
        state.loading = false;
        state.latestAnnouncements = action.payload;
      })
      .addCase(fetchLatestAnnouncements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectLatestAnnouncements = (state) => state.announcements.latestAnnouncements;
export const selectAnnouncementsLoading = (state) => state.announcements.loading;
export const selectAnnouncementsError = (state) => state.announcements.error;

// Export actions from createApiSlice
export const {
  fetch: fetchAnnouncements,
  create: createAnnouncement,
  update: updateAnnouncement,
  delete: deleteAnnouncement,
} = actions;

export default reducer;
