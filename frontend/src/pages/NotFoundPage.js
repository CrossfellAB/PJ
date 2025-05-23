import React from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 2,
            maxWidth: '600px',
            width: '100%',
          }}
        >
          <ErrorOutlineIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
          <Typography variant="h3" component="h1" gutterBottom>
            404
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            Page Not Found
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
            The page you are looking for does not exist or has been moved.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/')}
            sx={{ borderRadius: 2 }}
          >
            Return to Home
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default NotFoundPage;