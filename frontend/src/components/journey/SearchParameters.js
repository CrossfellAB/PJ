import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  LinearProgress
} from '@mui/material';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import PublicIcon from '@mui/icons-material/Public';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

const SearchParameters = ({ journeyData }) => {
  // Simulate research progress - in a real app, this would come from the backend
  const researchCategories = [
    { 
      name: 'Epidemiological Data', 
      complete: true, 
      sources: 3,
      details: 'Prevalence rates, disease burden, demographics'
    },
    { 
      name: 'Treatment Guidelines', 
      complete: true, 
      sources: 5,
      details: 'Clinical guidelines, care pathways, updates'
    },
    { 
      name: 'Healthcare System Context', 
      complete: true, 
      sources: 4,
      details: 'Access pathways, reimbursement, delivery structure'
    },
    { 
      name: 'Patient Experience', 
      complete: false, 
      progress: 75,
      sources: 2,
      details: 'Journey challenges, dropout points, outcomes'
    },
    { 
      name: 'Treatment Landscape', 
      complete: false, 
      progress: 40,
      sources: 3,
      details: 'Available treatments, market access, effectiveness'
    }
  ];

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Research Parameters
            </Typography>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell component="th" sx={{ fontWeight: 'bold' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <HealthAndSafetyIcon sx={{ mr: 1, color: 'primary.main' }} />
                      Therapeutic Area
                    </Box>
                  </TableCell>
                  <TableCell>{journeyData.therapeuticArea || 'Not specified'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" sx={{ fontWeight: 'bold' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PublicIcon sx={{ mr: 1, color: 'primary.main' }} />
                      Region
                    </Box>
                  </TableCell>
                  <TableCell>{journeyData.region || 'Not specified'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" sx={{ fontWeight: 'bold' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AssignmentIcon sx={{ mr: 1, color: 'primary.main' }} />
                      Additional Criteria
                    </Box>
                  </TableCell>
                  <TableCell>{journeyData.additionalCriteria || 'None'}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Paper>

          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Research Progress
            </Typography>
            <List dense>
              {researchCategories.map((category, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemIcon>
                      {category.complete ? 
                        <CheckCircleIcon color="success" /> : 
                        <HourglassEmptyIcon color="action" />
                      }
                    </ListItemIcon>
                    <ListItemText 
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2">{category.name}</Typography>
                          <Chip 
                            size="small" 
                            label={`${category.sources} sources`} 
                            color="primary" 
                            variant="outlined"
                          />
                        </Box>
                      }
                      secondary={
                        category.complete ? 
                          category.details : 
                          <>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                              <Box sx={{ width: '100%', mr: 1 }}>
                                <LinearProgress variant="determinate" value={category.progress} />
                              </Box>
                              <Box sx={{ minWidth: 35 }}>
                                <Typography variant="body2" color="text.secondary">{`${category.progress}%`}</Typography>
                              </Box>
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                              {category.details}
                            </Typography>
                          </>
                      }
                    />
                  </ListItem>
                  {index < researchCategories.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <SearchIcon sx={{ mr: 1 }} />
              Research Findings
            </Typography>
            <Typography variant="body2" paragraph>
              Claude AI is gathering and analyzing information about the patient journey for 
              <strong> {journeyData.therapeuticArea}</strong> in <strong>{journeyData.region}</strong>. 
              Here are some preliminary findings:
            </Typography>

            <Typography variant="subtitle2" sx={{ mt: 2, color: 'primary.main' }}>
              Epidemiological Context
            </Typography>
            <Typography variant="body2" paragraph>
              {journeyData.therapeuticArea === 'Type 2 Diabetes' ? 
                `Prevalence of Type 2 Diabetes in ${journeyData.region} is approximately 10.5% of the adult population, with significant regional variations. The economic burden is estimated at $327 billion annually in direct medical costs and reduced productivity.` : 
                journeyData.therapeuticArea === 'Obesity' ? 
                `Obesity affects approximately 26% of adults in ${journeyData.region}, with rates increasing by 1-2% annually over the past decade. Childhood obesity is also rising, currently at 19% of children ages 2-19.` : 
                `Gathering epidemiological data for ${journeyData.therapeuticArea} in ${journeyData.region}...`
              }
            </Typography>

            <Typography variant="subtitle2" sx={{ mt: 2, color: 'primary.main' }}>
              Treatment Guidelines
            </Typography>
            <Typography variant="body2" paragraph>
              {journeyData.therapeuticArea === 'Type 2 Diabetes' ? 
                `Current guidelines in ${journeyData.region} recommend a stepped care approach beginning with lifestyle modifications, followed by metformin as first-line pharmacotherapy. Recent updates emphasize early consideration of GLP-1 receptor agonists and SGLT2 inhibitors for patients with cardiovascular risk factors.` : 
                journeyData.therapeuticArea === 'Obesity' ? 
                `Treatment guidelines in ${journeyData.region} recommend multi-component interventions including diet, physical activity, and behavioral therapy as first-line treatment. Pharmacotherapy is recommended for individuals with BMI ≥30 kg/m² or ≥27 kg/m² with obesity-related complications.` : 
                `Analyzing treatment guidelines for ${journeyData.therapeuticArea} in ${journeyData.region}...`
              }
            </Typography>

            <Typography variant="subtitle2" sx={{ mt: 2, color: 'primary.main' }}>
              Healthcare System Insights
            </Typography>
            <Typography variant="body2" paragraph>
              {journeyData.region === 'United Kingdom' ? 
                `The NHS in the UK provides structured care pathways for chronic conditions through primary care networks, with specialist services arranged in tiers of increasing specialization. Referral waiting times and regional variability in service provision remain significant challenges.` : 
                journeyData.region === 'United States' ? 
                `The US healthcare system features a complex mix of private insurance, Medicare, and Medicaid coverage. Access to specialists often requires referrals from primary care providers, with significant barriers related to insurance coverage, provider networks, and out-of-pocket costs.` : 
                `Examining healthcare system structure in ${journeyData.region}...`
              }
            </Typography>

            <Box sx={{ mt: 2, p: 1, bgcolor: 'action.hover', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Note: Full research findings and sources will be available in the final journey visualization.
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SearchParameters;