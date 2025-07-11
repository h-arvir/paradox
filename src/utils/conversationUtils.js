/**
 * Utility functions for managing conversation state
 */

/**
 * Create a new message object
 * @param {string} text - The message text
 * @param {boolean} isUser - Whether the message is from the user
 * @returns {Object} A formatted message object
 */
export const createMessage = (text, isUser = false) => {
  // Apply semantic formatting to non-user messages
  const formattedText = isUser ? text : formatTextSemantically(text);
  
  return {
    id: Date.now().toString(),
    text: formattedText,
    isUser,
    timestamp: new Date().toISOString()
  };
};

/**
 * Format text with semantic breaks to improve readability
 * @param {string} text - The text to format
 * @returns {string} Formatted text with semantic breaks
 */
export const formatTextSemantically = (text) => {
  if (!text) return text;
  
  // First, fix any missing spaces after punctuation
  // This addresses cases like "liberating.Did you know" where there should be a space
  let formatted = text.replace(/([.!?])([A-Z])/g, '$1 $2');
  
  // Step 1: Ensure paragraphs are properly separated after sentences
  // This looks for sentence endings followed by a capital letter
  formatted = formatted.replace(/([.!?])\s+(?=[A-Z])/g, '$1\n\n');
  
  // Step 2: Separate ALL questions onto their own lines
  // First, handle questions at the beginning of sentences
  formatted = formatted.replace(/([.!?])\s+(What\s+[^.!?]*\?)/gi, '$1\n\n$2');
  
  // Then handle questions that might be in the middle of paragraphs
  formatted = formatted.replace(/(\.)\s*(What\s+[^.!?]*\?)/gi, '$1\n\n$2');
  
  // Also handle "Imagine if" questions
  formatted = formatted.replace(/(\.)\s*(Imagine\s+[^.!?]*\?)/gi, '$1\n\n$2');
  
  // Step 3: Mark theories or facts with a subtle indicator and put on new line
  // This adds a bullet point before phrases that typically introduce facts or theories
  const factPhrases = [
    'Did you know', 'Interestingly', 'Fascinatingly', 'In fact', 
    'Research shows', 'Studies indicate', 'Theoretically', 
    'Imagine if', 'What if', 'Surprisingly', 'Remarkably', 
    'Curiously', 'Scientists have found', 'It turns out',
    'According to', 'Historically', 'Philosophically',
    'The truth is', 'Strangely enough', 'Paradoxically'
  ];
  
  // Create a regex pattern from the fact phrases - make it case insensitive
  const factPattern = new RegExp(
    `(${factPhrases.join('|')})([^.!?]*[.!?])`, 'gi'
  );
  
  // Add a line break before facts and theories
  formatted = formatted.replace(factPattern, '\n\n• $1$2');
  
  // Step 4: Ensure proper spacing after bullet points
  formatted = formatted.replace(/•\s*([A-Z])/g, '• $1');
  
  // Step 5: Handle consecutive questions
  // This finds question marks followed by "Would", "Could", "How", etc.
  formatted = formatted.replace(/(\?)\s+([A-Z][^.!?]*\?)/g, '$1\n\n$2');
  
  // Step 6: Ensure double line breaks aren't excessive (more than 2)
  formatted = formatted.replace(/\n{3,}/g, '\n\n');
  
  // Step 7: Add line break before final question (which often ends AI responses)
  formatted = formatted.replace(/([.!])\s+([A-Z][^.!?]*\?)$/, '$1\n\n$2');
  
  return formatted;
};

