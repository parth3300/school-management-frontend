// src/pages/TeacherLogin.jsx
import { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Typography,
  Container,
  CircularProgress,
  Alert,
} from '@mui/material';
import AuthCard from './AuthCard';
import GlobalLogin from './GlobalLogin';
import { TEACHER_USER_ROLE } from '../../components/common/constants';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearAuthError } from '../../redux/slices/authSlice';
import { formatDjangoErrors } from '../../components/common/errorHelper';

const TeacherAuth = () => {
  const [flipped, setFlipped] = useState(false);
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    teacher_id: '',
    password: '',
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
    console.log('Registering Teacher with:', formData);

    const result = await dispatch(register({
      ...formData,
      is_teacher: true,
    }));

    if (register.fulfilled.match(result)) {
      setFlipped(false);
    }
  };

  const handleKeyPress = (e, nextInputRef) => {
    if (e.key === 'Enter' && nextInputRef) {
      nextInputRef.focus();
    }
  };

  const loginForm = <GlobalLogin userType={TEACHER_USER_ROLE} />;

  const registerForm = (
    <form onSubmit={handleRegister}>
      <Typography variant="h5" gutterBottom>Teacher Registration</Typography>

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
        fullWidth
        margin="normal"
        required
        value={formData.email}
        onChange={handleChange}
        error={!!authState.error?.email}
        helperText={authState.error?.email?.[0]}
      />

      <TextField
        name="teacher_id"
        label="Teacher ID"
        fullWidth
        margin="normal"
        required
        value={formData.teacher_id}
        onChange={handleChange}
        error={!!authState.error?.teacher_id}
        helperText={authState.error?.teacher_id?.[0]}
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

      {(authState.error?.detail || authState.error?.non_field_errors) && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {formatDjangoErrors(authState.error)}
        </Alert>
      )}

      <Button
        variant="contained"
        color="secondary"
        fullWidth
        type="submit"
        sx={{ mt: 2 }}
        disabled={authState.loading}
      >
        {authState.loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          'Register'
        )}
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

export default TeacherAuth;
