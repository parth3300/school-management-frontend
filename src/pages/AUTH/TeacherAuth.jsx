import React, { useState, useEffect } from 'react';
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
  Chip,
  IconButton,
  InputAdornment
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AuthCard from './AuthCard';
import GlobalLogin from './GlobalLogin';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearAuthError } from '../../redux/slices/authSlice';
import { formatDjangoErrors } from '../../components/common/errorHelper';
import { TEACHER_USER_ROLE } from '../../components/common/constants';
import { selectAllSubjects, fetchSubjects } from '../../redux/slices/subjectSlice';

const TeacherAuth = () => {
  const [flipped, setFlipped] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

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
    role: 'teacher',
    
    // Teacher model fields
    joining_date: null,
    qualification: '',
    subjects: [],
    school: '',
    
    // Auth fields
    password: '',
    re_password: ''
  });

  // Get data from Redux store
  const subjects = useSelector(selectAllSubjects);

  useEffect(() => {
    dispatch(clearAuthError());
    if (flipped) {
      dispatch(fetchSubjects());
    }
  }, [dispatch, flipped]);

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

  const handleSubjectChange = (event) => {
    const { value } = event.target;
    setFormData(prev => ({
      ...prev,
      subjects: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    dispatch(clearAuthError());

    // Format dates to ISO string
    const payload = {
      ...formData,
      date_of_birth: formData.date_of_birth?.toISOString(),
      joining_date: formData.joining_date?.toISOString()
    };
    
    const result = await dispatch(register(payload));

    if (register.fulfilled.match(result)) {
      setFlipped(false);
    }
  };

  const loginForm = <GlobalLogin userType={TEACHER_USER_ROLE} />;

  const registerForm = (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box component="form" onSubmit={handleRegister} sx={{ maxWidth: 800, mx: 'auto' }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
          Teacher Registration
        </Typography>

        <Grid container spacing={3}>
          {/* User Information Section */}
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

          {/* Teacher Information Section */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ borderBottom: '1px solid #eee', pb: 1, mt: 2 }}>
              Teacher Information
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <DatePicker
              label="Joining Date"
              value={formData.joining_date}
              onChange={handleDateChange('joining_date')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  required
                  error={!!authState.error?.joining_date}
                  helperText={authState.error?.joining_date?.[0]}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              name="qualification"
              label="Qualification"
              fullWidth
              required
              value={formData.qualification}
              onChange={handleChange}
              error={!!authState.error?.qualification}
              helperText={authState.error?.qualification?.[0]}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box minHeight={80}>
              <FormControl fullWidth error={!!authState.error?.subjects}>
                <InputLabel id="subjects-label">Subjects</InputLabel>
                <Select
                  labelId="subjects-label"
                  name="subjects"
                  multiple
                  value={formData.subjects}
                  onChange={handleSubjectChange}
                  label="Subjects"
                  displayEmpty
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => {
                        const subject = subjects.find((s) => s.id === value);
                        return <Chip key={value} label={subject?.name} color="primary" />;
                      })}
                    </Box>
                  )}
                >
                  {subjects.map((subject) => {
                    const isSelected = formData.subjects.includes(subject.id);
                    return (
                      <MenuItem
                        key={subject.id}
                        value={subject.id}
                        sx={{
                          backgroundColor: isSelected ? 'rgba(25, 118, 210, 0.1)' : 'inherit',
                          fontWeight: isSelected ? 'bold' : 'normal',
                          color: isSelected ? '#1976d2' : 'inherit',
                          '&:hover': {
                            backgroundColor: 'rgba(25, 118, 210, 0.2)',
                          },
                        }}
                      >
                        {subject.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Box>
          </Grid>

          {/* Authentication Section */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ borderBottom: '1px solid #eee', pb: 1, mt: 2 }}>
              Account Security
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              required
              value={formData.password}
              onChange={handleChange}
              error={!!authState.error?.password}
              helperText={authState.error?.password?.[0]}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
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
              name="re_password"
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              required
              value={formData.re_password}
              onChange={handleChange}
              error={!!authState.error?.re_password}
              helperText={authState.error?.re_password?.[0]}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>

        {(authState.error?.detail || authState.error?.non_field_errors) && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {formatDjangoErrors(authState.error)}
          </Alert>
        )}

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
            'Register Teacher'
          )}
        </Button>
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

export default TeacherAuth;