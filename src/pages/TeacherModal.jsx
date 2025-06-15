import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
  IconButton,
  Typography,
  useTheme,
  Grid,
  OutlinedInput,
} from '@mui/material';
import { CloudUpload, Cancel } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

const TeacherModal = ({ open, onClose, onSubmit, teacher, subjects, schools }) => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
    date_of_birth: null,
    gender: '',
    photo: null,
    photoPreview: '',
    joining_date: dayjs(),
    qualification: '',
    subjects: [],
    school: '',
    role: 'teacher',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (teacher) {
      setFormData({
        email: teacher.user?.email || '',
        first_name: teacher.user?.first_name || '',
        last_name: teacher.user?.last_name || '',
        phone: teacher.user?.phone || '',
        address: teacher.user?.address || '',
        date_of_birth: teacher.user?.date_of_birth ? dayjs(teacher.user.date_of_birth) : null,
        gender: teacher.user?.gender || '',
        photo: null,
        photoPreview: teacher.user?.photo || '',
        joining_date: dayjs(teacher.joining_date),
        qualification: teacher.qualification || '',
        subjects: teacher.subjects?.map(s => s.id) || [],
        school: teacher.school?.id || '',
        role: teacher.user?.role || 'teacher',
      });
    } else {
      setFormData({
        email: '',
        first_name: '',
        last_name: '',
        phone: '',
        address: '',
        date_of_birth: null,
        gender: '',
        photo: null,
        photoPreview: '',
        joining_date: dayjs(),
        qualification: '',
        subjects: [],
        school: '',
        role: 'teacher',
      });
    }
  }, [teacher]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleDateChange = (date, field) => {
    setFormData(prev => ({ ...prev, [field]: date }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        photo: file,
        photoPreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleRemovePhoto = () => {
    setFormData(prev => ({
      ...prev,
      photo: null,
      photoPreview: '',
    }));
  };

  const handleSubjectChange = (event) => {
    setFormData(prev => ({
      ...prev,
      subjects: event.target.value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.first_name) newErrors.first_name = 'First name is required';
    if (!formData.joining_date) newErrors.joining_date = 'Joining date is required';
    if (!formData.qualification) newErrors.qualification = 'Qualification is required';
    if (!formData.school) newErrors.school = 'School is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {teacher ? 'Edit Teacher' : 'Add New Teacher'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box display="flex" flexDirection="column" alignItems="center">
                <Avatar
                  src={formData.photoPreview}
                  sx={{ width: 120, height: 120, mb: 2 }}
                >
                  {formData.first_name?.[0]}{formData.last_name?.[0]}
                </Avatar>
                
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="photo-upload"
                  type="file"
                  onChange={handleFileChange}
                />
                <label htmlFor="photo-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<CloudUpload />}
                    sx={{ mb: 1 }}
                  >
                    Upload Photo
                  </Button>
                </label>
                
                {formData.photoPreview && (
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Cancel />}
                    onClick={handleRemovePhoto}
                  >
                    Remove
                  </Button>
                )}
              </Box>
            </Grid>
            
            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    error={!!errors.first_name}
                    helperText={errors.first_name}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Gender</InputLabel>
                    <Select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      label="Gender"
                    >
                      <MenuItem value="M">Male</MenuItem>
                      <MenuItem value="F">Female</MenuItem>
                      <MenuItem value="O">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Date of Birth"
                    value={formData.date_of_birth}
                    onChange={(date) => handleDateChange(date, 'date_of_birth')}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Joining Date"
                    value={formData.joining_date}
                    onChange={(date) => handleDateChange(date, 'joining_date')}
                    renderInput={(params) => (
                      <TextField 
                        {...params} 
                        fullWidth 
                        error={!!errors.joining_date}
                        helperText={errors.joining_date}
                        required
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Qualification"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    error={!!errors.qualification}
                    helperText={errors.qualification}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={!!errors.school} required>
                    <InputLabel>School</InputLabel>
                    <Select
                      name="school"
                      value={formData.school}
                      onChange={handleChange}
                      label="School"
                    >
                      {schools.map((school) => (
                        <MenuItem key={school.id} value={school.id}>
                          {school.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.school && (
                      <Typography variant="caption" color="error">
                        {errors.school}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Role</InputLabel>
                    <Select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      label="Role"
                    >
                      <MenuItem value="admin">Admin</MenuItem>
                      <MenuItem value="teacher">Teacher</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Subjects</InputLabel>
                    <Select
                      multiple
                      name="subjects"
                      value={formData.subjects}
                      onChange={handleSubjectChange}
                      input={<OutlinedInput label="Subjects" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((subjectId) => {
                            const subject = subjects.find(s => s.id === subjectId);
                            return subject ? (
                              <Chip key={subjectId} label={subject.name} size="small" />
                            ) : null;
                          })}
                        </Box>
                      )}
                    >
                      {subjects.map((subject) => (
                        <MenuItem key={subject.id} value={subject.id}>
                          {subject.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {teacher ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TeacherModal;