// src/components/RoleSelectionModal.jsx
import React from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Paper,
  IconButton
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CloseIcon from '@mui/icons-material/Close';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  maxWidth: '95%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const RoleSelectionModal = ({ open, onClose, onRoleSelect, school }) => {
  const roles = [
    {
      id: 'student',
      title: 'Student',
      description: 'Access your grades, attendance, and school resources',
      icon: <PersonIcon fontSize="large" />,
      color: 'primary'
    },
    {
      id: 'teacher',
      title: 'Teacher',
      description: 'Manage classes, grades, and student information',
      icon: <SchoolIcon fontSize="large" />,
      color: 'secondary'
    },
    {
      id: 'admin',
      title: 'Administrator',
      description: 'Manage school settings, users, and system configuration',
      icon: <AdminPanelSettingsIcon fontSize="large" />,
      color: 'error'
    },
    {
      id: 'visitor',
      title: 'Visitor',
      description: 'Explore public information about the school',
      icon: <PersonIcon fontSize="large" />,
      color: 'success'
    }
  ];

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="role-selection-modal"
      aria-describedby="select-your-role"
    >
      <Paper sx={style}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" component="h2">
            Welcome to {school?.name || 'Our School'}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <Typography variant="body1" color="text.secondary" mb={4}>
          Please select your role to continue
        </Typography>

        <Grid container spacing={3}>
          {roles.map((role) => (
            <Grid item xs={12} sm={6} md={4} key={role.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Avatar sx={{ 
                    width: 60, 
                    height: 60, 
                    mb: 2, 
                    mx: 'auto', 
                    bgcolor: `${role.color}.main`,
                    color: `${role.color}.contrastText`
                  }}>
                    {role.icon}
                  </Avatar>
                  <Typography gutterBottom variant="h6" component="div">
                    {role.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {role.description}
                  </Typography>
                </CardContent>
                <Box sx={{ p: 2 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    color={role.color}
                    onClick={() => onRoleSelect(role.id)}
                  >
                    Continue as {role.title}
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Modal>
  );
};

export default RoleSelectionModal;