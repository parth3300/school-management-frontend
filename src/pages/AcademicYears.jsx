import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarToday,
  School,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { styled } from '@mui/material/styles';
import api from '../api/axios';
import API_ENDPOINTS from '../api/endpoints';
import { fetchSchools } from '../redux/slices/schoolSlice';

const StyledCard = styled(motion.div)(({ theme }) => ({
  height: '100%',
  '& .MuiCard-root': {
    height: '100%',
    transition: 'transform 0.3s, box-shadow 0.3s',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: theme.shadows[8],
    },
  },
}));

const AcademicYears = () => {
  const [academicYears, setAcademicYears] = useState([]);
  const [schools, setSchools] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    start_date: null,
    end_date: null,
    is_current: false,
    school: '',
  });

  useEffect(() => {
    fetchAcademicYears();
    fetchSchools();
  }, []);

  const fetchAcademicYears = async () => {
    try {
      setLoading(true);
      const response = await api.get(API_ENDPOINTS.academicYears.getAll);
      setAcademicYears(response.data);
    } catch (error) {
      setError('Failed to fetch academic years');
    } finally {
      setLoading(false);
    }
  };


  const handleOpenDialog = (year = null) => {
    if (year) {
      setSelectedYear(year);
      setFormData({
        name: year.name,
        start_date: new Date(year.start_date),
        end_date: new Date(year.end_date),
        is_current: year.is_current,
        school: year.school.id,
      });
    } else {
      setSelectedYear(null);
      setFormData({
        name: '',
        start_date: null,
        end_date: null,
        is_current: false,
        school: '',
      });
    }
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (selectedYear) {
        await api.put(`${API_ENDPOINTS.academicYears}${selectedYear.id}/`, formData);
      } else {
        await api.post(API_ENDPOINTS.academicYears, formData);
      }
      fetchAcademicYears();
      setOpenDialog(false);
    } catch (error) {
      setError('Failed to save academic year');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this academic year?')) {
      try {
        setLoading(true);
        await api.delete(`${API_ENDPOINTS.academicYears}${id}/`);
        fetchAcademicYears();
      } catch (error) {
        setError('Failed to delete academic year');
      } finally {
        setLoading(false);
      }
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            fontWeight: 'bold'
          }}
        >
          Academic Years
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add New Academic Year
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <motion.div variants={containerAnimation} initial="hidden" animate="show">
        <Grid container spacing={3}>
          {loading ? (
            <Box display="flex" justifyContent="center" width="100%" mt={4}>
              <CircularProgress />
            </Box>
          ) : (
            academicYears.map((year) => (
              <Grid item xs={12} sm={6} md={4} key={year.id}>
                <StyledCard variants={itemAnimation}>
                  <Card>
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <CalendarToday color="primary" />
                        <Typography variant="h6">{year.name}</Typography>
                        {year.is_current && (
                          <Chip
                            label="Current"
                            color="success"
                            size="small"
                            sx={{ ml: 'auto' }}
                          />
                        )}
                      </Box>

                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <School fontSize="small" color="action" />
                        <Typography variant="body2" color="textSecondary">
                          {year.school.name}
                        </Typography>
                      </Box>

                      <Typography variant="body2" color="textSecondary" mb={1}>
                        Duration: {new Date(year.start_date).toLocaleDateString()} - {new Date(year.end_date).toLocaleDateString()}
                      </Typography>

                      <Box display="flex" gap={1} mt={2}>
                        <Button
                          size="small"
                          startIcon={<EditIcon />}
                          onClick={() => handleOpenDialog(year)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDelete(year.id)}
                        >
                          Delete
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </StyledCard>
              </Grid>
            ))
          )}
        </Grid>
      </motion.div>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedYear ? 'Edit Academic Year' : 'Add New Academic Year'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={formData.start_date}
                onChange={(date) => setFormData({ ...formData, start_date: date })}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
              <DatePicker
                label="End Date"
                value={formData.end_date}
                onChange={(date) => setFormData({ ...formData, end_date: date })}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>

            <TextField
              select
              fullWidth
              label="School"
              value={formData.school}
              onChange={(e) => setFormData({ ...formData, school: e.target.value })}
            >
              {schools.map((school) => (
                <option key={school.id} value={school.id}>
                  {school.name}
                </option>
              ))}
            </TextField>

            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_current}
                  onChange={(e) => setFormData({ ...formData, is_current: e.target.checked })}
                />
              }
              label="Set as Current Academic Year"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AcademicYears;