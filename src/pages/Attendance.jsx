import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Grid, Card, CardContent,
  FormControl, InputLabel, Select, MenuItem,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Checkbox, Button, CircularProgress, Alert, Chip, TextField, Box
} from '@mui/material';
import { Class as ClassIcon, Person, CheckCircle, Cancel } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAttendance,
  setSelectedClass,
  setSelectedDate,
  toggleStudentAttendance,
  submitAttendance,
  resetStatus,
} from '../redux/slices/attendanceSlice';
import { fetchClasses } from '../redux/slices/classSlice';
import { fetchStudents } from '../redux/slices/studentSlice';

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
  const dispatch = useDispatch();
  const {
    classes, students, attendance,
    selectedClass, selectedDate,
    loading, error, success
  } = useSelector((state) => state.attendance);

  useEffect(() => {
    dispatch(fetchClasses());
  }, [dispatch]);

  useEffect(() => {
    if (selectedClass && selectedDate) {
      dispatch(fetchStudents(selectedClass));
      dispatch(fetchAttendance({ classId: selectedClass, date: selectedDate.toISOString() }));
    }
  }, [dispatch, selectedClass, selectedDate]);

  const handleSubmit = () => {
    dispatch(submitAttendance());
  };

  const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Typography
          variant="h4"
          sx={{
            mb: 4,
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            fontWeight: 'bold',
          }}
        >
          Attendance Management
        </Typography>
      </motion.div>

      {(error || success) && (
        <Alert
          severity={error ? 'error' : 'success'}
          onClose={() => dispatch(resetStatus())}
          sx={{ mb: 3 }}
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
                      value={selectedClass || ''}
                      onChange={(e) => dispatch(setSelectedClass(e.target.value))}
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
                      onChange={(date) => dispatch(setSelectedDate(date))}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth disabled={loading.attendance} />
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
                                {student.first_name} {student.last_name}
                              </Box>
                            </TableCell>
                            <TableCell>{student.roll_number}</TableCell>
                            <TableCell align="center">
                              <Chip
                                label={attendance[student.id] ? 'Present' : 'Absent'}
                                color={attendance[student.id] ? 'success' : 'error'}
                                icon={attendance[student.id] ? <CheckCircle /> : <Cancel />}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Checkbox
                                checked={attendance[student.id] || false}
                                onChange={() => dispatch(toggleStudentAttendance(student.id))}
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
