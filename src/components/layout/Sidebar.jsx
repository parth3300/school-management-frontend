import React, { useState } from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Toolbar,
  styled,
  Box,
  useTheme
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  CalendarToday as CalendarIcon,
  Class as ClassIcon,
  Book as BookIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  Assessment as AssessmentIcon,
  Login as LoginIcon,
  AppRegistration as SignupIcon
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';

const collapsedWidth = 64;
const expandedWidth = 240;

const StyledDrawer = styled(Drawer)(({ theme, open }) => ({
  width: open ? expandedWidth : collapsedWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  '& .MuiDrawer-paper': {
    width: open ? expandedWidth : collapsedWidth,
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    borderRight: 'none',
    boxShadow: theme.shadows[1],
    backgroundColor: theme.palette.background.paper,
    height: '100vh',
    position: 'relative',
  },
}));

const Sidebar = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const role = localStorage.getItem('role') || 'visitor';
  const location = useLocation();

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard',
      allowedRoles: ['visitor', 'student', 'teacher', 'user'],
    },
    {
      text: 'Academic Years',
      icon: <CalendarIcon />,
      path: '/academic-years',
      allowedRoles: ['user'],
    },
    {
      text: 'Classes',
      icon: <ClassIcon />,
      path: '/classes',
      allowedRoles: ['teacher', 'user'],
    },
    {
      text: 'Subjects',
      icon: <BookIcon />,
      path: '/subjects',
      allowedRoles: ['teacher', 'user'],
    },
    {
      text: 'Teachers',
      icon: <PersonIcon />,
      path: '/teachers',
      allowedRoles: ['user'],
    },
    {
      text: 'Students',
      icon: <PeopleIcon />,
      path: '/students',
      allowedRoles: ['teacher', 'user'],
    },
    {
      text: 'Attendance',
      icon: <AssignmentIcon />,
      path: '/attendance',
      allowedRoles: ['teacher', 'student'],
    },
    {
      text: 'Exams',
      icon: <AssessmentIcon />,
      path: '/exams',
      allowedRoles: ['teacher', 'student'],
    },
    {
      text: 'Login',
      icon: <LoginIcon />,
      path: '/login',
      allowedRoles: ['visitor'],
    },
    {
      text: 'Signup',
      icon: <SignupIcon />,
      path: '/signup',
      allowedRoles: ['visitor'],
    },
  ];

  const handleMouseEnter = () => {
    setOpen(true);
  };

  const handleMouseLeave = () => {
    setOpen(false);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: open ? expandedWidth : collapsedWidth,
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <StyledDrawer 
        variant="permanent" 
        open={open}
      >
        <Toolbar />
        <List>
          {menuItems
            .filter((item) => item.allowedRoles.includes(role))
            .map((item) => {
              const selected = location.pathname === item.path;

              return (
                <ListItem
                  button
                  key={item.text}
                  component={Link}
                  to={item.path}
                  selected={selected}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    '&.Mui-selected': {
                      backgroundColor: theme.palette.action.selected,
                      borderRight: `3px solid ${theme.palette.primary.main}`,
                    },
                    '&.Mui-selected:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                      color: selected ? theme.palette.primary.main : 'inherit',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    sx={{ 
                      opacity: open ? 1 : 0,
                      transition: 'opacity 0.2s ease',
                    }} 
                  />
                </ListItem>
              );
            })}
        </List>
      </StyledDrawer>
    </Box>
  );
};

export default Sidebar;