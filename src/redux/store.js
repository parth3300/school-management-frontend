import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import schoolReducer from './slices/schoolSlice';
// Import other reducers as needed

export const store = configureStore({
  reducer: {
    auth: authReducer,
    school: schoolReducer,
    // Add other reducers here
  },
});