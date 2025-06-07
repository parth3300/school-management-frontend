// src/components/VisitorLoginForm.jsx

import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../redux/slices/authSlice';
import { capitalizeFirst } from '../../components/common/constants';
import { formatDjangoErrors } from '../../components/common/errorHelper';

const GlobalLogin = ({ userType }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [schoolId, setSchoolId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  // Extract and persist school_id from URL if available
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const schoolIdFromUrl = params.get('school_id');

    if (schoolIdFromUrl) {
      localStorage.setItem('school_id', schoolIdFromUrl);
      setSchoolId(schoolIdFromUrl);
    } else {
      const storedId = localStorage.getItem('school_id');
      if (storedId) setSchoolId(storedId);
    }
  }, [location]);

  const handleLoginChange = (e) => {
    setLoginData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async () => {
    setIsLoading(true);
    const payload = {
      ...loginData,
      school_id: schoolId,
      user_type: userType,
    };
    console.log('Logging in with:', payload);

    const result = await dispatch(login(payload));
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
      <Typography variant="h5" gutterBottom>
        {capitalizeFirst(userType)} Login
      </Typography>

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
        onKeyDown={(e) =>
          handleKeyPress(e, document.getElementById('login-password'))
        }
      />

      <TextField
        id="login-password"
        name="password"
        label="Password"
        type={showPassword ? 'text' : 'password'}
        fullWidth
        margin="normal"
        value={loginData.password}
        onChange={handleLoginChange}
        error={!!authState.error?.password}
        helperText={authState.error?.password?.[0]}
        onKeyDown={(e) => handleKeyPress(e, null)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={handleTogglePassword}
                edge="end"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
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
