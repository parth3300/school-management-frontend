import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SchoolIcon from '@mui/icons-material/School';

const Header = () => {
  return (
    <AppBar
      position="fixed"
      elevation={3}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: '#1565c0',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Left Section */}
        <Box display="flex" alignItems="center">
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 1 }}
          >
            <MenuIcon />
          </IconButton>
          <SchoolIcon sx={{ mr: 1, fontSize: 28 }} />
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ fontWeight: 'bold' }}
          >
            School Management System
          </Typography>
        </Box>

        {/* Right Section (Placeholder for profile or actions) */}
        <Box display="flex" alignItems="center" gap={2}>
          {/* Future: Notification button can go here */}
          <Tooltip title="Profile">
            <Avatar
              alt="User"
              src="" // Add user image here if available
              sx={{
                width: 36,
                height: 36,
                bgcolor: '#fff',
                color: '#1976d2',
                fontWeight: 'bold',
              }}
            >
              S
            </Avatar>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
