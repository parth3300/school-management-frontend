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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import StudentForm from '../components/students/StudentForm';
import { fetchStudents, createStudent, updateStudent, deleteStudent } from '../redux/slices/studentSlice';
import { fetchClasses } from '../redux/slices/classSlice';

const Students = () => {
  const dispatch = useDispatch();
  const { students, loading, error } = useSelector((state) => state.student);
  const { classes } = useSelector((state) => state.class);
  const [openForm, setOpenForm] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);

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

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Grid item>
            <Typography variant="h4">Students</Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setCurrentStudent(null);
                setOpenForm(true);
              }}
            >
              Add Student
            </Button>
          </Grid>
        </Grid>

        <Card>
          <CardContent>
            {loading ? (
              <Typography>Loading...</Typography>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Photo</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Admission No.</TableCell>
                      <TableCell>Class</TableCell>
                      <TableCell>Parent</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <Avatar
                            src={student.photo}
                            alt={`${student.user.first_name} ${student.user.last_name}`}
                          />
                        </TableCell>
                        <TableCell>
                          {student.user.first_name} {student.user.last_name}
                        </TableCell>
                        <TableCell>{student.admission_number}</TableCell>
                        <TableCell>
                          {classes.find((c) => c.id === student.current_class)?.name}
                        </TableCell>
                        <TableCell>
                          {student.parent_name} ({student.parent_phone})
                        </TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            onClick={() => {
                              setCurrentStudent(student);
                              setOpenForm(true);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            size="small"
                            color="error"
                            onClick={() => handleDelete(student.id)}
                          >
                            Delete
                          </Button>
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