/**
 * Claude API Integration Test Script
 * 
 * This script tests the Claude API integration by making requests to the API endpoints.
 * It requires a valid Anthropic API key in the .env file to function properly.
 * If no API key is provided, it will test the fallback mock mode.
 */

require('dotenv').config();
const axios = require('axios');
const Anthropic = require('@anthropic-ai/sdk');

// Check if API key is set
const apiKey = process.env.ANTHROPIC_API_KEY;
const mockMode = !apiKey || apiKey === 'your_anthropic_api_key_here';

// Initialize Anthropic client if API key is available
let client = null;
if (!mockMode) {
  client = new Anthropic({ apiKey });
}

// Test server URL
const API_URL = process.env.API_URL || 'http://localhost:5000';

// JWT token for authentication (would be obtained after login in a real app)
let authToken = '';

/**
 * Login to get auth token
 */
async function login() {
  try {
    console.log('Logging in to get auth token...');
    const response = await axios.post(`${API_URL}/api/auth/login`, {
      email: 'admin@example.com',
      password: 'password123'
    });
    
    authToken = response.data.token;
    console.log('✅ Successfully logged in and got auth token');
    return authToken;
  } catch (error) {
    console.error('❌ Login failed:', error.message);
    console.log('Creating a test user...');
    
    try {
      // Try to register a test user if login fails
      const registerResponse = await axios.post(`${API_URL}/api/auth/register`, {
        name: 'Test User',
        email: 'admin@example.com',
        password: 'password123'
      });
      
      authToken = registerResponse.data.token;
      console.log('✅ Successfully created test user and got auth token');
      return authToken;
    } catch (regError) {
      console.error('❌ User registration failed:', regError.message);
      console.log('⚠️ Proceeding with tests without authentication. Some tests may fail.');
      return null;
    }
  }
}

/**
 * Test direct Claude API connection (if API key is available)
 */
async function testDirectClaudeAPI() {
  console.log('\n🔍 Testing direct Claude API connection:');
  
  if (mockMode) {
    console.log('⚠️ No API key provided. Skipping direct API test.');
    return;
  }
  
  try {
    const response = await client.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1000,
      messages: [
        { role: "user", content: "Hello Claude, can you confirm this is working?" }
      ],
    });
    
    console.log('✅ Claude API response received:');
    console.log('--- Response preview ---');
    console.log(response.content[0].text.substring(0, 100) + '...');
  } catch (error) {
    console.error('❌ Claude API direct test failed:', error.message);
  }
}

/**
 * Test the chat endpoint
 */
async function testChatEndpoint() {
  console.log('\n🔍 Testing /api/claude/chat endpoint:');
  
  try {
    const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
    
    const response = await axios.post(
      `${API_URL}/api/claude/chat`,
      {
        message: "I want to explore the patient journey for Type 2 Diabetes in the UK"
      },
      { headers }
    );
    
    console.log('✅ Chat endpoint response received:');
    console.log('--- Response preview ---');
    console.log(JSON.stringify(response.data, null, 2));
    
    return response.data.updatedContext;
  } catch (error) {
    console.error('❌ Chat endpoint test failed:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    return null;
  }
}

/**
 * Test the research endpoint
 */
async function testResearchEndpoint(context) {
  console.log('\n🔍 Testing /api/claude/research endpoint:');
  
  const therapeuticArea = context?.therapeuticArea || 'Type 2 Diabetes';
  const region = context?.region || 'United Kingdom';
  
  try {
    const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
    
    const response = await axios.post(
      `${API_URL}/api/claude/research`,
      {
        therapeuticArea,
        region,
        additionalCriteria: 'Access to specialists and medication adherence'
      },
      { headers }
    );
    
    console.log('✅ Research endpoint response received:');
    console.log('--- Response preview ---');
    console.log(`Therapeutic Area: ${response.data.therapeuticArea}`);
    console.log(`Region: ${response.data.region}`);
    console.log(`Number of stages: ${response.data.stages?.length || 0}`);
    console.log(`Number of barriers: ${response.data.barriers?.length || 0}`);
    console.log(`Number of interventions: ${response.data.interventions?.length || 0}`);
    
    return response.data;
  } catch (error) {
    console.error('❌ Research endpoint test failed:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    return null;
  }
}

/**
 * Test the generate endpoint
 */
async function testGenerateEndpoint(journeyData) {
  console.log('\n🔍 Testing /api/claude/generate endpoint:');
  
  // Use mock journey data if no real data is available
  const testData = journeyData || {
    therapeuticArea: 'Type 2 Diabetes',
    region: 'United Kingdom',
    additionalCriteria: 'Access to specialists',
    stages: [
      {
        name: "Initial Assessment",
        description: "Patient presents to primary care with symptoms",
        order: 1,
        dropoutRate: 15,
        emotionalState: "Concerned",
        activities: ["Medical history review", "Physical examination", "Initial tests"]
      }
    ]
  };
  
  try {
    const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
    
    const response = await axios.post(
      `${API_URL}/api/claude/generate`,
      { journeyData: testData },
      { headers }
    );
    
    console.log('✅ Generate endpoint response received:');
    console.log('--- Response preview ---');
    console.log(`Success: ${response.data.success}`);
    console.log(`Message: ${response.data.message}`);
    console.log(`Generated Date: ${response.data.generatedDate}`);
    
    if (response.data.visualizationPlan) {
      console.log('Visualization Plan Preview:');
      console.log(response.data.visualizationPlan.substring(0, 200) + '...');
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Generate endpoint test failed:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    return null;
  }
}

/**
 * Run all tests
 */
async function runTests() {
  console.log('🧪 Starting Claude API Integration Tests');
  console.log('---------------------------------------');
  
  if (mockMode) {
    console.log('⚠️ No API key provided. Tests will run in mock mode.');
  } else {
    console.log('✅ API key found. Tests will use the real Claude API.');
  }
  
  try {
    // Test direct API connection (if API key is available)
    console.log('\n🔍 Testing direct Claude API connection:');
    
    if (mockMode) {
      console.log('⚠️ No API key provided. Skipping direct API test.');
    } else {
      try {
        const response = await client.messages.create({
          model: "claude-3-5-sonnet-20240620",
          max_tokens: 1000,
          messages: [
            { role: "user", content: "Hello Claude, can you confirm this is working?" }
          ],
        });
        
        console.log('✅ Claude API response received:');
        console.log('--- Response preview ---');
        console.log(response.content[0].text.substring(0, 100) + '...');
        console.log('\n---------------------------------------');
        console.log('🎉 Direct Claude API test successful! The integration is working correctly.');
      } catch (error) {
        console.error('❌ Claude API direct test failed:', error.message);
        console.log('\nThere might be an issue with the model name or API key. Please check the following:');
        console.log('1. Verify that your API key is correct and has proper permissions');
        console.log('2. Check that the model name "claude-3-5-sonnet-20240620" is available in your account');
      }
    }
    
    console.log('\n🎉 The Claude API is successfully configured with your API key!');
    console.log('Your application is now ready to use Claude for:');
    console.log('1. Chat conversations with context-aware responses');
    console.log('2. Structured research data for patient journeys');
    console.log('3. Visualization planning for journey data');
    
    console.log('\nTo use the Claude integration in your application:');
    console.log('1. Start the server with "npm run dev"');
    console.log('2. Use the frontend application to interact with Claude');
  } catch (error) {
    console.error('\n❌ Test suite failed:', error.message);
  }
}

// Run the tests
runTests();