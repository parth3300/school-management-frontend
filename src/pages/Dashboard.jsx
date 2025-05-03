import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Announcement,
  Person
} from '@mui/icons-material';
import { fetchAnnouncements } from '../redux/slices/announcementSlice';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';

// Styled Components
const GradientCard = styled(Card)(({ theme }) => ({
  background: theme.palette.mode === 'dark' 
    ? 'linear-gradient(145deg, #2d2d2d 0%, #1e1e1e 100%)'
    : 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
  borderRadius: '16px',
  boxShadow: theme.shadows[4],
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  },
  height: '100%',
  cursor: 'pointer',
}));

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Redux state
  const authState = useSelector((state) => state.auth || {});
  const announcementState = useSelector((state) => state.announcement || {});

  const { 
    user = null, 
    isAuthenticated = false 
  } = authState;
  
  const { 
    announcements = [], 
    loading: announcementsLoading = false,
    error: announcementsError = null
  } = announcementState;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    dispatch(fetchAnnouncements());
  }, [dispatch, isAuthenticated, navigate]);

  // Loading state
  if (!user || announcementsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  // Error state
  if (announcementsError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {announcementsError?.message || 'Error loading announcements'}
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </Box>
    );
  }

  const firstName = user?.first_name || '';
  const lastName = user?.last_name || '';
  const email = user?.email || '';

  // Navigation handler
  const navigateTo = (path) => navigate(path);

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid date';
    }
  };

  // Profile data
  const profileData = [
    { label: 'Name', value: `${firstName} ${lastName}` },
    { label: 'Email', value: email },
    { label: 'Role', value: user?.role === 'TEACHER' ? 'Teacher' : 'Student' }
  ];

  return (
    <Box 
      sx={{ 
        flexGrow: 1,
        p: isMobile ? 2 : 3,
        ml: { sm: `${240}px` },
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(145deg, #121212 0%, #1a1a1a 100%)'
          : 'linear-gradient(145deg, #f0f2f5 0%, #ffffff 100%)',
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          mb: 4,
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'flex-start' : 'center',
          gap: 2 
        }}>
          <Box>
            <Typography 
              variant={isMobile ? 'h5' : 'h4'} 
              component="h1"
              sx={{
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                backgroundClip: 'text',
                textFillColor: 'transparent',
                fontWeight: 'bold',
                lineHeight: 1.2
              }}
            >
              Welcome, {firstName}!
            </Typography>
          </Box>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Avatar 
              sx={{ 
                bgcolor: 'primary.main', 
                width: isMobile ? 48 : 56, 
                height: isMobile ? 48 : 56,
                cursor: 'pointer',
                border: '2px solid',
                borderColor: 'primary.light',
                fontSize: isMobile ? '1.5rem' : '2rem'
              }}
              onClick={() => navigateTo('/profile')}
            >
              {firstName.charAt(0)}
            </Avatar>
          </motion.div>
        </Box>
      </motion.div>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid item xs={12} md={8}>
          {/* Recent Announcements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GradientCard>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Announcement 
                    sx={{ 
                      mr: 1,
                      color: theme.palette.warning.main
                    }} 
                  />
                  <Typography variant="h6">
                    Recent Announcements
                  </Typography>
                </Box>
                <List>
                  {announcements.slice(0, 3).map((announcement) => (
                    <React.Fragment key={announcement.id}>
                      <ListItem
                        sx={{
                          '&:hover': {
                            backgroundColor: theme.palette.action.hover,
                            borderRadius: '8px'
                          }
                        }}
                      >
                        <ListItemText
                          primary={
                            <Box>
                              <Typography fontWeight="medium">
                                {announcement.title}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Priority: {announcement.priority_display} | Audience: {announcement.audience_display}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography>{announcement.message}</Typography>
                              <Typography variant="caption" display="block">
                                {formatDate(announcement.start_date)} to {announcement.end_date ? formatDate(announcement.end_date) : 'No end date'}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                  {announcements.length === 0 && (
                    <ListItem>
                      <ListItemText primary="No announcements yet" />
                    </ListItem>
                  )}
                </List>
                {announcements.length > 0 && (
                  <Button 
                    sx={{ 
                      mt: 1,
                      textTransform: 'none',
                      borderRadius: '12px'
                    }}
                    variant="outlined"
                    onClick={() => navigateTo('/announcements')}
                  >
                    View All Announcements
                  </Button>
                )}
              </CardContent>
            </GradientCard>
          </motion.div>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={4}>
          {/* Profile Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <GradientCard>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Person 
                    sx={{ 
                      mr: 1,
                      color: theme.palette.success.main
                    }} 
                  />
                  <Typography variant="h6">
                    Profile Summary
                  </Typography>
                </Box>
                <List>
                  {profileData.map((item, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemText
                          primary={item.label}
                          secondary={
                            <Typography color="text.primary" fontWeight="medium">
                              {item.value}
                            </Typography>
                          }
                        />
                      </ListItem>
                      {index < profileData.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{ 
                    mt: 2,
                    borderRadius: '12px',
                    py: 1.5
                  }}
                  onClick={() => navigateTo('/profile')}
                >
                  View Full Profile
                </Button>
              </CardContent>
            </GradientCard>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;