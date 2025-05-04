import React, { useEffect, useState } from 'react';
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
  useMediaQuery,
  Chip,
  Paper,
  LinearProgress
} from '@mui/material';
import {
  Announcement,
  Person,
  Class,
  People,
  Assignment,
  School,
  Today,
  BarChart,
  EventNote,
  Grade
} from '@mui/icons-material';
import { fetchAnnouncements } from '../redux/slices/announcementSlice';
import { fetchTeacherClasses } from '../redux/slices/teacherSlice';
import { fetchTodayAttendance } from '../redux/slices/attendanceSlice';
import { fetchExamResultsSummary } from '../redux/slices/examResultsSlice';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import API_ENDPOINTS from '../api/endpoints';

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

const StatCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: theme.shadows[4],
  },
}));

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Local state
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalStudents: 0,
    attendanceRate: 0,
    pendingGrades: 0
  });

  // Redux state
  const authState = useSelector((state) => state.auth || {});
  const announcementState = useSelector((state) => state.announcement || {});
  const teacherState = useSelector((state) => state.teacher || {});
  const attendanceState = useSelector((state) => state.attendance || {});
  const examState = useSelector((state) => state.exam || {});

  const { 
    user = null, 
    isAuthenticated = false,
    teacherProfile = null
  } = authState;
  
  const { 
    announcements = [], 
    loading: announcementsLoading = false,
    error: announcementsError = null
  } = announcementState;

  const {
    classes = [],
    loading: classesLoading = false,
    error: classesError = null
  } = teacherState;

  const {
    stats: attendanceStats = null,
    loading: attendanceLoading = false,
    error: attendanceError = null
  } = attendanceState;

  const {
    summary: examSummary = null,
    loading: examLoading = false,
    error: examError = null
  } = examState;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const loadDashboardData = async () => {
      try {
        await Promise.all([
          dispatch(fetchAnnouncements()),
          dispatch(fetchTeacherClasses()),
          dispatch(fetchTodayAttendance()),
          dispatch(fetchExamResultsSummary())
        ]);

        // Calculate summary stats
        const totalStudents = classes.reduce((acc, cls) => acc + (cls.students_count || 0), 0);
        setStats({
          totalClasses: classes.length,
          totalStudents,
          attendanceRate: attendanceStats?.average_attendance_rate || 0,
          pendingGrades: examSummary?.pending_grades || 0
        });
      } catch (error) {
        console.error('Dashboard loading error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [dispatch, isAuthenticated, navigate, classes, attendanceStats, examSummary]);

  // Loading state
  if (loading || announcementsLoading || classesLoading || attendanceLoading || examLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  // Error states
  const errors = [announcementsError, classesError, attendanceError, examError].filter(Boolean);
  if (errors.length > 0) {
    return (
      <Box sx={{ p: 3 }}>
        {errors.map((error, index) => (
          <Alert key={index} severity="error" sx={{ mb: 2 }}>
            {error?.message || 'Error loading dashboard data'}
          </Alert>
        ))}
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  const firstName = user?.first_name || '';
  const lastName = user?.last_name || '';
  const email = user?.email || '';
  const profilePhoto = teacherProfile?.photo || null;

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

  // Format percentage
  const formatPercentage = (value) => {
    return Math.round((value || 0) * 100) + '%';
  };

  // Profile data
  const profileData = [
    { label: 'Name', value: `${firstName} ${lastName}` },
    { label: 'Email', value: email },
    { label: 'Subjects', value: teacherProfile?.subjects?.join(', ') || 'Not specified' },
    { label: 'Qualification', value: teacherProfile?.qualification || 'Not specified' }
  ];

  // Upcoming classes (mock data - would come from API in real app)
  const upcomingClasses = classes.slice(0, 3).map(cls => ({
    ...cls,
    nextSession: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    subject: cls.subjects?.[0] || 'General'
  }));

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
            <Typography variant="subtitle1" color="text.secondary">
              Here's what's happening today
            </Typography>
          </Box>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Avatar 
              src={profilePhoto ? `${API_ENDPOINTS.baseUrl}${profilePhoto}` : undefined}
              sx={{ 
                bgcolor: 'primary.main', 
                width: isMobile ? 48 : 56, 
                height: isMobile ? 48 : 56,
                cursor: 'pointer',
                border: '2px solid',
                borderColor: 'primary.light',
                fontSize: isMobile ? '1.5rem' : '2rem'
              }}
              onClick={() => navigateTo('/teacher/profile')}
            >
              {firstName.charAt(0)}
            </Avatar>
          </motion.div>
        </Box>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard onClick={() => navigateTo('/teacher/classes')}>
              <Class color="primary" fontSize="large" />
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Classes
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {stats.totalClasses}
                </Typography>
              </Box>
            </StatCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard onClick={() => navigateTo('/teacher/students')}>
              <People color="secondary" fontSize="large" />
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Students
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {stats.totalStudents}
                </Typography>
              </Box>
            </StatCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard onClick={() => navigateTo('/teacher/attendance')}>
              <Assignment color="success" fontSize="large" />
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Attendance Rate
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {formatPercentage(stats.attendanceRate)}
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={stats.attendanceRate * 100} 
                  sx={{ mt: 1, height: 6, borderRadius: 3 }}
                  color="success"
                />
              </Box>
            </StatCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard onClick={() => navigateTo('/teacher/exam-results')}>
              <Grade color="warning" fontSize="large" />
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Pending Grades
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {stats.pendingGrades}
                </Typography>
              </Box>
            </StatCard>
          </Grid>
        </Grid>
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
            <GradientCard onClick={() => navigateTo('/teacher/announcements')}>
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
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography fontWeight="medium">
                                {announcement.title}
                              </Typography>
                              {announcement.is_pinned && (
                                <Chip 
                                  label="Pinned" 
                                  size="small" 
                                  color="warning"
                                  icon={<Today fontSize="small" />}
                                />
                              )}
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" sx={{ mt: 0.5 }}>
                                {announcement.message}
                              </Typography>
                              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
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
              </CardContent>
            </GradientCard>
          </motion.div>

          {/* Upcoming Classes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{ marginTop: theme.spacing(3) }}
          >
            <GradientCard onClick={() => navigateTo('/teacher/classes')}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <EventNote 
                    sx={{ 
                      mr: 1,
                      color: theme.palette.info.main
                    }} 
                  />
                  <Typography variant="h6">
                    Upcoming Classes
                  </Typography>
                </Box>
                <List>
                  {upcomingClasses.map((cls) => (
                    <React.Fragment key={cls.id}>
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
                                {cls.name} - {cls.subject}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {cls.students_count} students
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" sx={{ mt: 0.5 }}>
                                Next session: {formatDate(cls.nextSession)}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                  {classes.length === 0 && (
                    <ListItem>
                      <ListItemText primary="No classes assigned" />
                    </ListItem>
                  )}
                </List>
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
            <GradientCard onClick={() => navigateTo('/teacher/profile')}>
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
              </CardContent>
            </GradientCard>
          </motion.div>

          {/* School Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            style={{ marginTop: theme.spacing(3) }}
          >
            <GradientCard onClick={() => navigateTo('/teacher/school-info')}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <School 
                    sx={{ 
                      mr: 1,
                      color: theme.palette.primary.main
                    }} 
                  />
                  <Typography variant="h6">
                    School Information
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {teacherProfile?.school?.name || 'School name not available'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Current Academic Year: {teacherProfile?.school?.current_academic_year?.name || 'Not specified'}
                </Typography>
              </CardContent>
            </GradientCard>
          </motion.div>

          {/* Performance Overview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            style={{ marginTop: theme.spacing(3) }}
          >
            <GradientCard onClick={() => navigateTo('/teacher/exam-results')}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <BarChart 
                    sx={{ 
                      mr: 1,
                      color: theme.palette.secondary.main
                    }} 
                  />
                  <Typography variant="h6">
                    Performance Overview
                  </Typography>
                </Box>
                {examSummary ? (
                  <Box>
                    <Typography variant="body2">
                      Top Performing Class: {examSummary.top_class?.name || 'N/A'} ({examSummary.top_class?.average || 0}%)
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Subjects Taught: {examSummary.subjects_taught || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Exams Graded: {examSummary.exams_graded || 0}/{examSummary.total_exams || 0}
                    </Typography>
                  </Box>
                ) : (
                  <Typography variant="body2">
                    No performance data available
                  </Typography>
                )}
              </CardContent>
            </GradientCard>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;