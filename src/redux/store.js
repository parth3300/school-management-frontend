import { configureStore } from '@reduxjs/toolkit';

// Import reducers
import authReducer from './slices/authSlice';
import schoolReducer from './slices/schoolSlice';
import classReducer from './slices/classSlice';
import subjectReducer from './slices/subjectSlice';
import teacherReducer from './slices/teacherSlice';
import studentReducer from './slices/studentSlice';
import attendanceReducer from './slices/attendanceSlice';
import examReducer from './slices/examSlice';
import announcementReducer from './slices/announcementSlice'; // ✅ import this
import academicYearsReducer from './slices/academicYearSlice'; // ✅ import this

// Configure store with all reducers
const store = configureStore({
  reducer: {
    auth: authReducer,
    school: schoolReducer,
    classes: classReducer,
    subjects: subjectReducer,
    teachers: teacherReducer,
    students: studentReducer,
    attendance: attendanceReducer,
    exams: examReducer,
    announcements: announcementReducer, // ✅ add this
    academicYears: academicYearsReducer, // ✅ add this

  },
});


export { store }