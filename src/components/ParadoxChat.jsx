import React, { useRef, useEffect, useState } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';
import ParadoxDepthIndicator from './ParadoxDepthIndicator';
import ErrorMessage from './ErrorMessage';
import useParadoxChat from '../hooks/useParadoxChat';

/**
 * Main component for the Paradox Chat interface
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
    conversationDepth,
    handleInputChange, 
    handleSubmit,
    error
  } = useParadoxChat();
  
  // Reference to the message container for auto-scrolling
  const messageContainerRef = useRef(null);
  
  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);
  
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
        'LOADING PARADOX ENGINE v0.9.7...',
        'CALIBRATING LOGIC CIRCUITS...',
        'WARNING: REALITY DISTORTION DETECTED',
        'BYPASSING SANITY CHECKS...',
        'DISABLING COHERENCE FILTERS...',
        'SYSTEM READY: WELCOME TO THE INFINITE PARADOX',
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
          setTimeout(() => setBootSequence(false), 800);
        }
      }, 40);
      
      return () => clearInterval(typingInterval);
    }
  }, [bootSequence]);
  
  // If there's an API key error, show the error message
  if (apiKeyError) {
    return (
      <ErrorMessage message="FATAL ERROR: AUTHENTICATION FAILURE. SYSTEM COMPROMISED." />
    );
  }
  
  // If there's an error from the hook, show it
  if (error) {
    return (
      <ErrorMessage message={`SYSTEM MALFUNCTION: ${error.toUpperCase()}`} />
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
      <header style={{ marginBottom: "1.5rem", marginTop: "0.5rem" }}>
        <pre 
          className="glitch" 
          data-text="INFINITE PARADOX"
          style={{
            color: "#00FF41",
            textAlign: "center",
            fontSize: "0.75rem",
            marginBottom: "0.5rem"
          }}
        >
{`
   ____  ____  ____  ____  ____ 
  ||I ||||N ||||F ||||I ||||N ||
  ||__||||__||||__||||__||||__||
  |/__\\||/__\\||/__\\||/__\\||/__\\|
`}
        </pre>
        <h1 
          className="glitch" 
          data-text="THE INFINITE PARADOX"
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
          THE INFINITE PARADOX
        </h1>
        {/* <p style={{
          fontSize: "0.75rem",
          textAlign: "center",
          color: "#00FF41",
          opacity: "0.7",
          marginTop: "0.5rem",
          fontFamily: "'Press Start 2P', Courier, monospace"
        }}>
          Where logic loops and reason unravels
        </p> */}
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
        <ParadoxDepthIndicator depth={conversationDepth} />
      </div>
      
      <div className="message-container" ref={messageContainerRef}>
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
        SYSTEM UNSTABLE - REALITY DISTORTION AT {Math.floor(Math.random() * 80) + 20}%
      </div>
    </div>
  );
};

export default ParadoxChat;