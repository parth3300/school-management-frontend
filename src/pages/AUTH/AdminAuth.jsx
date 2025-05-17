// src/pages/AdminLogin.jsx
import React from 'react';
import { TextField, Button, Typography, Container } from '@mui/material';
import AuthCard from './AuthCard';
import GlobalLogin from './GlobalLogin';

const AdminAuth = () => {
  const loginForm = <GlobalLogin userType="Admin"/>


  // Admin registration might be disabled or handled differently
  const registerForm = (
    <>
      <Typography variant="h5" gutterBottom>Admin Access</Typography>
      <Typography color="text.secondary" paragraph>
        Administrator accounts can only be created by existing administrators.
        Please contact your system administrator for access.
      </Typography>
      <Button 
        variant="outlined" 
        fullWidth 
        onClick={() => window.location.href = 'mailto:admin@yourschool.edu'}
      >
        Request Admin Access
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

export default AdminAuth;