// src/redux/sliceHelpers.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

/**
 * Creates a standardized Redux slice for API data with notifications
 */
export const createApiSlice = ({
  name,
  api,
  endpoints,
  initialState = {},
  extraReducers = {},
  notificationMessages = {
    fetchSuccess: 'Data loaded successfully',
    fetchError: 'Failed to load data',
    createSuccess: 'Created successfully',
    createError: 'Failed to create',
    updateSuccess: 'Updated successfully',
    updateError: 'Failed to update',
    deleteSuccess: 'Deleted successfully',
    deleteError: 'Failed to delete',
  }
}) => {
  // Default initial state
  const defaultInitialState = {
    data: [],
    loading: false,
    error: null,
    ...initialState
  };

  // Helper function to dispatch notifications
  const handleNotification = (dispatch, { severity, message, error = null }) => {
    const formattedMessage = error 
      ? `${message}: ${error.detail || error.message || 'Unknown error'}`
      : message;

    dispatch({
      type: 'notification/setNotification',
      payload: {
        open: true,
        message: formattedMessage,
        severity
      }
    });
  };

  // Create async thunks with notification handling
  const fetchThunk = createAsyncThunk(
    `${name}/fetch`,
    async (_, { dispatch, rejectWithValue }) => {
      try {
        const response = await api.get(endpoints.getAll);
        handleNotification(dispatch, {
          severity: 'success',
          message: notificationMessages.fetchSuccess
        });
        return response.data;
      } catch (err) {
        handleNotification(dispatch, {
          severity: 'error',
          message: notificationMessages.fetchError,
          error: err.response?.data || err.message
        });
        return rejectWithValue(err.response?.data || err.message);
      }
    }
  );

  const createThunk = createAsyncThunk(
    `${name}/create`,
    async (payload, { dispatch, rejectWithValue }) => {
      try {
        const response = await api.post(endpoints.create, payload);
        handleNotification(dispatch, {
          severity: 'success',
          message: notificationMessages.createSuccess
        });
        return response.data;
      } catch (err) {
        handleNotification(dispatch, {
          severity: 'error',
          message: notificationMessages.createError,
          error: err.response?.data || err.message
        });
        return rejectWithValue(err.response?.data || err.message);
      }
    }
  );

  const updateThunk = createAsyncThunk(
    `${name}/update`,
    async ({ id, data }, { dispatch, rejectWithValue }) => {
      try {
        const response = await api.put(endpoints.update(id), data);
        handleNotification(dispatch, {
          severity: 'success',
          message: notificationMessages.updateSuccess
        });
        return response.data;
      } catch (err) {
        handleNotification(dispatch, {
          severity: 'error',
          message: notificationMessages.updateError,
          error: err.response?.data || err.message
        });
        return rejectWithValue(err.response?.data || err.message);
      }
    }
  );

  const deleteThunk = createAsyncThunk(
    `${name}/delete`,
    async (id, { dispatch, rejectWithValue }) => {
      try {
        await api.delete(endpoints.delete(id));
        handleNotification(dispatch, {
          severity: 'success',
          message: notificationMessages.deleteSuccess
        });
        return id;
      } catch (err) {
        handleNotification(dispatch, {
          severity: 'error',
          message: notificationMessages.deleteError,
          error: err.response?.data || err.message
        });
        return rejectWithValue(err.response?.data || err.message);
      }
    }
  );

  // Create the slice
  const slice = createSlice({
    name,
    initialState: defaultInitialState,
    reducers: {
      reset: (state) => {
        Object.assign(state, defaultInitialState);
      }
    },
    extraReducers: (builder) => {
      // Standard async handling
      builder
        // Fetch
        .addCase(fetchThunk.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchThunk.fulfilled, (state, action) => {
          state.loading = false;
          state.data = action.payload;
        })
        .addCase(fetchThunk.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || action.error.message;
        })
        
        // Create
        .addCase(createThunk.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(createThunk.fulfilled, (state, action) => {
          state.loading = false;
          state.data.push(action.payload);
        })
        .addCase(createThunk.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || action.error.message;
        })
        
        // Update
        .addCase(updateThunk.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(updateThunk.fulfilled, (state, action) => {
          state.loading = false;
          const index = state.data.findIndex(item => item.id === action.payload.id);
          if (index !== -1) {
            state.data[index] = action.payload;
          }
        })
        .addCase(updateThunk.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || action.error.message;
        })
        
        // Delete
        .addCase(deleteThunk.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(deleteThunk.fulfilled, (state, action) => {
          state.loading = false;
          state.data = state.data.filter(item => item.id !== action.payload);
        })
        .addCase(deleteThunk.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || action.error.message;
        });

      // Add any custom extra reducers
      if (extraReducers) {
        extraReducers(builder, { fetchThunk, createThunk, updateThunk, deleteThunk });
      }
    }
  });

  return {
    reducer: slice.reducer,
    actions: {
      ...slice.actions,
      fetch: fetchThunk,
      create: createThunk,
      update: updateThunk,
      delete: deleteThunk
    }
  };
};