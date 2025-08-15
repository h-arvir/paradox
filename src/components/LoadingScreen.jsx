import React from 'react';

/**
 * Component for displaying a loading screen
 * @returns {JSX.Element} The rendered component
 */
const LoadingScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-paradox-dark text-paradox-light">
      <h1 className="text-3xl font-bold text-paradox-accent mb-4">
        The Infinite Paradox
      </h1>
      
      <div className="flex space-x-2 mb-4">
        <div 
          className="w-3 h-3 rounded-full bg-paradox-primary" 
          style={{ 
            animationDelay: '0ms',
            animation: 'pulse 0.25s cubic-bezier(0.4, 0, 0.6, 1) infinite'
          }}
        ></div>
        <div 
          className="w-3 h-3 rounded-full bg-paradox-secondary" 
          style={{ 
            animationDelay: '50ms',
            animation: 'pulse 0.25s cubic-bezier(0.4, 0, 0.6, 1) infinite'
          }}
        ></div>
        <div 
          className="w-3 h-3 rounded-full bg-paradox-accent" 
          style={{ 
            animationDelay: '100ms',
            animation: 'pulse 0.25s cubic-bezier(0.4, 0, 0.6, 1) infinite'
          }}
        ></div>
      </div>
      
      <p className="text-gray-400 text-center max-w-md">
        Initializing paradoxical thinking patterns...
      </p>
    </div>
  );
};

export default LoadingScreen;

