// src/components/VisitorLoginForm.jsx

import React, { useState } from 'react';
import { TextField, Button, Typography, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../redux/slices/authSlice';
import { capitalizeFirst } from '../../components/common/constants';
import { formatDjangoErrors } from '../../components/common/errorHelper';

const GlobalLogin = ({ userType }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    console.log('Logging in withsss:', loginData);
    const result = await dispatch(login(loginData));
    setIsLoading(false);
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
  const authState = useSelector((state) => state.auth);

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
      <Typography variant="h5" gutterBottom>{capitalizeFirst(userType)} Login</Typography>
      <TextField
        name="email"
        label="Email"
        type="email"
        fullWidth
        margin="normal"
        value={loginData.email}
        onChange={handleLoginChange}
        error={!!authState.error?.email}
        helperText={authState.error?.email?.[0]}
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
        error={!!authState.error?.password}
        helperText={authState.error?.password?.[0]}
        onKeyDown={(e) => handleKeyPress(e, null)}
      />
      <Button
        variant="contained"
        color={getButtonColor()}
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          'Login'
        )}
      </Button>
      {(authState.error?.detail || authState.error) && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {formatDjangoErrors(authState.error.detail || authState.error)}
        </Alert>
      )}
    </>
  );
};

export default GlobalLogin;