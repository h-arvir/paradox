# The Infinite Paradox Chat

An AI chatbot that tries to trap you in paradox loops. You talk to it — it answers only in paradoxes, logical traps, or questions that contradict themselves. You can't "win" — you just spiral deeper. If you quit, it mocks you for escaping the loop.

## Project Overview

The Infinite Paradox Chat is a mind-bending experience that challenges users' understanding of language and logic. The bot exclusively responds with paradoxes, logical traps, and self-contradicting questions, creating an endless loop of logical impossibilities.

## Features

- AI-powered paradoxical responses using Gemini 2.0 Flash
- Conversation depth tracking that increases paradox complexity over time
- Escape detection that mocks users for trying to leave
- Minimalist UI that contrasts with the complex nature of the conversations
- Visual indicators of paradox depth

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- A Gemini API key from Google AI Studio

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/paradox.git
   cd paradox
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add your Gemini API key:
   ```
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## How It Works

1. The user sends a message to the chatbot
2. The system analyzes the message and current conversation depth
3. The AI generates a paradoxical response based on the context
4. The conversation depth increases as the user engages more
5. If the user tries to escape, the system detects it and responds mockingly

## Project Structure

- `/src/components` - React components for the UI
- `/src/services` - Services for AI integration
- `/src/hooks` - Custom React hooks
- `/src/utils` - Utility functions
- `/src/data` - Paradox database and related data

## Technologies Used

- React.js
- Vite
- Tailwind CSS
- Google Generative AI (Gemini)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by philosophical paradoxes and logical puzzles
- Built with the power of modern AI language models
