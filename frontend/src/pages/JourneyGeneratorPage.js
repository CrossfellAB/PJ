import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Stepper, 
  Step, 
  StepLabel,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import ChatInterface from '../components/chat/ChatInterface';
import { useChat } from '../contexts/ChatContext';
import InputForm from '../components/journey/InputForm';
import SearchParameters from '../components/journey/SearchParameters';
import JourneyVisualization from '../components/journey/JourneyVisualization';

const steps = [
  'Specify Parameters',
  'Review Research',
  'Visualize Journey'
];

const JourneyGeneratorPage = () => {
  const { currentStep: chatStep, journeyData, resetChat } = useChat();
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [journeyResult, setJourneyResult] = useState(null);

  // Update step based on chat progress
  useEffect(() => {
    if (chatStep === 3 && activeStep === 0) {
      setActiveStep(1);
    }
  }, [chatStep, activeStep]);

  const handleNext = () => {
    if (activeStep === 1) {
      // Simulate generating journey visualization
      setIsLoading(true);
      setError(null);
      
      // In a real implementation, this would call the backend API
      setTimeout(() => {
        setIsLoading(false);
        setJourneyResult({
          therapeuticArea: journeyData.therapeuticArea,
          region: journeyData.region,
          stages: [
            {
              name: "Initial Assessment",
              description: "Patient presents to primary care with symptoms",
              order: 1,
              dropoutRate: 15,
              emotionalState: "Concerned",
              activities: ["Medical history review", "Physical examination", "Initial diagnosis discussion"],
            },
            {
              name: "Specialist Referral",
              description: "Patient referred to specialist for further assessment",
              order: 2,
              dropoutRate: 25,
              emotionalState: "Anxious",
              activities: ["Referral process", "Waiting period", "Specialist consultation"],
            },
            {
              name: "Treatment Planning",
              description: "Development of personalized treatment plan",
              order: 3,
              dropoutRate: 10,
              emotionalState: "Hopeful",
              activities: ["Treatment options discussion", "Decision making", "Plan documentation"],
            },
            {
              name: "Treatment Implementation",
              description: "Initial treatment implementation and monitoring",
              order: 4,
              dropoutRate: 20,
              emotionalState: "Determined",
              activities: ["Treatment initiation", "Side effect monitoring", "Efficacy assessment"],
            },
            {
              name: "Follow-up Care",
              description: "Ongoing management and monitoring",
              order: 5,
              dropoutRate: 30,
              emotionalState: "Variable",
              activities: ["Regular check-ups", "Treatment adjustments", "Long-term support"],
            }
          ],
          barriers: [
            {
              name: "Limited Specialist Access",
              description: "Long waiting times for specialist appointments",
              category: "operational",
              severity: "High",
              isDropoutPoint: true
            },
            {
              name: "Treatment Costs",
              description: "High costs of medications and treatments",
              category: "strategic",
              severity: "High",
              isDropoutPoint: true
            },
            {
              name: "Care Coordination",
              description: "Poor coordination between healthcare providers",
              category: "operational",
              severity: "Medium",
              isDropoutPoint: false
            }
          ],
          interventions: [
            {
              name: "Telehealth Integration",
              description: "Implement telehealth services to increase specialist access",
              implementationComplexity: "Medium",
              impactAreas: ["Specialist Referral", "Follow-up Care"],
              impactMetrics: {
                dropoutReduction: 15,
                costSavings: 20,
                timeReduction: 40,
                patientSatisfactionImprovement: 25
              }
            },
            {
              name: "Patient Navigation Program",
              description: "Dedicated navigators to guide patients through the healthcare system",
              implementationComplexity: "Medium",
              impactAreas: ["Initial Assessment", "Specialist Referral", "Treatment Planning"],
              impactMetrics: {
                dropoutReduction: 20,
                costSavings: 10,
                timeReduction: 30,
                patientSatisfactionImprovement: 35
              }
            }
          ]
        });
        setActiveStep(2);
      }, 3000);
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setJourneyResult(null);
    resetChat();
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Patient Journey Generator
      </Typography>
      
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        {activeStep === 0 && (
          <>
            <Grid item xs={12} md={7}>
              <ChatInterface />
            </Grid>
            <Grid item xs={12} md={5}>
              <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Input Parameters
                </Typography>
                <InputForm />
              </Paper>
            </Grid>
          </>
        )}
        
        {activeStep === 1 && (
          <>
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Search Parameters
                </Typography>
                <SearchParameters journeyData={journeyData} />
              </Paper>
            </Grid>
          </>
        )}
        
        {activeStep === 2 && journeyResult && (
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Patient Journey Visualization
              </Typography>
              <JourneyVisualization journeyData={journeyResult} />
            </Paper>
          </Grid>
        )}
      </Grid>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
        {activeStep > 0 && (
          <Button 
            variant="outlined" 
            onClick={handleBack} 
            sx={{ mr: 1 }}
            disabled={isLoading}
          >
            Back
          </Button>
        )}
        
        {activeStep < steps.length - 1 ? (
          <Button 
            variant="contained" 
            onClick={handleNext}
            disabled={
              (activeStep === 0 && chatStep < 3) || 
              isLoading
            }
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Next'}
          </Button>
        ) : (
          <Button variant="contained" onClick={handleReset}>
            New Journey
          </Button>
        )}
      </Box>
    </Container>
  );
};

export default JourneyGeneratorPage;