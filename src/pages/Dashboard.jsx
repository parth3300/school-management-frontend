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
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  CalendarToday,
  Assignment,
  Class,
  School,
  Person,
  Book,
  Today,
  Announcement
} from '@mui/icons-material';
import { fetchAnnouncements } from '../redux/slices/announcementSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { announcements, loading: announcementsLoading } = useSelector((state) => state.announcement);
  const { classes } = useSelector((state) => state.class);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
    dispatch(fetchAnnouncements());
  }, [dispatch, isAuthenticated, navigate]);

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  const isTeacher = user.role === 'TEACHER' || user.profile?.subjects; // Adjust based on your user model
  const userProfile = user.profile;

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1">
            Welcome, {user.first_name}!
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {isTeacher ? 'Teacher Dashboard' : 'Student Dashboard'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
            {user.first_name.charAt(0)}
          </Avatar>
        </Box>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Assignment color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h6">Assignments</Typography>
                  <Typography variant="h4">
                    {isTeacher ? userProfile?.assignments_count || 0 : userProfile?.pending_assignments || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Class color="secondary" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h6">Classes</Typography>
                  <Typography variant="h4">
                    {isTeacher ? userProfile?.classes_count || 0 : 1}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {!isTeacher && (
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Book color="success" sx={{ fontSize: 40, mr: 2 }} />
                  <Box>
                    <Typography variant="h6">Subjects</Typography>
                    <Typography variant="h4">
                      {userProfile?.subjects_count || 0}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Today color="warning" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h6">Today</Typography>
                  <Typography variant="h5">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid item xs={12} md={8}>
          {/* Upcoming Classes/Assignments */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                <CalendarToday sx={{ verticalAlign: 'middle', mr: 1 }} />
                Upcoming {isTeacher ? 'Classes' : 'Schedule'}
              </Typography>
              <List>
                {classes.slice(0, 3).map((cls) => (
                  <ListItem key={cls.id}>
                    <ListItemIcon>
                      <School color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={cls.name}
                      secondary={`${cls.time} with ${cls.teacher}`}
                    />
                    <Button 
                      size="small" 
                      onClick={() => navigate(`/classes/${cls.id}`)}
                    >
                      View
                    </Button>
                  </ListItem>
                ))}
                {classes.length === 0 && (
                  <ListItem>
                    <ListItemText primary="No upcoming classes" />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>

          {/* Recent Announcements */}
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                <Announcement sx={{ verticalAlign: 'middle', mr: 1 }} />
                Recent Announcements
              </Typography>
              {announcementsLoading ? (
                <CircularProgress />
              ) : (
                <List>
                  {announcements.slice(0, 3).map((announcement) => (
                    <React.Fragment key={announcement.id}>
                      <ListItem>
                        <ListItemText
                          primary={announcement.title}
                          secondary={announcement.message}
                        />
                        <Typography variant="caption">
                          {new Date(announcement.date).toLocaleDateString()}
                        </Typography>
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
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={4}>
          {/* Quick Actions */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Quick Actions
              </Typography>
              <Grid container spacing={1}>
                {isTeacher ? (
                  <>
                    <Grid item xs={6}>
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<Assignment />}
                        onClick={() => navigate('/assignments/create')}
                      >
                        New Assignment
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<Class />}
                        onClick={() => navigate('/attendance')}
                      >
                        Take Attendance
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<Person />}
                        onClick={() => navigate('/students')}
                      >
                        View Students
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<Book />}
                        onClick={() => navigate('/subjects')}
                      >
                        My Subjects
                      </Button>
                    </Grid>
                  </>
                ) : (
                  <>
                    <Grid item xs={12}>
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<Assignment />}
                        onClick={() => navigate('/assignments')}
                      >
                        View Assignments
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<Class />}
                        onClick={() => navigate('/classes')}
                      >
                        My Classes
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<Book />}
                        onClick={() => navigate('/subjects')}
                      >
                        My Subjects
                      </Button>
                    </Grid>
                  </>
                )}
              </Grid>
            </CardContent>
          </Card>

          {/* Profile Summary */}
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                <Person sx={{ verticalAlign: 'middle', mr: 1 }} />
                Profile Summary
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Name"
                    secondary={`${user.first_name} ${user.last_name}`}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Email"
                    secondary={user.email}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Role"
                    secondary={isTeacher ? 'Teacher' : 'Student'}
                  />
                </ListItem>
                {isTeacher ? (
                  <>
                    <Divider />
                    <ListItem>
                      <ListItemText
                        primary="Qualification"
                        secondary={userProfile?.qualification || 'Not specified'}
                      />
                    </ListItem>
                  </>
                ) : (
                  <>
                    <Divider />
                    <ListItem>
                      <ListItemText
                        primary="Admission Number"
                        secondary={userProfile?.admission_number || 'N/A'}
                      />
                    </ListItem>
                  </>
                )}
              </List>
              <Button
                fullWidth
                variant="outlined"
                sx={{ mt: 2 }}
                onClick={() => navigate('/profile')}
              >
                View Full Profile
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;