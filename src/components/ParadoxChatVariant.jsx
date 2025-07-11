import React, { useRef, useEffect, useState } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';

import ErrorMessage from './ErrorMessage';
import useDeepChat from '../hooks/useDeepChat';

/**
 * Main component for the Paradox Chat interface
 * @returns {JSX.Element} The rendered component
 */
const ParadoxChatVariant = () => {
  const [apiKeyError, setApiKeyError] = useState(false);
  const [bootSequence, setBootSequence] = useState(true);
  const [bootText, setBootText] = useState('');
  
  const { 
    messages, 
    inputValue, 
    isLoading, 
    handleInputChange, 
    handleSubmit,
    error
  } = useDeepChat({ variant: 'paradox' });
  
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
        'LOADING PARADOX ENGINE v1.0.0...',
        'CALIBRATING KNOWLEDGE CIRCUITS...',
        'INDEXING FACTS DATABASE...',
        'LOADING THEORIES & PERSPECTIVES...',
        'PREPARING PARADOX COLLECTIONS...',
        'SYSTEM READY: WELCOME TO PARADOX CONVERSATIONS',
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
      <header style={{ marginBottom: "1.5rem", marginTop: "0.5rem" }}>
        <pre 
          className="glitch" 
          data-text="PARADOX CHAT"
          style={{
            color: "#00FF41",
            textAlign: "center",
            fontSize: "0.75rem",
            marginBottom: "0.5rem"
          }}
        >
{`
   ____  ____  ____  ____  ____ 
  ||P ||||A ||||R ||||A ||||D ||
  ||__||||__||||__||||__||||__||
  |/__\\||/__\\||/__\\||/__\\||/__\\|
`}
        </pre>
        <h1 
          className="glitch" 
          data-text="PARADOX CONVERSATIONS"
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
          PARADOX CONVERSATIONS
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
        justifyContent: "flex-start",
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
        KNOWLEDGE INDEX: {Math.floor(Math.random() * 50) + 50}% CURIOSITY LEVEL: HIGH
      </div>
    </div>
  );
};

export default ParadoxChatVariant;