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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import StudentForm from '../components/students/StudentForm';
import {
  fetchStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from '../redux/slices/studentSlice';
import { fetchClasses } from '../redux/slices/classSlice';

const Students = () => {
  const dispatch = useDispatch();
  const { students, loading, error } = useSelector((state) => state.student);
  const { classes } = useSelector((state) => state.class);
  const [openForm, setOpenForm] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    dispatch(fetchStudents());
    dispatch(fetchClasses());
  }, [dispatch]);

  const handleSubmit = async (studentData) => {
    const formData = new FormData();
    for (const key in studentData) {
      if (key === 'photo' && studentData[key]) {
        formData.append(key, studentData[key]);
      } else if (studentData[key] !== null && studentData[key] !== undefined) {
        formData.append(key, studentData[key]);
      }
    }

    if (currentStudent) {
      await dispatch(updateStudent({ id: currentStudent.id, data: formData }));
    } else {
      await dispatch(createStudent(formData));
    }
    setOpenForm(false);
    setCurrentStudent(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      await dispatch(deleteStudent(id));
    }
  };

  const getInitials = (student) => {
    return `${student.user.first_name?.[0] || ''}${student.user.last_name?.[0] || ''}`;
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 5 }}>
        <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Grid item>
            <Typography variant="h4" fontWeight="bold" color="primary">
              Students
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setCurrentStudent(null);
                setOpenForm(true);
              }}
              sx={{ borderRadius: 3 }}
            >
              Add Student
            </Button>
          </Grid>
        </Grid>

        <Card elevation={3}>
          <CardContent>
            {loading ? (
              <Typography>Loading...</Typography>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : students.length === 0 ? (
              <Typography>No students found.</Typography>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead sx={{ backgroundColor: theme.palette.primary.light }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Photo</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Admission No.</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Class</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Parent</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }} align="right">
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {students.map((student, index) => (
                      <TableRow
                        key={student.id}
                        sx={{
                          backgroundColor: index % 2 === 0 ? '#fafafa' : '#fff',
                          '&:hover': { backgroundColor: '#f1f1f1' },
                        }}
                      >
                        <TableCell>
                          <Avatar
                            src={student.photo}
                            alt={`${student.user.first_name} ${student.user.last_name}`}
                          >
                            {getInitials(student)}
                          </Avatar>
                        </TableCell>
                        <TableCell>
                          {student.user.first_name} {student.user.last_name}
                        </TableCell>
                        <TableCell>{student.admission_number}</TableCell>
                        <TableCell>
                          {classes.find((c) => c.id === student.current_class)?.name || '—'}
                        </TableCell>
                        <TableCell>
                          {student.parent_name} ({student.parent_phone})
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Edit">
                            <IconButton
                              onClick={() => {
                                setCurrentStudent(student);
                                setOpenForm(true);
                              }}
                              color="primary"
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              onClick={() => handleDelete(student.id)}
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

      <StudentForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleSubmit}
        student={currentStudent}
        classes={classes}
      />
    </Container>
  );
};

export default Students;
