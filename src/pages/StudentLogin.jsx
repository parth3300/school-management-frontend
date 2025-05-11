// src/pages/StudentLogin.jsx
import React from 'react';
import { TextField, Button, Typography, Container } from '@mui/material';
import AuthCard from './AuthCard';

const StudentLogin = () => {
  const loginForm = (
    <>
      <Typography variant="h5" gutterBottom>Student Login</Typography>
      <TextField label="Email" fullWidth margin="normal" />
      <TextField label="Password" type="password" fullWidth margin="normal" />
      <Button variant="contained" fullWidth size="large" sx={{ mt: 2 }}>
        Login
      </Button>
    </>
  );

  console.log("Stttttttttttttttttttttt");
  
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

export default StudentLogin;