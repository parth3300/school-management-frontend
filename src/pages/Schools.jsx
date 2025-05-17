import { useEffect, useState, useRef, createRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSchools, uploadLogo } from '../redux/slices/schoolSlice';
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Container,
  Box,
  Paper,
  InputAdornment,
  CircularProgress,
  Alert,
  TextField,
  Button,
  IconButton,
  Snackbar
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SchoolIcon from '@mui/icons-material/School';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import RoleSelectionModal from './AUTH/RoleSelectionModal';
import SchoolLoginModal from './AUTH/SchoolLoginModal';

const Schools = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.school);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [uploadingLogoForSchool, setUploadingLogoForSchool] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' // 'success' | 'error' | 'info' | 'warning'
  });
  const fileInputRefs = useRef({});
  const schools = useSelector((state) => state.school.data) || [];


  useEffect(() => {
    dispatch(fetchSchools());
  }, [dispatch]);

  const filteredSchools = schools.filter((school) =>
    school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSchoolClick = (school) => {
    setSelectedSchool(school);
    setLoginModalOpen(true);
  };

  const handleLoginSuccess = () => {
    setLoginModalOpen(false);
    setRoleModalOpen(true);
  };

  const handleLogoUpload = async (event, schoolId) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.match('image.*')) {
      setNotification({
        open: true,
        message: 'Invalid file type',
        severity: 'error',
        details: 'Please upload an image file (JPEG, PNG)'
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setNotification({
        open: true,
        message: 'File too large',
        severity: 'error',
        details: 'Image must be less than 5MB'
      });
      return;
    }

    setUploadingLogoForSchool(schoolId);

    try {
      await dispatch(uploadLogo({ schoolId, file })).unwrap();
      
      setNotification({
        open: true,
        message: 'Logo uploaded successfully!',
        severity: 'success'
      });
      
      // Refresh schools data after successful upload
      dispatch(fetchSchools());
    } catch (error) {
      console.error('Logo upload failed:', error);
      setNotification({
        open: true,
        message: 'Failed to upload logo',
        severity: 'error',
        details: error.message || 'Please try again'
      });
    } finally {
      setUploadingLogoForSchool(null);
    }
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const getFileInputRef = (schoolId) => {
    if (!fileInputRefs.current[schoolId]) {
      fileInputRefs.current[schoolId] = createRef();
    }
    return fileInputRefs.current[schoolId];
  };

  if (loading && schools.length === 0) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Alert severity="error">Error loading schools: {error}</Alert>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          severity={notification.severity}
          onClose={handleCloseNotification}
          sx={{ width: '100%' }}
          iconMapping={{
            success: <CheckCircleIcon fontSize="inherit" />,
            error: <ErrorIcon fontSize="inherit" />
          }}
        >
          <Box>
            <Typography>{notification.message}</Typography>
            {notification.details && (
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {notification.details}
              </Typography>
            )}
          </Box>
        </Alert>
      </Snackbar>

      {/* School Login Modal */}
      {selectedSchool && (
        <SchoolLoginModal
          open={loginModalOpen}
          onClose={() => setLoginModalOpen(false)}
          school={selectedSchool}
          onSuccess={handleLoginSuccess}
        />
      )}

      {/* Role Selection Modal */}
      {selectedSchool && (
        <RoleSelectionModal
          open={roleModalOpen}
          onClose={() => setRoleModalOpen(false)}
          schoolId={selectedSchool.id}
        />
      )}

      <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            <SchoolIcon fontSize="large" sx={{ mr: 1, verticalAlign: 'middle' }} />
            Select Your School
          </Typography>
          
          <TextField
            variant="outlined"
            placeholder="Search schools..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: 300 }}
          />
        </Box>

        {filteredSchools.length === 0 ? (
          <Box textAlign="center" py={6}>
            <Typography variant="h6" color="textSecondary">
              No schools found matching your search
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {filteredSchools.map((school) => (
              <Grid item xs={12} sm={6} md={4} key={school.id}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 8,
                    }
                  }}
                >
                  {/* School Logo Section */}
                  <Box sx={{ position: 'relative', height: 160 }}>
                    {school.logo ? (
                      <>
                        <CardMedia
                          component="img"
                          height="160"
                          image={school.logo}
                          alt={school.name}
                          sx={{ 
                            objectFit: 'contain', 
                            p: 2,
                            width: '100%',
                            height: '100%'
                          }}
                        />
                        <Box sx={{ 
                          position: 'absolute', 
                          top: 8, 
                          right: 8,
                          backgroundColor: 'rgba(255, 255, 255, 0.8)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 40,
                          height: 40
                        }}>
                          {uploadingLogoForSchool === school.id ? (
                            <CircularProgress size={24} />
                          ) : (
                            <IconButton
                              component="label"
                              size="small"
                              disabled={uploadingLogoForSchool !== null}
                            >
                              <AddPhotoAlternateIcon color="primary" fontSize="small" />
                              <input
                                type="file"
                                ref={getFileInputRef(school.id)}
                                hidden
                                accept="image/*"
                                onChange={(e) => handleLogoUpload(e, school.id)}
                                disabled={uploadingLogoForSchool !== null}
                              />
                            </IconButton>
                          )}
                        </Box>
                      </>
                    ) : (
                      <>
                        <Box
                          height="100%"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          bgcolor="grey.100"
                        >
                          <SchoolIcon fontSize="large" color="action" />
                        </Box>
                        <Button
                          variant="contained"
                          component="label"
                          startIcon={<AddPhotoAlternateIcon />}
                          sx={{
                            position: 'absolute',
                            bottom: 16,
                            right: 16,
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 1)',
                            },
                            backdropFilter: 'blur(4px)'
                          }}
                          disabled={uploadingLogoForSchool !== null}
                        >
                          {uploadingLogoForSchool === school.id ? 'Uploading...' : 'Add Logo'}
                          <input
                            type="file"
                            ref={getFileInputRef(school.id)}
                            hidden
                            accept="image/*"
                            onChange={(e) => handleLogoUpload(e, school.id)}
                            disabled={uploadingLogoForSchool !== null}
                          />
                        </Button>
                      </>
                    )}
                  </Box>

                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="div">
                      {school.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {school.address}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {school.website}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                      Established: {new Date(school.established_date).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                  <Box sx={{ p: 2 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => handleSchoolClick(school)}
                      disabled={uploadingLogoForSchool !== null}
                    >
                      Select School
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Container>
  );
};

export default Schools;