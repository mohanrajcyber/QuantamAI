const API_BASE_URL = 'http://localhost:3001/api';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface OllamaChatRequest {
  prompt: string;
  model?: string;
  options?: {
    temperature?: number;
    top_p?: number;
    max_tokens?: number;
    stop?: string[];
  };
}

export interface OllamaChatResponse {
  response: string;
  model: string;
  prompt: string;
}

export interface ModelInfo {
  families: string[];
  models: string[];
  family?: string;
}

class BackendService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  // Health check
  async healthCheck(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/health`);
    return response.json();
  }

  // OpenAI Chat
  async openaiChat(messages: ChatMessage[], model = 'gpt-3.5-turbo', options: any = {}): Promise<any> {
    const response = await fetch(`${this.baseUrl}/ai/openai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        model,
        temperature: options.temperature || 0.7,
        max_tokens: options.max_tokens || 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    return response.json();
  }

  // Gemini Chat
  async geminiChat(prompt: string, model = 'gemini-pro'): Promise<any> {
    const response = await fetch(`${this.baseUrl}/ai/gemini/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        model,
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    return response.json();
  }

  // Groq Chat
  async groqChat(messages: ChatMessage[], model = 'mixtral-8x7b-32768', options: any = {}): Promise<any> {
    const response = await fetch(`${this.baseUrl}/ai/groq/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        model,
        temperature: options.temperature || 0.7,
        max_tokens: options.max_tokens || 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`);
    }

    return response.json();
  }

  // Hugging Face Inference
  async huggingFaceInference(inputs: string, model = 'microsoft/DialoGPT-medium'): Promise<any> {
    const response = await fetch(`${this.baseUrl}/ai/huggingface/inference`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs,
        model,
      }),
    });

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.statusText}`);
    }

    return response.json();
  }

  // Ollama Free API Methods

  // List model families
  async getOllamaFamilies(): Promise<{ families: string[] }> {
    const response = await fetch(`${this.baseUrl}/ollama/families`);
    if (!response.ok) {
      throw new Error(`Failed to fetch families: ${response.statusText}`);
    }
    return response.json();
  }

  // List models (optionally by family)
  async getOllamaModels(family?: string): Promise<ModelInfo> {
    const url = family 
      ? `${this.baseUrl}/ollama/models?family=${encodeURIComponent(family)}`
      : `${this.baseUrl}/ollama/models`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.statusText}`);
    }
    return response.json();
  }

  // Get model information
  async getOllamaModelInfo(modelName: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/ollama/models/${encodeURIComponent(modelName)}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch model info: ${response.statusText}`);
    }
    return response.json();
  }

  // Get model servers
  async getOllamaModelServers(modelName: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/ollama/models/${encodeURIComponent(modelName)}/servers`);
    if (!response.ok) {
      throw new Error(`Failed to fetch model servers: ${response.statusText}`);
    }
    return response.json();
  }

  // Chat with Ollama models
  async ollamaChat(request: OllamaChatRequest): Promise<OllamaChatResponse> {
    const response = await fetch(`${this.baseUrl}/ollama/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Ollama chat error: ${errorData.error || response.statusText}`);
    }

    return response.json();
  }

  // Get Ollama API status
  async getOllamaStatus(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/ollama/status`);
    if (!response.ok) {
      throw new Error(`Failed to fetch Ollama status: ${response.statusText}`);
    }
    return response.json();
  }

  // Get all available models from all providers
  async getAllModels(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/ai/models`);
    if (!response.ok) {
      throw new Error(`Failed to fetch all models: ${response.statusText}`);
    }
    return response.json();
  }

  // WebSocket connection for real-time communication
  createWebSocket(): WebSocket {
    const wsUrl = 'ws://localhost:3001';
    return new WebSocket(wsUrl);
  }
}

export const backendService = new BackendService();
export default backendService;