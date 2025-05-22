import React from 'react';
import { Box, Typography, Button, Container, Grid, Paper, Card, CardContent, CardMedia } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CreateIcon from '@mui/icons-material/Create';
import TimelineIcon from '@mui/icons-material/Timeline';
import BarChartIcon from '@mui/icons-material/BarChart';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      <Box 
        sx={{ 
          py: 8, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          textAlign: 'center' 
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          PRISM-X Patient Journey Generator
        </Typography>
        <Typography variant="h5" component="h2" color="text.secondary" sx={{ mb: 4, maxWidth: '800px' }}>
          Create interactive patient journeys powered by Claude AI for any therapeutic area and region
        </Typography>
        <Button 
          variant="contained" 
          size="large" 
          startIcon={<CreateIcon />}
          onClick={() => navigate('/generator')}
          sx={{ py: 1.5, px: 4, borderRadius: 2, fontSize: '1.1rem' }}
        >
          Create New Patient Journey
        </Button>
      </Box>

      <Box sx={{ my: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600, textAlign: 'center', mb: 4 }}>
          How It Works
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ height: '100%', p: 3, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                <TimelineIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  1. Specify Parameters
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
                  Enter your therapeutic area, region, and any additional criteria through our conversational interface.
                </Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ height: '100%', p: 3, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                <BarChartIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  2. AI-Powered Research
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
                  Claude AI conducts comprehensive research across multiple data sources to gather relevant information.
                </Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ height: '100%', p: 3, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                <IntegrationInstructionsIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  3. Interactive Visualization
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
                  View your patient journey as an interactive visualization with barriers, interventions, and stakeholder mapping.
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ my: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600, textAlign: 'center', mb: 4 }}>
          Featured Patient Journeys
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2 }}>
              <CardMedia
                component="img"
                height="140"
                image="https://via.placeholder.com/800x400?text=Obesity+UK+Patient+Journey"
                alt="Obesity UK Patient Journey"
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="div">
                  Obesity - United Kingdom
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Comprehensive patient journey mapping for obesity treatment pathways in the UK NHS system,
                  including tier-based intervention model and stakeholder analysis.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2 }}>
              <CardMedia
                component="img"
                height="140"
                image="https://via.placeholder.com/800x400?text=Type+2+Diabetes+US+Patient+Journey"
                alt="Type 2 Diabetes US Patient Journey"
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="div">
                  Type 2 Diabetes - United States
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Interactive journey visualization for Type 2 Diabetes care in the US healthcare system,
                  highlighting insurance coverage barriers and specialist referral pathways.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default HomePage;