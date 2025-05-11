// src/redux/slices/announcementSlice.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import API_ENDPOINTS from '../../api/endpoints';
import { createApiSlice } from '../../utils/sliceHelpers';

const announcementEndpoints = {
  getAll: API_ENDPOINTS.announcements.getAll,
  create: API_ENDPOINTS.announcements.create,
  update: (id) => API_ENDPOINTS.announcements.update(id),
  delete: (id) => API_ENDPOINTS.announcements.delete(id),
};

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
    const fetchLatestAnnouncements = createAsyncThunk(
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

    builder
      .addCase(fetchLatestAnnouncements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLatestAnnouncements.fulfilled, (state, action) => {
        state.loading = false;
        state.latestAnnouncements = action.payload;
      })
      .addCase(fetchLatestAnnouncements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    return {
      ...actions,
      fetchLatestAnnouncements
    };
  }
});

// Selectors
export const selectLatestAnnouncements = (state) => state.announcements.latestAnnouncements;
export const selectAnnouncementsLoading = (state) => state.announcements.loading;
export const selectAnnouncementsError = (state) => state.announcements.error;

console.log("actionsactionsactions",actions);

// Actions
export const {
  fetch: fetchAnnouncements,
  create: createAnnouncement,
  update: updateAnnouncement,
  delete: deleteAnnouncement,
  fetchLatestAnnouncements
} = actions;

export default reducer;
