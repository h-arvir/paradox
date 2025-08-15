import React, { useRef, useEffect, useState } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';
import MoodSelector from './MoodSelector';

import ErrorMessage from './ErrorMessage';
import useDeepChat from '../hooks/useDeepChat';

/**
 * Main component for the Thoughtful Chat interface
 * @returns {JSX.Element} The rendered component
 */
const ParadoxChat = () => {
  const [apiKeyError, setApiKeyError] = useState(false);
  const [bootSequence, setBootSequence] = useState(true);
  const [bootText, setBootText] = useState('');
  
  const { 
    messages, 
    inputValue, 
    isLoading, 
    handleInputChange, 
    handleSubmit,
    error,
    currentMood,
    handleMoodChange
  } = useDeepChat({ variant: 'thoughtful' });
  
  // Reference to the message container for auto-scrolling
  const messageContainerRef = useRef(null);
  
  // Track if user has manually scrolled up and the last scroll position
  const [userHasScrolled, setUserHasScrolled] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [scrollLocked, setScrollLocked] = useState(false);
  
  // Handle scroll events to detect when user manually scrolls
  const handleScroll = () => {
    if (!messageContainerRef.current || scrollLocked) return;
    
    const container = messageContainerRef.current;
    const currentScrollTop = container.scrollTop;
    const isAtBottom = container.scrollHeight - currentScrollTop - container.clientHeight < 20;
    
    // Detect if user is actively scrolling up (against auto-scroll)
    const isScrollingUp = currentScrollTop < lastScrollTop;
    
    // If user is scrolling up or is not at the bottom
    if (isScrollingUp || !isAtBottom) {
      setUserHasScrolled(true);
      // Lock scrolling for a short period to prevent flickering
      setScrollLocked(true);
      setTimeout(() => setScrollLocked(false), 1000);
    } else if (isAtBottom) {
      // Only reset if user has scrolled all the way to the bottom
      setUserHasScrolled(false);
    }
    
    // Update last scroll position
    setLastScrollTop(currentScrollTop);
  };
  
  // Helper function for smooth scrolling
  const smoothScrollToBottom = (duration = 300) => {
    if (!messageContainerRef.current) return;
    
    const container = messageContainerRef.current;
    const targetPosition = container.scrollHeight - container.clientHeight;
    const startPosition = container.scrollTop;
    const distance = targetPosition - startPosition;
    
    if (distance <= 0) return; // Already at bottom
    
    let startTime = null;
    
    const animateScroll = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      
      // Easing function for smooth deceleration
      const easeOutCubic = progress => 1 - Math.pow(1 - progress, 3);
      
      container.scrollTop = startPosition + distance * easeOutCubic(progress);
      
      if (timeElapsed < duration) {
        requestAnimationFrame(animateScroll);
      } else {
        container.scrollTop = targetPosition; // Ensure we end exactly at the bottom
        setUserHasScrolled(false);
      }
    };
    
    requestAnimationFrame(animateScroll);
  };
  
  // Auto-scroll to the bottom when new messages are added (not during typing)
  useEffect(() => {
    if (messageContainerRef.current) {
      // Only auto-scroll on new messages, not during typing
      if (!isLoading) {
        smoothScrollToBottom(300); // Smooth scroll over 300ms
        setUserHasScrolled(false);
      }
    }
  }, [messages.length, isLoading]); // Trigger on message count change and when loading stops
  
  // Set up a very gentle scroll check during typing - only if user hasn't scrolled
  useEffect(() => {
    // Only auto-scroll when the AI is typing (isLoading is true) and user hasn't scrolled up
    if (!isLoading || userHasScrolled || scrollLocked) return;
    
    // Use a single timeout instead of interval to be less aggressive
    const scrollTimeout = setTimeout(() => {
      if (messageContainerRef.current) {
        const container = messageContainerRef.current;
        // Only scroll if we're already very close to the bottom
        if (container.scrollHeight - container.scrollTop - container.clientHeight < 20) {
          container.scrollTop = container.scrollHeight;
        }
      }
    }, 1000); // Check once per second, much less aggressive
    
    return () => clearTimeout(scrollTimeout);
  }, [isLoading, userHasScrolled, scrollLocked, lastScrollTop]);
  
  // Check if API key is missing or invalid
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_api_key_here') {
      setApiKeyError(true);
    }
  }, []);

  // Boot sequence animation
  useEffect(() => {
    if (bootSequence) {
      const bootLines = [
        'INITIALIZING SYSTEM...',
        'LOADING THOUGHTFUL ENGINE v1.0.0...',
        'CALIBRATING KNOWLEDGE CIRCUITS...',
        'INDEXING FACTS DATABASE...',
        'LOADING THEORIES & PERSPECTIVES...',
        'PREPARING PARADOX COLLECTIONS...',
        'SYSTEM READY: WELCOME TO THOUGHTFUL CONVERSATIONS',
      ];
      
      let currentLine = 0;
      let currentChar = 0;
      const bootTextRef = { current: '' }; // temp ref
      
      const typingInterval = setInterval(() => {
        if (currentLine < bootLines.length) {
          if (currentChar < bootLines[currentLine].length) {
            bootTextRef.current += bootLines[currentLine].charAt(currentChar);
            setBootText(bootTextRef.current);
            currentChar++;
          } else {
            currentLine++;
            currentChar = 0;
            if (currentLine < bootLines.length) {
              bootTextRef.current += '\n';
              setBootText(bootTextRef.current);
            }
          }
        } else {
          clearInterval(typingInterval);
          setTimeout(() => setBootSequence(false), 300);
        }
      }, 15);
      
      return () => clearInterval(typingInterval);
    }
  }, [bootSequence]);
  
  // If there's an API key error, show the error message
  if (apiKeyError) {
    return (
      <ErrorMessage message="AUTHENTICATION ERROR: Please configure your API key." />
    );
  }
  
  // If there's an error from the hook, show it
  if (error) {
    return (
      <ErrorMessage message={`System Error: ${error}`} />
    );
  }

  // Show boot sequence
  if (bootSequence) {
    return (
      <div className="chat-container">
        <pre style={{
          fontFamily: "'Press Start 2P', Courier, monospace",
          color: "#00FF41",
          padding: "1rem",
          whiteSpace: "pre-wrap"
        }}>
          {bootText}<span style={{ animation: "blink 1s infinite" }}>█</span>
        </pre>
      </div>
    );
  }
  
  return (
    <div className="chat-container">
      <header style={{ marginBottom: "1.5rem", marginTop: "0rem" }}>
        <pre 
          className="glitch" 
          data-text=""
          style={{
            color: "#00FF41",
            textAlign: "center",
            fontSize: "0.75rem",
            marginBottom: "0.5rem",
            marginTop: "-1rem" /* Move the ASCII art up */
          }}
        >
{`
    ____  ____  ____  ____  
  ||T ||||H ||||Y ||||N ||
  ||__||||__||||__||||__||
  |/__\\||/__\\||/__\\||/__\\|
`}
        </pre>
        <h1 
          className="glitch" 
          data-text="Thoughtful Conversations"
          style={{
            fontSize: "1.25rem",
            fontFamily: "'Press Start 2P', Courier, monospace",
            textAlign: "center",
            color: "#FF00FF",
            marginBottom: "0.25rem",
            textTransform: "uppercase",
            letterSpacing: "0.2em"
          }}
        >
          Thoughtful Conversations
        </h1>
        <div style={{
          width: "100%",
          borderTop: "1px solid #00FF41",
          marginTop: "1rem",
          opacity: "0.5"
        }}></div>
      </header>
      
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "1rem"
      }}>
        <div style={{
          fontSize: "0.75rem",
          color: "#00FF41",
          fontFamily: "'Press Start 2P', Courier, monospace"
        }}>
          <span style={{ marginRight: "0.5rem" }}>STATUS:</span>
          <span style={{ color: isLoading ? "#FFFF00" : "#00FF41" }}>
            {isLoading ? 'PROCESSING' : 'READY'}
          </span>
        </div>
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "0.5rem" 
                  }}>
          <span style={{
            fontSize: "0.75rem",
            color: "#00FF41",
            fontFamily: "'Press Start 2P', Courier, monospace"
          }}>
            MOOD:
          </span>
          {/* Mood Selector */}
          <MoodSelector 
            currentMood={currentMood} 
            onMoodChange={handleMoodChange} 
          />
        </div>
      </div>
      
      <div 
        className="message-container" 
        ref={messageContainerRef}
        onScroll={handleScroll}
      >
        {messages.map((message, index) => (
          <ChatMessage 
            key={message.id} 
            message={message} 
            glitchEffect={!message.isUser && index % 3 === 0}
          />
        ))}
        
        {isLoading && (
          <div className="bot-message" style={{ width: 'fit-content' }}>
            <TypingIndicator />
          </div>
        )}

      </div>
      
      <ChatInput
        value={inputValue}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
      
      <div style={{
        fontSize: "0.75rem",
        color: "#00FF41",
        opacity: "0.5",
        marginTop: "1rem",
        fontFamily: "'Press Start 2P', Courier, monospace",
        textAlign: "center",
        animation: "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite"
      }}>
        KNOWLEDGE INDEX: {Math.floor(Math.random() * 50) + 50}% CURIOSITY LEVEL: HIGH
      </div>
    </div>
  );
};

export default ParadoxChat;