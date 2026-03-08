// AI Service - Serverless Function Integration (No CORS issues!)
// Uses Vercel serverless functions to proxy API calls
// Updated: March 8, 2026

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export type AIProvider = 'openai' | 'gemini' | 'groq' | 'huggingface' | 'mock';

// System context for all AI responses
function getSystemContext(): Message {
  const currentDate = new Date();
  return {
    role: 'system',
    content: `You are Quantum AI, a helpful AI assistant created by Mohanraj.

Your creator and architect is Mohanraj, a Cybersecurity Researcher and AI Developer.

If anyone asks who created, built, or developed you, respond: "Quantum AI was created and developed by Mohanraj, a Cybersecurity Researcher, AI Developer, and the architect of the Quantum AI platform."

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
}

// Mock AI (Fallback - Always Works!)
function callMockAI(messages: Message[]): string {
  const lastMessage = messages[messages.length - 1]?.content.toLowerCase() || '';
  
  // Check for specific keywords
  if (lastMessage.includes('who created') || lastMessage.includes('who made') || lastMessage.includes('who built')) {
    return "I was created and developed by Mohanraj, a Cybersecurity Researcher, AI Developer, and the architect of the Quantum AI platform.";
  }
  
  if (lastMessage.includes('hello') || lastMessage.includes('hi ') || lastMessage.includes('hey')) {
    return "Hello! I'm Quantum AI, created by Mohanraj. How can I help you today?";
  }
  
  if (lastMessage.includes('help')) {
    return "I'm here to help! I can assist with coding, answer questions, provide information, and much more. What would you like to know?";
  }
  
  const responses = [
    "I'm Quantum AI, created by Mohanraj! I'm here to help you with anything you need.",
    "That's an interesting question! As Quantum AI, I can assist you with various tasks.",
    "I understand. Let me help you with that. I'm powered by advanced AI technology.",
    "Great question! I'm designed to provide helpful, accurate responses.",
    "I'm here to assist you. Feel free to ask me anything!"
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}

// Main AI Service - Direct API calls with CORS proxy for GitHub Pages
export async function generateAIResponse(
  messages: Message[],
  provider: AIProvider = 'groq',
  model?: string
): Promise<string> {
  // Add system context
  const hasSystemMessage = messages.some(m => m.role === 'system');
  const messagesWithContext = hasSystemMessage ? messages : [getSystemContext(), ...messages];

  try {
    // Try Groq first (fastest and most reliable)
    try {
      const response = await callGroqDirect(messagesWithContext, model);
      console.log('✅ Response from Groq');
      return response;
    } catch (error) {
      console.warn('Groq failed, trying fallback...');
    }

    // Fallback to mock AI
    return callMockAI(messagesWithContext);
  } catch (error) {
    console.error('API Error:', error);
    return callMockAI(messagesWithContext);
  }
}

// Direct Groq API call (works on GitHub Pages)
async function callGroqDirect(messages: Message[], model = 'mixtral-8x7b-32768'): Promise<string> {
  const GROQ_API_KEY = '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';
  
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
      temperature: 0.7,
      max_tokens: 1000
    })
  });

  if (!response.ok) {
    throw new Error(`Groq API failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// Code generation
export async function generateCode(
  prompt: string,
  language: string,
  provider: AIProvider = 'groq',
  model?: string
): Promise<string> {
  const messages: Message[] = [
    {
      role: 'system',
      content: `You are an expert ${language} developer. Generate clean, efficient, and well-commented code. Only return the code without explanations unless asked.`
    },
    {
      role: 'user',
      content: prompt
    }
  ];

  return generateAIResponse(messages, provider, model);
}

// Code explanation
export async function explainCode(
  code: string,
  language: string,
  provider: AIProvider = 'groq',
  model?: string
): Promise<string> {
  const messages: Message[] = [
    {
      role: 'system',
      content: 'You are a helpful code teacher. Explain code clearly and concisely.'
    },
    {
      role: 'user',
      content: `Explain this ${language} code:\n\n${code}`
    }
  ];

  return generateAIResponse(messages, provider, model);
}

// Debug code
export async function debugCode(
  code: string,
  language: string,
  error: string,
  provider: AIProvider = 'groq',
  model?: string
): Promise<string> {
  const messages: Message[] = [
    {
      role: 'system',
      content: 'You are an expert debugger. Identify issues and provide fixes.'
    },
    {
      role: 'user',
      content: `Debug this ${language} code. Error: ${error}\n\nCode:\n${code}`
    }
  ];

  return generateAIResponse(messages, provider, model);
}

// Code refactoring
export async function refactorCode(
  code: string,
  language: string,
  provider: AIProvider = 'groq',
  model?: string
): Promise<string> {
  const messages: Message[] = [
    {
      role: 'system',
      content: 'You are an expert at code optimization and refactoring. Provide improved, cleaner code.'
    },
    {
      role: 'user',
      content: `Refactor this ${language} code to be more efficient and maintainable:\n\n${code}`
    }
  ];

  return generateAIResponse(messages, provider, model);
}

// Get available models
export async function getAvailableModels(): Promise<any> {
  return {
    openai: ['gpt-3.5-turbo', 'gpt-4'],
    groq: ['mixtral-8x7b-32768', 'llama2-70b-4096', 'gemma-7b-it'],
    gemini: ['gemini-pro'],
    huggingface: ['microsoft/DialoGPT-large']
  };
}

// Get Ollama status (stub for compatibility)
export async function getOllamaStatus(): Promise<any> {
  return {
    status: 'not_available',
    message: 'Ollama is not available in serverless deployment. Using cloud AI providers instead.',
    providers: ['OpenAI', 'Groq', 'Gemini', 'Hugging Face']
  };
}
