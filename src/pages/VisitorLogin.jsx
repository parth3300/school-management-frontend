import React, { useState } from 'react';
import { TextField, Button, Typography, Container } from '@mui/material';
import AuthCard from './AuthCard';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import API_ENDPOINTS from '../api/endpoints';
import { login, register } from '../redux/slices/authSlice';
import { useDispatch } from 'react-redux';
import GlobalLogin from './GlobalLogin';

const VisitorLogin = () => {
  const navigate = useNavigate();
  const [flipped, setFlipped] = useState(false); // << control flip here
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    re_password: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegister = async () => {
    try {

      
          const result = await dispatch(register({
            ...formData,
            user_type: "Visitor"
          }));
          
          // Only navigate if registration was successful
          if (register.fulfilled.match(result)) {
              setFlipped(false); // Flip to login after successful registration
          }


    } catch (err) {
      console.error('Registration error:', err);
    }
  };

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
    // api.post('/login', loginData);
  };

  // Handle Enter key press to focus the next input or submit form
  const handleKeyPress = (e, nextInputRef) => {
    if (e.key === 'Enter') {
      if (nextInputRef) {
        nextInputRef.focus(); // Focus next input field
      } else {
        handleRegister(); // Submit form if no next field
      }
    }
  };

  // Login Form (common to all)
  const loginForm = <GlobalLogin userType="Visitor" />


  // Visitor registration form
  const registerForm = (
    <>
      <Typography variant="h5" gutterBottom>Register</Typography>
      <TextField
        name="name"
        label="Name"
        fullWidth
        margin="normal"
        value={formData.name}
        onChange={handleChange}
        onKeyDown={(e) => handleKeyPress(e, document.getElementById('register-email'))} // Focus email field
      />
      <TextField
        id="register-email"
        name="email"
        label="Email"
        type="email"
        fullWidth
        margin="normal"
        value={formData.email}
        onChange={handleChange}
        onKeyDown={(e) => handleKeyPress(e, document.getElementById('register-password'))} // Focus password field
      />
      <TextField
        id="register-password"
        name="password"
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        value={formData.password}
        onChange={handleChange}
        onKeyDown={(e) => handleKeyPress(e, document.getElementById('register-repassword'))} // Focus confirm password
      />
      <TextField
        id="register-repassword"
        name="re_password"
        label="Confirm Password"
        type="password"
        fullWidth
        margin="normal"
        value={formData.re_password}
        onChange={handleChange}
        onKeyDown={(e) => handleKeyPress(e, null)} // Submit form if Enter pressed
      />
      <Button
        variant="contained"
        color="success"
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleRegister}
      >
        Submit Registration
      </Button>
    </>
  );

  return (
    <Container
      maxWidth="sm"
      sx={{
        py: 8,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <AuthCard
        loginComponent={loginForm}
        registerComponent={registerForm}
        flipped={flipped}
        setFlipped={setFlipped}
      />
    </Container>
  );
};

export default VisitorLogin;
