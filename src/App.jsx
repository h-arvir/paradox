import React, { useState, useEffect } from 'react';
import ThoughtfulChat from './components/ParadoxChat';
import LoadingScreen from './components/LoadingScreen';
import './App.css';

/**
 * Main App component
 * @returns {JSX.Element} The rendered application
 */
function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading time to enhance user experience
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Almost instant - boot sequence appears for just 100ms

    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className="min-h-screen text-paradox-light"
      style={{
        backgroundColor: "#000000",
        minHeight: "100vh"
      }}
    >
      {isLoading ? <LoadingScreen /> : <ThoughtfulChat />}
    </div>
  );
}

export default App;