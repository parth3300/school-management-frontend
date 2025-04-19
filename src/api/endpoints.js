const API_ENDPOINTS = {
    auth: {
      login: '/auth/jwt/create',
      custom: '/token-by-email/',
      register: '/auth/users/', // Add this
      refresh: '/auth/jwt/refresh/',
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