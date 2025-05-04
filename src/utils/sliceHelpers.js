// src/redux/sliceHelpers.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

/**
 * Creates a standardized Redux slice for API data
 * @param {string} name - The name of the slice (e.g., 'teachers', 'attendance')
 * @param {object} api - The API object with endpoints
 * @param {object} endpoints - Endpoint configuration
 * @param {object} initialState - Custom initial state (optional)
 * @param {object} extraReducers - Additional reducers (optional)
 * @returns {object} Redux slice
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

  // Create async thunks for CRUD operations
  const fetchThunk = createAsyncThunk(
    `${name}/fetch`,
    async () => {
      const response = await api.get(endpoints.getAll);
      return response.data;
    }
  );

  const createThunk = createAsyncThunk(
    `${name}/create`,
    async (payload) => {
      const response = await api.post(endpoints.create, payload);
      return response.data;
    }
  );

  const updateThunk = createAsyncThunk(
    `${name}/update`,
    async ({ id, data }) => {
      const response = await api.put(endpoints.update(id), data);
      return response.data;
    }
  );

  const deleteThunk = createAsyncThunk(
    `${name}/delete`,
    async (id) => {
      await api.delete(endpoints.delete(id));
      return id;
    }
  );

  // Create the slice
  const slice = createSlice({
    name,
    initialState: defaultInitialState,
    reducers: {
      // Add any synchronous reducers here
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
          state.error = action.error.message;
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
          state.error = action.error.message;
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
          state.error = action.error.message;
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
          state.error = action.error.message;
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