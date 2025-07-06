/**
 * Utility functions for managing conversation state and depth
 */

/**
 * Calculate the depth of a conversation based on message count and complexity
 * @param {Array} messages - The conversation history
 * @returns {number} The calculated conversation depth
 */
export const calculateConversationDepth = (messages) => {
  if (!messages || messages.length === 0) {
    return 1;
  }
  
  // Base depth is determined by the number of exchanges
  const baseDepth = Math.ceil(messages.length / 2);
  
  // Additional depth factors
  let complexityBonus = 0;
  
  // Check the last 3 user messages (if available) for complexity indicators
  const userMessages = messages
    .filter(msg => msg.isUser)
    .slice(-3);
  
  userMessages.forEach(msg => {
    const text = msg.text.toLowerCase();
    
    // Check for philosophical keywords
    if (/\b(reality|existence|consciousness|truth|knowledge|meaning|paradox|logic|infinite|contradiction)\b/.test(text)) {
      complexityBonus += 0.5;
    }
    
    // Check for question complexity
    if ((text.match(/\?/g) || []).length >= 2) {
      complexityBonus += 0.5;
    }
    
    // Check for message length (deeper engagement)
    if (text.split(' ').length > 20) {
      complexityBonus += 0.5;
    }
  });
  
  // Calculate final depth
  const depth = Math.min(15, Math.max(1, Math.floor(baseDepth + complexityBonus)));
  
  return depth;
};

/**
 * Create a new message object
 * @param {string} text - The message text
 * @param {boolean} isUser - Whether the message is from the user
 * @returns {Object} A formatted message object
 */
export const createMessage = (text, isUser = false) => {
  return {
    id: Date.now().toString(),
    text,
    isUser,
    timestamp: new Date().toISOString()
  };
};

/**
 * Get a visual representation of the current paradox depth
 * @param {number} depth - The current conversation depth
 * @returns {string} A visual representation of the depth
 */
export const getDepthVisualization = (depth) => {
  if (depth <= 3) {
    return '◉◯◯◯';
  } else if (depth <= 6) {
    return '◉◉◯◯';
  } else if (depth <= 10) {
    return '◉◉◉◯';
  } else {
    return '◉◉◉◉';
  }
};