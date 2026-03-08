# Quantum AI Backend

A powerful Node.js backend API that integrates multiple AI providers including OpenAI, Gemini, Groq, Hugging Face, and Ollama Free API.

## Features

- 🤖 **Multiple AI Providers**: OpenAI, Gemini, Groq, Hugging Face
- 🦙 **Ollama Free API**: Access to 650+ free models including LLaMA, Mistral, DeepSeek, Qwen
- 🔒 **Security**: Rate limiting, CORS, Helmet security headers
- 📡 **WebSocket Support**: Real-time communication
- 🚀 **High Performance**: Express.js with optimized routing
- 📊 **Health Monitoring**: System health and status endpoints

## Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Setup
The `.env` file is already configured with your API keys:
- OpenAI API Key
- Gemini API Key  
- Groq API Key
- Hugging Face API Key

### 3. Start the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3001`

## API Endpoints

### Health Check
- `GET /api/health` - Basic health check
- `GET /api/health/system` - Detailed system information

### AI Providers
- `POST /api/ai/openai/chat` - OpenAI chat completion
- `POST /api/ai/gemini/chat` - Google Gemini chat
- `POST /api/ai/groq/chat` - Groq chat completion
- `POST /api/ai/huggingface/inference` - Hugging Face inference
- `GET /api/ai/models` - List available models for all providers

### Ollama Free API
- `GET /api/ollama/families` - List model families
- `GET /api/ollama/models` - List all models (optional ?family=llama filter)
- `GET /api/ollama/models/:modelName` - Get model information
- `GET /api/ollama/models/:modelName/servers` - Get available servers for model
- `POST /api/ollama/chat` - Chat with Ollama models
- `GET /api/ollama/status` - API status and statistics

## Usage Examples

### OpenAI Chat
```javascript
const response = await fetch('http://localhost:3001/api/ai/openai/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [
      { role: 'user', content: 'Hello, how are you?' }
    ],
    model: 'gpt-3.5-turbo'
  })
});
```

### Ollama Free Chat
```javascript
const response = await fetch('http://localhost:3001/api/ollama/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: 'Explain quantum computing',
    model: 'llama3.2:latest', // Optional - auto-selects if not provided
    options: {
      temperature: 0.7,
      max_tokens: 500
    }
  })
});
```

### List Available Ollama Models
```javascript
const response = await fetch('http://localhost:3001/api/ollama/models');
const data = await response.json();
console.log(data.models); // Array of available models
```

## Available Ollama Models

The backend includes access to 650+ free models across 6 families:
- **LLaMA**: Meta's foundation models (llama3.2:latest, etc.)
- **Mistral**: High-performance models (mistral:latest, etc.)
- **DeepSeek**: Reasoning-focused models (deepseek-r1:7b, etc.)
- **Qwen**: Alibaba's multilingual models (qwen2.5:7b-instruct, etc.)
- **Gemma**: Google's efficient models (gemma3:4b, etc.)
- **Others**: Additional specialized models (openchat:latest, etc.)

## WebSocket Support

Connect to `ws://localhost:3001` for real-time communication:

```javascript
const ws = new WebSocket('ws://localhost:3001');
ws.onopen = () => {
  ws.send(JSON.stringify({ message: 'Hello WebSocket!' }));
};
```

## Configuration

### Environment Variables
- `PORT`: Server port (default: 3001)
- `NODE_ENV`: Environment mode (development/production)
- `CORS_ORIGIN`: Allowed CORS origin (default: http://localhost:5173)
- `RATE_LIMIT_WINDOW_MS`: Rate limit window in milliseconds
- `RATE_LIMIT_MAX_REQUESTS`: Max requests per window

### Security Features
- Rate limiting (100 requests per 15 minutes by default)
- CORS protection
- Helmet security headers
- Request size limits (10MB)

## Development

```bash
# Install dependencies
npm install

# Start development server with auto-reload
npm run dev

# Run tests
npm test
```

## Architecture

```
backend/
├── server.js              # Main server file
├── routes/
│   ├── health.js          # Health check endpoints
│   ├── ai.js              # AI provider routes
│   └── ollama.js          # Ollama Free API routes
├── ollama_json/           # Model configuration files
│   ├── llama.json
│   ├── mistral.json
│   ├── deepseek.json
│   ├── qwen.json
│   ├── gemma.json
│   └── others.json
├── .env                   # Environment variables
├── package.json           # Dependencies and scripts
└── README.md             # This file
```

## Error Handling

The API includes comprehensive error handling:
- Invalid requests return 400 with error details
- Missing models return 404 with suggestions
- Server errors return 500 with safe error messages
- Rate limiting returns 429 with retry information

## Performance

- Automatic server selection for Ollama models
- Load balancing across multiple servers
- Connection pooling and timeouts
- Efficient JSON parsing and validation