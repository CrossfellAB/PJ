const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');
const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

// Initialize Anthropic client
const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY, // This needs to be set in .env
});

// Fallback to mock responses if no API key is set
const MOCK_MODE = !process.env.ANTHROPIC_API_KEY;

// Helper function to process context based conversations with Claude
async function processClaudeConversation(message, context) {
  // If no API key is set, use mock mode
  if (MOCK_MODE) {
    console.warn('ANTHROPIC_API_KEY not set, using mock responses');
    return mockChatResponse(message, context);
  }

  try {
    // Prepare conversation messages based on context
    const messages = [];
    
    // Add system message based on context
    let systemMessage = "You are a healthcare AI assistant specializing in patient journeys. ";
    
    if (context && context.therapeuticArea && context.region) {
      systemMessage += `You are currently discussing the patient journey for ${context.therapeuticArea} in ${context.region}.`;
      
      if (context.additionalCriteria) {
        systemMessage += ` The user is particularly interested in ${context.additionalCriteria}.`;
      }
      
      if (context.step === 'criteria') {
        systemMessage += " You should ask for any specific aspects they'd like to focus on.";
      } else if (context.step === 'research') {
        systemMessage += " You are in the research phase and should provide factual information about the patient journey.";
      }
    } else {
      systemMessage += "You should help identify the therapeutic area and region the user is interested in exploring.";
    }
    
    // Call Claude API with the prepared messages
    const response = await client.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 2000,
      system: systemMessage,
      messages: [
        { role: "user", content: message }
      ],
    });
    
    // Process Claude's response to extract therapeutic area and region if needed
    let updatedContext = { ...context };
    
    // If we don't have therapeutic area and region yet, try to extract from the message and response
    if (!context.therapeuticArea || !context.region) {
      const userMessage = message.toLowerCase();
      
      // Extract therapeutic area if possible
      if (userMessage.includes('diabetes')) {
        updatedContext.therapeuticArea = 'Type 2 Diabetes';
      } else if (userMessage.includes('obesity')) {
        updatedContext.therapeuticArea = 'Obesity';
      }
      
      // Extract region if possible
      if (userMessage.includes('uk') || userMessage.includes('united kingdom')) {
        updatedContext.region = 'United Kingdom';
      } else if (userMessage.includes('us') || userMessage.includes('united states')) {
        updatedContext.region = 'United States';
      }
      
      // If we've identified both therapeutic area and region, update step
      if (updatedContext.therapeuticArea && updatedContext.region && !context.step) {
        updatedContext.step = 'criteria';
      }
    } else if (context.step === 'criteria') {
      // If we're in the criteria step, user's message is additional criteria
      updatedContext.additionalCriteria = message;
      updatedContext.step = 'research';
    }
    
    return {
      message: response.content[0].text,
      updatedContext
    };
  } catch (error) {
    console.error('Error calling Claude API:', error);
    throw error;
  }
}

// Mock response function for development without an API key
function mockChatResponse(message, context) {
  const input = message.toLowerCase();
  
  // Initialize response based on context state
  let response = '';
  let updatedContext = { ...context };
  
  if (!context || !context.therapeuticArea || !context.region) {
    // Try to extract therapeutic area and region from input
    const therapeuticArea = input.includes('diabetes') ? 'Type 2 Diabetes' : 
                          input.includes('obesity') ? 'Obesity' : null;
    
    const region = input.includes('uk') || input.includes('united kingdom') ? 'United Kingdom' :
                  input.includes('us') || input.includes('united states') ? 'United States' : null;
    
    if (therapeuticArea && region) {
      response = `Great! I'll research the patient journey for ${therapeuticArea} in ${region}. Do you have any specific aspects you'd like me to focus on?`;
      updatedContext = {
        ...updatedContext,
        therapeuticArea,
        region,
        step: 'criteria'
      };
    } else {
      response = "I'm not sure I understood which therapeutic area and region you'd like to explore. Could you please specify? For example, 'Type 2 Diabetes in the United Kingdom' or 'Obesity in the United States'.";
    }
  } else if (context.step === 'criteria') {
    // Process additional criteria
    const additionalCriteria = input;
    
    response = `Thank you for providing that information. I'll now research the patient journey for ${context.therapeuticArea} in ${context.region}${additionalCriteria ? `, focusing on ${additionalCriteria}` : ''}. This will take a moment as I gather information from authoritative sources.`;
    
    updatedContext = {
      ...updatedContext,
      additionalCriteria,
      step: 'research'
    };
  } else if (context.step === 'research') {
    if (input.includes('result') || input.includes('finding') || input.includes('what') || input.includes('show')) {
      response = `Here's what I've found so far about the ${context.therapeuticArea} patient journey in ${context.region}:\n\n1. Epidemiological Data:\n- Prevalence rate is approximately 12.5% of adults\n- Higher rates in urban vs. rural areas (15.3% vs. 9.8%)\n- Annual incidence increasing by 2.1% year over year\n\n2. Treatment Guidelines:\n- Initial diagnosis typically occurs in primary care settings\n- Treatment follows a stepped-care approach with 5 distinct phases\n- Recent guidelines emphasize earlier intervention\n\n3. Healthcare System Context:\n- Referral from primary care required for specialist services\n- Average wait time for specialist appointments: 12.6 weeks\n- Significant variation in care quality between regions\n\nWould you like me to generate a visualization of this patient journey?`;
    } else {
      response = `I'm continuing my research on the ${context.therapeuticArea} patient journey in ${context.region}. I've analyzed treatment guidelines, epidemiological data, and common barriers in the care pathway. Would you like to see my preliminary findings, or shall I continue with the complete analysis?`;
    }
  } else {
    // Default fallback response
    response = "I'm not sure how to proceed. Could you clarify what you'd like me to do next?";
  }
  
  return { message: response, updatedContext };
}

