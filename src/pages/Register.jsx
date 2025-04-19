import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { register } from '../redux/slices/authSlice';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
  Grid,
  Paper,
  Avatar,
  CssBaseline,
  Link,
  Divider,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  LockOutlined,
  Visibility,
  VisibilityOff,
  Person,
  School,
  Phone,
  Home,
  Cake,
  Work,
  People,
  Badge,
  PersonPin,
  Image
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import API_ENDPOINTS from '../api/endpoints';
import api from '../api/axios';

const defaultTheme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

const Register = () => {
  const [userType, setUserType] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    date_of_birth: '',
    qualification: '',
    joining_date: '',
    gender: '',
    parent_name: '',
    parent_phone: '',
    current_class: '',
    subjects: []
  });

  // Create refs for all input fields
  const usernameRef = useRef(null);
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const phoneRef = useRef(null);
  const dobRef = useRef(null);
  const addressRef = useRef(null);
  const qualificationRef = useRef(null);
  const joiningDateRef = useRef(null);
  const parentNameRef = useRef(null);
  const parentPhoneRef = useRef(null);
  const classRef = useRef(null);
  const profilePicRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  // Fetch classes and subjects from API
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoadingClasses(true);
      setLoadingSubjects(true);
      try {
        const [classesResponse, subjectsResponse] = await Promise.all([
          api.get(API_ENDPOINTS.classes),
          api.get(API_ENDPOINTS.subjects)
        ]);
        setClasses(classesResponse.data);
        setSubjects(subjectsResponse.data);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        setLoadingClasses(false);
        setLoadingSubjects(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setProfilePicPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Create FormData object to handle file upload
    const formDataObj = new FormData();
    
    // Append all form data
    for (const key in formData) {
      if (Array.isArray(formData[key])) {
        formData[key].forEach(item => formDataObj.append(key, item));
      } else {
        formDataObj.append(key, formData[key]);
      }
    }
    
    // Append profile picture if exists
    if (profilePic) {
      formDataObj.append('profile_pic', profilePic);
    }
    
    // Append user type
    formDataObj.append('user_type', userType);

    const result = await dispatch(register(formDataObj));
    
    if (result.payload) {
      navigate('/dashboard');
    }
  };

  // Handle Enter key press to move to next field or submit
  const handleKeyDown = (e, nextFieldRef) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (nextFieldRef && nextFieldRef.current) {
        nextFieldRef.current.focus();
      } else {
        // If no next field, submit the form
        handleSubmit(e);
      }
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="md">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Paper elevation={6} sx={{ p: 4, width: '100%', borderRadius: 2 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mb: 3
              }}
            >
              <Avatar 
                sx={{ 
                  m: 1, 
                  bgcolor: 'secondary.main',
                  width: 80,
                  height: 80
                }}
                src={profilePicPreview}
              >
                {!profilePicPreview && <LockOutlined />}
              </Avatar>
              <Typography component="h1" variant="h4">
                Create Account
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Please fill in this form to create an account
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
              <FormLabel component="legend" sx={{ mb: 1, fontWeight: 'bold' }}>
                I am registering as:
              </FormLabel>
              <RadioGroup
                row
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                sx={{ justifyContent: 'center' }}
              >
                <FormControlLabel 
                  value="student" 
                  control={<Radio color="primary" />} 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <School sx={{ mr: 1 }} /> Student
                    </Box>
                  } 
                />
                <FormControlLabel 
                  value="teacher" 
                  control={<Radio color="primary" />} 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Work sx={{ mr: 1 }} /> Teacher
                    </Box>
                  } 
                />
              </RadioGroup>
            </FormControl>

            {error && (
              <Alert 
                severity="error" 
                sx={{ width: '100%', mb: 3 }}
                onClose={() => {}}
              >
                {typeof error === 'object' ? JSON.stringify(error) : error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <Grid container spacing={3}>
                {/* Profile Picture Upload */}
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    startIcon={<Image />}
                    sx={{ py: 2 }}
                  >
                    Upload Profile Picture
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleFileChange}
                      ref={profilePicRef}
                    />
                  </Button>
                  {profilePic && (
                    <Typography variant="caption" color="text.secondary">
                      {profilePic.name}
                    </Typography>
                  )}
                </Grid>

                {/* Username Field */}
                <Grid item xs={12}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    onKeyDown={(e) => handleKeyDown(e, firstNameRef)}
                    inputRef={usernameRef}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonPin color="action" />
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
                    label="First Name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    onKeyDown={(e) => handleKeyDown(e, lastNameRef)}
                    inputRef={firstNameRef}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person color="action" />
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
                    label="Last Name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    onKeyDown={(e) => handleKeyDown(e, emailRef)}
                    inputRef={lastNameRef}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    onKeyDown={(e) => handleKeyDown(e, passwordRef)}
                    inputRef={emailRef}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Badge color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    onKeyDown={(e) => handleKeyDown(e, phoneRef)}
                    inputRef={passwordRef}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlined color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                
                {/* Class Dropdown - Only for Students */}
                {userType === 'student' && (
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth margin="normal" sx={{ minWidth: 100 }}>
                      <InputLabel>Class</InputLabel>
                      <Select
                        name="current_class"
                        value={formData.current_class}
                        label="Class"
                        onChange={handleChange}
                        onKeyDown={(e) => handleKeyDown(e, phoneRef)}
                        inputRef={classRef}
                        disabled={loadingClasses}
                      >
                        {loadingClasses ? (
                          <MenuItem disabled>Loading classes...</MenuItem>
                        ) : (
                          classes.map((cls) => (
                            <MenuItem key={cls.id} value={cls.id}>
                              {cls.name} {cls.section ? `(${cls.section})` : ''}
                            </MenuItem>
                          ))
                        )}
                      </Select>
                    </FormControl>
                  </Grid>
                )}

                {/* Subjects Dropdown - Only for Teachers */}
                {userType === 'teacher' && (
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth margin="normal" sx={{ minWidth: 100 }}>
                      <InputLabel>Subjects</InputLabel>
                      <Select
                        name="subjects"
                        multiple
                        value={formData.subjects}
                        label="Subjects"
                        onChange={handleChange}
                        onKeyDown={(e) => handleKeyDown(e, phoneRef)}
                        disabled={loadingSubjects}
                      >
                        {loadingSubjects ? (
                          <MenuItem disabled>Loading subjects...</MenuItem>
                        ) : (
                          subjects.map((subject) => (
                            <MenuItem key={subject.id} value={subject.id}>
                              {subject.name}
                            </MenuItem>
                          ))
                        )}
                      </Select>
                    </FormControl>
                  </Grid>
                )}

                <Grid item xs={12} sm={6}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="phone"
                    label="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    onKeyDown={(e) => handleKeyDown(e, dobRef)}
                    inputRef={phoneRef}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone color="action" />
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
                    name="date_of_birth"
                    label="Date of Birth"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    onKeyDown={(e) => handleKeyDown(e, addressRef)}
                    inputRef={dobRef}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Cake color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="address"
                    label="Address"
                    multiline
                    rows={2}
                    value={formData.address}
                    onChange={handleChange}
                    onKeyDown={(e) => {
                      if (userType === 'teacher') {
                        handleKeyDown(e, qualificationRef);
                      } else {
                        handleKeyDown(e, parentNameRef);
                      }
                    }}
                    inputRef={addressRef}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Home color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {userType === 'teacher' ? (
                  <>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="qualification"
                        label="Qualification"
                        value={formData.qualification}
                        onChange={handleChange}
                        onKeyDown={(e) => handleKeyDown(e, joiningDateRef)}
                        inputRef={qualificationRef}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <School color="action" />
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
                        name="joining_date"
                        label="Joining Date"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={formData.joining_date}
                        onChange={handleChange}
                        onKeyDown={(e) => handleKeyDown(e, null)} // Submit form
                        inputRef={joiningDateRef}
                      />
                    </Grid>
                  </>
                ) : (
                  <>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth margin="normal" sx={{ minWidth: 100 }}>
                        <InputLabel>Gender</InputLabel>
                        <Select
                          name="gender"
                          value={formData.gender}
                          label="Gender"
                          onChange={handleChange}
                          onKeyDown={(e) => handleKeyDown(e, parentNameRef)}
                        >
                          <MenuItem value="M">Male</MenuItem>
                          <MenuItem value="F">Female</MenuItem>
                          <MenuItem value="O">Other</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="parent_name"
                        label="Parent/Guardian Name"
                        value={formData.parent_name}
                        onChange={handleChange}
                        onKeyDown={(e) => handleKeyDown(e, parentPhoneRef)}
                        inputRef={parentNameRef}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <People color="action" />
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
                        name="parent_phone"
                        label="Parent/Guardian Phone"
                        value={formData.parent_phone}
                        onChange={handleChange}
                        onKeyDown={(e) => handleKeyDown(e, null)} // Submit form
                        inputRef={parentPhoneRef}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Phone color="action" />
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
                        name="qualification"
                        label="Qualification"
                        value={formData.qualification}
                        onChange={handleChange}
                        onKeyDown={(e) => handleKeyDown(e, joiningDateRef)}
                        inputRef={qualificationRef}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <School color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </>
                )}
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, py: 1.5 }}
                disabled={loading}
                size="large"
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Register Now'
                )}
              </Button>

              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link component={RouterLink} to="/login" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Register;