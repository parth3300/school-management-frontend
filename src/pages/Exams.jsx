// src/pages/Exams.jsx
import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Box,
  Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import SchoolIcon from '@mui/icons-material/School';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import InfoIcon from '@mui/icons-material/Info';
import EventNoteIcon from '@mui/icons-material/EventNote';

const MotionCard = motion(Card);

const Exams = () => {
  const exams = [
    {
      id: '0734GZWGGAYG',
      name: 'Mock Test',
      description: 'This is test',
      start_date: '2025-05-17',
      end_date: '2025-05-14',
      academic_year: {
        name: '2025-26',
      },
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Box textAlign="center" mb={5}>
        <Typography
          variant="h3"
          fontWeight="bold"
          gutterBottom
          sx={{ color: '#3f51b5' }}
        >
          📘 Exams
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Stay on top of upcoming and scheduled exams.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {exams.map((exam) => (
          <Grid item xs={12} sm={6} md={4} key={exam.id}>
            <MotionCard
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 200 }}
              elevation={4}
              sx={{
                borderRadius: 3,
                p: 2,
                background: '#ffffff',
                minHeight: 220,
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                  <EventNoteIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" fontWeight="bold">
                    {exam.name}
                  </Typography>
                </Box>

                <Chip
                  label={exam.academic_year?.name}
                  icon={<SchoolIcon />}
                  size="small"
                  color="secondary"
                  sx={{ mb: 2 }}
                />

                <Box display="flex" alignItems="center" mb={1}>
                  <CalendarMonthIcon fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {exam.start_date} to {exam.end_date}
                  </Typography>
                </Box>

                <Divider sx={{ my: 1 }} />

                <Box display="flex" alignItems="center">
                  <InfoIcon fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    {exam.description || 'No description'}
                  </Typography>
                </Box>
              </CardContent>
            </MotionCard>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Exams;
