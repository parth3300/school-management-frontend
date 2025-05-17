const API_ENDPOINTS = {
  // Authentication endpoints
  auth: {
    jwt_create: '/auth/jwt/create',
    jwt_create_custom: '/token-by-email/',
    jwt_refresh: '/auth/jwt/refresh/',
    login: '/auth/users/me/',
    register: '/auth/users/',
    password_reset: '/auth/users/reset_password/',
    password_change: '/auth/users/set_password/',
  },

  // School endpoints
  school: {
    getAll: '/schools/',
    get: (id) => `/schools/${id}/`,
    create: '/schools/',
    update: (id) => `/schools/${id}/`,
    delete: (id) => `/schools/${id}/`,
    uploadLogo: (id) => `/schools/${id}/upload_logo/`,
    getStats: '/schools/stats/',
    staff: {
      base: '/schools/staff/',
      byRole: (role) => `/schools/staff/?role=${role}`,
    },
    login: '/school/login/'
  },

  // Academic Year endpoints
  academicYears: {
    getAll: '/academic-years/',
    get: (id) => `/academic-years/${id}/`,
    create: '/academic-years/',
    update: (id) => `/academic-years/${id}/`,
    delete: (id) => `/academic-years/${id}/`,
    setCurrent: (id) => `/academic-years/${id}/set-current/`,
    getCurrent: '/academic-years/current/',
  },

  // Subject endpoints
  subjects: {
    getAll: '/subjects/',
    get: (id) => `/subjects/${id}/`,
    create: '/subjects/',
    update: (id) => `/subjects/${id}/`,
    delete: (id) => `/subjects/${id}/`,
    teachers: {
      base: '/subjects/teachers/',
      bySubject: (subjectId) => `/subjects/${subjectId}/teachers/`,
    },
    classes: {
      base: '/subjects/classes/',
      bySubject: (subjectId) => `/subjects/${subjectId}/classes/`,
    },
    curriculum: (id) => `/subjects/${id}/curriculum/`,
  },

  // Class endpoints
  classes: {
    getAll: '/classes/',
    get: (id) => `/classes/${id}/`,
    create: '/classes/',
    update: (id) => `/classes/${id}/`,
    delete: (id) => `/classes/${id}/`,
    students: {
      base: '/classes/students/',
      byClass: (classId) => `/classes/${classId}/students/`,
    },
    teachers: {
      base: '/classes/teachers/',
      byClass: (classId) => `/classes/${classId}/teachers/`,
    },
    subjects: {
      base: '/classes/subjects/',
      byClass: (classId) => `/classes/${classId}/subjects/`,
    },
    schedule: {
      base: '/classes/schedule/',
      byClass: (classId) => `/classes/${classId}/schedule/`,
      byDate: (classId, date) => `/classes/${classId}/schedule/?date=${date}`,
    },
  },

  // Teacher endpoints
  teachers: {
    getAll: '/teachers/',
    get: (id) => `/teachers/${id}/`,
    create: '/teachers/',
    update: (id) => `/teachers/${id}/`,
    delete: (id) => `/teachers/${id}/`,
    profile: (id) => `/teachers/${id}/profile/`,
    dashboard: '/teachers/dashboard/',
    schoolInfo: '/teachers/school-info/',
    classes: {
      base: '/teachers/classes/',
      byTeacher: (teacherId) => `/teachers/${teacherId}/classes/`,
    },
    students: {
      base: '/teachers/students/',
      byTeacher: (teacherId) => `/teachers/${teacherId}/students/`,
      fullHistory: (teacherId, studentId) => `/teachers/${teacherId}/students/${studentId}/full-history/`,
    },
    subjects: {
      base: '/teachers/subjects/',
      byTeacher: (teacherId) => `/teachers/${teacherId}/subjects/`,
    },
    uploadPhoto: (id) => `/teachers/${id}/upload-photo/`,
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

  // Student endpoints
  students: {
    getAll: '/students/',
    get: (id) => `/students/${id}/`,
    create: '/students/',
    update: (id) => `/students/${id}/`,
    delete: (id) => `/students/${id}/`,
    profile: (id) => `/students/${id}/profile/`,
    courses: {
      base: '/students/courses/',
      byStudent: (studentId) => `/students/${studentId}/courses/`,
    },
    attendance: {
      base: '/students/attendance/',
      byStudent: (studentId) => `/students/${studentId}/attendance/`,
      byDateRange: (studentId, start, end) => `/students/${studentId}/attendance/?start=${start}&end=${end}`,
    },
    results: {
      base: '/students/results/',
      byStudent: (studentId) => `/students/${studentId}/results/`,
      byExam: (studentId, examId) => `/students/${studentId}/results/?exam=${examId}`,
    },
    uploadPhoto: (id) => `/students/${id}/upload-photo/`,
  },

  // Attendance endpoints
  attendance: {
    getAll: '/attendance/',
    get: (id) => `/attendance/${id}/`,
    create: '/attendance/',
    update: (id) => `/attendance/${id}/`,
    delete: (id) => `/attendance/${id}/`,
    getByDate: '/attendance/by-date/',
    getByClass: (classId) => `/attendance/by-class/${classId}/`,
    getByStudent: (studentId) => `/attendance/by-student/${studentId}/`,
    bulkCreate: '/attendance/bulk-create/',
    bulkUpdate: '/attendance/bulk-update/',
    monthlyStats: '/attendance/monthly-stats/',
    classStats: (classId) => `/attendance/class-stats/${classId}/`,
  },

  // Exam endpoints
  exams: {
    getAll: '/exams/',
    get: (id) => `/exams/${id}/`,
    create: '/exams/',
    update: (id) => `/exams/${id}/`,
    delete: (id) => `/exams/${id}/`,
    byAcademicYear: (yearId) => `/exams/?academic_year=${yearId}`,
    schedule: {
      base: '/exams/schedule/',
      byExam: (examId) => `/exams/${examId}/schedule/`,
    },
  },

  // Exam Result endpoints
  examResults: {
    getAll: '/exam-results/',
    get: (id) => `/examResults/${id}/`,
    create: '/exam-results/',
    update: (id) => `/exam-results/${id}/`,
    delete: (id) => `/exam-results/${id}/`,
    byExam: (examId) => `/exam-results/?exam=${examId}`,
    byStudent: (studentId) => `/exam-results/?student=${studentId}`,
    byClass: (classId) => `/exam-results/?class=${classId}`,
    summary: '/exam-results/summary/',
    classSummary: (classId) => `/exam-results/class-summary/${classId}/`,
    studentSummary: (studentId) => `/exam-results/student-summary/${studentId}/`,
  },

  // Announcement endpoints
  announcements: {
    getAll: '/announcements/',
    get: (id) => `/announcements/${id}/`,
    create: '/announcements/',
    update: (id) => `/announcements/${id}/`,
    delete: (id) => `/announcements/${id}/`,
    active: '/announcements/active/',
    pinned: '/announcements/pinned/',
    togglePin: (id) => `/announcements/${id}/toggle-pin/`,
    byAudience: (audience) => `/announcements/?audience=${audience}`,
    uploadAttachment: (id) => `/announcements/${id}/upload-attachment/`,
  },

  // Class Schedule endpoints
  classSchedule: {
    getAll: '/class-schedules/',
    get: (id) => `/classSchedule/${id}/`,
    create: '/class-schedules/',
    update: (id) => `/class-schedules/${id}/`,
    delete: (id) => `/class-schedules/${id}/`,
    byClass: (classId) => `/class-schedules/?class=${classId}`,
    byTeacher: (teacherId) => `/class-schedules/?teacher=${teacherId}`,
    byDate: (date) => `/class-schedules/?date=${date}`,
    weekly: (classId, weekStart) => `/class-schedules/weekly/?class=${classId}&week_start=${weekStart}`,
  },

  // User management endpoints
  user: {
    profile: '/users/profile/',
    changePassword: '/users/change-password/',
    resetPassword: '/users/reset-password/',
    verifyEmail: '/users/verify-email/',
  },
};

export default API_ENDPOINTS;