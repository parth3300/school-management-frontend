// src/components/SubjectList.js
import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchSubjects,
  deleteSubject,
  selectSubjectTeachers,
  selectSubjectClasses,
  fetchSubjectTeachers,
  fetchSubjectClasses,
  selectTeachersLoading,
  selectClassesLoading
} from '../redux/slices/subjectSlice';

const Subjects = () => {
  const dispatch = useDispatch();
  const { data: subjects = [], loading, error } = useSelector((state) => state.subjects);
  const teachers = useSelector(selectSubjectTeachers);
  const classes = useSelector(selectSubjectClasses);
  const teachersLoading = useSelector(selectTeachersLoading);
  const classesLoading = useSelector(selectClassesLoading);

  useEffect(() => {
    dispatch(fetchSubjects());
    dispatch(fetchSubjectTeachers());
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteSubject(id));
  };

  const handleLoadExtras = (subjectId) => {
    dispatch(fetchSubjectTeachers(subjectId));
    dispatch(fetchSubjectClasses(subjectId));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center">
        Failed to load subjects: {error}
      </Typography>
    );
  }

  console.log("subject",teachers);
  
  return (
    <Box p={3}>
      <Typography variant="h4" mb={3}>
        Subjects
      </Typography>
      <Grid container spacing={3}>
        {subjects.map((subject) => (
          <Grid item xs={12} sm={6} md={4} key={subject.id}>
            <Card elevation={4}>
              <CardContent>
                <Typography variant="h6">{subject.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Code: {subject.code}
                </Typography>

                <Box mt={2}>
                  <Typography variant="subtitle2">Teachers:</Typography>
                  {teachersLoading ? (
                    <CircularProgress size={20} />
                  ) : (
                    teachers
                      .filter((t) => t.subject === subject.id)
                      .map((teacher) => (
                        <Chip
                          key={teacher.id}
                          label={teacher.name}
                          size="small"
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))
                  )}
                </Box>

                <Box mt={2}>
                  <Typography variant="subtitle2">Classes:</Typography>
                  {classesLoading ? (
                    <CircularProgress size={20} />
                  ) : (
                    classes
                      .filter((c) => c.subject === subject.id)
                      .map((cls) => (
                        <Chip
                          key={cls.id}
                          label={cls.name}
                          size="small"
                          color="info"
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))
                  )}
                </Box>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => handleLoadExtras(subject.id)}>
                  Load Info
                </Button>
                <Button size="small" color="error" onClick={() => handleDelete(subject.id)}>
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Subjects;
