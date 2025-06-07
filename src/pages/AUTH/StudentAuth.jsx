import React, { useState, useEffect } from 'react';
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
  Grid
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// Components
import AuthCard from './AuthCard';
import GlobalLogin from './GlobalLogin';

// Redux
import { register, clearAuthError } from '../../redux/slices/authSlice';
import { selectAllClasses, fetchClasses } from '../../redux/slices/classSlice';

// Helpers
import { formatDjangoErrors } from '../../components/common/errorHelper';
import { STUDENT_USER_ROLE } from '../../components/common/constants';

const StudentAuth = () => {
  // State Management
  const [flipped, setFlipped] = useState(false);
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

  // Redux Hooks
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const classes = useSelector(selectAllClasses);

  // Effects
  useEffect(() => {
    dispatch(clearAuthError());
    dispatch(fetchClasses());
  }, [dispatch, flipped]);

  // Event Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

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

  const handleRegister = async (e) => {
    e.preventDefault();
    dispatch(clearAuthError());

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
          error={!!authState.error?.name}
          helperText={authState.error?.name?.[0]}
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
          error={!!authState.error?.email}
          helperText={authState.error?.email?.[0]}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          name="first_name"
          label="First Name"
          fullWidth
          value={formData.first_name}
          onChange={handleChange}
          error={!!authState.error?.first_name}
          helperText={authState.error?.first_name?.[0]}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          name="last_name"
          label="Last Name"
          fullWidth
          value={formData.last_name}
          onChange={handleChange}
          error={!!authState.error?.last_name}
          helperText={authState.error?.last_name?.[0]}
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
            error={!!authState.error?.gender}
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
              error={!!authState.error?.date_of_birth}
              helperText={authState.error?.date_of_birth?.[0]}
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
          error={!!authState.error?.phone}
          helperText={authState.error?.phone?.[0]}
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
          error={!!authState.error?.address}
          helperText={authState.error?.address?.[0]}
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
              error={!!authState.error?.admission_date}
              helperText={authState.error?.admission_date?.[0]}
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
          error={!!authState.error?.parent_name}
          helperText={authState.error?.parent_name?.[0]}
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
          error={!!authState.error?.parent_phone}
          helperText={authState.error?.parent_phone?.[0]}
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
            error={!!authState.error?.current_class}
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
          name="password"
          label="Password"
          type="password"
          fullWidth
          required
          value={formData.password}
          onChange={handleChange}
          error={!!authState.error?.password}
          helperText={authState.error?.password?.[0]}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          name="re_password"
          label="Confirm Password"
          type="password"
          fullWidth
          required
          value={formData.re_password}
          onChange={handleChange}
          error={!!authState.error?.re_password}
          helperText={authState.error?.re_password?.[0]}
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

          {(authState.error?.detail || authState.error?.non_field_errors) && (
            <Grid item xs={12}>
              <Alert severity="error" sx={{ mt: 3 }}>
                {formatDjangoErrors(authState.error)}
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