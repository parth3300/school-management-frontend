// src/pages/TeacherLogin.jsx
import { TextField, Button, Typography, Container } from '@mui/material';
import AuthCard from './AuthCard';
import GlobalLogin from './GlobalLogin';

const TeacherAuth = () => {
  const loginForm = <GlobalLogin userType="Teacher"/>


  const registerForm = (
    <>
      <Typography variant="h5" gutterBottom>Teacher Registration</Typography>
      <TextField label="Full Name" fullWidth margin="normal" />
      <TextField label="Email" fullWidth margin="normal" />
      <TextField label="Teacher ID" fullWidth margin="normal" />
      <TextField label="Password" type="password" fullWidth margin="normal" />
      <Button variant="contained" color="secondary" fullWidth size="large" sx={{ mt: 2 }}>
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

export default TeacherAuth;