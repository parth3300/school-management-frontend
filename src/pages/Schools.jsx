// src/pages/Schools.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSchools } from '../redux/slices/schoolSlice';
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Container,
  Box,
  Paper,
  InputAdornment,
  CircularProgress,
  Alert,
  TextField
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SchoolIcon from '@mui/icons-material/School';
import RoleSelectionModal from './RoleSelectionModal';
import SchoolLoginModal from './SchoolLoginModal';

const Schools = () => {
  const dispatch = useDispatch();
  const {  loading, error } = useSelector((state) => state.school);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const schools = useSelector((state) => state.school.data) || [];

  useEffect(() => {
    dispatch(fetchSchools());
  }, [dispatch]);

  const filteredSchools = schools.filter((school) =>
    school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSchoolClick = (school) => {
    setSelectedSchool(school);
    setLoginModalOpen(true);
  };

  const handleLoginSuccess = () => {
    setLoginModalOpen(false);
    setRoleModalOpen(true);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Alert severity="error">Error loading schools: {error}</Alert>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* School Login Modal */}
      {selectedSchool && (
        <SchoolLoginModal
          open={loginModalOpen}
          onClose={() => setLoginModalOpen(false)}
          school={selectedSchool}
          onSuccess={handleLoginSuccess}
        />
      )}

      {/* Role Selection Modal */}
      {selectedSchool && (
        <RoleSelectionModal
          open={roleModalOpen}
          onClose={() => setRoleModalOpen(false)}
          schoolId={selectedSchool.id}
        />
      )}

      <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            <SchoolIcon fontSize="large" sx={{ mr: 1, verticalAlign: 'middle' }} />
            Select Your School
          </Typography>
          
          <TextField
            variant="outlined"
            placeholder="Search schools..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: 300 }}
          />
        </Box>

        {filteredSchools.length === 0 ? (
          <Box textAlign="center" py={6}>
            <Typography variant="h6" color="textSecondary">
              No schools found matching your search
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {filteredSchools.map((school) => (
              <Grid item xs={12} sm={6} md={4} key={school.id}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 8,
                      cursor: 'pointer'
                    }
                  }}
                  onClick={() => handleSchoolClick(school)}
                >
                  {school.logo ? (
                    <CardMedia
                      component="img"
                      height="160"
                      image={school.logo}
                      alt={school.name}
                      sx={{ objectFit: 'contain', p: 2 }}
                    />
                  ) : (
                    <Box
                      height={160}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      bgcolor="grey.100"
                    >
                      <SchoolIcon fontSize="large" color="action" />
                    </Box>
                  )}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="div">
                      {school.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {school.address}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {school.website}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                      Established: {new Date(school.established_date).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Container>
  );
};

export default Schools;