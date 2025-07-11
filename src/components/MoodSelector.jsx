import React, { useState } from 'react';
import { moods } from '../data/moods';

/**
 * MoodSelector component for selecting different chat moods
 * @param {Object} props - Component props
 * @param {string} props.currentMood - The currently selected mood ID
 * @param {Function} props.onMoodChange - Callback function when mood is changed
 * @returns {JSX.Element} The rendered component
 */
const MoodSelector = ({ currentMood, onMoodChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Find the current mood object
  const currentMoodObj = moods.find(mood => mood.id === currentMood) || moods[0];
  
  // Toggle the dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  // Handle mood selection
  const handleMoodSelect = (moodId) => {
    onMoodChange(moodId);
    setIsOpen(false);
  };
  
  return (
    <div className="mood-selector-container" style={{ position: 'relative' }}>
      {/* Current mood button */}
      <button 
        onClick={toggleDropdown}
        style={{
          backgroundColor: 'transparent',
          border: '1px solid #00FF41',
          borderRadius: '50%',
          width: '2.5rem',
          height: '2.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.25rem',
          color: '#00FF41',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 0 10px rgba(0, 255, 65, 0.5)',
          animation: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }}
        aria-label={`Current mood: ${currentMoodObj.name}`}
      >
        {currentMoodObj.icon}
      </button>
      
      {/* Dropdown menu */}
      {isOpen && (
        <div 
          style={{
            position: 'absolute',
            top: '3rem',
            right: '0',
            backgroundColor: '#121212',
            border: '1px solid #00FF41',
            borderRadius: '0.5rem',
            padding: '0.5rem',
            zIndex: 10,
            width: '12rem',
            boxShadow: '0 0 15px rgba(0, 255, 65, 0.7)'
          }}
        >
          <div style={{
            fontSize: '0.75rem',
            color: '#00FF41',
            fontFamily: "'Press Start 2P', Courier, monospace",
            marginBottom: '0.5rem',
            textAlign: 'center'
          }}>
            SELECT MOOD
          </div>
          
          {moods.map(mood => (
            <button
              key={mood.id}
              onClick={() => handleMoodSelect(mood.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                padding: '0.5rem',
                backgroundColor: mood.id === currentMood ? '#1E3A1E' : 'transparent',
                border: 'none',
                borderRadius: '0.25rem',
                marginBottom: '0.25rem',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
                color: '#00FF41',
                textAlign: 'left',
                fontFamily: "'Press Start 2P', Courier, monospace",
                fontSize: '0.7rem'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#1E3A1E';
              }}
              onMouseOut={(e) => {
                if (mood.id !== currentMood) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <span style={{ marginRight: '0.5rem', fontSize: '1.25rem' }}>{mood.icon}</span>
              {mood.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MoodSelector;