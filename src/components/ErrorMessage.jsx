import React, { useState, useEffect } from 'react';

/**
 * Component for displaying error messages
 * @param {Object} props - Component props
 * @param {string} props.message - The error message to display
 * @returns {JSX.Element} The rendered component
 */
const ErrorMessage = ({ message }) => {
  const [glitchActive, setGlitchActive] = useState(false);
  
  // Random glitch effect
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 2000);
    
    return () => clearInterval(glitchInterval);
  }, []);
  
  return (
    <div className="w-full h-screen bg-black flex flex-col items-center justify-center p-4 font-terminal">
      <div className={`border border-red-500 p-6 max-w-md mx-auto ${glitchActive ? 'animate-glitch' : ''}`}>
        <pre className="text-red-500 mb-4 text-center">
{`
  _____                    
 | ____|_ __ _ __ ___  _ __ 
 |  _| | '__| '__/ _ \\| '__|
 | |___| |  | | | (_) | |   
 |_____|_|  |_|  \\___/|_|   
`}
        </pre>
        
        <h2 className="text-xl text-red-500 mb-4 uppercase tracking-widest text-center">System Failure</h2>
        
        <div className="bg-black border border-red-500 p-4 mb-4">
          <p className="text-red-500 font-terminal text-sm mb-2">ERROR CODE: {Math.floor(Math.random() * 9000) + 1000}</p>
          <p className="text-neonGreen font-terminal text-sm">{message}</p>
        </div>
        
        <div className="text-paradox-secondary text-xs">
          <p className="mb-2 uppercase">Diagnostic Information:</p>
          <div className="border border-paradox-secondary p-2 mb-4">
            <p className="mb-1">{'>'} Memory corruption detected</p>
            <p className="mb-1">{'>'} Logic circuits compromised</p>
            <p className="mb-1">{'>'} Reality buffer overflow</p>
            <p>{'>'} Paradox engine failure</p>
          </div>
          
          <p className="uppercase mb-2">Possible Solutions:</p>
          <ul className="border border-paradox-secondary p-2">
            <li className="mb-1">{'>'} Check API key configuration</li>
            <li className="mb-1">{'>'} Verify network connectivity</li>
            <li className="mb-1">{'>'} Recalibrate reality filters</li>
            <li>{'>'} Reboot system</li>
          </ul>
        </div>
      </div>
      
      {/* Scanline effect */}
      <div 
        className="fixed top-0 left-0 w-full h-screen pointer-events-none"
        style={{
          background: 'repeating-linear-gradient(0deg, rgba(255, 0, 0, 0.1), rgba(255, 0, 0, 0.1) 1px, transparent 1px, transparent 2px)',
          animation: 'scanline 10s linear infinite',
          zIndex: 50
        }}
      ></div>
      
      {/* Random glitch elements */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div 
          key={i}
          className="fixed bg-red-500 opacity-20"
          style={{
            top: `${Math.random() * 100}vh`,
            left: `${Math.random() * 100}vw`,
            width: `${Math.random() * 100 + 50}px`,
            height: `${Math.random() * 5 + 1}px`,
            animation: `glitch ${Math.random() * 2 + 0.5}s infinite alternate-reverse`
          }}
        ></div>
      ))}
    </div>
  );
};

export default ErrorMessage;