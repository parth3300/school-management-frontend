import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Avatar,
  IconButton,
  Tooltip,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Cake as CakeIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  Transgender as TransgenderIcon,
  CalendarToday as CalendarTodayIcon,
} from '@mui/icons-material';
import TeacherModal from './TeacherModal';
import {
  fetchTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} from '../redux/slices/teacherSlice';
import { fetchSubjects } from '../redux/slices/subjectSlice';
import { fetchSchools } from '../redux/slices/schoolSlice';
import dayjs from 'dayjs';

const Teachers = () => {
  const dispatch = useDispatch();
  const theme = useTheme();

  // Get data from store with safe defaults
  const { data: teachers = [], loading, error } = useSelector((state) => state.teachers);
  const { data: subjects = [] } = useSelector((state) => state.subjects);
  const { data: schools = [] } = useSelector((state) => state.schools);

  const [openForm, setOpenForm] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [currentTeacher, setCurrentTeacher] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  useEffect(() => {
    dispatch(fetchTeachers());
    dispatch(fetchSubjects());
    dispatch(fetchSchools());
  }, [dispatch]);

  const handleSubmit = async (teacherData) => {
    const formData = new FormData();
    for (const key in teacherData) {
      if (key === 'photo' && teacherData[key]) {
        formData.append(key, teacherData[key]);
      } else if (teacherData[key] !== null && teacherData[key] !== undefined) {
        formData.append(key, teacherData[key]);
      }
    }

    if (currentTeacher) {
      await dispatch(updateTeacher({ id: currentTeacher.id, data: formData }));
    } else {
      await dispatch(createTeacher(formData));
    }
    setOpenForm(false);
    setCurrentTeacher(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      await dispatch(deleteTeacher(id));
    }
  };

  const handleViewDetails = (teacher) => {
    setSelectedTeacher(teacher);
    setOpenDetails(true);
  };

  const getInitials = (teacher) => {
    const first = teacher.user?.first_name?.[0] || '';
    const last = teacher.user?.last_name?.[0] || '';
    return `${first}${last}`.toUpperCase();
  };

  const getGenderIcon = (gender) => {
    switch (gender) {
      case 'M': return '♂';
      case 'F': return '♀';
      case 'O': return '⚧';
      default: return '';
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 5 }}>
        <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Grid item>
            <Typography variant="h4" fontWeight="bold" color="primary">
              Teachers
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setCurrentTeacher(null);
                setOpenForm(true);
              }}
              sx={{ borderRadius: 3 }}
            >
              Add Teacher
            </Button>
          </Grid>
        </Grid>

        <Card elevation={3}>
          <CardContent>
            {loading ? (
              <Typography>Loading...</Typography>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : teachers.length === 0 ? (
              <Typography>No teachers found.</Typography>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead sx={{ backgroundColor: theme.palette.primary.light }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Photo</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Qualification</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Subjects</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }} align="right">
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {teachers.map((teacher, index) => (
                      <TableRow
                        key={teacher.id}
                        sx={{
                          backgroundColor: index % 2 === 0 ? '#fafafa' : '#fff',
                          '&:hover': { backgroundColor: '#f1f1f1' },
                        }}
                        onClick={() => handleViewDetails(teacher)}
                        style={{ cursor: 'pointer' }}
                      >
                        <TableCell>
                          <Avatar
                            src={teacher.user?.photo}
                            alt={`${teacher.user?.first_name || ''} ${teacher.user?.last_name || ''}`}
                          >
                            {getInitials(teacher)}
                          </Avatar>
                        </TableCell>
                        <TableCell>
                          {teacher.user?.first_name || ''} {teacher.user?.last_name || ''}
                        </TableCell>
                        <TableCell>{teacher.user?.email || '—'}</TableCell>
                        <TableCell>{teacher.qualification || '—'}</TableCell>
                        <TableCell>
                          {teacher.subjects?.slice(0, 2).map(subject => (
                            <Chip key={subject.id} label={subject.name} size="small" sx={{ mr: 0.5 }} />
                          ))}
                          {teacher.subjects?.length > 2 && (
                            <Chip label={`+${teacher.subjects.length - 2}`} size="small" />
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={teacher.user?.role} 
                            size="small" 
                            color={
                              teacher.user?.role === 'admin' ? 'primary' : 
                              teacher.user?.role === 'teacher' ? 'secondary' : 'default'
                            }
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Edit">
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentTeacher(teacher);
                                setOpenForm(true);
                              }}
                              color="primary"
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(teacher.id);
                              }}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Teacher Form Modal */}
      <TeacherModal
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleSubmit}
        teacher={currentTeacher}
        subjects={subjects}
        schools={schools}
      />

      {/* Teacher Details Modal */}
      <Dialog
        open={openDetails}
        onClose={() => setOpenDetails(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedTeacher && (
          <>
            <DialogTitle>
              <Box display="flex" alignItems="center">
                <Avatar
                  src={selectedTeacher.user?.photo}
                  sx={{ width: 60, height: 60, mr: 2 }}
                >
                  {getInitials(selectedTeacher)}
                </Avatar>
                <Box>
                  <Typography variant="h5">
                    {selectedTeacher.user?.first_name} {selectedTeacher.user?.last_name}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {selectedTeacher.qualification}
                  </Typography>
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Personal Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Box display="flex" alignItems="center" mb={1}>
                    <EmailIcon color="action" sx={{ mr: 1 }} />
                    <Typography>{selectedTeacher.user?.email}</Typography>
                  </Box>
                  
                  <Box display="flex" alignItems="center" mb={1}>
                    <PhoneIcon color="action" sx={{ mr: 1 }} />
                    <Typography>{selectedTeacher.user?.phone || 'Not provided'}</Typography>
                  </Box>
                  
                  <Box display="flex" alignItems="center" mb={1}>
                    <TransgenderIcon color="action" sx={{ mr: 1 }} />
                    <Typography>
                      {selectedTeacher.user?.gender ? 
                        `${getGenderIcon(selectedTeacher.user.gender)} ${selectedTeacher.user.gender === 'M' ? 'Male' : 
                         selectedTeacher.user.gender === 'F' ? 'Female' : 'Other'}` : 
                        'Not specified'}
                    </Typography>
                  </Box>
                  
                  <Box display="flex" alignItems="center" mb={1}>
                    <CakeIcon color="action" sx={{ mr: 1 }} />
                    <Typography>
                      {selectedTeacher.user?.date_of_birth ? 
                        dayjs(selectedTeacher.user.date_of_birth).format('MMMM D, YYYY') : 
                        'Not provided'}
                    </Typography>
                  </Box>
                  
                  <Box display="flex" alignItems="center" mb={1}>
                    <HomeIcon color="action" sx={{ mr: 1 }} />
                    <Typography>
                      {selectedTeacher.user?.address || 'Not provided'}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Professional Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Box display="flex" alignItems="center" mb={1}>
                    <WorkIcon color="action" sx={{ mr: 1 }} />
                    <Typography>
                      Joined on {dayjs(selectedTeacher.joining_date).format('MMMM D, YYYY')}
                    </Typography>
                  </Box>
                  
                  <Box display="flex" alignItems="center" mb={1}>
                    <SchoolIcon color="action" sx={{ mr: 1 }} />
                    <Typography>
                      {selectedTeacher.school?.name || 'No school assigned'}
                    </Typography>
                  </Box>
                  
                  <Box display="flex" alignItems="center" mb={1}>
                    <PersonIcon color="action" sx={{ mr: 1 }} />
                    <Typography>
                      Role: 
                      <Chip 
                        label={selectedTeacher.user?.role} 
                        size="small" 
                        color={
                          selectedTeacher.user?.role === 'admin' ? 'primary' : 
                          selectedTeacher.user?.role === 'teacher' ? 'secondary' : 'default'
                        }
                        sx={{ ml: 1 }}
                      />
                    </Typography>
                  </Box>
                  
                  <Box mb={2}>
                    <Typography variant="subtitle2" gutterBottom>
                      Subjects Taught:
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                      {selectedTeacher.subjects?.length > 0 ? (
                        selectedTeacher.subjects.map(subject => (
                          <Chip 
                            key={subject.id} 
                            label={subject.name} 
                            color="primary"
                            size="small"
                          />
                        ))
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No subjects assigned
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDetails(false)} color="primary">
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default Teachers;