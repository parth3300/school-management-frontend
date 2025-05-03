const API_ENDPOINTS = {
    auth: {
      jwt_create: '/auth/jwt/create',
      jwt_create_custom: '/token-by-email/',
      jwt_refresh: '/auth/jwt/refresh/',
      login: '/auth/users/me', // Add this
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
  };
  
  export default API_ENDPOINTS;