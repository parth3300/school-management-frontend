import React, { useState, useMemo } from 'react';
import {
  AppBar, Toolbar, Typography, IconButton, Box, Avatar, Tooltip,
  Menu, MenuItem, ListItemIcon, Divider, useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Menu as MenuIcon,
  School as SchoolIcon,
  Logout,
  Settings,
  AccountCircle,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const Header = ({ onMenuToggle = () => {} }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleLogout = () => {
    dispatch(logout())
    navigate('/');
    handleClose();
  };

  const menuItems = useMemo(() => [
    { label: 'Profile', icon: <AccountCircle fontSize="small" />, action: handleClose },
    { label: 'Settings', icon: <Settings fontSize="small" />, action: handleClose },
  ], []);

  return (
    <AppBar
      position="fixed"
      elevation={4}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        background: 'linear-gradient(to right, #1976d2, #42a5f5)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      }}
      role="banner"
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Left Side: Logo & Title */}
        <Box display="flex" alignItems="center">
          <IconButton
            edge="start"
            aria-label="Open navigation menu"
            onClick={onMenuToggle}
            sx={{ mr: 1 }}
            size="large"
          >
            <MenuIcon sx={{ color: '#fff' }} />
          </IconButton>

          {!isMobile && (
            <>
              <SchoolIcon sx={{ color: 'white', mr: 1 }} />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(to right, #ffffff, #d1ecf1)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                School Management System
              </Typography>
            </>
          )}
        </Box>

        {/* Right Side: Avatar with Menu */}
        <Box display="flex" alignItems="center" gap={2}>
          <Tooltip title="Account Settings">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <IconButton
                onClick={handleClick}
                size="small"
                sx={{
                  p: 0,
                  borderRadius: '50%',
                  border: '2px solid white',
                }}
                aria-label="User avatar"
                aria-controls={open ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
              >
                <Avatar
                  alt="User"
                  sx={{
                    width: 38,
                    height: 38,
                    bgcolor: 'white',
                    color: '#1976d2',
                    fontWeight: 700,
                  }}
                >
                  S
                </Avatar>
              </IconButton>
            </motion.div>
          </Tooltip>
        </Box>
      </Toolbar>

      {/* Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            borderRadius: 2,
            minWidth: 180,
            overflow: 'visible',
            filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.2))',
            '& .MuiAvatar-root': {
              width: 30,
              height: 30,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {menuItems.map((item, i) => (
          <MenuItem key={i} onClick={item.action}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            {item.label}
          </MenuItem>
        ))}
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </AppBar>
  );
};

export default Header;
