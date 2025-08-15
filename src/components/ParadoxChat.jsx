import React, { useRef, useEffect, useState } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';
import MoodSelector from './MoodSelector';
import ApiKeySettings from './ApiKeySettings';
import ErrorMessage from './ErrorMessage';
import useDeepChat from '../hooks/useDeepChat';
import { hasValidApiKey, refreshApiKey } from '../services/aiService';

/**
 * Main component for the Thoughtful Chat interface
 * @returns {JSX.Element} The rendered component
 */
const ParadoxChat = () => {
  const [apiKeyError, setApiKeyError] = useState(false);
  const [showApiKeySettings, setShowApiKeySettings] = useState(false);
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
  
  // Enhanced submit handler that includes immediate scroll
  const handleSubmitWithScroll = (e) => {
    handleSubmit(e);
    // Immediately scroll to bottom when user submits a message
    setTimeout(() => {
      smoothScrollToBottom(200);
    }, 50); // Small delay to ensure the message is added to DOM
  };
  
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
    if (!hasValidApiKey()) {
      setApiKeyError(true);
    }
  }, []);

  // Handle API key set
  const handleApiKeySet = (newApiKey) => {
    refreshApiKey();
    setApiKeyError(false);
    setShowApiKeySettings(false);
  };

  // Handle opening API key settings
  const handleOpenApiKeySettings = () => {
    setShowApiKeySettings(true);
  };

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
  
  // If there's an API key error, show the API key settings
  if (apiKeyError && !showApiKeySettings) {
    return (
      <div className="chat-container">
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
          <div className="mb-8">
            <pre 
              className="glitch" 
              data-text=""
              style={{
                color: "#00FF41",
                textAlign: "center",
                fontSize: "0.75rem",
                marginBottom: "0.5rem"
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
              data-text="API Key Required"
              style={{
                fontSize: "1.25rem",
                fontFamily: "'Press Start 2P', Courier, monospace",
                textAlign: "center",
                color: "#FF00FF",
                marginBottom: "1rem",
                textTransform: "uppercase",
                letterSpacing: "0.2em"
              }}
            >
              API Key Required
            </h1>
          </div>
          
          <div className="bg-gray-900 border-2 border-red-400 p-6 max-w-md mx-4 font-mono">
            <div className="text-red-400 mb-4">
              <p className="text-sm mb-2">AUTHENTICATION ERROR</p>
              <p className="text-xs mb-4">
                No valid Gemini API key found. You need to configure an API key to use this application.
              </p>
            </div>
            
            <button
              onClick={handleOpenApiKeySettings}
              className="w-full bg-green-400 text-black px-4 py-2 text-sm font-bold hover:bg-green-300 mb-2"
            >
              CONFIGURE API KEY
            </button>
            
            <div className="text-green-400 text-xs mt-4">
              <p className="mb-2">
                <strong>Get your free API key:</strong>
              </p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Visit <span className="text-green-300">ai.google.dev</span></li>
                <li>Sign in with Google</li>
                <li>Create a new API key</li>
                <li>Click "Configure API Key" above</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
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
      {showApiKeySettings && (
        <ApiKeySettings
          onApiKeySet={handleApiKeySet}
          onClose={() => setShowApiKeySettings(false)}
        />
      )}
      
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
          <button
            onClick={handleOpenApiKeySettings}
            style={{
              fontSize: "0.6rem",
              color: "#00FF41",
              fontFamily: "'Press Start 2P', Courier, monospace",
              background: "none",
              border: "1px solid #00FF41",
              padding: "0.25rem 0.5rem",
              cursor: "pointer",
              marginRight: "0.5rem"
            }}
            className="hover:bg-green-400 hover:text-black"
          >
            API
          </button>
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
        onSubmit={handleSubmitWithScroll}
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