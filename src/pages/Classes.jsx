import React, { useState, useEffect } from 'react';
import {
  Container, Box, Typography, Grid, Card, CardContent, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Chip, Alert, CircularProgress, FormControl, InputLabel,
  Select, MenuItem, OutlinedInput, useTheme, useMediaQuery
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
  Class as ClassIcon, Person as PersonIcon, School as SchoolIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchClasses,
  createClass,
  updateClass,
  deleteClass,
  selectClasses,
  selectClassesLoading,
  selectClassesError
} from '../redux/slices/classSlice';
import {
  fetchTeachers,
  selectTeachers,
  selectTeachersLoading
} from '../redux/slices/teacherSlice';
import {
  fetchAcademicYears,
  selectAcademicYears,
  selectAcademicYearLoading
} from '../redux/slices/academicYearSlice';

// Styled Components
const StyledCard = styled(motion(Card))(({ theme }) => ({
  height: '100%',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  },
  display: 'flex',
  flexDirection: 'column',
}));

const Classes = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();

  // Redux selectors
  const classes = useSelector(selectClasses);
  const teachers = useSelector(selectTeachers);
  const academicYears = useSelector(selectAcademicYears);
  const loading = {
    classes: useSelector(selectClassesLoading),
    teachers: useSelector(selectTeachersLoading),
    years: useSelector(selectAcademicYearLoading),
    form: false // Form loading handled separately
  };
  const error = useSelector(selectClassesError);

  // Local state
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
    academic_year: '',
    teachers: [],
  });
  const [formErrors, setFormErrors] = useState({
    name: false,
    capacity: false,
    academic_year: false,
  });

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchClasses());
    dispatch(fetchTeachers());
    dispatch(fetchAcademicYears());
  }, [dispatch]);

  // Dialog handlers
  const handleOpenDialog = (classData = null) => {
    setFormErrors({
      name: false,
      capacity: false,
      academic_year: false,
    });

    if (classData) {
      setSelectedClass(classData);
      setFormData({
        name: classData.name,
        capacity: classData.capacity.toString(),
        academic_year: classData.academic_year.id,
        teachers: classData.teachers.map(teacher => teacher.id),
      });
    } else {
      setSelectedClass(null);
      setFormData({
        name: '',
        capacity: '',
        academic_year: '',
        teachers: [],
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedClass(null);
  };

  // Form handlers
  const validateForm = () => {
    const errors = {
      name: !formData.name.trim(),
      capacity: !formData.capacity || isNaN(formData.capacity) || parseInt(formData.capacity) <= 0,
      academic_year: !formData.academic_year,
    };
    setFormErrors(errors);
    return !Object.values(errors).some(error => error);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: false,
      }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const payload = {
      ...formData,
      capacity: parseInt(formData.capacity),
    };

    try {
      if (selectedClass) {
        await dispatch(updateClass({ id: selectedClass.id, data: payload })).unwrap();
      } else {
        await dispatch(createClass(payload)).unwrap();
      }
      handleCloseDialog();
    } catch (error) {
      // Error will be handled by Redux and displayed via selector
    }
  };

  const handleDelete = async (classId) => {
    if (!window.confirm('Are you sure you want to delete this class?')) return;
    try {
      await dispatch(deleteClass(classId)).unwrap();
    } catch (error) {
      // Error will be handled by Redux
    }
  };

  // Loading state
  if (loading.classes && classes.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '80vh' 
      }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Classes Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          disabled={loading.classes}
        >
          Add New Class
        </Button>
      </Box>


      <Grid container spacing={3}>
        {classes.map((classItem) => (
          <Grid item xs={12} sm={6} md={4} key={classItem.id}>
            <StyledCard
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <ClassIcon color="primary" />
                  <Typography variant="h6" component="div">
                    {classItem.name}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <SchoolIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    Academic Year: {classItem.academic_year.name}
                  </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" mb={1}>
                  Capacity: {classItem.capacity} students
                </Typography>

                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    Teachers:
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {classItem.teachers.map((teacher) => (
                      <Chip
                        key={teacher.id}
                        icon={<PersonIcon fontSize="small" />}
                        label={`${teacher.user.first_name} ${teacher.user.last_name}`}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>

                <Box display="flex" gap={1} mt="auto">
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleOpenDialog(classItem)}
                    disabled={loading.classes}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(classItem.id)}
                    disabled={loading.classes}
                  >
                    Delete
                  </Button>
                </Box>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>

      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="sm" 
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          {selectedClass ? 'Edit Class' : 'Add New Class'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Class Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              margin="dense"
              required
              error={formErrors.name}
              helperText={formErrors.name ? 'Class name is required' : ''}
            />

            <TextField
              fullWidth
              label="Capacity"
              name="capacity"
              type="number"
              value={formData.capacity}
              onChange={handleInputChange}
              margin="dense"
              required
              error={formErrors.capacity}
              helperText={formErrors.capacity ? 'Please enter a valid capacity (positive number)' : ''}
              inputProps={{ min: 1 }}
            />

            <FormControl 
              fullWidth 
              margin="dense"
              error={formErrors.academic_year}
              required
            >
              <InputLabel>Academic Year</InputLabel>
              <Select
                name="academic_year"
                value={formData.academic_year}
                onChange={handleInputChange}
                label="Academic Year"
              >
                {academicYears.map((year) => (
                  <MenuItem key={year.id} value={year.id}>
                    {year.name}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.academic_year && (
                <Typography variant="caption" color="error">
                  Academic year is required
                </Typography>
              )}
            </FormControl>

            <FormControl fullWidth margin="dense">
              <InputLabel>Teachers</InputLabel>
              <Select
                multiple
                name="teachers"
                value={formData.teachers}
                onChange={handleInputChange}
                input={<OutlinedInput label="Teachers" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((teacherId) => {
                      const teacher = teachers.find(t => t.id === teacherId);
                      return teacher ? (
                        <Chip
                          key={teacherId}
                          label={`${teacher.user.first_name} ${teacher.user.last_name}`}
                          size="small"
                        />
                      ) : null;
                    })}
                  </Box>
                )}
              >
                {teachers.map((teacher) => (
                  <MenuItem key={teacher.id} value={teacher.id}>
                    {`${teacher.user.first_name} ${teacher.user.last_name}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={loading.form}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Classes;