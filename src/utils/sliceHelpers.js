// src/redux/sliceHelpers.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

/**
 * Creates a standardized Redux slice for API data with enhanced logging
 */
export const createApiSlice = ({
  name,
  api,
  endpoints,
  initialState = {},
  extraReducers = {}
}) => {
  // Default initial state
  const defaultInitialState = {
    data: [],
    loading: false,
    error: null,
    ...initialState
  };

  // Helper function for consistent logging
  const logApiCall = (operation, url, payload = null) => {
    console.groupCollapsed(`[${name}] ${operation} API Call`);
    console.log('Endpoint:', url);
    if (payload) console.log('Payload:', payload);
    console.groupEnd();
  };

  // Create async thunks with logging
  const fetchThunk = createAsyncThunk(
    `${name}/fetch`,
    async (_, { rejectWithValue }) => {
      try {
        const url = endpoints.getAll;
        logApiCall('FETCH', url);
        const response = await api.get(url);
        console.log(`[${name}] FETCH Response:`, response.data);
        return response.data;
      } catch (err) {
        console.error(`[${name}] FETCH Error:`, err.response?.data || err.message);
        return rejectWithValue(err.response?.data || err.message);
      }
    }
  );

  const createThunk = createAsyncThunk(
    `${name}/create`,
    async (payload, { rejectWithValue }) => {
      try {
        const url = endpoints.create;
        logApiCall('CREATE', url, payload);
        const response = await api.post(url, payload);
        console.log(`[${name}] CREATE Response:`, response.data);
        return response.data;
      } catch (err) {
        console.error(`[${name}] CREATE Error:`, err.response?.data || err.message);
        return rejectWithValue(err.response?.data || err.message);
      }
    }
  );

  const updateThunk = createAsyncThunk(
    `${name}/update`,
    async ({ id, data }, { rejectWithValue }) => {
      try {
        const url = endpoints.update(id);
        logApiCall('UPDATE', url, data);
        const response = await api.put(url, data);
        console.log(`[${name}] UPDATE Response:`, response.data);
        return response.data;
      } catch (err) {
        console.error(`[${name}] UPDATE Error:`, err.response?.data || err.message);
        return rejectWithValue(err.response?.data || err.message);
      }
    }
  );

  const deleteThunk = createAsyncThunk(
    `${name}/delete`,
    async (id, { rejectWithValue }) => {
      try {
        const url = endpoints.delete(id);
        logApiCall('DELETE', url);
        await api.delete(url);
        console.log(`[${name}] DELETE Success for ID:`, id);
        return id;
      } catch (err) {
        console.error(`[${name}] DELETE Error:`, err.response?.data || err.message);
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
      // Standard async handling with logging
      builder
        // Fetch
        .addCase(fetchThunk.pending, (state) => {
          console.log(`[${name}] FETCH Pending`);
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchThunk.fulfilled, (state, action) => {
          console.log(`[${name}] FETCH Fulfilled:`, action.payload);
          state.loading = false;
          state.data = action.payload;
        })
        .addCase(fetchThunk.rejected, (state, action) => {
          console.error(`[${name}] FETCH Rejected:`, action.error);
          state.loading = false;
          state.error = action.payload || action.error.message;
        })
        
        // Create
        .addCase(createThunk.pending, (state) => {
          console.log(`[${name}] CREATE Pending`);
          state.loading = true;
          state.error = null;
        })
        .addCase(createThunk.fulfilled, (state, action) => {
          console.log(`[${name}] CREATE Fulfilled:`, action.payload);
          state.loading = false;
          state.data.push(action.payload);
        })
        .addCase(createThunk.rejected, (state, action) => {
          console.error(`[${name}] CREATE Rejected:`, action.error);
          state.loading = false;
          state.error = action.payload || action.error.message;
        })
        
        // Update
        .addCase(updateThunk.pending, (state) => {
          console.log(`[${name}] UPDATE Pending`);
          state.loading = true;
          state.error = null;
        })
        .addCase(updateThunk.fulfilled, (state, action) => {
          console.log(`[${name}] UPDATE Fulfilled:`, action.payload);
          state.loading = false;
          const index = state.data.findIndex(item => item.id === action.payload.id);
          if (index !== -1) {
            state.data[index] = action.payload;
          }
        })
        .addCase(updateThunk.rejected, (state, action) => {
          console.error(`[${name}] UPDATE Rejected:`, action.error);
          state.loading = false;
          state.error = action.payload || action.error.message;
        })
        
        // Delete
        .addCase(deleteThunk.pending, (state) => {
          console.log(`[${name}] DELETE Pending`);
          state.loading = true;
          state.error = null;
        })
        .addCase(deleteThunk.fulfilled, (state, action) => {
          console.log(`[${name}] DELETE Fulfilled for ID:`, action.payload);
          state.loading = false;
          state.data = state.data.filter(item => item.id !== action.payload);
        })
        .addCase(deleteThunk.rejected, (state, action) => {
          console.error(`[${name}] DELETE Rejected:`, action.error);
          state.loading = false;
          state.error = action.payload || action.error.message;
        });

      // Add any custom extra reducers
      if (extraReducers) {
        console.log(`[${name}] Adding custom extra reducers`);
        extraReducers(builder, { fetchThunk, createThunk, updateThunk, deleteThunk });
      }
    }
  });

  console.log(`[${name}] Slice created with endpoints:`, endpoints);

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