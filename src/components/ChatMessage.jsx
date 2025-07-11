import React, { useState } from 'react';
import TypewriterText from './TypewriterText';
import ProgressiveText from './ProgressiveText';

/**
 * Component for rendering individual chat messages
 * @param {Object} props - Component props
 * @param {Object} props.message - The message object to display
 * @param {boolean} props.glitchEffect - Whether to apply glitch effect to this message
 * @returns {JSX.Element} The rendered component
 */
const ChatMessage = ({ message, glitchEffect = false }) => {
  const { text, isUser } = message;
  const [animationComplete, setAnimationComplete] = useState(false);
  
  // Random offset for misalignment
  const randomOffset = Math.floor(Math.random() * 5) - 2;
  
  // Randomly add ASCII characters for bot messages
  const addGlitchChars = (text) => {
    if (isUser) return text;
    
    // Only add glitch chars occasionally
    if (Math.random() > 0.2) return text;
    
    const glitchChars = ['█', '▓', '▒', '░', '▄', '▀', '■', '□', '▪', '▫'];
    const randomChar = () => glitchChars[Math.floor(Math.random() * glitchChars.length)];
    
    // Add random glitch chars at random positions
    let result = text;
    const positions = Math.floor(Math.random() * 3) + 1; // 1-3 glitch chars
    
    for (let i = 0; i < positions; i++) {
      const pos = Math.floor(Math.random() * text.length);
      result = result.substring(0, pos) + randomChar() + result.substring(pos);
    }
    
    return result;
  };
  
  // Randomly apply text transformation
  const getTextTransform = () => {
    if (isUser) return {};
    
    const transforms = [
      { transform: 'skew(0.5deg)' },
      { transform: 'skew(-0.5deg)' },
      { transform: 'rotate(0.3deg)' },
      { transform: 'rotate(-0.3deg)' },
      { transform: 'scale(1.01, 0.99)' },
      { transform: 'scale(0.99, 1.01)' },
    ];
    
    return transforms[Math.floor(Math.random() * transforms.length)];
  };
  
  // Determine which text rendering method to use based on message length and type
  const renderMessageContent = () => {
    const processedText = isUser ? text : addGlitchChars(text);
    
    // For user messages, just show immediately
    if (isUser) {
      return (
        <TypewriterText 
          text={processedText} 
          isUser={true} 
          onComplete={() => setAnimationComplete(true)}
        />
      );
    }
    
    // For AI messages, use typewriter effect to simulate console typing
    // For very long messages, use progressive reveal instead of collapsible functionality
    if (text.length > 500) {
      return (
        <ProgressiveText 
          text={processedText} 
          isUser={false} 
          typingSpeed={20} // Slightly faster typing for long messages
          paragraphDelay={300}
        />
      );
    }
    
    // For medium-length AI messages with multiple paragraphs, use progressive reveal
    const paragraphs = text.split('\n\n').filter(p => p.trim() !== '');
    if (paragraphs.length > 1) {
      return (
        <ProgressiveText 
          text={processedText} 
          isUser={false} 
          typingSpeed={30}
          paragraphDelay={300}
        />
      );
    }
    
    // For all other AI messages, use simple typewriter effect
    return (
      <TypewriterText 
        text={processedText} 
        isUser={false}
        speed={30}
        onComplete={() => setAnimationComplete(true)}
      />
    );
  };
  
  return (
    <div 
      className={`message ${isUser ? 'user-message' : 'bot-message'}`}
      style={{ 
        marginLeft: isUser ? 'auto' : `${randomOffset}px`,
        marginRight: isUser ? `${randomOffset}px` : 'auto',
        ...getTextTransform()
      }}
    >
      <div className="flex items-start">
        <span className="mr-2 opacity-70">
          {isUser ? 'YOU>' : '∞>'}
        </span>
        <div className={glitchEffect ? 'glitch' : ''} data-text={text}>
          {renderMessageContent()}
        </div>
      </div>
      
      {/* Randomly add scanlines to some messages */}
      {!isUser && Math.random() > 0.7 && (
        <div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 4px)'
          }}
        ></div>
      )}
    </div>
  );
};

export default ChatMessage;