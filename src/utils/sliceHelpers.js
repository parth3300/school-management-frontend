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
  console.log(`[${name}] Initializing API slice`,endpoints);

  // Default initial state
  const defaultInitialState = {
    data: [],
    loading: false,
    error: null,
    ...initialState
  };
  console.log(`[${name}] Default initial state set`, defaultInitialState);

  // Helper function to dispatch notifications
  const handleNotification = (dispatch, { severity, message, error = null }) => {
    const formattedMessage = error 
      ? `${message}: ${error.detail || error.message || 'Unknown error'}`
      : message;

    console.log(`[${name}] Dispatching notification:`, { severity, message: formattedMessage });

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
      console.log(`[${name}] Fetch thunk started`);
      try {
        const response = await api.get(endpoints.getAll);
        console.log(`[${name}] Fetch thunk success`, response.data);
        handleNotification(dispatch, {
          severity: 'success',
          message: notificationMessages.fetchSuccess
        });
        return response.data;
      } catch (err) {
        console.error(`[${name}] Fetch thunk error`, err);
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
      console.log(`[${name}] Create thunk started`, payload);
      try {
        const response = await api.post(endpoints.create, payload);
        console.log(`[${name}] Create thunk success`, response.data);
        handleNotification(dispatch, {
          severity: 'success',
          message: notificationMessages.createSuccess
        });
        return response.data;
      } catch (err) {
        console.error(`[${name}] Create thunk error`, err);
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
      console.log(`[${name}] Update thunk started`, { id, data });
      try {
        const response = await api.put(endpoints.update(id), data);
        console.log(`[${name}] Update thunk success`, response.data);
        handleNotification(dispatch, {
          severity: 'success',
          message: notificationMessages.updateSuccess
        });
        return response.data;
      } catch (err) {
        console.error(`[${name}] Update thunk error`, err);
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
      console.log(`[${name}] Delete thunk started`, id);
      try {
        await api.delete(endpoints.delete(id));
        console.log(`[${name}] Delete thunk success`, id);
        handleNotification(dispatch, {
          severity: 'success',
          message: notificationMessages.deleteSuccess
        });
        return id;
      } catch (err) {
        console.error(`[${name}] Delete thunk error`, err);
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
        console.log(`[${name}] Reset reducer called`);
        Object.assign(state, defaultInitialState);
      }
    },
    extraReducers: (builder) => {
      console.log(`[${name}] Setting up extraReducers`);

      // Standard async handling
      builder
        // Fetch
        .addCase(fetchThunk.pending, (state) => {
          console.log(`[${name}] Fetch pending`);
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchThunk.fulfilled, (state, action) => {
          console.log(`[${name}] Fetch fulfilled`, action.payload);
          state.loading = false;
          state.data = action.payload;
        })
        .addCase(fetchThunk.rejected, (state, action) => {
          console.log(`[${name}] Fetch rejected`, action.payload || action.error.message);
          state.loading = false;
          state.error = action.payload || action.error.message;
        })
        
        // Create
        .addCase(createThunk.pending, (state) => {
          console.log(`[${name}] Create pending`);
          state.loading = true;
          state.error = null;
        })
        .addCase(createThunk.fulfilled, (state, action) => {
          console.log(`[${name}] Create fulfilled`, action.payload);
          state.loading = false;
          state.data.push(action.payload);
        })
        .addCase(createThunk.rejected, (state, action) => {
          console.log(`[${name}] Create rejected`, action.payload || action.error.message);
          state.loading = false;
          state.error = action.payload || action.error.message;
        })
        
        // Update
        .addCase(updateThunk.pending, (state) => {
          console.log(`[${name}] Update pending`);
          state.loading = true;
          state.error = null;
        })
        .addCase(updateThunk.fulfilled, (state, action) => {
          console.log(`[${name}] Update fulfilled`, action.payload);
          state.loading = false;
          const index = state.data.findIndex(item => item.id === action.payload.id);
          if (index !== -1) {
            state.data[index] = action.payload;
          }
        })
        .addCase(updateThunk.rejected, (state, action) => {
          console.log(`[${name}] Update rejected`, action.payload || action.error.message);
          state.loading = false;
          state.error = action.payload || action.error.message;
        })
        
        // Delete
        .addCase(deleteThunk.pending, (state) => {
          console.log(`[${name}] Delete pending`);
          state.loading = true;
          state.error = null;
        })
        .addCase(deleteThunk.fulfilled, (state, action) => {
          console.log(`[${name}] Delete fulfilled`, action.payload);
          state.loading = false;
          state.data = state.data.filter(item => item.id !== action.payload);
        })
        .addCase(deleteThunk.rejected, (state, action) => {
          console.log(`[${name}] Delete rejected`, action.payload || action.error.message);
          state.loading = false;
          state.error = action.payload || action.error.message;
        });

      // Add any custom extra reducers
      if (extraReducers) {
        console.log(`[${name}] Running custom extraReducers`);
        extraReducers(builder, { fetchThunk, createThunk, updateThunk, deleteThunk });
      }
    }
  });

  console.log(`[${name}] Slice created successfully`);

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
