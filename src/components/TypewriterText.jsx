import React, { useState, useEffect, useRef } from 'react';

/**
 * Component for rendering text with a typewriter animation effect
 * @param {Object} props - Component props
 * @param {string} props.text - The text to animate
 * @param {number} props.speed - The typing speed in milliseconds (default: 10)
 * @param {boolean} props.isUser - Whether this is user text (no animation for user text)
 * @param {Function} props.onComplete - Callback when animation completes
 * @returns {JSX.Element} The rendered component
 */
const TypewriterText = ({ 
  text, 
  speed = 10, 
  isUser = false, 
  onComplete = () => {} 
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const animationRef = useRef(null);
  const textContainerRef = useRef(null);
  
  // For user messages, just show the full text immediately
  useEffect(() => {
    if (isUser) {
      setDisplayedText(text);
      setIsComplete(true);
      onComplete();
      return;
    }
    
    // For AI messages, animate the text with variable speed
    if (currentIndex < text.length) {
      // Vary typing speed slightly for more realistic effect
      const currentChar = text[currentIndex];
      let typingSpeed = speed;
      
      // Shorter pauses at the end of sentences and paragraphs
      if (currentChar === '.' || currentChar === '!' || currentChar === '?') {
        typingSpeed = speed * 2; // Shorter pause after sentence endings
      } else if (currentChar === '\n') {
        typingSpeed = speed * 1.5; // Shorter pause at line breaks
      } else if (currentChar === ' ') {
        typingSpeed = speed * 1.2; // Very slight pause at spaces
      } else if (Math.random() < 0.03) {
        // Occasionally add a slight random delay (less frequently)
        typingSpeed = speed * 1.5;
      }
      
      animationRef.current = setTimeout(() => {
        setDisplayedText(prev => prev + currentChar);
        setCurrentIndex(prev => prev + 1);
      }, typingSpeed);
      
      return () => clearTimeout(animationRef.current);
    } else if (currentIndex === text.length && !isComplete) {
      setIsComplete(true);
      onComplete();
    }
  }, [text, currentIndex, speed, isUser, isComplete, onComplete]);
  
  // Format text with line breaks for display
  const formatTextWithLineBreaks = (text) => {
    if (!text) return '';
    
    // Split by newlines and map each line to a JSX element
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };
  
  // Add a console-style cursor that blinks at the end of the text
  const renderCursor = () => {
    if (isUser || isComplete) return null;
    
    return (
      <span className="animate-blink" style={{ color: '#00FF41' }}>█</span>
    );
  };
  
  return (
    <div className="console-text" ref={textContainerRef}>
      {formatTextWithLineBreaks(displayedText)}
      {renderCursor()}
    </div>
  );
};

export default TypewriterText;