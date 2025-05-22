import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  Paper, 
  Grid, 
  Stepper, 
  Step, 
  StepLabel, 
  StepContent,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tooltip,
  IconButton
} from '@mui/material';
import TimelineIcon from '@mui/icons-material/Timeline';
import BarrierIcon from '@mui/icons-material/Block';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import PeopleIcon from '@mui/icons-material/People';
import InfoIcon from '@mui/icons-material/Info';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import SaveIcon from '@mui/icons-material/Save';
import SettingsIcon from '@mui/icons-material/Settings';
import MoodIcon from '@mui/icons-material/Mood';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FlagIcon from '@mui/icons-material/Flag';

const JourneyVisualization = ({ journeyData }) => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  // Helper function to determine color based on severity/impact
  const getSeverityColor = (level) => {
    switch (level) {
      case 'High':
        return 'error';
      case 'Medium':
        return 'warning';
      case 'Low':
        return 'success';
      default:
        return 'primary';
    }
  };

  // Helper function to get emotion icon
  const getEmotionIcon = (emotion) => {
    switch (emotion) {
      case 'Anxious':
      case 'Concerned':
        return <SentimentDissatisfiedIcon color="warning" />;
      case 'Hopeful':
      case 'Determined':
        return <MoodIcon color="success" />;
      default:
        return <MoodIcon color="action" />;
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 500 }}>
          {journeyData.therapeuticArea} Patient Journey - {journeyData.region}
        </Typography>
        <Box>
          <Tooltip title="Download">
            <IconButton>
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Share">
            <IconButton>
              <ShareIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Save">
            <IconButton>
              <SaveIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Settings">
            <IconButton>
              <SettingsIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={tabIndex} 
          onChange={handleTabChange} 
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab icon={<TimelineIcon />} label="Journey Timeline" />
          <Tab icon={<BarrierIcon />} label="Barriers" />
          <Tab icon={<MedicalServicesIcon />} label="Interventions" />
          <Tab icon={<PeopleIcon />} label="Stakeholders" />
        </Tabs>
      </Paper>

      {/* Journey Timeline View */}
      {tabIndex === 0 && (
        <Box sx={{ mb: 3 }}>
          <Stepper orientation="vertical">
            {journeyData.stages.map((stage, index) => (
              <Step key={index} active={true}>
                <StepLabel 
                  StepIconProps={{
                    icon: <Typography variant="body2">{stage.order}</Typography>
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h6">{stage.name}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getEmotionIcon(stage.emotionalState)}
                      <Chip 
                        label={`${stage.dropoutRate}% Dropout`} 
                        color={stage.dropoutRate > 20 ? "error" : stage.dropoutRate > 10 ? "warning" : "success"}
                        size="small"
                      />
                    </Box>
                  </Box>
                </StepLabel>
                <StepContent>
                  <Typography variant="body2" paragraph>
                    {stage.description}
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" sx={{ color: 'primary.main', mb: 1 }}>
                        Key Activities
                      </Typography>
                      <List dense sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
                        {stage.activities.map((activity, actIdx) => (
                          <ListItem key={actIdx}>
                            <ListItemIcon sx={{ minWidth: 30 }}>
                              <FlagIcon fontSize="small" color="primary" />
                            </ListItemIcon>
                            <ListItemText primary={activity} />
                          </ListItem>
                        ))}
                      </List>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" sx={{ color: 'primary.main', mb: 1 }}>
                        Related Barriers
                      </Typography>
                      {journeyData.barriers
                        .filter(barrier => barrier.name.includes(stage.name) || Math.random() > 0.5) // Just for demo
                        .slice(0, 2)
                        .map((barrier, bidx) => (
                          <Chip 
                            key={bidx}
                            label={barrier.name} 
                            color={getSeverityColor(barrier.severity)}
                            variant="outlined"
                            size="small"
                            icon={<ErrorIcon />}
                            sx={{ mr: 1, mb: 1 }}
                          />
                        ))
                      }
                    </Grid>
                  </Grid>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </Box>
      )}

      {/* Barriers View */}
      {tabIndex === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, bgcolor: '#fde9e8', height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Strategic Barriers
              </Typography>
              {journeyData.barriers
                .filter(barrier => barrier.category === 'strategic')
                .map((barrier, index) => (
                  <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="subtitle2">{barrier.name}</Typography>
                        <Chip 
                          size="small" 
                          label={barrier.severity} 
                          color={getSeverityColor(barrier.severity)} 
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {barrier.description}
                      </Typography>
                      {barrier.isDropoutPoint && (
                        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                          <ErrorIcon color="error" fontSize="small" sx={{ mr: 0.5 }} />
                          <Typography variant="caption" color="error.main">
                            Significant dropout point
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                ))}
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, bgcolor: '#fff4e5', height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Operational Barriers
              </Typography>
              {journeyData.barriers
                .filter(barrier => barrier.category === 'operational')
                .map((barrier, index) => (
                  <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="subtitle2">{barrier.name}</Typography>
                        <Chip 
                          size="small" 
                          label={barrier.severity} 
                          color={getSeverityColor(barrier.severity)} 
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {barrier.description}
                      </Typography>
                      {barrier.isDropoutPoint && (
                        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                          <ErrorIcon color="error" fontSize="small" sx={{ mr: 0.5 }} />
                          <Typography variant="caption" color="error.main">
                            Significant dropout point
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                ))}
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, bgcolor: '#e8eaf6', height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Standards Barriers
              </Typography>
              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle2">Outdated Guidelines</Typography>
                    <Chip size="small" label="Medium" color="warning" />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Clinical guidelines not updated to reflect latest evidence and treatment options
                  </Typography>
                </CardContent>
              </Card>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
                No additional standards barriers identified
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Interventions View */}
      {tabIndex === 2 && (
        <Grid container spacing={3}>
          {journeyData.interventions.map((intervention, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Paper elevation={3} sx={{ p: 0, overflow: 'hidden' }}>
                <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 2 }}>
                  <Typography variant="h6">{intervention.name}</Typography>
                  <Typography variant="caption">
                    Implementation Complexity: {intervention.implementationComplexity}
                  </Typography>
                </Box>
                <Box sx={{ p: 2 }}>
                  <Typography variant="body2" paragraph>
                    {intervention.description}
                  </Typography>
                  
                  <Typography variant="subtitle2" color="primary.main">
                    Impact Areas
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    {intervention.impactAreas.map((area, areaIndex) => (
                      <Chip 
                        key={areaIndex}
                        label={area}
                        size="small"
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))}
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle2" color="primary.main" gutterBottom>
                    Projected Impact
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Card variant="outlined">
                        <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                          <Typography variant="caption" color="text.secondary">
                            Dropout Reduction
                          </Typography>
                          <Typography variant="h6" color="success.main">
                            {intervention.impactMetrics.dropoutReduction}%
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={6}>
                      <Card variant="outlined">
                        <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                          <Typography variant="caption" color="text.secondary">
                            Cost Savings
                          </Typography>
                          <Typography variant="h6" color="success.main">
                            {intervention.impactMetrics.costSavings}%
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={6}>
                      <Card variant="outlined">
                        <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                          <Typography variant="caption" color="text.secondary">
                            Time Reduction
                          </Typography>
                          <Typography variant="h6" color="success.main">
                            {intervention.impactMetrics.timeReduction}%
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={6}>
                      <Card variant="outlined">
                        <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                          <Typography variant="caption" color="text.secondary">
                            Patient Satisfaction
                          </Typography>
                          <Typography variant="h6" color="success.main">
                            +{intervention.impactMetrics.patientSatisfactionImprovement}%
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Stakeholders View */}
      {tabIndex === 3 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Stakeholder Mapping
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            This view shows the involvement of different stakeholders across the patient journey stages.
          </Typography>
          
          <Box sx={{ overflowX: 'auto' }}>
            <Box sx={{ minWidth: 700, mt: 2 }}>
              <Grid container>
                <Grid item xs={3}>
                  <Typography variant="subtitle2" sx={{ p: 1, fontWeight: 'bold' }}>
                    Stakeholder
                  </Typography>
                </Grid>
                {journeyData.stages.map((stage, index) => (
                  <Grid item xs={true} key={index}>
                    <Typography variant="subtitle2" sx={{ p: 1, textAlign: 'center', fontWeight: 'bold' }}>
                      {stage.name}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
              
              <Divider />
              
              {/* Static stakeholder examples */}
              {[
                { name: 'Primary Care Physician', type: 'Healthcare Provider' },
                { name: 'Specialist', type: 'Healthcare Provider' },
                { name: 'Patient', type: 'Patient' },
                { name: 'Family/Caregiver', type: 'Support' },
                { name: 'Insurance Provider', type: 'Payer' },
                { name: 'Pharmacist', type: 'Healthcare Provider' }
              ].map((stakeholder, sIndex) => (
                <React.Fragment key={sIndex}>
                  <Grid container sx={{ '&:nth-of-type(odd)': { bgcolor: 'action.hover' } }}>
                    <Grid item xs={3}>
                      <Box sx={{ p: 1 }}>
                        <Typography variant="body2">{stakeholder.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {stakeholder.type}
                        </Typography>
                      </Box>
                    </Grid>
                    {journeyData.stages.map((stage, stageIndex) => (
                      <Grid item xs={true} key={stageIndex}>
                        <Box 
                          sx={{ 
                            p: 1, 
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center',
                            height: '100%'
                          }}
                        >
                          {/* Random involvement level for demo purposes */}
                          {['High', 'Medium', 'Low', 'None'][Math.floor(Math.random() * 4)] !== 'None' && (
                            <Chip 
                              label={['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)]}
                              size="small"
                              color={
                                Math.random() > 0.66 ? 'success' : 
                                Math.random() > 0.33 ? 'warning' : 
                                'error'
                              }
                              variant="outlined"
                            />
                          )}
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                  {sIndex < 5 && <Divider />}
                </React.Fragment>
              ))}
            </Box>
          </Box>
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Legend
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Chip label="High" size="small" color="success" variant="outlined" sx={{ mr: 0.5 }} />
                <Typography variant="caption">Primary role</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Chip label="Medium" size="small" color="warning" variant="outlined" sx={{ mr: 0.5 }} />
                <Typography variant="caption">Supporting role</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Chip label="Low" size="small" color="error" variant="outlined" sx={{ mr: 0.5 }} />
                <Typography variant="caption">Minor involvement</Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default JourneyVisualization;