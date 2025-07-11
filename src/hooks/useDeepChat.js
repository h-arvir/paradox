import { useState, useEffect, useCallback } from 'react';
import { 
  generateThoughtfulResponse, 
  isEndingAttempt, 
  generateFarewellResponse 
} from '../services/aiService';
import { 
  createMessage 
} from '../utils/conversationUtils';

/**
 * Custom hook for managing the deep chat state and interactions
 * @param {Object} options - Configuration options
 * @param {string} options.variant - Chat variant ('thoughtful' or 'paradox')
 * @returns {Object} Chat state and functions
 */
const useDeepChat = ({ variant = 'thoughtful' } = {}) => {
  // Chat state
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentMood, setCurrentMood] = useState('default');
  
  // Initialize with a welcome message
  useEffect(() => {
    const initialText = variant === 'paradox' 
      ? `Hey there! I'm really excited to dive into some deep conversations with you. You know that feeling when you're talking with someone and suddenly you both get caught up in this amazing tangent about life, the universe, or some completely random but fascinating topic? That's exactly what I love doing.

I'm here to share mind-blowing facts, explore wild theories, and ask the kinds of questions that make you stare at the ceiling at 2 AM thinking "wait, what if...?" 

What's been on your mind lately? What topic has been pulling at your curiosity?`
      : `Hey there! I'm really excited to dive into some deep conversations with you. You know that feeling when you're talking with someone and suddenly you both get caught up in this amazing tangent about life, the universe, or some completely random but fascinating topic? That's exactly what I love doing.

I'm here to share mind-blowing facts, explore wild theories, and ask the kinds of questions that make you stare at the ceiling at 2 AM thinking "wait, what if...?" 

What's been on your mind lately? What topic has been pulling at your curiosity?`;
    
    const initialMessage = createMessage(initialText, false);
    setMessages([initialMessage]);
  }, [variant]);
  
  // Handle mood change
  const handleMoodChange = useCallback((moodId) => {
    if (moodId !== currentMood) {
      setCurrentMood(moodId);
      
      // Add a system message indicating the mood change
      const moodChangeText = "Mood changed. I'll respond differently now.";
      const moodChangeMessage = createMessage(moodChangeText, false);
      setMessages(prevMessages => [...prevMessages, moodChangeMessage]);
    }
  }, [currentMood]);
  
  // Handle sending a message
  const sendMessage = useCallback(async (messageText, retryCount = 0) => {
    if (!messageText.trim()) return;
    
    // Flag to track if we're going to retry due to overload
    let willRetry = false;
    
    // Only add the user message on the first attempt, not on retries
    if (retryCount === 0) {
      const userMessage = createMessage(messageText, true);
      setMessages(prevMessages => [...prevMessages, userMessage]);
      setInputValue('');
    }
    
    setIsLoading(true);
    
    try {
      // Check if the user is trying to end the conversation
      const ending = isEndingAttempt(messageText);
      
      // Use the variant as a session ID to maintain separate chat instances
      const sessionId = `chat-${variant}`;
      
      // Generate the appropriate response with the current mood
      const responseText = ending 
        ? await generateFarewellResponse(sessionId, currentMood)
        : await generateThoughtfulResponse(
            messageText, 
            messages,
            sessionId,
            currentMood
          );
      
      // Add AI response to the chat
      const botMessage = createMessage(responseText, false);
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error in chat interaction:', error);
      
      const isOverloadError = error.status === 503 || 
                             (error.message && error.message.includes('overloaded'));
      
      // Check if it's a server overload error (503) and we haven't exceeded retry attempts
      if (isOverloadError && retryCount < 2) {
        // Wait a moment before retrying
        const retryDelay = 2000 * (retryCount + 1); // Exponential backoff: 2s, then 4s
        
        // Show a temporary message about retrying
        if (retryCount === 0) {
          const retryMessage = createMessage(
            "I'm experiencing a bit of overload at the moment. Let me try again in a few seconds...",
            false
          );
          setMessages(prevMessages => [...prevMessages, retryMessage]);
        }
        
        // Keep loading state active during retry
        // We'll handle this in the finally block
        willRetry = true;
        
        // Retry after a delay
        setTimeout(() => {
          sendMessage(messageText, retryCount + 1);
        }, retryDelay);
        
      } 
      // Check if it's an API key error
      else if (error.message && (
          error.message.includes('API key') || 
          error.message.includes('authentication') ||
          error.message.includes('credentials')
        )) {
        setError('There was an issue with the API key. Please check that your Gemini API key is valid.');
        setIsLoading(false);
      } 
      // For overload errors that have exceeded retry attempts
      else if (isOverloadError && retryCount >= 2) {
        const overloadMessage = createMessage(
          "I apologize, but it seems the system is still experiencing high demand. This happens sometimes when many deep thinkers are engaging in conversations simultaneously. Perhaps we could continue our discussion in a few minutes when things calm down a bit? In the meantime, what's a topic you've been curious about lately that we could explore when we reconnect?",
          false
        );
        setMessages(prevMessages => [...prevMessages, overloadMessage]);
        setIsLoading(false);
      }
      // For all other errors
      else {
        const errorMessage = createMessage(
          `You know, it's funny how I'm having technical difficulties right now, but maybe that's actually perfect for our conversation. There's something beautifully ironic about technology failing us just when we're trying to connect more deeply. 

Did you know that some of the most profound conversations in history happened during moments of uncertainty or technical limitation? Ancient philosophers did their best thinking while walking, not because they had the best technology, but because they had the space to let their minds wander.

What do you think we might discover about ourselves when our usual tools aren't working perfectly?`, 
          false
        );
        setMessages(prevMessages => [...prevMessages, errorMessage]);
        setIsLoading(false);
      }
    } finally {
      // Don't reset loading state if we're going to retry
      // The willRetry variable is set in the catch block
      if (!willRetry) {
        setIsLoading(false);
      }
    }
  }, [messages, variant, currentMood]);
  
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
    error,
    currentMood,
    handleInputChange,
    handleSubmit,
    sendMessage,
    handleMoodChange
  };
};

export default useDeepChat;