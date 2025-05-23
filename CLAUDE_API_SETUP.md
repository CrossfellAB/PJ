# Claude API Setup and Integration

This document provides detailed instructions for setting up and working with the Anthropic Claude API integration in the Patient Journey Enterprise Platform.

## Prerequisites

- An Anthropic API key (get one from [https://console.anthropic.com/](https://console.anthropic.com/))
- Node.js (v14+)
- npm or yarn

## Setting Up Claude API

1. **Sign up for Anthropic API access**:
   - Visit [https://console.anthropic.com/](https://console.anthropic.com/)
   - Create an account or sign in
   - Navigate to the API Keys section
   - Create a new API key
   - Copy your API key for use in the application

2. **Configure the application**:
   - Open your `.env` file in the project root directory
   - Add your API key:
     ```
     ANTHROPIC_API_KEY=your_anthropic_api_key_here
     ```
   - Save the file

3. **Verify the installation**:
   - The application will automatically detect and use the Claude API when the key is present
   - If no key is found, the application will use mock responses for development purposes

## Using Claude API Features

The Patient Journey Enterprise Platform integrates Claude in three main ways:

### 1. Conversational Interface

- Available through the chat interface in the frontend
- Allows users to interact with Claude for research and analysis
- Automatically identifies therapeutic areas and regions of interest
- Guides users through the journey creation process

#### Example Conversation Flow:

1. User: "I want to explore the patient journey for Type 2 Diabetes in the UK"
2. Claude: "Great! I'll research the patient journey for Type 2 Diabetes in the United Kingdom. Do you have any specific aspects you'd like me to focus on?"
3. User: "Yes, I'm particularly interested in access to specialists and medication adherence"
4. Claude: "Thank you for providing that information. I'll now research the patient journey for Type 2 Diabetes in the United Kingdom, focusing on access to specialists and medication adherence. This will take a moment as I gather information from authoritative sources."

### 2. Journey Research

- Generates structured data about patient journeys
- Includes stages, barriers, interventions, and information sources
- Provides evidence-based information through Claude's knowledge

#### Example Research Request:

```javascript
// Frontend code example
const journeyData = await claudeService.searchAndAnalyze({
  therapeuticArea: 'Type 2 Diabetes',
  region: 'United Kingdom',
  additionalCriteria: 'Access to specialists and medication adherence'
});

console.log(journeyData.stages); // Array of journey stages
console.log(journeyData.barriers); // Array of barriers patients face
console.log(journeyData.interventions); // Array of potential interventions
```

### 3. Visualization Generation

- Creates detailed plans for visualizing patient journeys
- Recommends components, structures, and interactive elements
- Helps developers implement effective journey visualizations

#### Example Visualization Request:

```javascript
// Frontend code example
const visualizationPlan = await claudeService.generateJourneyVisualization(journeyData);

console.log(visualizationPlan.visualizationPlan); // Detailed visualization recommendations
```

## API Endpoints

The following endpoints are available for interacting with Claude:

### POST /api/claude/chat

Send a message to Claude and get a contextual response.

**Request:**
```json
{
  "message": "I want to explore the patient journey for Type 2 Diabetes in the UK",
  "context": {} // Optional context from previous interactions
}
```

**Response:**
```json
{
  "message": "Great! I'll research the patient journey for Type 2 Diabetes in the United Kingdom. Do you have any specific aspects you'd like me to focus on?",
  "updatedContext": {
    "therapeuticArea": "Type 2 Diabetes",
    "region": "United Kingdom",
    "step": "criteria"
  }
}
```

### POST /api/claude/research

Generate structured research data for a patient journey.

**Request:**
```json
{
  "therapeuticArea": "Type 2 Diabetes",
  "region": "United Kingdom",
  "additionalCriteria": "Access to specialists and medication adherence"
}
```

**Response:**
```json
{
  "therapeuticArea": "Type 2 Diabetes",
  "region": "United Kingdom",
  "additionalCriteria": "Access to specialists and medication adherence",
  "stages": [
    {
      "name": "Initial Assessment",
      "description": "Patient presents to primary care with symptoms",
      "order": 1,
      "dropoutRate": 15,
      "emotionalState": "Concerned",
      "activities": ["Medical history review", "Physical examination", "Initial tests"]
    },
    // Additional stages...
  ],
  "barriers": [
    // Array of barriers...
  ],
  "interventions": [
    // Array of interventions...
  ],
  "sources": [
    // Array of information sources...
  ]
}
```

### POST /api/claude/generate

Generate a visualization plan for a patient journey.

**Request:**
```json
{
  "journeyData": {
    // The complete journey data object from the research endpoint
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Journey visualization plan generated successfully",
  "visualizationPlan": "Detailed step-by-step recommendations for visualizing the journey...",
  "generatedDate": "2023-05-23T15:30:45.123Z"
}
```

## Fallback Mode

If no Claude API key is provided, the system operates in "mock mode" with these behaviors:

1. **Chat Responses**: Returns predefined responses based on simple pattern matching
2. **Research Data**: Returns static sample journey data 
3. **Visualization**: Returns a generic success message without actual visualization details

This allows for development and testing without requiring an API key.

## Troubleshooting

### Common Issues

1. **API Key Not Recognized**:
   - Ensure the key is correctly formatted in the .env file
   - Restart the server after changing the key
   - Check server logs for authentication errors

2. **Rate Limiting**:
   - Claude API has rate limits that may affect usage
   - Implement caching for common queries
   - Add retry logic for failed requests

3. **Large Response Handling**:
   - Some research queries may generate large responses
   - Ensure proper timeout settings
   - Consider pagination or chunking for large datasets

### Getting Support

For issues with the Claude API integration:
1. Check the Anthropic documentation at [https://docs.anthropic.com/](https://docs.anthropic.com/)
2. Review server logs for detailed error messages
3. Contact Anthropic support for API-specific issues