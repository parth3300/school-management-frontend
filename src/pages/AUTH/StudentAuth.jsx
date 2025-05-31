// src/pages/StudentLogin.jsx
import { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  CircularProgress
} from '@mui/material';
import AuthCard from './AuthCard';
import GlobalLogin from './GlobalLogin';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearAuthError } from '../../redux/slices/authSlice';
import { formatDjangoErrors } from '../../components/common/errorHelper';
import { STUDENT_USER_ROLE } from '../../components/common/constants';

const StudentAuth = () => {
  const [flipped, setFlipped] = useState(false);
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    re_password: '',
    student_id: '',
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

    const result = await dispatch(register({
      ...formData,
      is_student: true
    }));

    if (register.fulfilled.match(result)) {
      setFlipped(false);
    }
  };

  const loginForm = <GlobalLogin userType={STUDENT_USER_ROLE} />;

  const registerForm = (
    <form onSubmit={handleRegister}>
      <Typography variant="h5" gutterBottom>Student Registration</Typography>

      <TextField
        name="name"
        label="Full Name"
        fullWidth
        margin="normal"
        required
        value={formData.name}
        onChange={handleChange}
        error={!!authState.error?.name}
        helperText={authState.error?.name?.[0]}
      />

      <TextField
        name="email"
        label="Email"
        type="email"
        fullWidth
        margin="normal"
        required
        value={formData.email}
        onChange={handleChange}
        error={!!authState.error?.email}
        helperText={authState.error?.email?.[0]}
      />

      <TextField
        name="student_id"
        label="Student ID"
        fullWidth
        margin="normal"
        required
        value={formData.student_id}
        onChange={handleChange}
        error={!!authState.error?.student_id}
        helperText={authState.error?.student_id?.[0]}
      />

      <TextField
        name="password"
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        required
        value={formData.password}
        onChange={handleChange}
        error={!!authState.error?.password}
        helperText={authState.error?.password?.[0]}
      />

      <TextField
        name="re_password"
        label="Confirm Password"
        type="password"
        fullWidth
        margin="normal"
        required
        value={formData.re_password}
        onChange={handleChange}
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
        fullWidth
        type="submit"
        sx={{ mt: 2 }}
        disabled={authState.loading}
      >
        {authState.loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          'Submit Registration'
        )}
      </Button>
    </form>
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

export default StudentAuth;
