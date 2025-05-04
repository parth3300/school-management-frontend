const API_ENDPOINTS = {
  auth: {
    jwt_create: '/auth/jwt/create',
    jwt_create_custom: '/token-by-email/',
    jwt_refresh: '/auth/jwt/refresh/',
    login: '/auth/users/me',
  },
  schools: '/schools/',
  academicYears: '/academic-years/',
  classes: '/classes/',
  subjects: '/subjects/',
  teachers: '/teachers/',
  students: '/students/',
  attendance: '/attendance/',
  exams: '/exams/',
  examResults: '/exam-results/',
  announcements: '/announcements/',

  // Teacher-specific endpoints
  teacher: {
    profile: '/teacher/profile/',
    dashboard: '/teacher/dashboard/',
    schoolInfo: '/teacher/school-info/',
    classes: {
      base: '/teacher/classes/',
      timetable: (classId) => `/teacher/classes/${classId}/timetable/`,
    },
    students: {
      base: '/teacher/students/',
      fullHistory: (studentId) => `/teacher/students/${studentId}/full_history/`,
    },
    attendance: {
      base: '/teacher/attendance/',
      bulkCreate: '/teacher/attendance/bulk-create/',
      stats: '/teacher/attendance/stats/',
    },
    examResults: {
      base: '/teacher/exam-results/',
      byClass: '/teacher/exam-results/by-class/',
    },
    announcements: {
      base: '/teacher/announcements/',
      togglePin: (announcementId) => `/teacher/announcements/${announcementId}/toggle_pin/`,
    }
  },

  school: {
    get: '/schools/',
    create: '/school',
    update: '/school',
    uploadLogo: '/school/logo',
    getStats: '/school/stats'
  },
  attendance: {
    getAll: '/attendance',
    create: '/attendance',
    update: (id) => `/attendance/${id}`,
    delete: (id) => `/attendance/${id}`,
    getByDate: '/attendance/date',
    getByStudent: (studentId) => `/attendance/student/${studentId}`,
    bulkUpdate: '/attendance/bulk',
    monthlyStats: '/attendance/stats/monthly'
  },
  examResults: {
    getAll: '/exam-results/',
    create: '/exam-results/',
    update: (id) => `/exam-results/${id}/`,
    delete: (id) => `/exam-results/${id}/`,
    summary: '/exam-results/summary/', // Added summary endpoint
    byStudent: (studentId) => `/exam-results/student/${studentId}/`
  },
  announcements: {
    getAll: '/announcements/',
    create: '/announcements/',
    update: (id) => `/announcements/${id}/`,
    delete: (id) => `/announcements/${id}/`,
    togglePin: (id) => `/announcements/${id}/toggle-pin/`
  },
};

export default API_ENDPOINTS;