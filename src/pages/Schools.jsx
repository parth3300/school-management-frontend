import { useEffect, useState, useRef } from 'react';
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
  Snackbar,
  Avatar,
  Chip,
  useTheme,
  useMediaQuery,
  DialogTitle,
  Dialog,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Search as SearchIcon,
  School as SchoolIcon,
  AddPhotoAlternate as AddPhotoAlternateIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  LocationOn,
  Language,
  CalendarToday,
  CloudUpload
} from '@mui/icons-material';
import RoleSelectionModal from './AUTH/RoleSelectionModal';
import SchoolLoginModal from './AUTH/SchoolLoginModal';
import API_ENDPOINTS from '../api/endpoints';
import RefreshIcoN from '@mui/icons-material/Refresh';
import { useNotifier } from '../components/common/NotificationContext';
import api from '../api/axios';

const Schools = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.school);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [reseedLoading, setReseedLoading] = useState(false);
  const [uploadingLogoForSchool, setUploadingLogoForSchool] = useState(null);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [pin, setPin] = useState(["", "", "", ""]);
  const inputsRef = useRef([]);
  const { notifySuccess, notifyError } = useNotifier();
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const fileInputRef = useRef(null);
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

    if (!file.type.match('image.*')) {
      notifyError('Invalid file type', 'Please upload an image file (JPEG, PNG)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      notifyError('File too large', 'Image must be less than 5MB');
      return;
    }

    setUploadingLogoForSchool(schoolId);

    try {
      await dispatch(uploadLogo({ schoolId, file })).unwrap();
      notifySuccess('Logo uploaded successfully', 'Your school logo has been updated');
      dispatch(fetchSchools());
    } catch (error) {
      notifyError('Upload failed', error?.response?.data?.detail || error.message || 'Please try again');
    } finally {
      setUploadingLogoForSchool(null);
    }
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const focusInput = (idx) => {
    if (inputsRef.current && inputsRef.current[idx]) {
      inputsRef.current[idx].focus();
    }
  };

  const handleChange = (value, idx) => {
    if (!/^[0-9]?$/.test(value)) return;
    const next = [...pin];
    next[idx] = value;
    setPin(next);

    if (value && idx < 3) focusInput(idx + 1);
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !pin[idx] && idx > 0) {
      focusInput(idx - 1);
    }
  };

  const handleConfirm = async () => {
    const code = pin.join("");
    setPasswordDialogOpen(false);
    setReseedLoading(true);

    try {
      await api.post(API_ENDPOINTS.resseed, { password: code });
      notifySuccess('Database reseeded. New sample data has been generated.');
    } catch (err) {
      console.log("eerer",err);
      
      notifyError(`Reseed failed: ${err?.response?.data?.detail || 'Invalid PIN'}`);
    } finally {
      setReseedLoading(false);
      setPin(["", "", "", ""]);
    }
  };

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Error loading schools: {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
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
          {notification.message}
        </Alert>
      </Snackbar>

      {selectedSchool && (
        <SchoolLoginModal
          open={loginModalOpen}
          onClose={() => setLoginModalOpen(false)}
          school={selectedSchool}
          onSuccess={handleLoginSuccess}
        />
      )}

      {selectedSchool && (
        <RoleSelectionModal
          open={roleModalOpen}
          onClose={() => setRoleModalOpen(false)}
          schoolId={selectedSchool.id}
        />
      )}

      <Paper 
        elevation={2} 
        sx={{ 
          p: 4, 
          mb: 4,
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(145deg, #1e1e1e 0%, #2d2d2d 100%)'
            : 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)'
        }}
      >
        <Box 
          display="flex" 
          flexDirection={isMobile ? 'column' : 'row'} 
          justifyContent="space-between" 
          alignItems={isMobile ? 'flex-start' : 'center'} 
          gap={3}
          mb={4}
        >
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
              <SchoolIcon fontSize="large" sx={{ mr: 1, verticalAlign: 'middle' }} />
              Select Your School
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {schools.length} schools available
            </Typography>
          </Box>

          <Box display="flex" gap={2} alignItems="center">
            <Button
              variant="outlined"
              startIcon={
                reseedLoading ? (
                  <CircularProgress size={20} sx={{ color: 'success.main' }} />
                ) : (
                  <RefreshIcoN />
                )
              }
              onClick={() => setPasswordDialogOpen(true)}
              disabled={reseedLoading}
              sx={{
                whiteSpace: 'nowrap',
                borderRadius: 50,
                px: 2,
                textTransform: 'none',
              }}
            >
              {reseedLoading ? 'Seeding...' : 'Get New Data'}
            </Button>

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
                sx: {
                  borderRadius: 50,
                  backgroundColor: theme.palette.background.paper
                }
              }}
              sx={{ 
                width: isMobile ? '100%' : 350,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 50
                }
              }}
            />
          </Box>
        </Box>

        <Dialog open={passwordDialogOpen} onClose={() => setPasswordDialogOpen(false)}>
          <DialogTitle>Enter 4-Digit Admin PIN</DialogTitle>
          <DialogContent sx={{ mt: 1, mb: 1 }}>
            <Box display="flex" gap={2} justifyContent="center">
              {pin.map((digit, idx) => (
                <TextField
                  key={idx}
                  inputRef={(el) => (inputsRef.current[idx] = el)}
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  inputProps={{
                    maxLength: 1,
                    style: {
                      textAlign: "center",
                      fontSize: "1.5rem",
                      width: "3rem",
                      height: "3rem",
                    },
                  }}
                  variant="outlined"
                />
              ))}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPasswordDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleConfirm}
              variant="contained"
              disabled={pin.some((d) => d === "")}
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>

        {filteredSchools.length === 0 ? (
          <Box 
            textAlign="center" 
            py={6}
            sx={{
              background: theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.05)' 
                : 'rgba(0, 0, 0, 0.05)',
              borderRadius: 2
            }}
          >
            <Typography variant="h6" color="textSecondary" gutterBottom>
              No schools found matching your search
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Try different search terms
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredSchools.map((school) => (
              <Grid item xs={12} sm={6} md={4} key={school.id}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: theme.shadows[6],
                    },
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 3,
                    overflow: 'hidden'
                  }}
                >
                  <Box 
                    sx={{ 
                      position: 'relative', 
                      height: 180,
                      backgroundColor: theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.05)' 
                        : 'rgba(0, 0, 0, 0.05)'
                    }}
                  >
                    {school.logo ? (
                      <>
                        <CardMedia
                          component="img"
                          image={school.logo}
                          alt={school.name}
                          sx={{
                            width: '80%',
                            height: 150,
                            objectFit: 'contain',
                            p: 3,
                            bgcolor: 'grey.100',
                            borderRadius: 2
                          }}

                        />
                        <IconButton
                          component="label"
                          size="small"
                          disabled={uploadingLogoForSchool !== null}
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            color: 'white',
                            '&:hover': {
                              backgroundColor: 'rgba(0, 0, 0, 0.7)'
                            }
                          }}
                        >
                          {uploadingLogoForSchool === school.id ? (
                            <CircularProgress size={24} color="inherit" />
                          ) : (
                            <AddPhotoAlternateIcon fontSize="small" />
                          )}
                          <input
                            type="file"
                            ref={fileInputRef}
                            hidden
                            accept="image/*"
                            onChange={(e) => handleLogoUpload(e, school.id)}
                            disabled={uploadingLogoForSchool !== null}
                          />
                        </IconButton>
                      </>
                    ) : (
                      <Box
                        height="100%"
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        gap={2}
                      >
                        <Avatar
                          sx={{ 
                            width: 80, 
                            height: 80,
                            backgroundColor: theme.palette.mode === 'dark' 
                              ? 'rgba(255, 255, 255, 0.1)' 
                              : 'rgba(0, 0, 0, 0.1)'
                          }}
                        >
                          <SchoolIcon fontSize="large" />
                        </Avatar>
                        <Button
                          variant="contained"
                          component="label"
                          startIcon={<CloudUpload />}
                          size="small"
                          disabled={uploadingLogoForSchool !== null}
                          sx={{
                            backgroundColor: theme.palette.mode === 'dark' 
                              ? 'rgba(255, 255, 255, 0.1)' 
                              : 'rgba(0, 0, 0, 0.1)',
                            color: theme.palette.text.primary,
                            '&:hover': {
                              backgroundColor: theme.palette.mode === 'dark' 
                                ? 'rgba(255, 255, 255, 0.2)' 
                                : 'rgba(0, 0, 0, 0.2)'
                            }
                          }}
                        >
                          {uploadingLogoForSchool === school.id ? 'Uploading...' : 'Add Logo'}
                          <input
                            type="file"
                            ref={fileInputRef}
                            hidden
                            accept="image/*"
                            onChange={(e) => handleLogoUpload(e, school.id)}
                            disabled={uploadingLogoForSchool !== null}
                          />
                        </Button>
                      </Box>
                    )}
                  </Box>

                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="div" noWrap>
                      {school.name}
                    </Typography>
                    
                    <Box sx={{ mb: 1, height: 50, overflow: 'hidden' }}>
                      <Box display="flex" alignItems="flex-start" gap={1}>
                        <LocationOn fontSize="small" color="action" sx={{ mt: 0 }} />
                        <Typography variant="body2" color="text.secondary" sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {school.address}
                        </Typography>
                      </Box>
                    </Box>
                    
                    {school.website && (
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <Language fontSize="small" color="action" />
                        <Typography 
                          variant="body2" 
                          color="primary"
                          sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                          onClick={() => window.open(school.website, '_blank')}
                        >
                          Visit Website
                        </Typography>
                      </Box>
                    )}
                    
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <CalendarToday fontSize="small" color="action" />
                      <Typography variant="caption" color="text.secondary">
                        Established: {new Date(school.established_date).getFullYear()}
                      </Typography>
                    </Box>
                    
                    <Chip 
                      label="Select to continue" 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                      sx={{ mt: 1 }}
                    />
                  </CardContent>
                  
                  <Box sx={{ p: 2 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => handleSchoolClick(school)}
                      disabled={uploadingLogoForSchool !== null}
                      sx={{
                        borderRadius: 50,
                        py: 1.5,
                        background: theme.palette.mode === 'dark'
                          ? 'linear-gradient(45deg, #64b5f6 30%, #ba68c8 90%)'
                          : 'linear-gradient(45deg, #1976d2 30%, #9c27b0 90%)',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: theme.shadows[4]
                        }
                      }}
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