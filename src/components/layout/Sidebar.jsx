// Sidebar.jsx
import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
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

const drawerWidth = 240;

const Sidebar = () => {
  // Get the role from localStorage or default to 'visitor'
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
    // Visitor-only links
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

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          height: '100vh',
          position: 'relative',
        },
      }}
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
                  '&.Mui-selected': {
                    backgroundColor: '#e3f2fd',
                  },
                  '&.Mui-selected:hover': {
                    backgroundColor: '#bbdefb',
                  },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            );
          })}
      </List>
    </Drawer>
  );
};

export default Sidebar;
