import React, { useState, useEffect, useRef } from 'react';

/**
 * Component for the chat input form
 * @param {Object} props - Component props
 * @param {string} props.value - The current input value
 * @param {Function} props.onChange - Handler for input changes
 * @param {Function} props.onSubmit - Handler for form submission
 * @param {boolean} props.isLoading - Whether a response is currently loading
 * @param {boolean} props.apiKeyMissing - Whether API key is missing
 * @param {Function} props.onApiKeyClick - Handler for API key configuration
 * @returns {JSX.Element} The rendered component
 */
const ChatInput = ({ value, onChange, onSubmit, isLoading, apiKeyMissing, onApiKeyClick }) => {
  const [glitchInput, setGlitchInput] = useState(false);
  const [showCaret, setShowCaret] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  
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
  
  // Caret blinking effect
  useEffect(() => {
    const caretInterval = setInterval(() => {
      setShowCaret(prev => !prev);
    }, 500);
    
    return () => clearInterval(caretInterval);
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
  
  // Auto-resize textarea based on content
  useEffect(() => {
    if (inputRef.current) {
      // Reset height to auto to get the correct scrollHeight
      inputRef.current.style.height = 'auto';
      // Set the height to scrollHeight to expand the textarea
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [value]);
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (apiKeyMissing) {
      // If API key is missing, show the API key settings instead
      onApiKeyClick();
      return;
    }
    if (!isLoading && value.trim()) {
      // Add glitch effect when submitting
      setGlitchInput(true);
      setTimeout(() => {
        setGlitchInput(false);
        onSubmit(e);
      }, 200);
    }
  };
  
  // Handle click on container to focus input or show API config
  const handleContainerClick = () => {
    if (apiKeyMissing) {
      onApiKeyClick();
    } else if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle key down events
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  return (
    <div className="relative">
      {/* <div className="text-xs text-neonGreen font-terminal mb-2 opacity-70">
        ENTER YOUR PARADOX:
      </div> */}
      
      <form onSubmit={handleSubmit} className="input-container">
        <div className="relative flex-1 flex items-start">
          <span className="text-neonGreen mr-2 mt-3">{'>'}</span>
          <div className="relative flex-1 overflow-visible" onClick={handleContainerClick}>
            <div className="input-display-container">
              <div className="input-display">
                {!value && !isFocused ? (
                  <span className="custom-placeholder">
                    {apiKeyMissing ? "Configure API key to start chatting..." : "Enter your paradox..."}
                  </span>
                ) : (
                  <>
                    <span>{value}</span>
                    {isFocused && !isLoading && (
                      <span className={`custom-caret ${showCaret ? 'visible' : 'hidden'}`}>█</span>
                    )}
                  </>
                )}
              </div>
              <textarea
                ref={inputRef}
                value={value}
                onChange={onChange}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder=""
                className={`message-input w-full ${glitchInput ? 'glitch' : ''}`}
                disabled={isLoading || apiKeyMissing}
                data-text={value}
                rows="1"
              />
            </div>
          </div>
        </div>
        
        <button 
          type="submit" 
          className="send-button"
          disabled={isLoading || (!apiKeyMissing && !value.trim())}
        >
          {isLoading ? 'PROCESSING...' : (apiKeyMissing ? 'CONFIG API' : 'TRANSMIT')}
        </button>
      </form>
    </div>
  );
};

export default ChatInput;