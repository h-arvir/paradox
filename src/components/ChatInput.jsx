import React, { useState, useEffect, useRef } from 'react';

/**
 * Component for the chat input form
 * @param {Object} props - Component props
 * @param {string} props.value - The current input value
 * @param {Function} props.onChange - Handler for input changes
 * @param {Function} props.onSubmit - Handler for form submission
 * @param {boolean} props.isLoading - Whether a response is currently loading
 * @returns {JSX.Element} The rendered component
 */
const ChatInput = ({ value, onChange, onSubmit, isLoading }) => {
  const [cursorVisible, setCursorVisible] = useState(true);
  const [glitchInput, setGlitchInput] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const inputRef = useRef(null);
  const textRef = useRef(null);
  
  // Blinking cursor effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 500);
    
    return () => clearInterval(cursorInterval);
  }, []);
  
  // Random input glitch effect
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.9) {
        setGlitchInput(true);
        setTimeout(() => setGlitchInput(false), 150);
      }
    }, 3000);
    
    return () => clearInterval(glitchInterval);
  }, []);
  
  // Auto-focus the input field when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  // Auto-focus the input field after loading state changes to false
  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);
  
  // Update cursor position when value changes
  useEffect(() => {
    if (textRef.current) {
      setCursorPosition(textRef.current.offsetWidth);
    }
  }, [value]);
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isLoading && value.trim()) {
      // Add glitch effect when submitting
      setGlitchInput(true);
      setTimeout(() => {
        setGlitchInput(false);
        onSubmit(e);
      }, 200);
    }
  };
  
  // Focus input when clicked anywhere in the form
  const handleContainerClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  return (
    <div className="relative">
      <div className="text-xs text-neonGreen font-terminal mb-2 opacity-70">
        ENTER YOUR PARADOX:
      </div>
      
      <form onSubmit={handleSubmit} className="input-container" onClick={handleContainerClick}>
        <div className="relative flex-1 flex items-center">
          <span className="text-neonGreen mr-2">{'>'}</span>
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={onChange}
              placeholder="Enter your paradox..."
              className={`message-input w-full ${glitchInput ? 'glitch' : ''}`}
              disabled={isLoading}
              data-text={value}
            />
            {/* Hidden span to measure text width */}
            <span 
              ref={textRef} 
              className="absolute opacity-0 top-0 left-0 whitespace-pre"
              style={{ 
                font: inputRef.current ? 
                  window.getComputedStyle(inputRef.current).font : 
                  "'Press Start 2P', Courier, monospace"
              }}
            >
              {value}
            </span>
            {/* Custom cursor that follows the text */}
            <span 
              className={`absolute text-neonGreen ${cursorVisible ? 'opacity-100' : 'opacity-0'}`}
              style={{ 
                left: `${cursorPosition}px`,
                top: '50%',
                transform: 'translateY(-50%)',
                paddingLeft: '2px'
              }}
            >
              █
            </span>
          </div>
        </div>
        
        <button 
          type="submit" 
          className="send-button"
          disabled={isLoading || !value.trim()}
        >
          {isLoading ? 'PROCESSING...' : 'TRANSMIT'}
        </button>
      </form>
      
      {/* Random system messages
      {Math.random() > 0.8 && !isLoading && (
        <div className="text-xs text-paradox-secondary font-terminal mt-2 opacity-70 animate-pulse-slow">
          {[
            "SYSTEM: REALITY BUFFER OVERFLOW",
            "SYSTEM: LOGIC CIRCUITS UNSTABLE",
            "SYSTEM: PARADOX ENGINE RUNNING HOT",
            "SYSTEM: QUANTUM FLUCTUATIONS DETECTED",
            "SYSTEM: COHERENCE FILTERS DISABLED",
          ][Math.floor(Math.random() * 5)]}
        </div>
      )} */}
    </div>
  );
};

export default ChatInput;