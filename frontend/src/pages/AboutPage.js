import React from 'react';
import { Container, Typography, Box, Paper, Grid, Divider } from '@mui/material';

const AboutPage = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          About PRISM-X Patient Journey Generator
        </Typography>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="body1" paragraph>
            The PRISM-X Patient Journey Generator is an advanced tool designed to create interactive 
            patient journey visualizations for healthcare professionals, researchers, and pharmaceutical 
            companies. By leveraging the power of Claude AI, our platform provides data-driven insights 
            into patient experiences across different therapeutic areas and healthcare systems worldwide.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h5" gutterBottom>
            Core Capabilities
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="h6" gutterBottom>
                  AI-Powered Research
                </Typography>
                <Typography variant="body2" paragraph>
                  Claude AI conducts comprehensive research across multiple authoritative sources to 
                  gather current information on treatment guidelines, healthcare systems, patient experiences, 
                  and market access conditions.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="h6" gutterBottom>
                  Interactive Visualizations
                </Typography>
                <Typography variant="body2" paragraph>
                  Transform complex patient journey data into intuitive, interactive visualizations 
                  that highlight key touchpoints, barriers, and intervention opportunities throughout 
                  the care pathway.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="h6" gutterBottom>
                  Barrier Analysis
                </Typography>
                <Typography variant="body2" paragraph>
                  Identify and categorize barriers to optimal care using the S.O.S framework 
                  (Strategic, Operational, Standards), enabling targeted improvement strategies.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="h6" gutterBottom>
                  Scenario Modeling
                </Typography>
                <Typography variant="body2" paragraph>
                  Model the potential impact of various interventions on patient outcomes, 
                  dropout rates, and healthcare resource utilization through data-driven 
                  scenario analysis.
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h5" gutterBottom>
            Use Cases
          </Typography>
          <Typography variant="body1" paragraph>
            <ul>
              <li>
                <strong>Healthcare Providers:</strong> Identify opportunities to improve care coordination, 
                reduce dropout rates, and enhance patient experiences.
              </li>
              <li>
                <strong>Pharmaceutical Companies:</strong> Understand market access challenges, patient 
                needs, and healthcare system structures to optimize product development and launch strategies.
              </li>
              <li>
                <strong>Health Systems:</strong> Analyze resource allocation, identify bottlenecks, and 
                develop targeted interventions to improve system efficiency and patient outcomes.
              </li>
              <li>
                <strong>Researchers:</strong> Generate visual representations of care pathways for 
                publications, presentations, and educational materials.
              </li>
            </ul>
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h5" gutterBottom>
            Technology Stack
          </Typography>
          <Typography variant="body1" paragraph>
            The PRISM-X Patient Journey Generator is built using modern web technologies:
          </Typography>
          <Box sx={{ pl: 3 }}>
            <Typography variant="body2">
              • <strong>Frontend:</strong> React with Material UI for responsive design
            </Typography>
            <Typography variant="body2">
              • <strong>Backend:</strong> Node.js/Express API server
            </Typography>
            <Typography variant="body2">
              • <strong>Database:</strong> MongoDB for structured data storage
            </Typography>
            <Typography variant="body2">
              • <strong>AI Integration:</strong> Anthropic Claude API for intelligent research and analysis
            </Typography>
            <Typography variant="body2">
              • <strong>Search:</strong> Web search integration for comprehensive data gathering
            </Typography>
          </Box>

          <Box sx={{ mt: 4, fontStyle: 'italic', color: 'text.secondary' }}>
            <Typography variant="body2">
              PRISM-X Patient Journey Generator is currently in beta. For questions or support, 
              please contact support@prism-x.com
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default AboutPage;