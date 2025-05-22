import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Therapeutic Areas API
export const getTherapeuticAreas = async () => {
  try {
    const response = await api.get('/therapeutic-areas');
    return response.data;
  } catch (error) {
    console.error('Error fetching therapeutic areas:', error);
    throw error;
  }
};

// Regions API
export const getRegions = async () => {
  try {
    const response = await api.get('/regions');
    return response.data;
  } catch (error) {
    console.error('Error fetching regions:', error);
    throw error;
  }
};

// Journey Templates API
export const getJourneyTemplates = async () => {
  try {
    const response = await api.get('/journeys');
    return response.data;
  } catch (error) {
    console.error('Error fetching journey templates:', error);
    throw error;
  }
};

export const getJourneyTemplate = async (id) => {
  try {
    const response = await api.get(`/journeys/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching journey template with id ${id}:`, error);
    throw error;
  }
};

export const createJourneyTemplate = async (journeyData) => {
  try {
    const response = await api.post('/journeys', journeyData);
    return response.data;
  } catch (error) {
    console.error('Error creating journey template:', error);
    throw error;
  }
};

export const updateJourneyTemplate = async (id, journeyData) => {
  try {
    const response = await api.put(`/journeys/${id}`, journeyData);
    return response.data;
  } catch (error) {
    console.error(`Error updating journey template with id ${id}:`, error);
    throw error;
  }
};

export const deleteJourneyTemplate = async (id) => {
  try {
    const response = await api.delete(`/journeys/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting journey template with id ${id}:`, error);
    throw error;
  }
};

// Authentication API
export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
};

export default api;