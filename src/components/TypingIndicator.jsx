import React, { useState, useEffect } from 'react';

/**
 * Component for showing a typing indicator when the AI is "thinking"
 * @returns {JSX.Element} The rendered component
 */
const TypingIndicator = () => {
  const [text, setText] = useState('');
  const [glitchActive, setGlitchActive] = useState(false);
  
  // Simulate terminal typing effect
  useEffect(() => {
    const phrases = [
      'PROCESSING PARADOX',
      'CALCULATING IMPOSSIBILITIES',
      'BREAKING LOGIC CIRCUITS',
      'GENERATING CONTRADICTION',
      'DISTORTING REALITY'
    ];
    
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    let currentIndex = 0;
    
    const typingInterval = setInterval(() => {
      if (currentIndex <= randomPhrase.length) {
        setText(randomPhrase.substring(0, currentIndex));
        currentIndex++;
      } else {
        currentIndex = 0;
        setText('');
      }
    }, 100);
    
    // Random glitch effect
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 150);
      }
    }, 1000);
    
    return () => {
      clearInterval(typingInterval);
      clearInterval(glitchInterval);
    };
  }, []);
  
  return (
    <div className="p-2 font-terminal text-xs flex items-center">
      <span className={`text-paradox-secondary ${glitchActive ? 'glitch' : ''}`} data-text={text}>
        {text}
      </span>
      {/* Moved typing indicator one character to the right */}
      <span className="animate-blink ml-4 text-paradox-secondary">█</span>
      
      {/* Glitchy dots */}
      <div className="flex ml-2">
        {[0, 1, 2].map((i) => (
          <div 
            key={i}
            className="typing-dot mx-1"
            style={{ 
              animationDelay: `${i * 300}ms`,
              transform: glitchActive ? `translateY(${Math.random() * 4 - 2}px)` : 'none'
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default TypingIndicator;