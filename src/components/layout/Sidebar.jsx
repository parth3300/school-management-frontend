// Sidebar.jsx
import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import {
  Dashboard as DashboardIcon,
  School as SchoolIcon,
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
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Schools', icon: <SchoolIcon />, path: '/schools' },
    { text: 'Academic Years', icon: <CalendarIcon />, path: '/academic-years' },
    { text: 'Classes', icon: <ClassIcon />, path: '/classes' },
    { text: 'Subjects', icon: <BookIcon />, path: '/subjects' },
    { text: 'Teachers', icon: <PersonIcon />, path: '/teachers' },
    { text: 'Students', icon: <PeopleIcon />, path: '/students' },
    { text: 'Attendance', icon: <AssignmentIcon />, path: '/attendance' },
    { text: 'Exams', icon: <AssessmentIcon />, path: '/exams' },
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
        {menuItems.map((item) => (
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