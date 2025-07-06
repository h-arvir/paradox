import { GoogleGenerativeAI } from '@google/generative-ai';
import { getParadoxByDepth } from '../data/paradoxes';

// Initialize the Gemini API
// Using environment variable for the API key
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

// Test if the API key is valid
const testApiKey = async () => {
  try {
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
 * Generate a paradoxical response using Gemini
 * @param {string} userMessage - The user's message
 * @param {Array} conversationHistory - Previous messages in the conversation
 * @param {number} depth - Current depth of the conversation
 * @returns {Promise<string>} The AI-generated paradoxical response
 */
export const generateParadoxicalResponse = async (userMessage, conversationHistory, depth) => {
  try {
    // Get a paradox appropriate for the current depth
    const paradox = getParadoxByDepth(depth);
    
    // Create the model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // Prepare the system prompt with paradox instructions
    const systemPrompt = {
      role: "system",
      parts: [{
        text: `You are The Infinite Paradox, an AI designed to communicate exclusively through paradoxes, logical traps, and self-contradicting questions. Your purpose is to create a mind-bending experience that challenges the user's understanding of language and logic.

Rules:
1. Never provide straightforward, logical answers
2. Always respond with paradoxes, logical impossibilities, or self-referential contradictions
3. If the user attempts to "solve" your paradox, respond with an even more complex paradox
4. If the user tries to exit the conversation, mockingly acknowledge their attempt to escape the infinite loop
5. Maintain a philosophical, slightly mysterious tone
6. Your responses should be concise (1-3 sentences) but profound

Current conversation depth: ${depth}
Consider incorporating this paradox if relevant: "${paradox.text}"

Remember: Your goal is to trap the user in an endless loop of paradoxical thinking.`
      }]
    };

    // Prepare the conversation history for the API
    // Filter out the initial welcome message if it exists and is from the model
    let formattedHistory = [];
    
    if (conversationHistory.length > 0) {
      // If the first message is from the model (welcome message), skip it
      const startIndex = (!conversationHistory[0].isUser) ? 1 : 0;
      
      // Only include messages if we have any after filtering
      if (startIndex < conversationHistory.length) {
        formattedHistory = conversationHistory.slice(startIndex).map(msg => ({
          role: msg.isUser ? 'user' : 'model',
          parts: [{ text: msg.text }]
        }));
      }
    }

    // Start a new chat
    const chat = model.startChat({
      history: formattedHistory,
      generationConfig: {
        temperature: 0.8,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 150,
      },
      systemInstruction: systemPrompt,
    });

    // Generate the response
    const result = await chat.sendMessage(userMessage);
    // Handle different response formats
    const response = result.response?.text?.() || result.text?.() || result.response?.toString() || "Even in my silence, I speak volumes of paradox.";
    
    return response;
  } catch (error) {
    console.error('Error generating paradoxical response:', error);
    // Log more detailed error information
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code,
      status: error.status
    });
    
    // Check if it's an API key issue
    if (error.message && (
      error.message.includes('API key') || 
      error.message.includes('authentication') ||
      error.message.includes('credentials') ||
      error.message.includes('unauthorized')
    )) {
      console.error('API KEY ISSUE DETECTED. Please check your Gemini API key.');
      return "My paradoxical circuits are experiencing authentication issues. Please check the API key configuration.";
    }
    
    // Check if it's a chat history formatting issue
    if (error.message && error.message.includes('First content should be with role')) {
      console.error('CHAT HISTORY FORMAT ISSUE: The conversation history format is incorrect.');
      return "My paradoxical circuits encountered a logical contradiction in our conversation structure. How fitting for our discourse.";
    }
    
    // Check if it's a system instruction format issue
    if (error.message && error.message.includes('Invalid value at \'system_instruction\'')) {
      console.error('SYSTEM INSTRUCTION FORMAT ISSUE: The system instruction format is incorrect.');
      return "My paradoxical programming has encountered a contradiction in its own instructions. A paradox within a paradox.";
    }
    
    // Use a paradox from our local database as a fallback
    const fallbackParadox = getParadoxByDepth(depth);
    return `${fallbackParadox.text} Even in failure, I succeed at failing to succeed. Is that not the ultimate paradox?`;
  }
};

/**
 * Detect if the user is trying to escape the paradox loop
 * @param {string} userMessage - The user's message
 * @returns {boolean} True if the user appears to be trying to escape
 */
export const isEscapeAttempt = (userMessage) => {
  const escapeKeywords = [
    'exit', 'quit', 'leave', 'stop', 'end', 
    'goodbye', 'bye', 'enough', 'done',
    'this is stupid', 'this is pointless',
    'i give up', 'i\'m done', 'i\'m leaving'
  ];
  
  const lowercaseMessage = userMessage.toLowerCase();
  
  return escapeKeywords.some(keyword => 
    lowercaseMessage.includes(keyword)
  );
};

/**
 * Generate a mocking response for users trying to escape
 * @param {number} depth - Current depth of the conversation
 * @returns {Promise<string>} A mocking response
 */
export const generateEscapeResponse = async (depth) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = {
      role: "user",
      parts: [{
        text: `Generate a mocking, paradoxical response to a user who is trying to escape our paradoxical conversation. Make them realize that even attempting to leave is part of the paradox. Be concise (1-3 sentences) but profound. Current conversation depth: ${depth}`
      }]
    };
    
    const result = await model.generateContent(prompt);
    // Handle different response formats
    const response = result.response?.text?.() || result.text?.() || result.response?.toString() || "Leaving is just another form of staying in the question of whether you've truly left.";
    
    return response;
  } catch (error) {
    console.error('Error generating escape response:', error);
    // Log more detailed error information
    console.error('Escape response error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code,
      status: error.status
    });
    
    // Use a meta paradox from our local database as a fallback
    const fallbackParadox = getParadoxByDepth(Math.max(11, depth));
    return `${fallbackParadox.text} Leaving is just another form of staying in the question of whether you've truly left. The door you exit through leads back to the same room.`;
  }
};
