import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  MenuItem, 
  Button,
  FormControl,
  InputLabel,
  Select,
  Grid,
  CircularProgress,
  Alert 
} from '@mui/material';
import { useChat } from '../../contexts/ChatContext';

const InputForm = () => {
  const { journeyData, currentStep } = useChat();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    therapeuticArea: '',
    region: '',
    additionalCriteria: ''
  });
  const [therapeuticAreas, setTherapeuticAreas] = useState([]);
  const [regions, setRegions] = useState([]);

  // Simulate loading therapeutic areas and regions from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real implementation, this would fetch from the backend
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setTherapeuticAreas([
          { id: '1', name: 'Type 2 Diabetes' },
          { id: '2', name: 'Obesity' },
          { id: '3', name: 'Hypertension' },
          { id: '4', name: 'Heart Failure' },
          { id: '5', name: 'Asthma' },
          { id: '6', name: 'COPD' }
        ]);
        
        setRegions([
          { id: '1', name: 'United Kingdom', healthcareSystem: 'NHS' },
          { id: '2', name: 'United States', healthcareSystem: 'Mixed Insurance' },
          { id: '3', name: 'Germany', healthcareSystem: 'Statutory Health Insurance' },
          { id: '4', name: 'France', healthcareSystem: 'Social Health Insurance' },
          { id: '5', name: 'Japan', healthcareSystem: 'Universal Health Insurance' }
        ]);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load therapeutic areas and regions. Please try again.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Update form with data from chat context
  useEffect(() => {
    if (journeyData.therapeuticArea || journeyData.region) {
      setFormData(prev => ({
        ...prev,
        therapeuticArea: journeyData.therapeuticArea || prev.therapeuticArea,
        region: journeyData.region || prev.region,
        additionalCriteria: journeyData.additionalCriteria || prev.additionalCriteria
      }));
    }
  }, [journeyData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" paragraph>
        You can specify parameters directly here or through the chat interface.
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth disabled={currentStep > 1}>
            <InputLabel id="therapeutic-area-label">Therapeutic Area</InputLabel>
            <Select
              labelId="therapeutic-area-label"
              id="therapeutic-area"
              name="therapeuticArea"
              value={formData.therapeuticArea}
              onChange={handleChange}
              label="Therapeutic Area"
            >
              <MenuItem value="">
                <em>Select a therapeutic area</em>
              </MenuItem>
              {therapeuticAreas.map(area => (
                <MenuItem key={area.id} value={area.name}>
                  {area.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <FormControl fullWidth disabled={currentStep > 1}>
            <InputLabel id="region-label">Region</InputLabel>
            <Select
              labelId="region-label"
              id="region"
              name="region"
              value={formData.region}
              onChange={handleChange}
              label="Region"
            >
              <MenuItem value="">
                <em>Select a region</em>
              </MenuItem>
              {regions.map(region => (
                <MenuItem key={region.id} value={region.name}>
                  {region.name} ({region.healthcareSystem})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="additionalCriteria"
            name="additionalCriteria"
            label="Additional Criteria"
            multiline
            rows={4}
            value={formData.additionalCriteria}
            onChange={handleChange}
            placeholder="Enter any specific focus areas or additional information to include in the patient journey"
            disabled={currentStep > 2}
          />
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          variant="contained" 
          disabled={!formData.therapeuticArea || !formData.region || currentStep > 1}
        >
          Submit Parameters
        </Button>
      </Box>
    </Box>
  );
};

export default InputForm;