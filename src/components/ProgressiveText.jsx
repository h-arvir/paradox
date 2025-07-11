import React, { useState, useEffect, useRef } from 'react';
import TypewriterText from './TypewriterText';

/**
 * Component for progressively revealing paragraphs with typewriter effect
 * @param {Object} props - Component props
 * @param {string} props.text - The full text content
 * @param {boolean} props.isUser - Whether this is user text
 * @param {number} props.typingSpeed - Speed of typing animation in ms (default: 30)
 * @param {number} props.paragraphDelay - Delay between paragraphs in ms (default: 300)
 * @returns {JSX.Element} The rendered component
 */
const ProgressiveText = ({ 
  text, 
  isUser = false, 
  typingSpeed = 30,
  paragraphDelay = 300
}) => {
  const containerRef = useRef(null);
  
  // For user messages, just show the full text immediately
  if (isUser) {
    return (
      <TypewriterText 
        text={text}
        isUser={true}
        speed={0}
      />
    );
  }
  
  // Split text into paragraphs
  const paragraphs = text.split('\n\n').filter(p => p.trim() !== '');
  
  // State to track which paragraphs are visible
  const [visibleParagraphs, setVisibleParagraphs] = useState(1);
  const [paragraphComplete, setParagraphComplete] = useState(Array(paragraphs.length).fill(false));
  
  // Remove auto-scrolling from ProgressiveText component
  // Let the parent component (ParadoxChat) handle all scrolling
  // This prevents competing scroll behaviors
  
  // When a paragraph's typing animation completes, show the next paragraph after a delay
  const handleParagraphComplete = (index) => {
    const newComplete = [...paragraphComplete];
    newComplete[index] = true;
    setParagraphComplete(newComplete);
    
    if (index < paragraphs.length - 1) {
      setTimeout(() => {
        setVisibleParagraphs(prev => Math.min(prev + 1, paragraphs.length));
      }, paragraphDelay);
    }
  };
  
  // For console-like effect, we'll show all visible paragraphs with the typewriter
  // and update as new paragraphs become visible
  return (
    <div className="console-text" ref={containerRef}>
      {paragraphs.slice(0, visibleParagraphs).map((paragraph, index) => (
        <div key={index} style={{ marginBottom: '0.75rem' }}>
          <TypewriterText 
            text={paragraph}
            speed={typingSpeed}
            isUser={isUser}
            onComplete={() => handleParagraphComplete(index)}
          />
        </div>
      ))}
    </div>
  );
};

export default ProgressiveText;