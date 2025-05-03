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
      try {
        setLoadingClasses(true);
        setLoadingSubjects(true);
        
        const [classesResponse, subjectsResponse] = await Promise.all([
          api.get(API_ENDPOINTS.classes),
          api.get(API_ENDPOINTS.subjects)
        ]);
        
        // Validate responses before setting state
        if (classesResponse.data && Array.isArray(classesResponse.data)) {
          setClasses(classesResponse.data);
        } else {
          console.error('Invalid classes data format:', classesResponse.data);
          setClasses([]); // Set to empty array as fallback
        }
        
        if (subjectsResponse.data && Array.isArray(subjectsResponse.data)) {
          setSubjects(subjectsResponse.data);
        } else {
          console.error('Invalid subjects data format:', subjectsResponse.data);
          setSubjects([]); // Set to empty array as fallback
        }
        
      } catch (error) {
        console.error('Error fetching initial data:', error);
        // Optionally set error state to display to user
        // setError('Failed to load initial data. Please refresh the page.');
        
        // Set empty arrays as fallback
        setClasses([]);
        setSubjects([]);
        
      } finally {
        setLoadingClasses(false);
        setLoadingSubjects(false);
      }
    };
  
    fetchInitialData();
    
    // Cleanup function (optional)
    return () => {
      // Cancel any pending requests if component unmounts
      // You might need an axios cancel token if using axios
    };
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };



  // Modify the file change handler
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setProfilePicPreview(URL.createObjectURL(file));
      setFormData(prevState => ({
        ...prevState,
        profile_pic: file
      }));
    }
  };

  const handleMultiSelectChange = (e) => {
    const { value } = e.target; // Material-UI Select multiple returns the array directly
    setFormData(prevState => ({
      ...prevState,
      subjects: value
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Create FormData for file upload
    const formDataWithFile = new FormData();
    for (const key in formData) {
      if (key === 'subjects') {
        formData[key].forEach(subject => formDataWithFile.append('subjects', subject));
      } else {
        formDataWithFile.append(key, formData[key]);
      }
    }
    if (profilePic) {
      formDataWithFile.append('profile_pic', profilePic);
    }
  
    try {
      const result = await dispatch(register({
        ...formData,
        userType,
        profile_pic: profilePic
      }));
      
      // Only navigate if registration was successful
      if (register.fulfilled.match(result)) {
        navigate('/login');
      }
    } catch (error) {
      console.error('Registration error:', error);
      // Error will be automatically handled by the authSlice
    }
  };
    // Append profile picture
  // Update the Select components to use handleSelectChange

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
    {typeof error === 'string' ? (
      error
    ) : typeof error === 'object' ? (
      <>
        {Object.entries(error).map(([field, messages]) => {
          if (typeof messages === 'object' && !Array.isArray(messages)) {
            // Nested error like "user": { "username": [...], "email": [...] }
            return Object.entries(messages).map(([nestedField, nestedMessages]) => (
              <div key={`${field}-${nestedField}`}>
                <strong>{nestedField.charAt(0).toUpperCase() + nestedField.slice(1)}:</strong>{' '}
                {Array.isArray(nestedMessages)
                  ? nestedMessages.join(' ')
                  : nestedMessages}
              </div>
            ));
          } else {
            // Regular error like "email": ["error msg"]
            return (
              <div key={field}>
                <strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong>{' '}
                {Array.isArray(messages) ? messages.join(' ') : messages}
              </div>
            );
          }
        })}
      </>
    ) : (
      'An unknown error occurred.'
    )}
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
        onChange={handleMultiSelectChange}
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