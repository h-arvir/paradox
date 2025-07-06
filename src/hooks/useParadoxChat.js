import { useState, useEffect, useCallback } from 'react';
import { 
  generateParadoxicalResponse, 
  isEscapeAttempt, 
  generateEscapeResponse 
} from '../services/aiService';
import { 
  calculateConversationDepth, 
  createMessage 
} from '../utils/conversationUtils';

/**
 * Custom hook for managing the paradox chat state and interactions
 * @returns {Object} Chat state and functions
 */
const useParadoxChat = () => {
  // Chat state
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationDepth, setConversationDepth] = useState(1);
  const [error, setError] = useState(null);
  
  // Initialize with a welcome message
  useEffect(() => {
    const initialMessage = createMessage(
      "Welcome to the Infinite Paradox. Every answer I give will be a paradox. Can a conversation that starts with this warning still trap you in logical impossibility?", 
      false
    );
    setMessages([initialMessage]);
  }, []);
  
  // Update conversation depth when messages change
  useEffect(() => {
    const newDepth = calculateConversationDepth(messages);
    setConversationDepth(newDepth);
  }, [messages]);
  
  // Handle sending a message
  const sendMessage = useCallback(async (messageText) => {
    if (!messageText.trim()) return;
    
    // Add user message to the chat
    const userMessage = createMessage(messageText, true);
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      // Check if the user is trying to escape
      const escaping = isEscapeAttempt(messageText);
      
      // Generate the appropriate response
      const responseText = escaping 
        ? await generateEscapeResponse(conversationDepth)
        : await generateParadoxicalResponse(
            messageText, 
            messages, 
            conversationDepth
          );
      
      // Add AI response to the chat
      const botMessage = createMessage(responseText, false);
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error in chat interaction:', error);
      
      // Check if it's an API key error
      if (error.message && (
          error.message.includes('API key') || 
          error.message.includes('authentication') ||
          error.message.includes('credentials')
        )) {
        setError('There was an issue with the API key. Please check that your Gemini API key is valid.');
      } else {
        // Just show the error in the chat
        const errorMessage = createMessage(
          "Even in my failure to respond, I succeed at failing. Is that not the ultimate paradox?", 
          false
        );
        setMessages(prevMessages => [...prevMessages, errorMessage]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [messages, conversationDepth]);
  
  // Handle input change
  const handleInputChange = useCallback((e) => {
    setInputValue(e.target.value);
  }, []);
  
  // Handle form submission
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    sendMessage(inputValue);
  }, [inputValue, sendMessage]);
  
  return {
    messages,
    inputValue,
    isLoading,
    conversationDepth,
    error,
    handleInputChange,
    handleSubmit,
    sendMessage
  };
};

export default useParadoxChat;