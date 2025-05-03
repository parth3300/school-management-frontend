// Footer.jsx
import React from 'react';
import { Box, Typography, Container, Grid, Link, Stack } from '@mui/material';
import { Facebook, Twitter, Instagram } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#1976d2',
        color: 'white',
        py: 6,
        marginTop: 'auto',
        width: '100%',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              School Management System
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
              A platform to simplify academic management and enhance learning.
            </Typography>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Quick Links
            </Typography>
            <Stack spacing={1}>
              <Link href="/" color="inherit" underline="hover">Home</Link>
              <Link href="/about" color="inherit" underline="hover">About</Link>
              <Link href="/contact" color="inherit" underline="hover">Contact</Link>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Connect with Us
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
              <Link href="#" color="inherit">
                <Facebook sx={{ fontSize: 28, '&:hover': { color: '#3b5998' } }} />
              </Link>
              <Link href="#" color="inherit">
                <Twitter sx={{ fontSize: 28, '&:hover': { color: '#00acee' } }} />
              </Link>
              <Link href="#" color="inherit">
                <Instagram sx={{ fontSize: 28, '&:hover': { color: '#C13584' } }} />
              </Link>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body2">
            © {new Date().getFullYear()} School Management System. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;