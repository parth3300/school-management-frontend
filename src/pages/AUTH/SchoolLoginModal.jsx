import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  IconButton,
  Paper
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LockIcon from '@mui/icons-material/Lock';
import { useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import API_ENDPOINTS from '../../api/endpoints';
import RoleSelectionModal from './RoleSelectionModal';
import { VISITOR_USER_ROLE } from '../../components/common/constants';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const SchoolLoginModal = ({ open, onClose, school, onLoginSuccess }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const passwordInputRef = useRef(null);
    const authState = useSelector((state) => state.auth);
  console.log("authState>>>>>>>>", authState);
  console.log("isAuthenticated:", isAuthenticated);
  

  useEffect(() => {
    if (open && passwordInputRef.current) {
      setTimeout(() => passwordInputRef.current.focus(), 100);
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post(API_ENDPOINTS.school.login, {
        school_id: school.id,
        password
      });

      if (response.status === 200) {
        setShowRoleSelection(true);
        onLoginSuccess?.();
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelected = (role) => {
    localStorage.setItem('role', role);
    localStorage.setItem('school_id', school.id);

    setShowRoleSelection(false);
    onClose();
      // Redirect to dashboard if already authenticated
    if (isAuthenticated) {
      navigate('/dashboard');
    } else  if (role === VISITOR_USER_ROLE) {
      navigate('/visitor-login');
    } else {
      navigate(`/${role}-login`, { state: { schoolId: school.id } });
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="school-login-modal"
        aria-describedby="school-login-form"
      >
        <Paper sx={style}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6" component="h2">
              <LockIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
              {school.name} Login
            </Typography>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Typography variant="body2" color="text.secondary" mb={2}>
            Please enter the school's general password to continue
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              inputRef={passwordInputRef}
              margin="normal"
              required
              fullWidth
              name="password"
              label="School Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Login'}
            </Button>
          </Box>
        </Paper>
      </Modal>

      <RoleSelectionModal
        open={showRoleSelection}
        onClose={() => setShowRoleSelection(false)}
        onRoleSelect={handleRoleSelected}
        school={school}
      />
    </>
  );
};

export default SchoolLoginModal;