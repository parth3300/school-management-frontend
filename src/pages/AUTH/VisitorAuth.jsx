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
import { register, clearAuthError } from '../../redux/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import GlobalLogin from './GlobalLogin';
import { formatDjangoErrors } from '../../components/common/errorHelper';
import { VISITOR_USER_ROLE } from '../../components/common/constants';

const VisitorAuth = () => {
  const [flipped, setFlipped] = useState(false);
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    re_password: '',
  });
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  // Clear errors when component mounts or when flipped changes
  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch, flipped]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    // Clear error for this specific field if it exists
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
      user_type: "Visitor"
    }));

    if (register.fulfilled.match(result)) {
      setFlipped(false); // Flip to login after successful registration
    }
  };

  const handleLoginChange = (e) => {
    setLoginData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleKeyPress = (e, nextInputRef) => {
    if (e.key === 'Enter') {
      if (nextInputRef) {
        nextInputRef.focus();
      }
    }
  };

  const loginForm = <GlobalLogin userType={VISITOR_USER_ROLE} />;

  const registerForm = (
    <form onSubmit={handleRegister}>
      <Typography variant="h5" gutterBottom>Register</Typography>

      <TextField
        name="name"
        label="Name"
        fullWidth
        margin="normal"
        required
        value={formData.name}
        onChange={handleChange}
        onKeyDown={(e) => handleKeyPress(e, document.getElementById('register-email'))}
        error={!!authState.error?.name}
        helperText={authState.error?.name?.[0]}
      />

      <TextField
        id="register-email"
        name="email"
        label="Email"
        type="email"
        fullWidth
        margin="normal"
        required
        value={formData.email}
        onChange={handleChange}
        onKeyDown={(e) => handleKeyPress(e, document.getElementById('register-password'))}
        error={!!authState.error?.email}
        helperText={authState.error?.email?.[0]}
      />

      <TextField
        id="register-password"
        name="password"
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        required
        value={formData.password}
        onChange={handleChange}
        onKeyDown={(e) => handleKeyPress(e, document.getElementById('register-repassword'))}
        error={!!authState.error?.password}
        helperText={authState.error?.password?.[0]}
      />

      <TextField
        id="register-repassword"
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

      {/* Display non-field errors */}
      {authState.error?.non_field_errors && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {formatDjangoErrors(authState.error.non_field_errors)}
        </Alert>
      )}

      {authState.error?.detail && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {formatDjangoErrors(authState.error.detail)}
        </Alert>
      )}

      <Button
        variant="contained"
        color="success"
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

export default VisitorAuth; 