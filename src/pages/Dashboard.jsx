import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
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
  LinearProgress,
  Badge,
  Tooltip,
  IconButton,
  Tabs,
  Tab
} from '@mui/material';
import {
  Announcement,
  Class,
  People,
  Assignment,
  School,
  Today,
  BarChart,
  EventNote,
  Grade,
  Notifications,
  Refresh,
  MoreVert,
  ArrowForward,
  SupervisedUserCircle,
  Person,
  School as SchoolIcon
} from '@mui/icons-material';
import { fetchAnnouncements, selectLatestAnnouncements } from '../redux/slices/announcementSlice';
import { fetchTeacherClasses, selectCurrentTeacher, selectTeacherClasses } from '../redux/slices/teacherSlice';
import { fetchTodayAttendance, selectTodayAttendance } from '../redux/slices/attendanceSlice';
import { fetchExamResultsSummary, selectExamResultsSummary } from '../redux/slices/examResultsSlice';
import { fetchSchools, selectSchool } from '../redux/slices/schoolSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { selectExamSchedule } from '../redux/slices/examSlice';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import API_ENDPOINTS from '../api/endpoints';

dayjs.extend(relativeTime);

// Styled Components
const GradientCard = styled(Card)(({ theme }) => ({
  background: theme.palette.mode === 'dark' 
    ? 'linear-gradient(145deg, #2d2d2d 0%, #1e1e1e 100%)'
    : 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
  borderRadius: '16px',
  boxShadow: theme.shadows[2],
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[6],
  },
  height: '100%',
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: theme.palette.primary.main,
  }
}));

const StatCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2.5),
  borderRadius: '14px',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: theme.shadows[4],
    '&:after': {
      opacity: 0.1,
    }
  },
  '&:after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: theme.palette.primary.main,
    opacity: 0,
    transition: 'opacity 0.3s ease',
  }
}));

