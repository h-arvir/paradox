import React, { useState, useEffect } from 'react';
import { getDepthVisualization } from '../utils/conversationUtils';

/**
 * Component for visualizing the current paradox depth
 * @param {Object} props - Component props
 * @param {number} props.depth - The current conversation depth
 * @returns {JSX.Element} The rendered component
 */
const ParadoxDepthIndicator = ({ depth }) => {
  const [glitchActive, setGlitchActive] = useState(false);
  const depthVisualization = getDepthVisualization(depth);
  
  // Random glitch effect based on depth
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      // Higher depth = more frequent glitches
      const glitchProbability = Math.min(0.1 + (depth * 0.05), 0.5);
      if (Math.random() < glitchProbability) {
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 150);
      }
    }, 2000);
    
    return () => clearInterval(glitchInterval);
  }, [depth]);
  
  // Generate color based on depth
  const getDepthColor = () => {
    if (depth <= 3) return 'text-neonGreen';
    if (depth <= 6) return 'text-yellow-400';
    return 'text-red-500';
  };
  
  // Generate ASCII art based on depth
  const getDepthArt = () => {
    const symbols = ['░', '▒', '▓', '█'];
    let result = '';
    
    for (let i = 0; i < depth; i++) {
      // Use more intense symbols as depth increases
      const symbolIndex = Math.min(Math.floor(i / 3), symbols.length - 1);
      result += symbols[symbolIndex];
    }
    
    return result;
  };
  
  return (
    <div className={`flex items-center text-xs font-terminal ${glitchActive ? 'animate-glitch' : ''}`}>
      <span className="mr-2 uppercase">Paradox Depth:</span>
      <div className="flex items-center">
        <span className={`font-mono ${getDepthColor()}`}>{depthVisualization}</span>
        <span className="ml-2 font-mono">{getDepthArt()}</span>
        
        {/* Warning indicator for high depths */}
        {depth > 5 && (
          <span className={`ml-2 ${depth > 8 ? 'text-red-500 animate-pulse-slow' : 'text-yellow-400'}`}>
            {depth > 8 ? '!DANGER!' : 'WARNING'}
          </span>
        )}
      </div>
    </div>
  );
};

export default ParadoxDepthIndicator;