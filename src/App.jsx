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
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="min-h-screen bg-paradox-dark text-paradox-light">
      {isLoading ? <LoadingScreen /> : <ThoughtfulChat />}
    </div>
  );
}

export default App;
