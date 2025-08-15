import React, { useState, useEffect } from 'react';

/**
 * Component for managing API key settings
 * @param {Object} props - Component props
 * @param {Function} props.onApiKeySet - Callback when API key is set
 * @param {Function} props.onClose - Callback to close the settings
 * @returns {JSX.Element} The rendered component
 */
const ApiKeySettings = ({ onApiKeySet, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [showKey, setShowKey] = useState(false);

  // Load existing API key from localStorage on mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('gemini_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  // Handle ESC key to close
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose]);

  const validateApiKey = async (key) => {
    if (!key || key.trim() === '') {
      throw new Error('API key cannot be empty');
    }

    if (!key.startsWith('AIzaSy')) {
      throw new Error('Invalid API key format. Gemini API keys should start with "AIzaSy"');
    }

    // Test the API key by making a simple request
    try {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(key);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      await model.generateContent('Test');
      return true;
    } catch (error) {
      if (error.message.includes('API key')) {
        throw new Error('Invalid API key. Please check your Gemini API key.');
      }
      throw new Error('Failed to validate API key. Please try again.');
    }
  };

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
      setValidationError('Please enter an API key');
      return;
    }

    setIsValidating(true);
    setValidationError('');

    try {
      await validateApiKey(apiKey.trim());
      
      // Save to localStorage
      localStorage.setItem('gemini_api_key', apiKey.trim());
      
      // Notify parent component
      onApiKeySet(apiKey.trim());
      
      // Close the settings
      onClose();
    } catch (error) {
      setValidationError(error.message);
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemoveApiKey = () => {
    localStorage.removeItem('gemini_api_key');
    setApiKey('');
    setValidationError('');
  };

  const handleUseDefaultKey = () => {
    const defaultKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (defaultKey && defaultKey !== 'your_api_key_here') {
      localStorage.removeItem('gemini_api_key');
      onApiKeySet(null); // Use default key
      onClose();
    } else {
      setValidationError('No default API key is configured');
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black z-50 flex flex-col relative"
      style={{
        width: "100vw",
        height: "100vh",
        fontFamily: "'Press Start 2P', Courier, monospace",
        backgroundColor: "#000000",
        padding: "2rem",
        boxSizing: "border-box"
      }}
    >
      {/* Close Button - Top Right Corner */}
      <div 
        className="absolute z-20"
        style={{
          top: "1rem",
          right: "1rem"
        }}
      >
        <button
          onClick={onClose}
          className="text-green-400 hover:text-red-400 border-2 border-green-400 hover:border-red-400"
          style={{
            fontSize: "1.5rem",
            fontFamily: "'Press Start 2P', Courier, monospace",
            backgroundColor: "#000000",
            cursor: "pointer",
            minWidth: "4rem",
            minHeight: "4rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0.5rem"
          }}
          title="Close API Settings (ESC)"
        >
          ×
        </button>
      </div>

      {/* Header */}
      <div className="flex justify-center items-center mb-8">
        <div className="text-center">
          <pre 
            className="glitch text-green-400 mb-4"
            data-text=""
            style={{
              fontSize: "0.9rem",
              lineHeight: "1.2",
              marginBottom:40
            }}
          >
{`
    ____  ____  ____      ____  ____  ____  ____  ____  ____  ____  ____  
  ||A ||||P ||||I ||    ||S ||||E ||||T ||||T ||||I ||||N ||||G ||||S ||
  ||__||||__||||__||    ||__||||__||||__||||__||||__||||__||||__||||__||
  |/__\\||/__\\||/__\\|    |/__\\||/__\\||/__\\||/__\\||/__\\||/__\\||/__\\||/__\\|
`}
          </pre>
          {/* <h2 
            className="text-green-400 font-bold glitch"
            data-text="GEMINI API KEY CONFIGURATION"
            style={{
              fontSize: "1.1rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "1rem"
            }}
          >
            GEMINI API KEY CONFIGURATION
          </h2>
          <div 
            style={{
              width: "100%",
              borderTop: "2px solid #00FF41",
              opacity: "0.7"
            }}
          ></div> */}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-0">
        {/* Left Column - API Key Input */}
        <div className="flex flex-col space-y-6">
          <div className="flex-1">
            <h3 
              className="text-green-400 mb-4 text-center"
              style={{
                fontSize: "0.9rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em"
              }}
            >
              ENTER YOUR API KEY:
            </h3>
            <div className="relative mb-4">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                disabled={isValidating}
                style={{
                  width: "98%",
                  backgroundColor: "#000000",
                  border: "2px solid #00FF41",
                  color: "#00FF41",
                  padding: "1rem",
                  fontSize: "0.8rem",
                  fontFamily: "'Press Start 2P', Courier, monospace",
                  outline: "none",
                  minHeight: "3rem"
                }}
                className="focus:border-green-300"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                style={{
                  position: "absolute",
                  right: "0.75rem",
                  top: "1rem",
                  color: "#00FF41",
                  fontSize: "0.7rem",
                  fontFamily: "'Press Start 2P', Courier, monospace",
                  background: "none",
                  border: "1px solid #00FF41",
                  padding: "0.25rem 0.5rem",
                  cursor: "pointer"
                }}
                className="hover:text-green-300 hover:border-green-300"
              >
                {showKey ? 'HIDE' : 'SHOW'}
              </button>
            </div>

            {validationError && (
              <div 
                className="mb-4 p-3 border-2 border-red-400 text-red-400"
                style={{
                  backgroundColor: "#000000",
                  fontSize: "0.7rem",
                  lineHeight: "1.4"
                }}
              >
                <div style={{ color: "#FF0000", marginBottom: "0.5rem", fontSize: "0.8rem" }}>
                  ⚠ ERROR:
                </div>
                {validationError}
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleSaveApiKey}
                disabled={isValidating || !apiKey.trim()}
                style={{
                  width: "100%",
                  backgroundColor: isValidating || !apiKey.trim() ? "#333333" : "#00FF41",
                  color: isValidating || !apiKey.trim() ? "#666666" : "#000000",
                  border: "2px solid #00FF41",
                  padding: "1rem",
                  fontSize: "0.8rem",
                  fontFamily: "'Press Start 2P', Courier, monospace",
                  cursor: isValidating || !apiKey.trim() ? "not-allowed" : "pointer",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  minHeight: "3rem"
                }}
                className="hover:bg-green-300 disabled:hover:bg-gray-600"
              >
                {isValidating ? 'VALIDATING...' : 'SAVE & VALIDATE'}
              </button>

              {apiKey && (
                <button
                  onClick={handleRemoveApiKey}
                  style={{
                    width: "100%",
                    backgroundColor: "#000000",
                    color: "#FF0000",
                    border: "2px solid #FF0000",
                    padding: "1rem",
                    fontSize: "0.8rem",
                    fontFamily: "'Press Start 2P', Courier, monospace",
                    cursor: "pointer",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    minHeight: "3rem"
                  }}
                  className="hover:bg-red-900"
                >
                  REMOVE API KEY
                </button>
              )}

              <button
                onClick={handleUseDefaultKey}
                style={{
                  width: "100%",
                  backgroundColor: "#000000",
                  color: "#0099FF",
                  border: "2px solid #0099FF",
                  padding: "1rem",
                  fontSize: "0.8rem",
                  fontFamily: "'Press Start 2P', Courier, monospace",
                  cursor: "pointer",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  minHeight: "3rem"
                }}
                className="hover:bg-blue-900"
              >
                USE DEFAULT KEY
              </button>

              {/* Additional Close Button */}
              <button
                onClick={onClose}
                style={{
                  width: "100%",
                  backgroundColor: "#000000",
                  color: "#FFFF00",
                  border: "2px solid #FFFF00",
                  padding: "1rem",
                  fontSize: "0.8rem",
                  fontFamily: "'Press Start 2P', Courier, monospace",
                  cursor: "pointer",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  minHeight: "3rem"
                }}
                className="hover:bg-yellow-900"
              >
                CLOSE SETTINGS
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Instructions */}
        <div className="flex flex-col space-y-6 overflow-y-auto">
          <div>
            <h3 
              className="text-green-400 mb-4"
              style={{
                fontSize: "0.9rem",
                textTransform: "uppercase",
                marginTop:30, 
                letterSpacing: "0.1em"
              }}
            >
              HOW TO GET YOUR API KEY:
            </h3>
            
            <div 
              className="border-2 border-green-400 p-4 mb-6"
              style={{
                backgroundColor: "#000000",
                fontSize: "0.7rem",
                lineHeight: "1.6"
              }}
            >
              <ol className="space-y-3">
                <li className="flex items-start">
                  <span className="text-green-300 mr-3 font-bold">1.</span>
                  <div>
                    <span className="text-green-400">Visit </span>
                    <span style={{ color: "#00FFFF", textDecoration: "underline" }}>
                      https://ai.google.dev
                    </span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-green-300 mr-3 font-bold">2.</span>
                  <span className="text-green-400">Sign in with your Google account</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-300 mr-3 font-bold">3.</span>
                  <span className="text-green-400">Navigate to "Get API key" section</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-300 mr-3 font-bold">4.</span>
                  <span className="text-green-400">Create a new API key for your project</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-300 mr-3 font-bold">5.</span>
                  <span className="text-green-400">Copy the key (starts with "AIzaSy...")</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-300 mr-3 font-bold">6.</span>
                  <span className="text-green-400">Paste it in the input field</span>
                </li>
              </ol>
            </div>

            <div 
              className="border-2 border-yellow-400 p-4"
              style={{
                backgroundColor: "#000000",
                fontSize: "0.65rem",
                lineHeight: "1.5"
              }}
            >
              {/* <div style={{ color: "#FFFF00", marginBottom: "0.75rem", fontSize: "0.75rem" }}>
                🔒 PRIVACY & SECURITY:
              </div>
              <ul className="space-y-1 text-yellow-300">
                <li>• Your API key is stored locally in your browser</li>
                <li>• It never gets transmitted to our servers</li>
                <li>• You maintain full control over your API usage</li>
                <li>• You can remove or change it anytime</li>
                <li>• All API calls go directly to Google's servers</li>
              </ul> */}
            </div>
          </div>
        </div>
      </div>

      {/* Footer with Close Hint */}
      <div 
        className=" text-center"
        style={{
          fontSize: "0.7rem",
          color: "#FFFF00",
          marginBottom: 300, 
          marginTop:70, 
          opacity: "0.9"
        }}
      >
        <span className="animate-pulse">PRESS ESC KEY OR CLICK THE × BUTTON TO CLOSE</span>
      </div>
    </div>
  );
};

export default ApiKeySettings;