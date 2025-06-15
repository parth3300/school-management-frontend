import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
  Alert,
  Snackbar,
  CircularProgress,
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import RecordIcon from '@mui/icons-material/FiberManualRecord';
import API_ENDPOINTS from '../api/endpoints';
import api from '../api/axios';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeacherClasses, selectTeacherClasses } from '../redux/slices/teacherSlice';

const GoogleMeetCreator = () => {
  const dispatch = useDispatch();
  const { teacherClasses, loading: classesLoading } = useSelector(selectTeacherClasses);
  const [title, setTitle] = useState('Class Meeting');
  const [description, setDescription] = useState('Join via Google Meet');
  const [startTime, setStartTime] = useState(dayjs());
  const [endTime, setEndTime] = useState(dayjs().add(1, 'hour'));
  const [enableBot, setEnableBot] = useState(false);
  const [filename, setFilename] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Fetch teacher's classes on component mount
  useEffect(() => {
    const fetchData = async () => {
      console.log("Fetching data...");
      try {
        dispatch(fetchTeacherClasses());

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    
    fetchData();    
  }, [dispatch]);

  const handleCreateMeet = async () => {
    const start = encodeURIComponent(startTime.toISOString());
    const end = encodeURIComponent(endTime.toISOString());

    const calendarUrl = `https://calendar.google.com/calendar/u/0/r/eventedit?text=${encodeURIComponent(
      title
    )}&dates=${start}/${end}&details=${encodeURIComponent(
      description
    )}&location=Google+Meet&sf=true`;

    if (enableBot) {
      if (!filename) {
        setSnackbar({
          open: true,
          message: 'Please enter a filename for the recording',
          severity: 'error'
        });
        return;
      }

      if (!selectedClass) {
        setSnackbar({
          open: true,
          message: 'Please select a class',
          severity: 'error'
        });
        return;
      }

      setLoading(true);
      try {
        // Call backend to start the bot with class information
        const payload = {
          meeting_link: calendarUrl,
          filename: filename,
          class_id: selectedClass
        };
        
        const response = await api.post(API_ENDPOINTS.meeting_bot, payload);
        
        if (response.status === 200) {
          setSnackbar({
            open: true,
            message: 'Meeting created and bot started successfully!',
            severity: 'success'
          });
          window.open(calendarUrl, '_blank');
        } else {
          throw new Error(response.data?.message || 'Failed to start bot');
        }
      } catch (error) {
        setSnackbar({
          open: true,
          message: `Error: ${error.message}`,
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    } else {
      window.open(calendarUrl, '_blank');
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Paper elevation={4} sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Schedule Google Meet
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Meeting Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={3}
          />
        </Grid>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid item xs={12} sm={6}>
            <DateTimePicker
              label="Start Time"
              value={startTime}
              onChange={setStartTime}
              renderInput={(params) => <TextField fullWidth {...params} required />}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <DateTimePicker
              label="End Time"
              value={endTime}
              onChange={setEndTime}
              minDateTime={startTime}
              renderInput={(params) => <TextField fullWidth {...params} required />}
            />
          </Grid>
        </LocalizationProvider>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={enableBot}
                onChange={(e) => setEnableBot(e.target.checked)}
                color="primary"
              />
            }
            label="Enable Meeting Bot (Auto Recording)"
          />
        </Grid>

        {enableBot && (
          <>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="class-select-label">Select Class</InputLabel>
                <Select
                  labelId="class-select-label"
                  value={selectedClass}
                  label="Select Class"
                  onChange={(e) => setSelectedClass(e.target.value)}
                  required
                >
                  {classesLoading ? (
                    <MenuItem disabled>Loading classes...</MenuItem>
                  ) : teacherClasses.length > 0 ? (
                    teacherClasses.map((cls) => (
                      <MenuItem key={cls.id} value={cls.id}>
                        {cls.name} (Grade {cls.grade_level})
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No classes available</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Recording Filename"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                helperText="This will be used to save the recording (without extension)"
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Alert severity="info">
                The bot will automatically join the meeting and record it for the selected class.
                Recording will stop when all participants leave or after maximum duration.
              </Alert>
            </Grid>
          </>
        )}

        <Grid item xs={12}>
          <Button
            variant="contained"
            startIcon={
              loading ? <CircularProgress size={20} /> : 
              enableBot ? <RecordIcon /> : <VideoCallIcon />
            }
            fullWidth
            onClick={handleCreateMeet}
            color="primary"
            disabled={loading || (enableBot && (!filename || !selectedClass))}
            size="large"
          >
            {loading ? 'Processing...' : 
             enableBot ? 'Create Meeting & Start Recording' : 'Create Google Meet Link'}
          </Button>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default GoogleMeetCreator;