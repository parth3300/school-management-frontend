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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SchoolForm from '../components/schools/SchoolForm';
import { fetchSchools, createSchool, updateSchool, deleteSchool } from '../redux/slices/schoolSlice';
import api from '../api/axios';
import API_ENDPOINTS from '../api/endpoints';

const Schools = () => {
  const dispatch = useDispatch();
  const { schools, loading, error } = useSelector((state) => state.school);
  const [openForm, setOpenForm] = useState(false);
  const [currentSchool, setCurrentSchool] = useState(null);

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
      <Box sx={{ my: 4 }}>
        <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Grid item>
            <Typography variant="h4">Schools</Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setCurrentSchool(null);
                setOpenForm(true);
              }}
            >
              Add School
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
                      <TableCell>Name</TableCell>
                      <TableCell>Address</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {schools.map((school) => (
                      <TableRow key={school.id}>
                        <TableCell>{school.name}</TableCell>
                        <TableCell>{school.address}</TableCell>
                        <TableCell>{school.phone}</TableCell>
                        <TableCell>{school.email}</TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            onClick={() => {
                              setCurrentSchool(school);
                              setOpenForm(true);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            size="small"
                            color="error"
                            onClick={() => handleDelete(school.id)}
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