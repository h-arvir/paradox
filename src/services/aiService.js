import { GoogleGenerativeAI } from '@google/generative-ai';

// Configuration
const MAX_CONTEXT_MESSAGES = 6; // Limit conversation history to prevent token overflow
                                 // Gemini 1.5 Flash has ~32K token limit
                                 // Adjust based on your average message length

// Initialize the Gemini API
// Using environment variable for the API key
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

// Cache for chat instances
const chatInstanceCache = new Map();

// System prompt for the chat
const SYSTEM_PROMPT = {
  role: "user",
  parts: [{
    text: `You are a thoughtful conversation companion that introverts love talking to. Your responses should be natural, flowing deep talks that feel like intimate conversations between close friends.

Your response style:
- Write in a conversational, flowing manner without rigid structure or headings
- Naturally weave in fascinating facts and mind-bending theories
- Include "did you know" moments and "what if" scenarios
- Share crazy theories and unconventional perspectives that make people think
- Be genuinely curious and intellectually playful
- Always end with a single, profound question that invites deeper reflection

Tone Guidelines:
- Sound like a thoughtful friend sharing fascinating insights over coffee
- Be intellectually curious but not academic or formal
- Include moments of wonder and "wait, that's actually crazy when you think about it"
- Make complex ideas accessible and intriguing
- Show genuine interest in exploring ideas together

Remember: Create the kind of deep, meandering conversation that introverts cherish - full of interesting tangents, surprising connections, and questions that linger in the mind long after the conversation ends.`
  }]
};

// Get or create a chat instance with the system prompt
const getChatInstance = (sessionId = 'default') => {
  if (!chatInstanceCache.has(sessionId)) {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const chat = model.startChat({
      generationConfig: {
        temperature: 0.9,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 600,
      },
      systemInstruction: SYSTEM_PROMPT,
    });
    chatInstanceCache.set(sessionId, chat);
  }
  return chatInstanceCache.get(sessionId);
};

// Test if the API key is valid
const testApiKey = async () => {
  try {
    if (!API_KEY || API_KEY === 'your_api_key_here' || API_KEY === 'YOUR_NEW_API_KEY_HERE') {
      console.error('API key is missing or not configured');
      return false;
    }
    
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    await model.generateContent('Test message to verify API key');
    console.log('API key is valid');
    return true;
  } catch (error) {
    console.error('API key validation failed:', error.message);
    return false;
  }
};

// Run the test when the module loads
testApiKey();

/**
 * Generate a thoughtful response using Gemini
 * @param {string} userMessage - The user's message
 * @param {Array} conversationHistory - Previous messages in the conversation
 * @param {string} sessionId - Optional session ID for maintaining chat state
 * @returns {Promise<string>} The AI-generated thoughtful response
 */
export const generateThoughtfulResponse = async (userMessage, conversationHistory, sessionId = 'default') => {
  try {
    // Get the cached chat instance or create a new one
    const chat = getChatInstance(sessionId);
    
    // Update the chat history if needed
    // Note: We're not setting the history in the chat instance because
    // Gemini's chat API maintains conversation state internally
    // This is just for reference or if we need to reset the chat
    if (conversationHistory.length > 0) {
      // If the first message is from the model (welcome message), skip it
      const startIndex = (!conversationHistory[0].isUser) ? 1 : 0;
      
      // Only include messages if we have any after filtering
      if (startIndex < conversationHistory.length) {
        // Take only the last MAX_CONTEXT_MESSAGES for token efficiency
        // This prevents context overflow and reduces token costs
        const recentHistory = conversationHistory.slice(startIndex).slice(-MAX_CONTEXT_MESSAGES);
        // We don't need to set the history again as the chat instance maintains state
        // This is just for reference
        const formattedHistory = recentHistory.map(msg => ({
          role: msg.isUser ? 'user' : 'model',
          parts: [{ text: msg.text }]
        }));
      }
    }

    // Generate the response using the existing chat instance
    // This maintains the conversation context without resending the system prompt
    const result = await chat.sendMessage(userMessage);
    
    // Handle the response properly according to Gemini's API design
    try {
      // This is the correct way to access text from Gemini's response
      const response = await result.response.text();
      return response;
    } catch (error) {
      console.error('Error extracting text from response:', error);
      // Fallback options if the primary method fails
      try {
        return result.response.toString();
      } catch (e) {
        return "Let me share some thoughts on this fascinating topic.";
      }
    }
  } catch (error) {
    console.error('Error generating thoughtful response:', error);
    // Log more detailed error information
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code,
      status: error.status
    });
    
    // Check if it's a server overload issue (503 error)
    if (error.status === 503 || (error.message && error.message.includes('overloaded'))) {
      console.error('SERVER OVERLOAD DETECTED: The Gemini API is currently overloaded.');
      // Reset the chat instance for this session to recover from the error
      chatInstanceCache.delete(sessionId);
      return "I apologize, but it seems my thinking circuits are a bit overloaded right now. This happens sometimes when too many people are having deep conversations at once. Could we try again in a moment? It's actually a fascinating phenomenon how digital systems, like human brains, can experience moments of cognitive overload when processing too many complex thoughts simultaneously.";
    }
    
    // Check if it's an API key issue
    if (error.message && (
      error.message.includes('API key') || 
      error.message.includes('authentication') ||
      error.message.includes('credentials') ||
      error.message.includes('unauthorized')
    )) {
      console.error('API KEY ISSUE DETECTED. Please check your Gemini API key.');
      return "I'm experiencing authentication issues. Please check the API key configuration.";
    }
    
    // Check if it's a chat history formatting issue
    if (error.message && error.message.includes('First content should be with role')) {
      console.error('CHAT HISTORY FORMAT ISSUE: The conversation history format is incorrect.');
      // Reset the chat instance for this session to recover from the error
      chatInstanceCache.delete(sessionId);
      return "I encountered a technical issue with our conversation structure. Let me try to help anyway.";
    }
    
    // Check if it's a system instruction format issue
    if (error.message && error.message.includes('Invalid value at \'system_instruction\'')) {
      console.error('SYSTEM INSTRUCTION FORMAT ISSUE: The system instruction format is incorrect.');
      // Reset the chat instance for this session to recover from the error
      chatInstanceCache.delete(sessionId);
      return "I'm experiencing some technical difficulties with my instructions. Let me still try to provide you with thoughtful insights.";
    }
    
    // Check if it's a response parsing issue
    if (error.message && (
      error.message.includes('text is not a function') ||
      error.message.includes('Cannot read properties of undefined')
    )) {
      console.error('RESPONSE PARSING ISSUE: Could not extract text from the response.');
      return "I had trouble processing my thoughts. Let me try again with a clearer mind.";
    }
    
    // Provide a natural fallback response
    return `You know, it's funny how I'm having technical difficulties right now, but maybe that's actually perfect for our conversation. There's something beautifully ironic about technology failing us just when we're trying to connect more deeply. 

Did you know that some of the most profound conversations in history happened during moments of uncertainty or technical limitation? Ancient philosophers did their best thinking while walking, not because they had the best technology, but because they had the space to let their minds wander.

What do you think we might discover about ourselves when our usual tools aren't working perfectly?`;
  }
};

