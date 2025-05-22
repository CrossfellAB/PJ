import React, { createContext, useState, useContext } from 'react';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([
    { id: 1, content: 'Welcome to the PRISM-X Patient Journey Generator! I\'m Claude, your assistant for creating interactive patient journeys. What therapeutic area and region would you like to explore?', sender: 'assistant' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [journeyData, setJourneyData] = useState({
    therapeuticArea: '',
    region: '',
    additionalCriteria: ''
  });
  const [currentStep, setCurrentStep] = useState(1);

  const sendMessage = async (message) => {
    if (!message.trim()) return;
    
    // Add user message
    const userMessage = {
      id: messages.length + 1,
      content: message,
      sender: 'user'
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setUserInput('');
    setIsLoading(true);
    
    try {
      // In a real implementation, this would call the backend API to interact with Claude
      // For now, we'll simulate a response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let responseContent = '';
      
      // Process user input based on current step
      if (currentStep === 1) {
        // Detect therapeutic area and region
        const userMessage = message.toLowerCase();
        if (userMessage.includes('diabetes') || userMessage.includes('obesity')) {
          const therapeuticArea = userMessage.includes('diabetes') ? 'Type 2 Diabetes' : 'Obesity';
          let region = 'Unknown';
          
          if (userMessage.includes('uk') || userMessage.includes('united kingdom')) {
            region = 'United Kingdom';
          } else if (userMessage.includes('us') || userMessage.includes('united states')) {
            region = 'United States';
          }
          
          setJourneyData(prev => ({
            ...prev,
            therapeuticArea,
            region
          }));
          
          responseContent = `Great! I understand you want to explore the patient journey for ${therapeuticArea} in ${region}. Would you like to provide any additional criteria or specific focus areas for this patient journey?`;
          setCurrentStep(2);
        } else {
          responseContent = "I'm not sure I understood the therapeutic area and region you're interested in. Could you please specify a therapeutic area (e.g., 'Type 2 Diabetes', 'Obesity') and a region (e.g., 'United Kingdom', 'United States')?";
        }
      } else if (currentStep === 2) {
        // Process additional criteria
        setJourneyData(prev => ({
          ...prev,
          additionalCriteria: message
        }));
        
        responseContent = `Thank you for providing that information. I'll now research the patient journey for ${journeyData.therapeuticArea} in ${journeyData.region}, focusing on ${message || 'standard pathways'}. This will take a moment as I gather and analyze relevant information.`;
        setCurrentStep(3);
        
        // In a real implementation, we would trigger the research process here
      } else if (currentStep === 3) {
        responseContent = "I'm still gathering information about the patient journey. Would you like to see what I've found so far, or would you prefer to wait until I have completed my research?";
      }
      
      // Add assistant response
      const assistantMessage = {
        id: messages.length + 2,
        content: responseContent,
        sender: 'assistant'
      };
      
      setMessages(prevMessages => [...prevMessages, assistantMessage]);
    } catch (error) {
      console.error("Error processing message:", error);
      
      // Add error message
      const errorMessage = {
        id: messages.length + 2,
        content: "I'm sorry, I encountered an error processing your request. Please try again.",
        sender: 'assistant'
      };
      
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = () => {
    setMessages([
      { id: 1, content: 'Welcome to the PRISM-X Patient Journey Generator! I\'m Claude, your assistant for creating interactive patient journeys. What therapeutic area and region would you like to explore?', sender: 'assistant' }
    ]);
    setUserInput('');
    setJourneyData({
      therapeuticArea: '',
      region: '',
      additionalCriteria: ''
    });
    setCurrentStep(1);
  };

  return (
    <ChatContext.Provider value={{
      messages,
      userInput,
      setUserInput,
      sendMessage,
      isLoading,
      journeyData,
      currentStep,
      resetChat
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;