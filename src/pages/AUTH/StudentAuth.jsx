// src/pages/StudentLogin.jsx
import { TextField, Button, Typography, Container } from '@mui/material';
import AuthCard from './AuthCard';
import GlobalLogin from './GlobalLogin';
import { STUDENT_USER_ROLE } from '../../components/common/constants';

const StudentAuth = () => {
  const loginForm = <GlobalLogin userType={STUDENT_USER_ROLE}/>

  
  const registerForm = (
    <>
      <Typography variant="h5" gutterBottom>Student Registration</Typography>
      <TextField label="Full Name" fullWidth margin="normal" />
      <TextField label="Email" fullWidth margin="normal" />
      <TextField label="Student ID" fullWidth margin="normal" />
      <TextField label="Password" type="password" fullWidth margin="normal" />
      <Button variant="contained" fullWidth size="large" sx={{ mt: 2 }}>
        Register
      </Button>
    </>
  );

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <AuthCard
        loginComponent={loginForm}
        registerComponent={registerForm}
      />
    </Container>
  );
};

export default StudentAuth;