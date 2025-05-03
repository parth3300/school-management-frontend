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
  IconButton,
  Tooltip,
  useTheme,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SchoolForm from '../components/schools/SchoolForm';
import {
  fetchSchools,
  createSchool,
  updateSchool,
  deleteSchool,
} from '../redux/slices/schoolSlice';

const Schools = () => {
  const dispatch = useDispatch();
  const { schools, loading, error } = useSelector((state) => state.school);
  const [openForm, setOpenForm] = useState(false);
  const [currentSchool, setCurrentSchool] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    dispatch(fetchSchools());
  }, [dispatch]);

  const handleSubmit = async (schoolData) => {
    if (currentSchool) {
      await dispatch(updateSchool({ id: currentSchool.id, data: schoolData }));
    } else {
      await dispatch(createSchool(schoolData));
    }
    setOpenForm(false);
    setCurrentSchool(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this school?')) {
      await dispatch(deleteSchool(id));
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 5 }}>
        <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Grid item>
            <Typography variant="h4" fontWeight="bold" color="primary">
              Schools
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setCurrentSchool(null);
                setOpenForm(true);
              }}
              sx={{ borderRadius: 3 }}
            >
              Add School
            </Button>
          </Grid>
        </Grid>

        <Card elevation={3}>
          <CardContent>
            {loading ? (
              <Typography>Loading...</Typography>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : schools.length === 0 ? (
              <Typography>No schools found.</Typography>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead sx={{ backgroundColor: theme.palette.primary.light }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Address</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Phone</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }} align="right">
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {schools.map((school, index) => (
                      <TableRow
                        key={school.id}
                        sx={{
                          backgroundColor: index % 2 === 0 ? '#fafafa' : '#fff',
                          transition: 'background-color 0.3s',
                          '&:hover': { backgroundColor: '#f1f1f1' },
                        }}
                      >
                        <TableCell>{school.name}</TableCell>
                        <TableCell>{school.address}</TableCell>
                        <TableCell>{school.phone}</TableCell>
                        <TableCell>{school.email}</TableCell>
                        <TableCell align="right">
                          <Tooltip title="Edit">
                            <IconButton
                              onClick={() => {
                                setCurrentSchool(school);
                                setOpenForm(true);
                              }}
                              color="primary"
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              onClick={() => handleDelete(school.id)}
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

      <SchoolForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleSubmit}
        school={currentSchool}
      />
    </Container>
  );
};

export default Schools;
