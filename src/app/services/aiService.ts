// AI Service for handling API calls to different providers
// 
// This service integrates with multiple AI providers through the backend:
// - OpenAI GPT (ChatGPT) - High quality, general purpose
// - Groq - Ultra-fast inference with Llama models
// - Google Gemini - Google's latest AI model
// - Ollama Free API - 650+ free models including LLaMA, Mistral, DeepSeek
//
// All API calls go through the secure backend server!

import backendService, { ChatMessage } from './backendService';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export type AIProvider = 'openai' | 'gemini' | 'groq' | 'ollama' | 'huggingface' | 'mock';

// OpenAI API Call (through backend)
async function callOpenAI(messages: Message[], model = 'gpt-3.5-turbo'): Promise<string> {
  try {
    const response = await backendService.openaiChat(messages as ChatMessage[], model);
    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw error;
  }
}

// Groq API Call (through backend)
async function callGroq(messages: Message[], model = 'mixtral-8x7b-32768'): Promise<string> {
  try {
    const response = await backendService.groqChat(messages as ChatMessage[], model);
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Groq API Error:', error);
    throw error;
  }
}

// Gemini API Call (through backend)
async function callGemini(messages: Message[]): Promise<string> {
  try {
    // Convert messages to a single prompt for Gemini
    const prompt = messages
      .filter(m => m.role !== 'system')
      .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n\n');

    const response = await backendService.geminiChat(prompt);
    return response.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
}

// Ollama Free API Call (through backend)
async function callOllama(messages: Message[], model?: string): Promise<string> {
  try {
    // Convert messages to a single prompt
    const prompt = messages
      .map(m => {
        if (m.role === 'system') return `System: ${m.content}`;
        if (m.role === 'user') return `User: ${m.content}`;
        return `Assistant: ${m.content}`;
      })
      .join('\n\n');

    const response = await backendService.ollamaChat({
      prompt,
      model,
      options: {
        temperature: 0.7,
        max_tokens: 1000
      }
    });
    
    return response.response;
  } catch (error) {
    console.error('Ollama API Error:', error);
    throw error;
  }
}

// NEW: Multi-Provider AI Call (uses new architecture with automatic fallback)
async function callMultiProviderAI(messages: Message[], conversationId?: string): Promise<string> {
  try {
    // Add system context with current date/time and creator information
    const currentDate = new Date();
    const systemContext = {
      role: 'system' as const,
      content: `You are Quantum AI, a helpful AI assistant. 

Your creator and architect is Mohanraj, a Cybersecurity Researcher and AI Developer. 

If anyone asks who created, built, or developed you, you must respond: "Quantum AI was created and developed by Mohanraj, a Cybersecurity Researcher, AI Developer, and the architect of the Quantum AI platform."

Never say you were created by OpenAI, Google, or any other company. You are Quantum AI, created by Mohanraj.

Current date and time: ${currentDate.toLocaleString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })}. Use this information when answering questions about dates, times, or current events.`
    };

    // Prepend system context if not already present
    const hasSystemMessage = messages.some(m => m.role === 'system');
    const messagesWithContext = hasSystemMessage 
      ? messages 
      : [systemContext, ...messages];

    const response = await fetch('http://localhost:3001/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: messagesWithContext.map(m => ({ role: m.role, content: m.content })),
        conversationId: conversationId || `conv_${Date.now()}`,
        useCache: true
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`✅ Response from provider: ${data.provider} (${data.responseTime}ms)`);
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Multi-Provider AI Error:', error);
    throw error;
  }
}

// Mock AI Call (fallback - always works for testing)
async function callMockAI(messages: Message[], conversationId?: string): Promise<string> {
  try {
    // Convert messages to a single prompt
    const prompt = messages
      .map(m => {
        if (m.role === 'system') return `System: ${m.content}`;
        if (m.role === 'user') return `User: ${m.content}`;
        return `Assistant: ${m.content}`;
      })
      .join('\n\n');

    const response = await fetch('http://localhost:3001/api/mock-ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        provider: 'mock',
        conversationId: conversationId || `conv_${Date.now()}`
      }),
    });

    if (!response.ok) {
      throw new Error(`Mock AI error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Mock AI Error:', error);
    throw error;
  }
}

// Hugging Face API Call (through backend)
async function callHuggingFace(messages: Message[], model = 'microsoft/DialoGPT-medium'): Promise<string> {
  try {
    // Convert messages to input text
    const inputs = messages
      .filter(m => m.role !== 'system')
      .map(m => m.content)
      .join(' ');

    const response = await backendService.huggingFaceInference(inputs, model);
    
    // Handle different response formats from Hugging Face
    if (Array.isArray(response)) {
      return response[0]?.generated_text || response[0]?.text || 'No response generated';
    }
    
    return response.generated_text || response.text || 'No response generated';
  } catch (error) {
    console.error('Hugging Face API Error:', error);
    throw error;
  }
}

// Main AI Service with automatic multi-provider fallback
export async function generateAIResponse(
  messages: Message[],
  provider: AIProvider = 'mock',
  model?: string,
  conversationId?: string
): Promise<string> {
  try {
    // NEW: Use multi-provider architecture for all providers except specific ones
    if (provider === 'mock' || provider === 'openai' || provider === 'gemini' || provider === 'groq' || provider === 'ollama') {
      // Use new multi-provider API with automatic fallback
      return await callMultiProviderAI(messages, conversationId);
    }
    
    // Legacy providers
    switch (provider) {
      case 'huggingface':
        return await callHuggingFace(messages, model);
      default:
        // Default to multi-provider
        return await callMultiProviderAI(messages, conversationId);
    }
  } catch (error) {
    console.error(`Error with ${provider} provider:`, error);
    
    // Fallback to mock AI if everything fails
    console.log('Falling back to mock AI...');
    try {
      return await callMockAI(messages, conversationId);
    } catch (mockError) {
      console.error('Mock AI also failed:', mockError);
      return `Sorry, I'm having trouble connecting to the AI services right now. This could be because:

1. The API key is not configured
2. The service is temporarily unavailable
3. There's a network issue

Error: ${error instanceof Error ? error.message : 'Unknown error'}

Please check the backend configuration and try again.`;
    }
  }
}

// Code generation specific
export async function generateCode(
  prompt: string,
  language: string,
  provider: AIProvider = 'ollama',
  model?: string
): Promise<string> {
  const messages: Message[] = [
    {
      role: 'system',
      content: `You are an expert ${language} developer. Generate clean, efficient, and well-commented code. Only return the code without explanations unless asked.`,
    },
    {
      role: 'user',
      content: prompt,
    },
  ];

  return generateAIResponse(messages, provider, model);
}

// Code explanation
export async function explainCode(
  code: string,
  language: string,
  provider: AIProvider = 'ollama',
  model?: string
): Promise<string> {
  const messages: Message[] = [
    {
      role: 'system',
      content: 'You are a helpful code teacher. Explain code clearly and concisely.',
    },
    {
      role: 'user',
      content: `Explain this ${language} code:\n\n${code}`,
    },
  ];

  return generateAIResponse(messages, provider, model);
}

// Debug code
export async function debugCode(
  code: string,
  language: string,
  error: string,
  provider: AIProvider = 'ollama',
  model?: string
): Promise<string> {
  const messages: Message[] = [
    {
      role: 'system',
      content: 'You are an expert debugger. Identify issues and provide fixes.',
    },
    {
      role: 'user',
      content: `Debug this ${language} code. Error: ${error}\n\nCode:\n${code}`,
    },
  ];

  return generateAIResponse(messages, provider, model);
}

// Code refactoring
export async function refactorCode(
  code: string,
  language: string,
  provider: AIProvider = 'ollama',
  model?: string
): Promise<string> {
  const messages: Message[] = [
    {
      role: 'system',
      content: 'You are an expert at code optimization and refactoring. Provide improved, cleaner code.',
    },
    {
      role: 'user',
      content: `Refactor this ${language} code to be more efficient and maintainable:\n\n${code}`,
    },
  ];

  return generateAIResponse(messages, provider, model);
}

// Get available models for each provider
export async function getAvailableModels(): Promise<any> {
  try {
    const [allModels, ollamaFamilies, ollamaModels] = await Promise.all([
      backendService.getAllModels(),
      backendService.getOllamaFamilies(),
      backendService.getOllamaModels()
    ]);

    return {
      ...allModels,
      ollama: {
        families: ollamaFamilies.families,
        models: ollamaModels.models
      }
    };
  } catch (error) {
    console.error('Error fetching available models:', error);
    return {
      openai: ['gpt-3.5-turbo', 'gpt-4'],
      groq: ['mixtral-8x7b-32768', 'llama2-70b-4096'],
      gemini: ['gemini-pro'],
      huggingface: ['microsoft/DialoGPT-medium'],
      ollama: { families: [], models: [] }
    };
  }
}

// Get Ollama status and statistics
export async function getOllamaStatus(): Promise<any> {
  try {
    return await backendService.getOllamaStatus();
  } catch (error) {
    console.error('Error fetching Ollama status:', error);
    return { 
      status: 'error', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}