// @route   POST api/claude/chat
// @desc    Send a message to Claude API
// @access  Private
router.post('/chat', [
  auth,
  check('message', 'Message is required').not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const { message, context = {} } = req.body;
    
    // Process the message with Claude
    const response = await processClaudeConversation(message, context);
    
    res.json(response);
  } catch (err) {
    console.error('Error in Claude API request:', err.message);
    res.status(500).json({ 
      message: 'Error processing request with Claude API',
      error: err.message
    });
  }
});

// @route   POST api/claude/research
// @desc    Run research using Claude
// @access  Private
router.post('/research', [
  auth,
  check('therapeuticArea', 'Therapeutic area is required').not().isEmpty(),
  check('region', 'Region is required').not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const { therapeuticArea, region, additionalCriteria } = req.body;
    
    // If no API key is set, use mock mode
    if (MOCK_MODE) {
      console.warn('ANTHROPIC_API_KEY not set, using mock responses for research');
      
      // Return mock journey data after a simulated delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      return res.json({
        therapeuticArea,
        region,
        additionalCriteria,
        stages: [
          {
            name: "Initial Assessment",
            description: "Patient presents to primary care with symptoms",
            order: 1,
            dropoutRate: 15,
            emotionalState: "Concerned",
            activities: ["Medical history review", "Physical examination", "Initial tests"],
          },
          {
            name: "Diagnosis",
            description: "Formal diagnosis and initial treatment plan",
            order: 2,
            dropoutRate: 10,
            emotionalState: "Anxious",
            activities: ["Diagnostic testing", "Condition education", "Initial prescription"],
          },
          {
            name: "Specialist Referral",
            description: "Referral to specialist for advanced care",
            order: 3,
            dropoutRate: 25,
            emotionalState: "Hopeful",
            activities: ["Referral processing", "Wait period", "Specialist consultation"],
          },
          {
            name: "Treatment Implementation",
            description: "Beginning of treatment regimen",
            order: 4,
            dropoutRate: 20,
            emotionalState: "Determined",
            activities: ["Medication adjustment", "Lifestyle modifications", "Follow-up scheduling"],
          },
          {
            name: "Long-term Management",
            description: "Ongoing care and monitoring",
            order: 5,
            dropoutRate: 30,
            emotionalState: "Variable",
            activities: ["Regular check-ups", "Medication management", "Complication screening"],
          }
        ],
        barriers: [
          {
            name: "Long Wait Times",
            description: "Extended delays for specialist appointments",
            category: "operational",
            severity: "High",
            isDropoutPoint: true
          },
          {
            name: "Cost of Treatment",
            description: "High medication and service costs",
            category: "strategic",
            severity: "High",
            isDropoutPoint: true
          },
          {
            name: "Limited Specialist Access",
            description: "Geographical barriers to specialist care",
            category: "operational",
            severity: "Medium",
            isDropoutPoint: false
          }
        ],
        interventions: [
          {
            name: "Telehealth Implementation",
            description: "Remote consultation options to improve access",
            implementationComplexity: "Medium",
            impactAreas: ["Specialist Referral", "Long-term Management"],
            impactMetrics: {
              dropoutReduction: 15,
              costSavings: 20,
              timeReduction: 40,
              patientSatisfactionImprovement: 25
            }
          },
          {
            name: "Care Coordinator Program",
            description: "Dedicated staff to guide patients through the healthcare system",
            implementationComplexity: "Medium",
            impactAreas: ["Initial Assessment", "Specialist Referral", "Treatment Implementation"],
            impactMetrics: {
              dropoutReduction: 25,
              costSavings: 15,
              timeReduction: 30,
              patientSatisfactionImprovement: 35
            }
          }
        ],
        sources: [
          {
            title: "National Treatment Guidelines",
            url: "https://example.org/guidelines",
            publishedDate: "2023-01-15"
          },
          {
            title: "Healthcare System Analysis Report",
            url: "https://example.org/healthcare-analysis",
            publishedDate: "2023-03-22"
          },
          {
            title: "Patient Experience Survey Results",
            url: "https://example.org/patient-survey",
            publishedDate: "2022-11-10"
          }
        ]
      });
    }
    
    // Prepare the prompt for Claude to research the patient journey
    const prompt = `I need you to research and analyze the patient journey for ${therapeuticArea} in ${region}${additionalCriteria ? `, focusing on ${additionalCriteria}` : ''}.
    
    Please provide a structured analysis in JSON format with the following sections:
    1. Stages of the patient journey (ordered sequence, including name, description, dropout rate, emotional state, and key activities)
    2. Barriers patients face (name, description, category, severity, whether it's a dropout point)
    3. Potential interventions (name, description, implementation complexity, impact areas, and impact metrics)
    4. Information sources (title, URL, published date)
    
    Ensure all data is factual and evidence-based. Format your response as valid JSON.`;

    // Call Claude API for the research
    const response = await client.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 4000,
      system: "You are a healthcare research assistant specializing in patient journeys. You analyze patient pathways through healthcare systems and identify barriers, interventions, and key stages of care. Provide factual, evidence-based information formatted as valid JSON.",
      messages: [
        { role: "user", content: prompt }
      ],
    });
    
    // Extract JSON from Claude's response
    const responseText = response.content[0].text;
    let journeyData;
    
    try {
      // Look for JSON in the response using regex to extract content between ``` markers if present
      const jsonMatch = responseText.match(/```(?:json)?([\s\S]*?)```/);
      const jsonString = jsonMatch ? jsonMatch[1].trim() : responseText;
      
      journeyData = JSON.parse(jsonString);
    } catch (error) {
      console.error('Error parsing JSON from Claude response:', error);
      
      // Fall back to mock data if parsing fails
      journeyData = {
        therapeuticArea,
        region,
        additionalCriteria,
        stages: [
          {
            name: "Initial Assessment",
            description: "Patient presents to primary care with symptoms",
            order: 1,
            dropoutRate: 15,
            emotionalState: "Concerned",
            activities: ["Medical history review", "Physical examination", "Initial tests"]
          }
          // Add more default stages, barriers, etc. if needed
        ]
      };
    }
    
    // Make sure journey data includes the basic info
    journeyData.therapeuticArea = therapeuticArea;
    journeyData.region = region;
    journeyData.additionalCriteria = additionalCriteria;
    
    res.json(journeyData);
  } catch (err) {
    console.error('Error in Claude research:', err.message);
    res.status(500).json({ 
      message: 'Error processing research request with Claude API',
      error: err.message
    });
  }
});