const PulseDot = styled('div')(({ theme }) => ({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  background: theme.palette.success.main,
  marginRight: theme.spacing(1),
  animation: 'pulse 1.5s infinite',
  '@keyframes pulse': {
    '0%': {
      transform: 'scale(0.95)',
      boxShadow: `0 0 0 0 ${theme.palette.success.main}80`
    },
    '70%': {
      transform: 'scale(1)',
      boxShadow: `0 0 0 8px ${theme.palette.success.main}00`
    },
    '100%': {
      transform: 'scale(0.95)',
      boxShadow: `0 0 0 0 ${theme.palette.success.main}00`
    }
  }
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
    pendingGrades: 0,
    unreadAnnouncements: 0
  });
  const [lastRefresh, setLastRefresh] = useState(dayjs());
  const [activeTab, setActiveTab] = useState(0);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);

  // Redux state selectors with proper initialization
  const authState = useSelector((state) => state.auth);
  const announcements = useSelector((state) => state.announcements.data) || [];
  const teacherState = useSelector(selectTeacherClasses) || {};
  const attendanceState = useSelector(selectTodayAttendance) || {};
  const examResultsSummary = useSelector(selectExamResultsSummary) || {};
  const schoolState = useSelector(selectSchool) || {};

  console.log("useSelector((state) => state.announcements.data)",useSelector((state) => state.announcements.data));
  
  // Destructure with proper fallbacks
  const { 
    user = {}, 
    isAuthenticated = false,
    isAdmin = false,
    isTeacher = false,
    isStudent = false
  } = authState || {};
  
  const {
    classes = [],
    loading: classesLoading = false,
    error: classesError = null
  } = teacherState;

  const {
    stats: attendanceStats = {},
    loading: attendanceLoading = false,
    error: attendanceError = null
  } = attendanceState;

  const {
    summary: examSummary = {},
    loading: examLoading = false,
    error: examError = null
  } = examResultsSummary;

  // Filter announcements based on user role
  useEffect(() => {
    if (!announcements.length) return;

    let filtered = [];
    
    if (isAdmin) {
      // Admins see all announcements
      filtered = announcements;
    } else if (isTeacher) {
      // Teachers see teacher and all announcements
      filtered = announcements.filter(ann => 
        ann.audience === 'TEA' || ann.audience === 'ALL'
      );
    } else if (isStudent) {
      // Students see student and all announcements
      filtered = announcements.filter(ann => 
        ann.audience === 'STU' || ann.audience === 'ALL'
      );
    }

    setFilteredAnnouncements(filtered);
  }, [announcements, isAdmin, isTeacher, isStudent]);

  // Memoized data calculations
  const calculateStats = useCallback(() => {
    const totalStudents = classes.reduce((acc, cls) => acc + (cls.students_count || 0), 0);
    const unreadAnnouncements = filteredAnnouncements.filter(a => !a.read).length;
    
    return {
      totalClasses: classes.length,
      totalStudents,
      attendanceRate: attendanceStats.average_attendance_rate || 0,
      pendingGrades: examSummary.pending_grades || 0,
      unreadAnnouncements
    };
  }, [classes, filteredAnnouncements, attendanceStats, examSummary]);

  // Data loading effect
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const loadDashboardData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          dispatch(fetchAnnouncements()),
          dispatch(fetchTeacherClasses()),
          dispatch(fetchTodayAttendance()),
          dispatch(fetchExamResultsSummary()),
          dispatch(fetchSchools())
        ]);

        setStats(calculateStats());
      } catch (error) {
        console.error('Dashboard loading error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [dispatch, isAuthenticated, navigate, lastRefresh, calculateStats]);

  const handleRefresh = () => {
    setLastRefresh(dayjs());
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Loading state
  if (loading || classesLoading || attendanceLoading || examLoading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="80vh"
        flexDirection="column"
        gap={2}
      >
        <CircularProgress size={60} thickness={4} />
        <Typography variant="body1" color="text.secondary">
          Loading your dashboard...
        </Typography>
      </Box>
    );
  }

  // Error states
  const errors = [classesError, attendanceError, examError].filter(Boolean);
  if (errors.length > 0) {
    return (
      <Box sx={{ p: 3 }}>
        {errors.map((error, index) => (
          <Alert 
            key={index} 
            severity="error" 
            sx={{ mb: 2 }}
            action={
              <Button 
                color="inherit" 
                size="small"
                onClick={handleRefresh}
              >
                Retry
              </Button>
            }
          >
            {error?.message || 'Error loading dashboard data'}
          </Alert>
        ))}
      </Box>
    );
  }

  // Data preparation
  const firstName = user.first_name || '';
  const schoolName = schoolState.name || 'School name not available';
  const academicYear = schoolState.current_academic_year?.name || 'Not specified';

  // Navigation handler
  const navigateTo = (path) => navigate(path);

  // Format helpers
  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    return dayjs(dateString).isValid() 
      ? dayjs(dateString).format('MMM D, YYYY h:mm A') 
      : 'Invalid date';
  };

  const formatRelativeTime = (dateString) => {
    if (!dateString) return '';
    return dayjs(dateString).isValid() 
      ? dayjs(dateString).fromNow() 
      : '';
  };

  const formatPercentage = (value) => {
    return Math.round((value || 0) * 100) + '%';
  };

  // Get audience label
  const getAudienceLabel = (audience) => {
    switch(audience) {
      case 'ALL': return 'Everyone';
      case 'STU': return 'Students';
      case 'TEA': return 'Teachers';
      case 'CLS': return 'Specific Class';
      case 'SUB': return 'Subject Students';
      default: return audience;
    }
  };

  // Upcoming classes with proper data handling
  const upcomingClasses = classes.slice(0, 3).map(cls => ({
    id: cls.id || Math.random().toString(36).substr(2, 9),
    name: cls.name || 'Unnamed Class',
    subject: cls.subjects?.[0]?.name || cls.subjects?.[0] || 'General',
    students_count: cls.students_count || 0,
    room: cls.room || 'N/A',
    nextSession: cls.next_session || dayjs().add(Math.random() * 7, 'day').toISOString()
  }));

  // Stats cards data
  const statCards = [
    {
      title: 'Classes',
      value: stats.totalClasses,
      icon: <Class color="primary" fontSize="large" />,
      progress: null,
      onClick: () => navigateTo('/teacher/classes')
    },
    {
      title: 'Students',
      value: stats.totalStudents,
      icon: <People color="secondary" fontSize="large" />,
      progress: null,
      onClick: () => navigateTo('/teacher/students')
    },
    {
      title: 'Attendance',
      value: formatPercentage(stats.attendanceRate),
      icon: <Assignment color="success" fontSize="large" />,
      progress: stats.attendanceRate * 100,
      onClick: () => navigateTo('/teacher/attendance')
    },
    {
      title: 'Pending Grades',
      value: stats.pendingGrades,
      icon: <Grade color="warning" fontSize="large" />,
      progress: null,
      onClick: () => navigateTo('/teacher/exam-results')
    }
  ];

  // Tab configuration based on user role
  const getTabs = () => {
    const tabs = [];
    
    if (isAdmin) {
      tabs.push({ label: 'All', value: 'ALL', icon: <SchoolIcon /> });
    }
    
    if (isAdmin || isTeacher) {
      tabs.push({ label: 'Teachers', value: 'TEA', icon: <Person /> });
    }
    
    if (isAdmin || isStudent) {
      tabs.push({ label: 'Students', value: 'STU', icon: <SupervisedUserCircle /> });
    }
    
    return tabs;
  };

  const tabs = getTabs();

  // Filter announcements based on active tab
  const getFilteredAnnouncements = () => {
    if (tabs.length === 0) return filteredAnnouncements;
    
    const currentTab = tabs[activeTab];
    if (!currentTab) return filteredAnnouncements;
    
    if (currentTab.value === 'ALL') {
      return filteredAnnouncements;
    }
    
    return filteredAnnouncements.filter(ann => ann.audience === currentTab.value);
  };

  const currentAnnouncements = getFilteredAnnouncements();

  return (
    <Box 
      sx={{ 
        flexGrow: 1,
        p: isMobile ? 2 : 3,
        ml: { sm: `${240}px` },
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: theme.palette.background.default,
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
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
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(45deg, #90caf9 30%, #4fc3f7 90%)'
                  : 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                backgroundClip: 'text',
                textFillColor: 'transparent',
                fontWeight: 'bold',
                lineHeight: 1.2
              }}
            >
              Welcome, {firstName}!
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {dayjs().format('dddd, MMMM D, YYYY')}
            </Typography>
          </Box>
          
          <Box display="flex" alignItems="center" gap={2}>
            <Tooltip title="Refresh data">
              <IconButton onClick={handleRefresh} color="primary">
                <Refresh />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Notifications">
              <IconButton color="inherit">
                <Badge badgeContent={stats.unreadAnnouncements} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {statCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <StatCard onClick={card.onClick}>
                  {card.icon}
                  <Box flexGrow={1}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {card.title}
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {card.value}
                    </Typography>
                    {card.progress !== null && (
                      <LinearProgress 
                        variant="determinate" 
                        value={card.progress} 
                        sx={{ mt: 1, height: 6, borderRadius: 3 }}
                        color="success"
                      />
                    )}
                  </Box>
                </StatCard>
              </motion.div>
            </Grid>
          ))}
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
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  mb: 2 
                }}>
                  <Box display="flex" alignItems="center">
                    <Announcement 
                      sx={{ 
                        mr: 1,
                        color: theme.palette.warning.main
                      }} 
                    />
                    <Typography variant="h6">
                      Recent Announcements
                    </Typography>
                    {stats.unreadAnnouncements > 0 && (
                      <Chip 
                        label={`${stats.unreadAnnouncements} new`}
                        size="small"
                        color="warning"
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Box>
                  <IconButton size="small">
                    <MoreVert />
                  </IconButton>
                </Box>
                
                {/* Announcement Tabs */}
                {tabs.length > 1 && (
                  <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                    <Tabs
                      value={activeTab}
                      onChange={handleTabChange}
                      variant={isMobile ? 'scrollable' : 'standard'}
                      scrollButtons="auto"
                      allowScrollButtonsMobile
                    >
                      {tabs.map((tab, index) => (
                        <Tab 
                          key={index}
                          label={tab.label}
                          icon={tab.icon}
                          iconPosition="start"
                          sx={{ minHeight: 48 }}
                        />
                      ))}
                    </Tabs>
                  </Box>
                )}
                
                <List sx={{ pt: 0 }}>
                  <AnimatePresence>
                    {currentAnnouncements.slice(0, 3).map((announcement) => (
                      <motion.div
                        key={announcement.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
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
                                {!announcement.read && <PulseDot />}
                                <Typography fontWeight="medium">
                                  {announcement.title}
                                </Typography>
                                <Chip 
                                  label={getAudienceLabel(announcement.audience)}
                                  size="small"
                                  color="info"
                                  sx={{ ml: 1 }}
                                />
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
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    mt: 0.5,
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden'
                                  }}
                                >
                                  {announcement.message}
                                </Typography>
                                <Box display="flex" justifyContent="space-between" sx={{ mt: 1 }}>
                                  <Typography variant="caption">
                                    {formatRelativeTime(announcement.created_at)}
                                  </Typography>
                                  <Typography variant="caption">
                                    {formatDate(announcement.start_date)} - {announcement.end_date ? formatDate(announcement.end_date) : 'No end'}
                                  </Typography>
                                </Box>
                              </Box>
                            }
                          />
                        </ListItem>
                        <Divider />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {currentAnnouncements.length === 0 && (
                    <ListItem>
                      <ListItemText 
                        primary="No announcements yet" 
                        primaryTypographyProps={{ color: 'text.secondary', fontStyle: 'italic' }}
                      />
                    </ListItem>
                  )}
                  
                  {currentAnnouncements.length > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                      <Button 
                        endIcon={<ArrowForward />}
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateTo('/teacher/announcements');
                        }}
                      >
                        View all
                      </Button>
                    </Box>
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
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  mb: 2 
                }}>
                  <Box display="flex" alignItems="center">
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
                  <IconButton size="small">
                    <MoreVert />
                  </IconButton>
                </Box>
                
                <List sx={{ pt: 0 }}>
                  <AnimatePresence>
                    {upcomingClasses.map((cls) => (
                      <motion.div
                        key={cls.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
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
                                  {cls.students_count} students • Room {cls.room}
                                </Typography>
                              </Box>
                            }
                            secondary={
                              <Box>
                                <Box display="flex" alignItems="center" sx={{ mt: 0.5 }}>
                                  <Today fontSize="small" color="action" sx={{ mr: 1 }} />
                                  <Typography variant="body2">
                                    {formatDate(cls.nextSession)}
                                  </Typography>
                                </Box>
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                  {formatRelativeTime(cls.nextSession)}
                                </Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                        <Divider />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {classes.length === 0 && (
                    <ListItem>
                      <ListItemText 
                        primary="No classes assigned" 
                        primaryTypographyProps={{ color: 'text.secondary', fontStyle: 'italic' }}
                      />
                    </ListItem>
                  )}
                  
                  {classes.length > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                      <Button 
                        endIcon={<ArrowForward />}
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateTo('/teacher/classes');
                        }}
                      >
                        View schedule
                      </Button>
                    </Box>
                  )}
                </List>
              </CardContent>
            </GradientCard>
          </motion.div>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={4}>
          {/* School Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <GradientCard onClick={() => navigateTo('/teacher/school-info')}>
              <CardContent>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  mb: 2 
                }}>
                  <Box display="flex" alignItems="center">
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
                  <IconButton size="small">
                    <MoreVert />
                  </IconButton>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1" fontWeight="medium">
                    {schoolName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {schoolState.address || 'Address not available'}
                  </Typography>
                </Box>
                
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Academic Year
                    </Typography>
                    <Typography variant="body2">
                      {academicYear}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Established
                    </Typography>
                    <Typography variant="body2">
                      {schoolState.established_date 
                        ? dayjs(schoolState.established_date).format('YYYY') 
                        : 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Phone
                    </Typography>
                    <Typography variant="body2">
                      {schoolState.phone || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Email
                    </Typography>
                    <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                      {schoolState.email || 'N/A'}
                    </Typography>
                  </Grid>
                </Grid>
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                  <Button 
                    endIcon={<ArrowForward />}
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateTo('/teacher/school-info');
                    }}
                  >
                    View details
                  </Button>
                </Box>
              </CardContent>
            </GradientCard>
          </motion.div>

          {/* Performance Overview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            style={{ marginTop: theme.spacing(3) }}
          >
            <GradientCard onClick={() => navigateTo(API_ENDPOINTS.teachers.examResults.base)}>
              <CardContent>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  mb: 2 
                }}>
                  <Box display="flex" alignItems="center">
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
                  <IconButton size="small">
                    <MoreVert />
                  </IconButton>
                </Box>
                
                {examSummary ? (
                  <Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Top Performing Class
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {examSummary.top_class?.name || 'N/A'} ({examSummary.top_class?.average || 0}%)
                      </Typography>
                    </Box>
                    
                    <Grid container spacing={1} sx={{ mb: 2 }}>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Subjects Taught
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {examSummary.subjects_taught || 0}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Exams Graded
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {examSummary.exams_graded || 0}/{examSummary.total_exams || 0}
                        </Typography>
                      </Grid>
                    </Grid>
                    
                    <Box sx={{ 
                      background: theme.palette.action.hover,
                      borderRadius: '8px',
                      p: 2,
                      mb: 2
                    }}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                        Class Averages
                      </Typography>
                      {examSummary.class_averages?.slice(0, 3).map((cls, index) => (
                        <Box key={index} sx={{ mb: 1 }}>
                          <Box display="flex" justifyContent="space-between">
                            <Typography variant="body2">
                              {cls.name}
                            </Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {cls.average}%
                            </Typography>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={cls.average} 
                            sx={{ height: 4, borderRadius: 2 }}
                            color={cls.average > 70 ? 'success' : cls.average > 50 ? 'warning' : 'error'}
                          />
                        </Box>
                      ))}
                    </Box>
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary" fontStyle="italic">
                    No performance data available
                  </Typography>
                )}
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                  <Button 
                    endIcon={<ArrowForward />}
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateTo('/teacher/exam-results');
                    }}
                  >
                    View details
                  </Button>
                </Box>
              </CardContent>
            </GradientCard>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;