import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { Box, CssBaseline, Toolbar } from '@mui/material';

const Layout = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Header />
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar /> {/* This pushes content below the app bar */}
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;