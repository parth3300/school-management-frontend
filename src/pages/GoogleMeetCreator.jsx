import React, { useState, useEffect } from 'react';
import {
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
  MenuItem,
  Radio,
  RadioGroup,
  FormLabel,
  Box
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import RecordIcon from '@mui/icons-material/FiberManualRecord';
import ScheduleIcon from '@mui/icons-material/Schedule';
import API_ENDPOINTS from '../api/endpoints';
import api from '../api/axios';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeacherClasses, selectTeacherClasses } from '../redux/slices/teacherSlice';
import { selectTeachersLoading } from '../redux/slices/subjectSlice';

const GoogleMeetCreator = () => {
  const dispatch = useDispatch();
  const teacherClasses = useSelector(selectTeacherClasses);
  const classesLoading = useSelector(selectTeachersLoading);
  const [title, setTitle] = useState('Class Meeting');
  const [description, setDescription] = useState('Join via Google Meet');
  const [startTime, setStartTime] = useState(dayjs().add(30, 'minutes'));
  const [endTime, setEndTime] = useState(dayjs().add(90, 'minutes'));
  const [duration, setDuration] = useState(60);
  const [durationType, setDurationType] = useState('minutes');
  const [meetingType, setMeetingType] = useState('instant');
  const [enableBot, setEnableBot] = useState(false);
  const [filename, setFilename] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [meetingLink, setMeetingLink] = useState('');
  const [meetingCreated, setMeetingCreated] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
  const [classesFetched, setClassesFetched] = useState(false);

  useEffect(() => {
    if (user && !classesFetched) {
      dispatch(fetchTeacherClasses(user.id));
      setClassesFetched(true);
    }
  }, [dispatch, user, classesFetched]);

  useEffect(() => {
    calculateEndTime();
  }, [duration, durationType, startTime, meetingType]);

  console.log("role",localStorage.getItem('role'));
  
  const calculateEndTime = () => {
    const baseTime = meetingType === 'instant' ? dayjs() : startTime;
    
    if (durationType === 'minutes') {
      setEndTime(baseTime.add(duration, 'minutes'));
    } else if (durationType === 'hours') {
      setEndTime(baseTime.add(duration, 'hours'));
    } else {
      setEndTime(baseTime.add(duration, 'days'));
    }
  };

const handleCreateMeet = async () => {
  if (!selectedClass) {
    return setSnackbar({
      open: true,
      message: 'Please select a class',
      severity: 'error'
    });
  }

  const meetingPayload = {
    title,
    description,
    start_time: startTime.toISOString(),
    end_time: endTime.toISOString(),
    duration: duration,
    teacher_email: user.email,
    class_id: selectedClass
  };

  
  try {
    const response = await api.post(API_ENDPOINTS.create_meeting, meetingPayload);
    const data = await response.data;

    if (response.status !== 200) {
      throw new Error(data.error || "Failed to create meeting");
    }

    const meetUrl = data.meet_url;
    setMeetingCreated(true);
    window.open(meetUrl, '_blank');

    setSnackbar({
      open: true,
      message: '✅ Meeting created successfully!',
      severity: 'success'
    });

    // If bot recording is enabled
    if (enableBot) {
      await startBotRecording(meetUrl);
    }
  } catch (error) {
    setSnackbar({
      open: true,
      message: `❌ Error: ${error.message}`,
      severity: 'error'
    });
  }
};

const startBotRecording = async (meetUrl) => {
  if (!filename) {
    return setSnackbar({
      open: true,
      message: 'Please enter a filename for the recording',
      severity: 'error'
    });
  }

  setLoading(true);
  try {
    const botPayload = {
      meeting_link: meetUrl,
      filename: `${filename}.mp4`,
      class_id: selectedClass,
      start_time: meetingType === 'scheduled' ? startTime.toISOString() : dayjs().toISOString(),
      end_time: endTime.toISOString(),
      duration
    };

    const botResponse = await api.post(API_ENDPOINTS.meeting_bot, botPayload);

    if (botResponse.status !== 200) {
      throw new Error(botResponse.data?.message || 'Failed to start bot');
    }

    setSnackbar({
      open: true,
      message: '🤖 Bot started successfully for the meeting!',
      severity: 'success'
    });
  } catch (botError) {
    setSnackbar({
      open: true,
      message: `❌ Bot Error: ${botError.message}`,
      severity: 'error'
    });
  } finally {
    setLoading(false);
    setMeetingCreated(false);
  }
};


  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleStartTimeChange = (newValue) => {
    const now = dayjs();
    if (newValue.isAfter(now)) {
      setStartTime(newValue);
      calculateEndTime();
    } else {
      setSnackbar({
        open: true,
        message: 'Start time must be in the future',
        severity: 'error'
      });
    }
  };

  const handleDurationChange = (e) => {
    const newDuration = parseInt(e.target.value) || 30;
    setDuration(newDuration);
    calculateEndTime();
  };

  const handleDurationTypeChange = (e) => {
    setDurationType(e.target.value);
  };

  const shouldDisableDateTime = (date) => {
    return date.isBefore(dayjs(), 'minute');
  };

  return (
    <Paper elevation={4} sx={{ p: 4, maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Schedule Google Meet
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Meeting Type</FormLabel>
            <RadioGroup
              row
              value={meetingType}
              onChange={(e) => setMeetingType(e.target.value)}
            >
              <FormControlLabel
                value="instant"
                control={<Radio />}
                label="Instant Meeting"
              />
              <FormControlLabel
                value="scheduled"
                control={<Radio />}
                label="Scheduled Meeting"
              />
            </RadioGroup>
          </FormControl>
        </Grid>

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
          {meetingType === 'scheduled' && (
            <Grid item xs={12} sm={6}>
              <DateTimePicker
                label="Start Time"
                value={startTime}
                onChange={handleStartTimeChange}
                renderInput={(params) => <TextField fullWidth {...params} required />}
                minDateTime={dayjs()}
                shouldDisableDateTime={shouldDisableDateTime}
              />
            </Grid>
          )}

          <Grid item xs={6} sm={meetingType === 'scheduled' ? 3 : 6}>
            <TextField
              fullWidth
              label="Duration"
              type="number"
              value={duration}
              onChange={handleDurationChange}
              InputProps={{ inputProps: { min: 1 } }}
              required
            />
          </Grid>

          <Grid item xs={6} sm={meetingType === 'scheduled' ? 3 : 6}>
            <FormControl fullWidth>
              <InputLabel>Duration Type</InputLabel>
              <Select
                value={durationType}
                label="Duration Type"
                onChange={handleDurationTypeChange}
              >
                <MenuItem value="minutes">Minutes</MenuItem>
                <MenuItem value="hours">Hours</MenuItem>
                <MenuItem value="days">Days</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </LocalizationProvider>

        <Grid item xs={12}>
          <Box sx={{ p: 2, border: '1px dashed grey', borderRadius: 1 }}>
            <Typography variant="subtitle1">Meeting Details:</Typography>
            {meetingType === 'scheduled' ? (
              <>
                <Typography>Start: {startTime.format('YYYY-MM-DD HH:mm')}</Typography>
                <Typography>End: {endTime.format('YYYY-MM-DD HH:mm')}</Typography>
              </>
            ) : (
              <>
                <Typography>Start: Now</Typography>
                <Typography>End: {endTime.format('YYYY-MM-DD HH:mm')}</Typography>
              </>
            )}
            <Typography>Duration: {duration} {durationType}</Typography>
          </Box>
        </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="class-select-label">Select Class</InputLabel>
                <Select
                  labelId="class-select-label"
                  value={selectedClass}
                  label="Select Class"
                  onChange={(e) => setSelectedClass(e.target.value)}
                  required
                  sx={{ width: 300 }} // 👈 fixed width in pixels

                >
                  {classesLoading ? (
                    <MenuItem disabled>Loading classes...</MenuItem>
                  ) : teacherClasses && teacherClasses.length > 0 ? (
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

        {meetingCreated && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Meeting Link"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              placeholder="Paste the Google Meet link here"
              required
            />
          </Grid>
        )}

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<VideoCallIcon />}
              onClick={handleCreateMeet}
              color="primary"
              size="large"
              disabled={loading}
              sx={{ flex: 1 }}
            >
              {meetingType === 'instant' ? 'Create Instant Meeting' : 'Schedule Meeting'}
            </Button>

          </Box>
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