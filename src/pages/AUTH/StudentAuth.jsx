import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  CircularProgress,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Box,
  Grid,
  IconButton,
  InputAdornment
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LockOutlined } from '@mui/icons-material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

// Components
import AuthCard from './AuthCard';
import GlobalLogin from './GlobalLogin';

// Redux
import { register, clearAuthError } from '../../redux/slices/authSlice';
import { selectClasses, fetchClasses } from '../../redux/slices/classSlice';

// Helpers
import { formatDjangoErrors } from '../../components/common/errorHelper';
import { STUDENT_USER_ROLE } from '../../components/common/constants';

const StudentAuth = () => {
  // State Management
  const [flipped, setFlipped] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    // User model fields
    email: '',
    name: '',
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
    date_of_birth: null,
    gender: 'M',
    role: 'student',
    
    // Student model fields
    parent_name: '',
    parent_phone: '',
    admission_date: null,
    current_class: '',
    school: '',
    
    // Auth fields
    password: '',
    re_password: ''
  });

  // Refs
  const passwordRef = useRef(null);

  // Redux Hooks
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const classes = useSelector(selectClasses);

  // Effects
  useEffect(() => {
    dispatch(clearAuthError());
    dispatch(fetchClasses());
  }, [dispatch, flipped]);

  // Validation
  const validateForm = () => {
    const errors = {};
    let isValid = true;

    // Password matching validation
    if (formData.password !== formData.re_password) {
      errors.re_password = 'Passwords do not match';
      isValid = false;
    }

    // Password strength validation
    if (formData.password.length > 0 && formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // Event Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    if (authState.error?.[name]) {
      const newError = { ...authState.error };
      delete newError[name];
      dispatch(clearAuthError(newError));
    }
  };

  const handleDateChange = (name) => (date) => {
    setFormData(prev => ({
      ...prev,
      [name]: date
    }));
  };

  const handleKeyDown = (e, fieldName) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (fieldName === 'password') {
        passwordRef.current.focus();
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    dispatch(clearAuthError());
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    const payload = {
      ...formData,
      date_of_birth: formData.date_of_birth?.toISOString(),
      admission_date: formData.admission_date?.toISOString(),
      is_student: true
    };
    
    const result = await dispatch(register(payload));

    if (register.fulfilled.match(result)) {
      setFlipped(false);
    }
  };

  // Form Sections
  const PersonalInformationSection = () => (
    <>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom sx={{ borderBottom: '1px solid #eee', pb: 1 }}>
          Personal Information
        </Typography>
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          name="name"
          label="Full Name"
          fullWidth
          required
          value={formData.name}
          onChange={handleChange}
          error={!!authState.error?.name || !!formErrors.name}
          helperText={authState.error?.name?.[0] || formErrors.name}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          name="email"
          label="Email"
          type="email"
          fullWidth
          required
          value={formData.email}
          onChange={handleChange}
          error={!!authState.error?.email || !!formErrors.email}
          helperText={authState.error?.email?.[0] || formErrors.email}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          name="first_name"
          label="First Name"
          fullWidth
          value={formData.first_name}
          onChange={handleChange}
          error={!!authState.error?.first_name || !!formErrors.first_name}
          helperText={authState.error?.first_name?.[0] || formErrors.first_name}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          name="last_name"
          label="Last Name"
          fullWidth
          value={formData.last_name}
          onChange={handleChange}
          error={!!authState.error?.last_name || !!formErrors.last_name}
          helperText={authState.error?.last_name?.[0] || formErrors.last_name}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Gender</InputLabel>
          <Select
            name="gender"
            value={formData.gender}
            label="Gender"
            onChange={handleChange}
            error={!!authState.error?.gender || !!formErrors.gender}
          >
            <MenuItem value="M">Male</MenuItem>
            <MenuItem value="F">Female</MenuItem>
            <MenuItem value="O">Other</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6}>
        <DatePicker
          label="Date of Birth"
          value={formData.date_of_birth}
          onChange={handleDateChange('date_of_birth')}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              error={!!authState.error?.date_of_birth || !!formErrors.date_of_birth}
              helperText={authState.error?.date_of_birth?.[0] || formErrors.date_of_birth}
            />
          )}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          name="phone"
          label="Phone Number"
          fullWidth
          value={formData.phone}
          onChange={handleChange}
          error={!!authState.error?.phone || !!formErrors.phone}
          helperText={authState.error?.phone?.[0] || formErrors.phone}
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          name="address"
          label="Address"
          fullWidth
          multiline
          rows={2}
          value={formData.address}
          onChange={handleChange}
          error={!!authState.error?.address || !!formErrors.address}
          helperText={authState.error?.address?.[0] || formErrors.address}
        />
      </Grid>
    </>
  );

  const StudentInformationSection = () => (
    <>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom sx={{ borderBottom: '1px solid #eee', pb: 1, mt: 2 }}>
          Student Information
        </Typography>
      </Grid>

      <Grid item xs={12} sm={6}>
        <DatePicker
          label="Admission Date"
          value={formData.admission_date}
          onChange={handleDateChange('admission_date')}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              required
              error={!!authState.error?.admission_date || !!formErrors.admission_date}
              helperText={authState.error?.admission_date?.[0] || formErrors.admission_date}
            />
          )}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          name="parent_name"
          label="Parent/Guardian Name"
          fullWidth
          required
          value={formData.parent_name}
          onChange={handleChange}
          error={!!authState.error?.parent_name || !!formErrors.parent_name}
          helperText={authState.error?.parent_name?.[0] || formErrors.parent_name}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          name="parent_phone"
          label="Parent/Guardian Phone"
          fullWidth
          required
          value={formData.parent_phone}
          onChange={handleChange}
          error={!!authState.error?.parent_phone || !!formErrors.parent_phone}
          helperText={authState.error?.parent_phone?.[0] || formErrors.parent_phone}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Current Class</InputLabel>
          <Select
            name="current_class"
            value={formData.current_class}
            label="Current Class"
            onChange={handleChange}
            error={!!authState.error?.current_class || !!formErrors.current_class}
            
          >
            {classes.map((cls) => (
              <MenuItem key={cls.id} value={cls.id}>
                {cls.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </>
  );

  const AccountSecuritySection = () => (
    <>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom sx={{ borderBottom: '1px solid #eee', pb: 1, mt: 2 }}>
          Account Security
        </Typography>
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          id="password"
          autoComplete="new-password"
          value={formData.password}
          onChange={handleChange}
          onKeyDown={(e) => handleKeyDown(e, 'password')}
          inputRef={passwordRef}
          error={!!authState.error?.password || !!formErrors.password}
          helperText={authState.error?.password?.[0] || formErrors.password}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockOutlined color="action" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={togglePasswordVisibility}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          margin="normal"
          required
          fullWidth
          name="re_password"
          label="Confirm Password"
          type={showPassword ? 'text' : 'password'}
          id="re_password"
          autoComplete="new-password"
          value={formData.re_password}
          onChange={handleChange}
          error={!!authState.error?.re_password || !!formErrors.re_password}
          helperText={authState.error?.re_password?.[0] || formErrors.re_password}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockOutlined color="action" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={togglePasswordVisibility}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Grid>
    </>
  );

  // Form Components
  const loginForm = <GlobalLogin userType={STUDENT_USER_ROLE} />;

  const registerForm = (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box component="form" onSubmit={handleRegister} sx={{ maxWidth: 800, mx: 'auto' }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
          Student Registration
        </Typography>

        <Grid container spacing={3}>
          <PersonalInformationSection />
          <StudentInformationSection />
          <AccountSecuritySection />

          {(authState.error?.detail || authState.error?.non_field_errors || Object.keys(formErrors).length > 0) && (
            <Grid item xs={12}>
              <Alert severity="error" sx={{ mt: 3 }}>
                {formatDjangoErrors(authState.error)}
                {Object.values(formErrors).map((error, index) => (
                  <div key={index}>{error}</div>
                ))}
              </Alert>
            </Grid>
          )}

          <Grid item xs={12}>
            <Button
              variant="contained"
              size="large"
              fullWidth
              type="submit"
              sx={{ mt: 3 }}
              disabled={authState.loading}
            >
              {authState.loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Register Student'
              )}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: 4,
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