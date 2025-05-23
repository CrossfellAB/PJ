import React, { createContext, useState, useContext } from 'react';
import claudeService from '../services/claude';

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
  const [context, setContext] = useState({});

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
      // Call the Claude API service with the current context
      const response = await claudeService.sendMessage(message, context);
      
      // Extract the response and updated context
      const { message: responseContent, updatedContext } = response;
      
      // Update context with the response
      setContext(updatedContext);
      
      // Update journey data if present in context
      if (updatedContext.therapeuticArea && updatedContext.region) {
        setJourneyData(prev => ({
          ...prev,
          therapeuticArea: updatedContext.therapeuticArea,
          region: updatedContext.region,
          additionalCriteria: updatedContext.additionalCriteria || ''
        }));
        
        // Update step based on context
        if (updatedContext.step === 'criteria') {
          setCurrentStep(2);
        } else if (updatedContext.step === 'research') {
          setCurrentStep(3);
        }
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
  
  const startResearch = async () => {
    try {
      setIsLoading(true);
      
      // Use journey data to start the research process
      const researchData = await claudeService.searchAndAnalyze(journeyData);
      
      // Here you would typically store the research data and handle the UI update
      // For now, we'll just log it
      console.log('Research completed:', researchData);
      
      return researchData;
    } catch (error) {
      console.error("Error starting research:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const generateVisualization = async (data) => {
    try {
      setIsLoading(true);
      
      // Generate visualization using the journey data
      const visualizationResult = await claudeService.generateJourneyVisualization(data);
      
      return visualizationResult;
    } catch (error) {
      console.error("Error generating visualization:", error);
      throw error;
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
    setContext({});
  };

  return (
    <ChatContext.Provider value={{
      messages,
      userInput,
      setUserInput,
      sendMessage,
      startResearch,
      generateVisualization,
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