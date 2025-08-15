# Thoughtful Chat

An AI-powered conversation companion designed for introverts and deep thinkers. Experience meaningful conversations with different AI personalities and moods, all wrapped in a retro-futuristic cyberpunk terminal aesthetic.

## Project Overview

Thoughtful Chat is a sophisticated conversational AI application that creates the kind of intimate, intellectually stimulating conversations that introverts cherish. The AI companion adapts to different moods and conversation styles, providing a personalized experience for users seeking meaningful dialogue.

## Features

### Core Conversation System
- **Multi-Mood AI Personalities**: Switch between different conversation styles (Default, Debate, Conspiracy, Dad Jokes, Mehfil)
- **Intelligent Context Awareness**: Maintains conversation history and context across exchanges
- **Escape Detection**: Thoughtful handling of conversation endings with appropriate farewells
- **Retry Mechanism**: Automatic retry system for handling API overload gracefully

### User Experience
- **Cyberpunk Terminal Aesthetic**: Retro-futuristic UI with matrix-style green text and glitch effects
- **Typewriter Effects**: Progressive text reveal with authentic terminal typing animations
- **Smooth Auto-Scrolling**: Intelligent scroll management that respects user interaction
- **Loading States**: Engaging boot sequence and typing indicators
- **Responsive Input**: Real-time input handling with custom terminal-style cursor

### Technical Features
- **React 19 Architecture**: Modern React with hooks and functional components
- **Real-time AI Integration**: Powered by Google's Gemini 1.5 Flash model
- **Smart Message Management**: Optimized conversation history to prevent token overflow
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Performance Optimized**: Efficient rendering and state management
- **🆕 User-Configurable API Keys**: In-app API key management with secure local storage

## Technologies Used

### Frontend Framework
- **React 19**: Latest React with improved hooks and concurrent features
- **Vite 7**: Fast build tool with hot module replacement
- **Tailwind CSS 4**: Utility-first CSS framework for rapid styling

### AI Integration
- **Google Generative AI (Gemini 1.5 Flash)**: Advanced language model for conversation generation
- **Custom AI Service Layer**: Optimized integration with conversation context management

### Development Tools
- **ESLint**: Code linting and formatting
- **PostCSS**: CSS preprocessing and optimization
- **Axios**: HTTP client for API requests

### Styling & Animation
- **Press Start 2P Font**: Retro pixel font for authentic terminal feel
- **Custom CSS Animations**: Glitch effects, scanlines, and typewriter animations
- **Responsive Design**: Optimized for different screen sizes

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- A Gemini API key from Google AI Studio (can be configured in-app)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/paradox.git
   cd paradox
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

5. **Configure your API key** (choose one option):
   - **Option A**: Use the in-app configuration (recommended)
   - **Option B**: Set up environment variable (for developers)

## API Key Configuration

### 🆕 Option A: In-App Configuration (Recommended)

The application now features a user-friendly API key management system:

1. **First Launch**: If no API key is configured, you'll see a setup screen
2. **Get Your Key**: Visit [Google AI Studio](https://ai.google.dev) to get a free API key
3. **Configure**: Click "CONFIGURE API KEY" and enter your key
4. **Manage**: Access API settings anytime via the "API" button in the top-right corner

**Features:**
- ✅ Real-time API key validation
- ✅ Secure local storage (never sent to our servers)
- ✅ Switch between personal and default keys
- ✅ User-friendly error handling
- ✅ No technical setup required

### Option B: Environment Variable (For Developers)

Create a `.env` file in the root directory:
```bash
VITE_GEMINI_API_KEY=your_api_key_here
```

### Getting Your Gemini API Key

1. Visit [Google AI Studio](https://ai.google.dev)
2. Sign in with your Google account
3. Navigate to "Get API key"
4. Create a new API key
5. Copy the key (starts with "AIzaSy...")
6. Use it in the application

**Privacy Note:** Your API key is stored locally in your browser and never transmitted to our servers.

## How It Works

### Conversation Flow
1. User selects a mood/personality for the AI
2. System initializes a chat session with the selected mood's system instructions
3. User sends messages through the terminal-style interface
4. AI generates contextually appropriate responses based on the selected mood
5. Conversation history is maintained with smart context management
6. Escape detection provides thoughtful farewell messages

### AI Mood System
- **Default**: Thoughtful conversation companion for deep discussions
- **Debate**: Socratic dialogue partner for intellectual challenges
- **Conspiracy**: Creative conspiracy theorist with wild theories
- **Dad Jokes**: Pun-loving comedian with wholesome humor
- **Mehfil**: Poetic and romantic soul with Hindi-Urdu expressions

## Project Structure

```
src/
├── components/          # React UI components
│   ├── ParadoxChat.jsx  # Main chat interface
│   ├── ChatMessage.jsx  # Individual message component
│   ├── ChatInput.jsx    # Input handling with terminal styling
│   ├── MoodSelector.jsx # AI personality selector
│   ├── ApiKeySettings.jsx # 🆕 API key management
│   └── ...
├── services/           # AI integration services
│   └── aiService.js    # Gemini API integration with key management
├── hooks/             # Custom React hooks
│   └── useDeepChat.js # Main chat state management
├── data/              # Configuration and mood data
│   ├── moods.js       # AI personality definitions
│   └── ...
├── utils/             # Utility functions
│   └── conversationUtils.js
└── ...
```

## Future Improvements

### Enhanced AI Features
- **Memory System**: Implement persistent conversation memory across sessions
- **Emotional Intelligence**: Add sentiment analysis for more empathetic responses
- **Custom Mood Creation**: Allow users to create and customize their own AI personalities
- **Multi-Language Support**: Expand beyond English with native language moods

### User Experience Enhancements
- **Voice Integration**: Add speech-to-text and text-to-speech capabilities
- **Conversation Export**: Allow users to save and share meaningful conversations
- **Themes**: Multiple visual themes beyond the cyberpunk aesthetic
- **Conversation Analytics**: Insights into conversation patterns and topics

### Technical Improvements
- **Offline Mode**: Cache conversations for offline access
- **Real-time Collaboration**: Multiple users in the same conversation
- **Performance Optimization**: Further optimize for mobile devices
- **Advanced Error Recovery**: More robust error handling and recovery mechanisms

### Social Features
- **Conversation Sharing**: Share interesting conversations with the community
- **Mood Marketplace**: Community-created AI personalities
- **Discussion Forums**: Platform for users to discuss AI conversations

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by the need for meaningful digital conversations
- Built with the power of modern AI language models
- Cyberpunk aesthetic inspired by terminal culture and retro-futurism
- Special thanks to the open-source community for the amazing tools and libraries