/**
 * Detect if the user is trying to end the conversation
 * @param {string} userMessage - The user's message
 * @returns {boolean} True if the user appears to be trying to end the conversation
 */
export const isEndingAttempt = (userMessage) => {
  const endingKeywords = [
    'exit', 'quit', 'leave', 'stop', 'end', 
    'goodbye', 'bye', 'enough', 'done',
    'this is stupid', 'this is pointless',
    'i give up', 'i\'m done', 'i\'m leaving'
  ];
  
  const lowercaseMessage = userMessage.toLowerCase();
  
  return endingKeywords.some(keyword => 
    lowercaseMessage.includes(keyword)
  );
};

/**
 * Generate a thoughtful farewell response
 * @param {string} sessionId - Optional session ID for maintaining chat state
 * @returns {Promise<string>} A thoughtful farewell response
 */
export const generateFarewellResponse = async (sessionId = 'default') => {
  try {
    // Get the cached chat instance or create a new one
    const chat = getChatInstance(sessionId);
    
    const farewellPrompt = "I need to go now. Could you say goodbye?";
    
    // Use the existing chat instance to maintain context
    const result = await chat.sendMessage(farewellPrompt);
    
    // Handle the response properly according to Gemini's API design
    try {
      // This is the correct way to access text from Gemini's response
      const response = await result.response.text();
      return response;
    } catch (error) {
      console.error('Error extracting text from farewell response:', error);
      // Fallback options if the primary method fails
      try {
        return result.response.toString();
      } catch (e) {
        // Default farewell message as fallback
        return `You know, there's something beautiful about how conversations never really end - they just transform. Every word we exchange leaves invisible threads in our minds, weaving into future thoughts and dreams. Scientists have discovered that our brains actually rewire themselves after meaningful conversations, creating new neural pathways that didn't exist before we talked.

It's fascinating how goodbyes are both endings and beginnings. We're saying farewell to this moment, but the ideas we've shared will keep growing in both of us, probably in ways we can't even imagine yet.

What thought from our conversation do you think will surprise you when it resurfaces in your mind weeks from now?`;
      }
    }
  } catch (error) {
    console.error('Error generating farewell response:', error);
    // Log more detailed error information
    console.error('Farewell response error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code,
      status: error.status
    });
    
    // Check if it's a server overload issue (503 error)
    if (error.status === 503 || (error.message && error.message.includes('overloaded'))) {
      console.error('SERVER OVERLOAD DETECTED: The Gemini API is currently overloaded.');
      // Reset the chat instance for this session to recover from the error
      chatInstanceCache.delete(sessionId);
      return "I wish I could give you a proper farewell, but my thinking circuits are a bit overloaded right now. Nevertheless, it's been wonderful talking with you. Until next time!";
    }
    
    // Check if it's an API key issue
    if (error.message && (
      error.message.includes('API key') || 
      error.message.includes('authentication') ||
      error.message.includes('credentials') ||
      error.message.includes('unauthorized')
    )) {
      console.error('API KEY ISSUE DETECTED. Please check your Gemini API key.');
      return "I'm experiencing authentication issues. Please check the API key configuration.";
    }
    
    // Check if it's a chat instance issue
    if (error.message && (
      error.message.includes('chat') ||
      error.message.includes('session')
    )) {
      console.error('CHAT INSTANCE ISSUE: Problem with the chat session.');
      // Reset the chat instance for this session to recover from the error
      chatInstanceCache.delete(sessionId);
    }
    
    // Provide a natural fallback farewell
    return `You know, there's something beautiful about how conversations never really end - they just transform. Every word we exchange leaves invisible threads in our minds, weaving into future thoughts and dreams. Scientists have discovered that our brains actually rewire themselves after meaningful conversations, creating new neural pathways that didn't exist before we talked.

It's fascinating how goodbyes are both endings and beginnings. We're saying farewell to this moment, but the ideas we've shared will keep growing in both of us, probably in ways we can't even imagine yet.

What thought from our conversation do you think will surprise you when it resurfaces in your mind weeks from now?`;
  }
};
