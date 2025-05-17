// src/components/VisitorLoginForm.jsx

import React, { useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/slices/authSlice';

const GlobalLogin = ({ userType }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const handleLoginChange = (e) => {
    setLoginData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async () => {
    console.log('Logging in with:', loginData);
    const result = await dispatch(login(loginData));
    if (login.fulfilled.match(result)) {
      navigate('/dashboard');
    }
  };

  const handleKeyPress = (e, nextInputRef) => {
    if (e.key === 'Enter') {
      if (nextInputRef) {
        nextInputRef.focus();
      } else {
        handleLogin();
      }
    }
  };

  const getButtonColor = () => {
  switch (userType) {
    case 'Teacher':
      return 'secondary';
    case 'Student':
      return 'primary';
    case 'Admin':
      return 'error';
    case 'Visitor':
    default:
      return 'success';
  }
};

  return (
    <>
      <Typography variant="h5" gutterBottom>{userType} Login</Typography>
      <TextField
        name="email"
        label="Email"
        type="email"
        fullWidth
        margin="normal"
        value={loginData.email}
        onChange={handleLoginChange}
        onKeyDown={(e) => handleKeyPress(e, document.getElementById('login-password'))}
      />
      <TextField
        id="login-password"
        name="password"
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        value={loginData.password}
        onChange={handleLoginChange}
        onKeyDown={(e) => handleKeyPress(e, null)}
      />
      <Button
        variant="contained"
        color={getButtonColor()}
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleLogin}
      >
        Login
      </Button>

    </>
  );
};

export default GlobalLogin;
