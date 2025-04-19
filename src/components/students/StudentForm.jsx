import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Avatar,
  IconButton,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

const StudentForm = ({ open, onClose, onSubmit, student, classes }) => {
  const [previewImage, setPreviewImage] = useState(student?.photo || null);

  const validationSchema = Yup.object({
    user: Yup.object({
      first_name: Yup.string().required('First name is required'),
      last_name: Yup.string().required('Last name is required'),
      email: Yup.string().email('Invalid email').required('Email is required'),
    }),
    admission_number: Yup.string().required('Admission number is required'),
    date_of_birth: Yup.date().required('Date of birth is required'),
    gender: Yup.string().required('Gender is required'),
    address: Yup.string().required('Address is required'),
    parent_name: Yup.string().required('Parent name is required'),
    parent_phone: Yup.string().required('Parent phone is required'),
    admission_date: Yup.date().required('Admission date is required'),
    current_class: Yup.string().required('Class is required'),
  });

  const formik = useFormik({
    initialValues: {
      user: {
        first_name: student?.user?.first_name || '',
        last_name: student?.user?.last_name || '',
        email: student?.user?.email || '',
      },
      admission_number: student?.admission_number || '',
      date_of_birth: student?.date_of_birth || null,
      gender: student?.gender || '',
      address: student?.address || '',
      phone: student?.phone || '',
      parent_name: student?.parent_name || '',
      parent_phone: student?.parent_phone || '',
      admission_date: student?.admission_date || null,
      current_class: student?.current_class || '',
      photo: null,
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  const handleImageChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      formik.setFieldValue('photo', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{student ? 'Edit Student' : 'Add New Student'}</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar
                src={previewImage}
                sx={{ width: 120, height: 120, mb: 2 }}
              />
              <input
                accept="image/*"
                id="photo-upload"
                type="file"
                style={{ display: 'none' }}
                onChange={handleImageChange}
              />
              <label htmlFor="photo-upload">
                <IconButton color="primary" component="span">
                  <PhotoCamera />
                </IconButton>
              </label>
            </Grid>
            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="user.first_name"
                    name="user.first_name"
                    label="First Name"
                    value={formik.values.user.first_name}
                    onChange={formik.handleChange}
                    error={formik.touched.user?.first_name && Boolean(formik.errors.user?.first_name)}
                    helperText={formik.touched.user?.first_name && formik.errors.user?.first_name}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="user.last_name"
                    name="user.last_name"
                    label="Last Name"
                    value={formik.values.user.last_name}
                    onChange={formik.handleChange}
                    error={formik.touched.user?.last_name && Boolean(formik.errors.user?.last_name)}
                    helperText={formik.touched.user?.last_name && formik.errors.user?.last_name}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="user.email"
                    name="user.email"
                    label="Email"
                    value={formik.values.user.email}
                    onChange={formik.handleChange}
                    error={formik.touched.user?.email && Boolean(formik.errors.user?.email)}
                    helperText={formik.touched.user?.email && formik.errors.user?.email}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="admission_number"
                    name="admission_number"
                    label="Admission Number"
                    value={formik.values.admission_number}
                    onChange={formik.handleChange}
                    error={formik.touched.admission_number && Boolean(formik.errors.admission_number)}
                    helperText={formik.touched.admission_number && formik.errors.admission_number}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DatePicker
                    label="Date of Birth"
                    value={formik.values.date_of_birth}
                    onChange={(date) => formik.setFieldValue('date_of_birth', date)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        margin="normal"
                        error={formik.touched.date_of_birth && Boolean(formik.errors.date_of_birth)}
                        helperText={formik.touched.date_of_birth && formik.errors.date_of_birth}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="gender-label">Gender</InputLabel>
                    <Select
                      labelId="gender-label"
                      id="gender"
                      name="gender"
                      value={formik.values.gender}
                      onChange={formik.handleChange}
                      error={formik.touched.gender && Boolean(formik.errors.gender)}
                    >
                      <MenuItem value="M">Male</MenuItem>
                      <MenuItem value="F">Female</MenuItem>
                      <MenuItem value="O">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="address"
                    name="address"
                    label="Address"
                    multiline
                    rows={3}
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    error={formik.touched.address && Boolean(formik.errors.address)}
                    helperText={formik.touched.address && formik.errors.address}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="parent_name"
                    name="parent_name"
                    label="Parent Name"
                    value={formik.values.parent_name}
                    onChange={formik.handleChange}
                    error={formik.touched.parent_name && Boolean(formik.errors.parent_name)}
                    helperText={formik.touched.parent_name && formik.errors.parent_name}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="parent_phone"
                    name="parent_phone"
                    label="Parent Phone"
                    value={formik.values.parent_phone}
                    onChange={formik.handleChange}
                    error={formik.touched.parent_phone && Boolean(formik.errors.parent_phone)}
                    helperText={formik.touched.parent_phone && formik.errors.parent_phone}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DatePicker
                    label="Admission Date"
                    value={formik.values.admission_date}
                    onChange={(date) => formik.setFieldValue('admission_date', date)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        margin="normal"
                        error={formik.touched.admission_date && Boolean(formik.errors.admission_date)}
                        helperText={formik.touched.admission_date && formik.errors.admission_date}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="class-label">Class</InputLabel>
                    <Select
                      labelId="class-label"
                      id="current_class"
                      name="current_class"
                      value={formik.values.current_class}
                      onChange={formik.handleChange}
                      error={formik.touched.current_class && Boolean(formik.errors.current_class)}
                    >
                      {classes.map((cls) => (
                        <MenuItem key={cls.id} value={cls.id}>
                          {cls.name}
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
          <Button type="submit" color="primary" variant="contained">
            {student ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default StudentForm;