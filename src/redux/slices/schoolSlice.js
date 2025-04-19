import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import API_ENDPOINTS from '../../api/endpoints';

export const fetchSchools = createAsyncThunk('schools/fetchSchools', async () => {
  const response = await api.get(API_ENDPOINTS.schools);
  return response.data;
});

export const createSchool = createAsyncThunk(
  'schools/createSchool',
  async (schoolData) => {
    const response = await api.post(API_ENDPOINTS.schools, schoolData);
    return response.data;
  }
);

export const updateSchool = createAsyncThunk(
  'schools/updateSchool',
  async ({ id, data }) => {
    const response = await api.patch(`${API_ENDPOINTS.schools}${id}/`, data);
    return response.data;
  }
);

export const deleteSchool = createAsyncThunk(
  'schools/deleteSchool',
  async (id) => {
    await api.delete(`${API_ENDPOINTS.schools}${id}/`);
    return id;
  }
);

const schoolSlice = createSlice({
  name: 'schools',
  initialState: {
    schools: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchools.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSchools.fulfilled, (state, action) => {
        state.loading = false;
        state.schools = action.payload;
      })
      .addCase(fetchSchools.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createSchool.fulfilled, (state, action) => {
        state.schools.push(action.payload);
      })
      .addCase(updateSchool.fulfilled, (state, action) => {
        const index = state.schools.findIndex(
          (school) => school.id === action.payload.id
        );
        if (index !== -1) {
          state.schools[index] = action.payload;
        }
      })
      .addCase(deleteSchool.fulfilled, (state, action) => {
        state.schools = state.schools.filter(
          (school) => school.id !== action.payload
        );
      });
  },
});

export const selectSchools = (state) => state.schools;

export default schoolSlice.reducer;