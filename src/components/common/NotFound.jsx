import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as Sentry from '@sentry/react';
import { Helmet } from 'react-helmet';
import {
  Box,
  Button,
  Container,
  Typography,
  TextField,
  InputAdornment,
  Chip,
  Divider,
  useTheme,
  useMediaQuery,
  Paper,
  IconButton,
  Tooltip,
  Fade
} from '@mui/material';
import {
  ArrowBack,
  Home,
  Search,
  SentimentVeryDissatisfied,
  SentimentSatisfied,
  HelpOutline,
  ContactSupport,
  Info,
  RocketLaunch,
  Refresh
} from '@mui/icons-material';

const NotFound = ({
  message = "Oops! The page you're looking for has vanished.",
  showSearch = true,
  redirectPath = "/",
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    Sentry.captureMessage(`404 Not Found: ${location.pathname}`);
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const easterEggMessages = [
    "Maybe the page went on vacation 🏖️",
    "Perhaps it's hiding behind the couch 🛋️",
    "Could be lost in the digital wilderness 🌲",
    "Might have joined the circus 🎪",
    "Probably playing hide and seek 🙈"
  ];

  const randomMessage = easterEggMessages[Math.floor(Math.random() * easterEggMessages.length)];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, #121212 0%, #1a1a2e 100%)'
          : 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
        p: 3
      }}
    >
      <Helmet>
        <title>404 - Page Not Found</title>
        <meta name="description" content="The page you're looking for doesn't exist or has been moved." />
      </Helmet>

      <Container maxWidth="md">
        <Paper
          elevation={isMobile ? 0 : 6}
          sx={{
            p: 4,
            borderRadius: 4,
            background: theme.palette.mode === 'dark'
              ? 'rgba(30, 30, 46, 0.8)'
              : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(8px)',
            border: theme.palette.mode === 'dark'
              ? '1px solid rgba(255, 255, 255, 0.1)'
              : '1px solid rgba(0, 0, 0, 0.1)'
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Animated Illustration */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <motion.div
                animate={{ 
                  rotate: [0, -5, 5, -5, 0],
                  y: [0, -10, 10, -10, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                style={{ position: 'relative', display: 'inline-block' }}
              >
                <Box
                  component="img"
                  src="/404.jpg"
                  alt="Page Not Found"
                  sx={{ 
                    width: isMobile ? 180 : 220,
                    height: 'auto',
                    filter: theme.palette.mode === 'dark' ? 'brightness(0.9)' : 'none'
                  }}
                />
                <Fade in={isHovering}>
                  <Chip
                    label="I'm lost!"
                    size="small"
                    color="warning"
                    sx={{ 
                      position: 'absolute',
                      top: -12,
                      right: -12,
                      transform: 'rotate(10deg)'
                    }}
                  />
                </Fade>
              </motion.div>
            </Box>

            {/* Error Code */}
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: '5rem',
                    fontWeight: 900,
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(45deg, #64b5f6 30%, #ba68c8 90%)'
                      : 'linear-gradient(45deg, #1976d2 30%, #9c27b0 90%)',
                    backgroundClip: 'text',
                    textFillColor: 'transparent',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1
                  }}
                >
                  404
                </Typography>
              </motion.div>
              <Typography 
                variant="h5"
                sx={{ 
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  mb: 1
                }}
              >
                {message}
              </Typography>
              <Typography 
                variant="body2"
                sx={{ 
                  color: theme.palette.text.secondary,
                  mb: 3
                }}
              >
                The page <code style={{ 
                  backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#eee',
                  padding: '2px 6px',
                  borderRadius: 4,
                  fontFamily: 'monospace'
                }}>{location.pathname}</code> does not exist.
              </Typography>
            </Box>

            {/* Search Form */}
            {showSearch && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Box 
                  component="form"
                  onSubmit={handleSearch}
                  sx={{ mb: 3 }}
                >
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search our site..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <Button 
                            type="submit"
                            variant="text"
                            color="primary"
                            size="small"
                          >
                            Search
                          </Button>
                        </InputAdornment>
                      ),
                      sx: {
                        borderRadius: 50,
                        backgroundColor: theme.palette.background.paper
                      }
                    }}
                  />
                </Box>
              </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center',
                gap: 2,
                flexWrap: 'wrap',
                mb: 3
              }}>
                <Button
                  onClick={() => navigate(-1)}
                  variant="outlined"
                  size="large"
                  startIcon={<ArrowBack />}
                  sx={{
                    borderRadius: 50,
                    px: 4,
                    textTransform: 'none'
                  }}
                >
                  Go Back
                </Button>
                <Button
                  onClick={() => navigate(redirectPath)}
                  variant="contained"
                  size="large"
                  startIcon={<Home />}
                  sx={{
                    borderRadius: 50,
                    px: 4,
                    textTransform: 'none',
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(45deg, #64b5f6 30%, #ba68c8 90%)'
                      : 'linear-gradient(45deg, #1976d2 30%, #9c27b0 90%)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: theme.shadows[4]
                    }
                  }}
                >
                  Return Home
                </Button>
              </Box>
            </motion.div>

            {/* Helpful Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <Divider sx={{ my: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Quick Links
                </Typography>
              </Divider>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center',
                gap: 2,
                flexWrap: 'wrap'
              }}>
                <Tooltip title="About Us">
                  <IconButton 
                    onClick={() => navigate('/about')}
                    color="primary"
                    size="large"
                  >
                    <Info />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Contact">
                  <IconButton 
                    onClick={() => navigate('/contact')}
                    color="primary"
                    size="large"
                  >
                    <ContactSupport />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Help Center">
                  <IconButton 
                    onClick={() => navigate('/help')}
                    color="primary"
                    size="large"
                  >
                    <HelpOutline />
                  </IconButton>
                </Tooltip>
              </Box>
            </motion.div>

            {/* Easter Egg */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              whileHover={{ scale: 1.05 }}
              style={{ cursor: 'pointer', marginTop: 16 }}
              onClick={() => setShowEasterEgg(!showEasterEgg)}
            >
              <Typography 
                variant="caption"
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: theme.palette.text.secondary,
                  fontStyle: 'italic'
                }}
              >
                {showEasterEgg ? (
                  <>
                    <SentimentSatisfied sx={{ mr: 0.5, fontSize: 16 }} />
                    {randomMessage}
                  </>
                ) : (
                  <>
                    <SentimentVeryDissatisfied sx={{ mr: 0.5, fontSize: 16 }} />
                    Feeling lost? Click me!
                  </>
                )}
              </Typography>
            </motion.div>
          </motion.div>
        </Paper>
      </Container>
    </Box>
  );
};

export default NotFound;