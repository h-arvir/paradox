/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paradox: {
          light: '#f0f4f8',
          dark: '#000000', // Black background
          primary: '#00FF41', // Matrix green
          secondary: '#FF00FF', // Bright magenta
          accent: '#FFFF00', // Grim yellow
        },
        neonGreen: '#00FF41',
      },
      fontFamily: {
        'terminal': ['"Press Start 2P"', 'Courier', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glitch': 'glitch 1s infinite linear alternate-reverse',
        'blink': 'blink 1s infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        glitch: {
          '0%': { 
            clip: 'rect(42px, 9999px, 44px, 0)',
            transform: 'skew(0.3deg)'
          },
          '5%': { 
            clip: 'rect(12px, 9999px, 15px, 0)',
            transform: 'skew(0.5deg)'
          },
          '10%': { 
            clip: 'rect(85px, 9999px, 90px, 0)',
            transform: 'skew(0.3deg)'
          },
          '15%': { 
            clip: 'rect(50px, 9999px, 53px, 0)',
            transform: 'skew(0.5deg)'
          },
          '20%': { 
            clip: 'rect(100px, 9999px, 105px, 0)',
            transform: 'skew(0.3deg)'
          },
          '100%': { 
            clip: 'rect(42px, 9999px, 44px, 0)',
            transform: 'skew(0.3deg)'
          }
        },
        blink: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' }
        },
        scanline: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(100vh)' }
        }
      }
    },
  },
  plugins: [],
}

