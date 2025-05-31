// src/pages/AdminLogin.jsx
import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Container, CircularProgress, Alert } from '@mui/material';
import AuthCard from './AuthCard';
import GlobalLogin from './GlobalLogin';
import { ADMIN_USER_ROLE } from '../../components/common/constants';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearAuthError } from '../../redux/slices/authSlice';
import { formatDjangoErrors } from '../../components/common/errorHelper';

const AdminAuth = () => {
  const [flipped, setFlipped] = useState(false);
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    re_password: '',
  });

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch, flipped]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    if (authState.error?.[e.target.name]) {
      const newError = { ...authState.error };
      delete newError[e.target.name];
      dispatch(clearAuthError(newError));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    dispatch(clearAuthError());
    const result = await dispatch(register({ ...formData }));
    if (register.fulfilled.match(result)) {
      setFlipped(false);
    }
  };

  const handleKeyPress = (e, nextInputRef) => {
    if (e.key === 'Enter' && nextInputRef) {
      nextInputRef.focus();
    }
  };

  const loginForm = <GlobalLogin userType={ADMIN_USER_ROLE} />;

  const registerForm = (
    <form onSubmit={handleRegister}>
      <Typography variant="h5" gutterBottom>Admin Registration</Typography>

      <TextField
        name="name"
        label="Name"
        fullWidth
        margin="normal"
        required
        value={formData.name}
        onChange={handleChange}
        onKeyDown={(e) => handleKeyPress(e, document.getElementById('admin-register-email'))}
        error={!!authState.error?.name}
        helperText={authState.error?.name?.[0]}
      />

      <TextField
        id="admin-register-email"
        name="email"
        label="Email"
        type="email"
        fullWidth
        margin="normal"
        required
        value={formData.email}
        onChange={handleChange}
        onKeyDown={(e) => handleKeyPress(e, document.getElementById('admin-register-password'))}
        error={!!authState.error?.email}
        helperText={authState.error?.email?.[0]}
      />

      <TextField
        id="admin-register-password"
        name="password"
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        required
        value={formData.password}
        onChange={handleChange}
        onKeyDown={(e) => handleKeyPress(e, document.getElementById('admin-register-repassword'))}
        error={!!authState.error?.password}
        helperText={authState.error?.password?.[0]}
      />

      <TextField
        id="admin-register-repassword"
        name="re_password"
        label="Confirm Password"
        type="password"
        fullWidth
        margin="normal"
        required
        value={formData.re_password}
        onChange={handleChange}
        onKeyDown={(e) => handleKeyPress(e, null)}
        error={!!authState.error?.re_password}
        helperText={authState.error?.re_password?.[0]}
      />

      {(authState.error?.detail || authState.error?.non_field_errors) && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {formatDjangoErrors(authState.error)}
        </Alert>
      )}

      <Button
        variant="contained"
        color="primary"
        fullWidth
        type="submit"
        sx={{ mt: 2 }}
        disabled={authState.loading}
      >
        {authState.loading ? <CircularProgress size={24} color="inherit" /> : 'Submit Registration'}
      </Button>
    </form>
  );

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <AuthCard
        loginComponent={loginForm}
        registerComponent={registerForm}
        flipped={flipped}
        setFlipped={setFlipped}
      />
    </Container>
  );
};

export default AdminAuth;