// @route   POST api/claude/generate
// @desc    Generate journey visualization with Claude
// @access  Private
router.post('/generate', [
  auth,
  check('journeyData', 'Journey data is required').not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const { journeyData } = req.body;
    
    // If no API key is set, use mock mode
    if (MOCK_MODE) {
      console.warn('ANTHROPIC_API_KEY not set, using mock responses for generation');
      
      // Simulated delay to mimic generation process
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      return res.json({
        success: true,
        message: "Journey visualization generated successfully",
        deployUrl: "https://example.org/generated-journey",
        generatedDate: new Date().toISOString()
      });
    }
    
    // Prepare prompt for Claude to generate visualization
    const prompt = `I have a patient journey dataset for ${journeyData.therapeuticArea} in ${journeyData.region} that I need to visualize. Here's the data:
    
    ${JSON.stringify(journeyData, null, 2)}
    
    Based on this data, create a detailed description of how to visualize this patient journey in React. Include a step-by-step breakdown of:
    
    1. The components needed
    2. The visualization structure (timeline, network, etc.)
    3. Key data points to highlight
    4. Interactive elements to include
    
    Format this as a comprehensive visualization plan that can be implemented by a developer.`;
    
    // Call Claude API for generation plan
    const response = await client.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 4000,
      system: "You are a visualization expert who specializes in converting healthcare journey data into interactive React visualizations. You provide detailed, technical plans for developers to implement.",
      messages: [
        { role: "user", content: prompt }
      ],
    });
    
    // Return the generation result
    res.json({
      success: true,
      message: "Journey visualization plan generated successfully",
      visualizationPlan: response.content[0].text,
      generatedDate: new Date().toISOString()
    });
  } catch (err) {
    console.error('Error in Claude generation:', err.message);
    res.status(500).json({ 
      message: 'Error generating visualization with Claude API',
      error: err.message
    });
  }
});

module.exports = router;