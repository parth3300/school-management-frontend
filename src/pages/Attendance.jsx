import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Alert,
  CircularProgress,
  Chip,
  TextField,
} from '@mui/material';
import {
  CalendarToday,
  Class as ClassIcon,
  Person,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import api from '../api/axios';
import API_ENDPOINTS from '../api/endpoints';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  },
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(3),
  '& .MuiTableCell-head': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  '& .MuiTableRow-root:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const Attendance = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState({
    classes: false,
    students: false,
    attendance: false,
    submit: false
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(prev => ({ ...prev, classes: true }));
        const response = await api.get(API_ENDPOINTS.classes);
        setClasses(response.data);
      } catch (error) {
        setError('Failed to fetch classes');
      } finally {
        setLoading(prev => ({ ...prev, classes: false }));
      }
    };

    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      const fetchStudentsAndAttendance = async () => {
        try {
          setLoading(prev => ({ ...prev, students: true, attendance: true }));
          
          // Fetch students
          const studentsResponse = await api.get(`${API_ENDPOINTS.students}?class=${selectedClass}`);
          setStudents(studentsResponse.data);
          initializeAttendance(studentsResponse.data);
          
          // Fetch attendance
          const attendanceResponse = await api.get(
            `${API_ENDPOINTS.attendance}?class=${selectedClass}&date=${selectedDate.toISOString()}`
          );
          const attendanceData = {};
          attendanceResponse.data.forEach(record => {
            attendanceData[record.student] = record.present;
          });
          setAttendance(prev => ({ ...prev, ...attendanceData }));
        } catch (error) {
          setError('Failed to fetch data');
          console.error('Error:', error);
        } finally {
          setLoading(prev => ({ ...prev, students: false, attendance: false }));
        }
      };

      fetchStudentsAndAttendance();
    }
  }, [selectedClass, selectedDate]);

  const initializeAttendance = (studentList) => {
    const newAttendance = {};
    studentList.forEach(student => {
      newAttendance[student.id] = true; // Default to present
    });
    setAttendance(newAttendance);
  };

  const handleAttendanceChange = (studentId) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(prev => ({ ...prev, submit: true }));
      setError(null);
      
      const attendanceData = Object.entries(attendance).map(([studentId, present]) => ({
        student: studentId,
        class: selectedClass,
        date: selectedDate.toISOString().split('T')[0],
        present
      }));

      await api.post(API_ENDPOINTS.attendance, { attendance: attendanceData });
      setSuccess('Attendance saved successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save attendance');
    } finally {
      setLoading(prev => ({ ...prev, submit: false }));
    }
  };

  const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            mb: 4,
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            fontWeight: 'bold'
          }}
        >
          Attendance Management
        </Typography>
      </motion.div>

      {(error || success) && (
        <Alert 
          severity={error ? "error" : "success"} 
          sx={{ mb: 3 }}
          onClose={() => error ? setError(null) : setSuccess(null)}
        >
          {error || success}
        </Alert>
      )}

      <motion.div variants={containerAnimation} initial="hidden" animate="show">
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <motion.div variants={itemAnimation}>
              <StyledCard>
                <CardContent>
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>Select Class</InputLabel>
                    <Select
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      disabled={loading.classes}
                      startAdornment={<ClassIcon sx={{ mr: 1 }} />}
                    >
                      {classes.map((cls) => (
                        <MenuItem key={cls.id} value={cls.id}>
                          {cls.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Select Date"
                      value={selectedDate}
                      onChange={(newValue) => setSelectedDate(newValue)}
                      renderInput={(params) => (
                        <TextField 
                          {...params} 
                          fullWidth 
                          disabled={loading.attendance}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </CardContent>
              </StyledCard>
            </motion.div>
          </Grid>

          {selectedClass && (
            <Grid item xs={12}>
              <motion.div variants={itemAnimation}>
                <StyledTableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Student Name</TableCell>
                        <TableCell>Roll Number</TableCell>
                        <TableCell align="center">Status</TableCell>
                        <TableCell align="center">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {loading.students ? (
                        <TableRow>
                          <TableCell colSpan={4} align="center">
                            <CircularProgress />
                          </TableCell>
                        </TableRow>
                      ) : students.length > 0 ? (
                        students.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Person />
                                {`${student.first_name} ${student.last_name}`}
                              </Box>
                            </TableCell>
                            <TableCell>{student.roll_number}</TableCell>
                            <TableCell align="center">
                              <Chip
                                label={attendance[student.id] ? "Present" : "Absent"}
                                color={attendance[student.id] ? "success" : "error"}
                                icon={attendance[student.id] ? <CheckCircle /> : <Cancel />}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Checkbox
                                checked={attendance[student.id] || false}
                                onChange={() => handleAttendanceChange(student.id)}
                                color="primary"
                              />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} align="center">
                            No students found in this class
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </StyledTableContainer>

                {students.length > 0 && (
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="contained"
                      onClick={handleSubmit}
                      disabled={loading.submit}
                      startIcon={loading.submit ? <CircularProgress size={20} /> : null}
                    >
                      {loading.submit ? 'Saving...' : 'Save Attendance'}
                    </Button>
                  </Box>
                )}
              </motion.div>
            </Grid>
          )}
        </Grid>
      </motion.div>
    </Container>
  );
};

export default Attendance;