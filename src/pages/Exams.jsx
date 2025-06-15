import React, { useState, useEffect } from 'react';
import {
  Container, Box, Typography, Grid, Card, CardContent, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Alert, CircularProgress, FormControl, InputLabel,
  Select, MenuItem, useTheme, useMediaQuery,
  TableContainer, Paper
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
  Event as EventIcon, DateRange as DateRangeIcon,
  School as SchoolIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { fetchExams, createExam, updateExam, deleteExam, clearExamErrors } from '../redux/slices/examSlice';
import { fetchAcademicYears } from '../redux/slices/academicYearSlice';

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  },
}));

const Exams = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();

  // Redux state
  const {
    data: exams = [],
    loading: examsLoading,
    error: examsError,
    success: examsSuccess
  } = useSelector((state) => state.exams);
  const { data: academicYears = [] } = useSelector((state) => state.academicYears);

  // Local state
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    academic_year: '',
    start_date: '',
    end_date: '',
    description: '',
    school: localStorage.getItem('schoolId') || '',
  });
  const [formErrors, setFormErrors] = useState({
    name: false,
    academic_year: false,
    start_date: false,
    end_date: false,
    school: false,
  });

  // Fetch data - fixed useEffect
  useEffect(() => {
    const fetchData = async () => {
      console.log("Fetching data...");
      try {
        await dispatch(fetchExams());
        await dispatch(fetchAcademicYears());
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    
    fetchData();
  }, [dispatch]); // Added dispatch to dependencies

  // Reset success message
  useEffect(() => {
    if (examsSuccess) {
      const timer = setTimeout(() => {
        dispatch(clearExamErrors());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [examsSuccess, dispatch]);

  // Dialog open/close
  const handleOpenDialog = (exam = null) => {
    setSelectedExam(exam);
    if (exam) {
      setFormData({
        name: exam.name,
        academic_year: exam.academic_year.id,
        start_date: dayjs(exam.start_date).format('YYYY-MM-DD'),
        end_date: dayjs(exam.end_date).format('YYYY-MM-DD'),
        description: exam.description || '',
        school: exam.school.id,
      });
    } else {
      setFormData({
        name: '',
        academic_year: '',
        start_date: '',
        end_date: '',
        description: '',
        school: localStorage.getItem('schoolId') || '',
      });
    }
    setFormErrors({
      name: false,
      academic_year: false,
      start_date: false,
      end_date: false,
      school: false,
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedExam(null);
  };

  // Input handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  // Validation
  const validateForm = () => {
    const errors = {
      name: !formData.name.trim(),
      academic_year: !formData.academic_year,
      start_date: !formData.start_date,
      end_date:
        !formData.end_date ||
        (formData.start_date && new Date(formData.end_date) < new Date(formData.start_date)),
      school: !formData.school,
    };
    setFormErrors(errors);
    return !Object.values(errors).some((err) => err);
  };

  // Submit
  const handleSubmit = () => {
    console.log("hello");
    
    if (!validateForm()) return;

    const payload = {
      ...formData,
      start_date: formData.start_date,
      end_date: formData.end_date,
    };

    if (selectedExam) {
      dispatch(updateExam({ id: selectedExam.id, examData: payload }));
    } else {
      dispatch(createExam(payload));
    }
  };

  // Delete
  const handleDelete = (examId) => {
    if (window.confirm('Are you sure you want to delete this exam?')) {
      dispatch(deleteExam(examId));
    }
  };

  if (examsLoading && exams.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4" component="h1">
            Exams Management
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            disabled={examsLoading}
          >
            Add New Exam
          </Button>
        </Box>
      </motion.div>

      {(examsError || examsSuccess) && (
        <Alert
          severity={examsError ? 'error' : 'success'}
          onClose={() => dispatch(clearExamErrors())}
          sx={{ mb: 3 }}
        >
          {examsError || examsSuccess}
        </Alert>
      )}

      {exams.length === 0 && !examsLoading ? (
        <Card>
          <CardContent>
            <Typography align="center">No exams found</Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {exams.map((exam) => (
            <Grid item xs={12} sm={6} md={4} key={exam.id}>
              <StyledCard>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <EventIcon color="primary" />
                    <Typography variant="h6">{exam.name}</Typography>
                  </Box>

                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <DateRangeIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {dayjs(exam.start_date).format('MMM D, YYYY')} - {dayjs(exam.end_date).format('MMM D, YYYY')}
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <SchoolIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {exam.academic_year.name} • {exam.school.name}
                    </Typography>
                  </Box>

                  {exam.description && (
                    <Box mb={2}>
                      <Typography variant="body2" color="text.secondary">
                        {exam.description}
                      </Typography>
                    </Box>
                  )}

                  <Box display="flex" gap={1}>
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => handleOpenDialog(exam)}
                      disabled={examsLoading}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDelete(exam.id)}
                      disabled={examsLoading}
                    >
                      Delete
                    </Button>
                  </Box>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth fullScreen={isMobile}>
        <DialogTitle>{selectedExam ? 'Edit Exam' : 'Add New Exam'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Exam Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              margin="dense"
              required
              error={formErrors.name}
              helperText={formErrors.name ? 'Exam name is required' : ''}
            />

            <FormControl fullWidth margin="dense" error={formErrors.academic_year} required>
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
              
            <TextField
              fullWidth
              label="Start Date"
              name="start_date"
              type="date"
              value={formData.start_date}
              onChange={handleInputChange}
              margin="dense"
              required
              error={formErrors.start_date}
              helperText={formErrors.start_date ? 'Start date is required' : ''}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              fullWidth
              label="End Date"
              name="end_date"
              type="date"
              value={formData.end_date}
              onChange={handleInputChange}
              margin="dense"
              required
              error={formErrors.end_date}
              helperText={formErrors.end_date ? 'End date is required and must be after start date' : ''}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: formData.start_date || undefined }}
            />

            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              margin="dense"
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={examsLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={examsLoading}
            startIcon={examsLoading ? <CircularProgress size={20} /> : null}
          >
            {examsLoading ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Exams;