import React, { useEffect, useState } from 'react';
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
  IconButton,
  Tooltip,
  useTheme,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
} from '../redux/slices/subjectSlice';
import SubjectForm from '../components/subjects/SubjectForm';

const Subjects = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { subjects, loading, error } = useSelector((state) => state.subject);

  const [openForm, setOpenForm] = useState(false);
  const [currentSubject, setCurrentSubject] = useState(null);

  useEffect(() => {
    dispatch(fetchSubjects());
  }, [dispatch]);

  const handleSubmit = async (subjectData) => {
    if (currentSubject) {
      await dispatch(updateSubject({ id: currentSubject.id, data: subjectData }));
    } else {
      await dispatch(createSubject(subjectData));
    }
    setOpenForm(false);
    setCurrentSubject(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      await dispatch(deleteSubject(id));
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 5 }}>
        <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Grid item>
            <Typography variant="h4" fontWeight="bold" color="primary">
              Subjects
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setCurrentSubject(null);
                setOpenForm(true);
              }}
              sx={{ borderRadius: 3 }}
            >
              Add Subject
            </Button>
          </Grid>
        </Grid>

        <Card elevation={3}>
          <CardContent>
            {loading ? (
              <Typography>Loading...</Typography>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : subjects.length === 0 ? (
              <Typography>No subjects available.</Typography>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead sx={{ backgroundColor: theme.palette.primary.light }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Code</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }} align="right">
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {subjects.map((subject, index) => (
                      <TableRow
                        key={subject.id}
                        sx={{
                          backgroundColor: index % 2 === 0 ? '#fafafa' : '#fff',
                          '&:hover': { backgroundColor: '#f1f1f1' },
                        }}
                      >
                        <TableCell>{subject.name}</TableCell>
                        <TableCell>{subject.code}</TableCell>
                        <TableCell>{subject.description}</TableCell>
                        <TableCell align="right">
                          <Tooltip title="Edit">
                            <IconButton
                              onClick={() => {
                                setCurrentSubject(subject);
                                setOpenForm(true);
                              }}
                              color="primary"
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              onClick={() => handleDelete(subject.id)}
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

      <SubjectForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleSubmit}
        subject={currentSubject}
      />
    </Container>
  );
};

export default Subjects;
