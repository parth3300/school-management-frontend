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
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const drawerWidth = 240;

const Sidebar = () => {
  const role = localStorage.getItem('role'); // 'teacher', 'student', 'user'

  console.log("role", role);
  
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', allowedRoles: ['teacher', 'student', 'user'] },
    { text: 'Academic Years', icon: <CalendarIcon />, path: '/academic-years', allowedRoles: ['user'] },
    { text: 'Classes', icon: <ClassIcon />, path: '/classes', allowedRoles: ['teacher', 'user'] },
    { text: 'Subjects', icon: <BookIcon />, path: '/subjects', allowedRoles: ['teacher', 'user'] },
    { text: 'Teachers', icon: <PersonIcon />, path: '/teachers', allowedRoles: ['user'] },
    { text: 'Students', icon: <PeopleIcon />, path: '/students', allowedRoles: ['teacher', 'user'] },
    { text: 'Attendance', icon: <AssignmentIcon />, path: '/attendance', allowedRoles: ['teacher', 'student'] },
    { text: 'Exams', icon: <AssessmentIcon />, path: '/exams', allowedRoles: ['teacher', 'student'] },
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
          .map((item) => (
            <ListItem
              button
              key={item.text}
              component={Link}
              to={item.path}
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
          ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
