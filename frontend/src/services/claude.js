import axios from 'axios';

// Real Claude API service
const claudeService = {
  // Send a message to Claude via the backend API
  sendMessage: async (message, context = {}) => {
    try {
      const response = await axios.post('/api/claude/chat', { 
        message, 
        context 
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message to Claude API:', error);
      throw error;
    }
  },
  
  // Research and analyze a patient journey
  searchAndAnalyze: async (params) => {
    try {
      const { therapeuticArea, region, additionalCriteria } = params;
      
      const response = await axios.post('/api/claude/research', {
        therapeuticArea,
        region,
        additionalCriteria
      });
      
      return response.data;
    } catch (error) {
      console.error('Error researching with Claude API:', error);
      throw error;
    }
  },
  
  // Generate a journey visualization
  generateJourneyVisualization: async (journeyData) => {
    try {
      const response = await axios.post('/api/claude/generate', {
        journeyData
      });
      
      return response.data;
    } catch (error) {
      console.error('Error generating visualization with Claude API:', error);
      throw error;
    }
  }
};

export default claudeService;