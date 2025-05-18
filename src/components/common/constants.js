export const ADMIN_USER_ROLE = 'admin';
export const TEACHER_USER_ROLE = 'teacher';
export const STUDENT_USER_ROLE = 'student';   
export const VISITOR_USER_ROLE = 'visitor';


export const capitalizeFirst = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
