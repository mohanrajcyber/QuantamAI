// AI Service - Direct API Integration (No Backend Needed!)
// Integrates with multiple AI providers directly from frontend
// All API keys are embedded for immediate deployment

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export type AIProvider = 'openai' | 'gemini' | 'groq' | 'huggingface' | 'mock';

// API Keys (embedded for deployment)
const API_KEYS = {
  OPENAI: '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',
  GEMINI: 'AIzaSyCCIvBlunSN8glSkD97yCR3AIoPw3r9-7o',
  GROQ: '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',
  HUGGINGFACE: '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',
  YOUTUBE: 'AIzaSyASMEJP1EY2JfQKB3QwudiQp3G_7gpSYys'
};

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

// OpenAI GPT API (Direct)
async function callOpenAI(messages: Message[], model = 'gpt-3.5-turbo'): Promise<string> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEYS.OPENAI}`
      },
      body: JSON.stringify({
        model,
        messages: messages.map(m => ({ role: m.role, content: m.content })),
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Response from OpenAI GPT');
    return data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI Error:', error);
    throw error;
  }
}

// Google Gemini API (Direct)
async function callGemini(messages: Message[]): Promise<string> {
  try {
    // Convert messages to Gemini format
    const prompt = messages
      .filter(m => m.role !== 'system')
      .map(m => m.content)
      .join('\n\n');

    const systemPrompt = messages.find(m => m.role === 'system')?.content || '';
    const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEYS.GEMINI}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: fullPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Response from Google Gemini');
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Gemini Error:', error);
    throw error;
  }
}

// Groq API (Direct - Ultra Fast!)
async function callGroq(messages: Message[], model = 'mixtral-8x7b-32768'): Promise<string> {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEYS.GROQ}`
      },
      body: JSON.stringify({
        model,
        messages: messages.map(m => ({ role: m.role, content: m.content })),
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Response from Groq (Ultra Fast!)');
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Groq Error:', error);
    throw error;
  }
}

// Hugging Face API (Direct)
async function callHuggingFace(messages: Message[]): Promise<string> {
  try {
    const prompt = messages
      .map(m => {
        if (m.role === 'system') return m.content;
        if (m.role === 'user') return `User: ${m.content}`;
        return `Assistant: ${m.content}`;
      })
      .join('\n\n');

    const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-large', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEYS.HUGGINGFACE}`
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_length: 500,
          temperature: 0.7,
          top_p: 0.9
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data[0]?.generated_text || data.generated_text || '';
    const newResponse = aiResponse.replace(prompt, '').trim();
    console.log('✅ Response from Hugging Face');
    return newResponse || aiResponse || 'I apologize, but I could not generate a response.';
  } catch (error) {
    console.error('Hugging Face Error:', error);
    throw error;
  }
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

// Main AI Service with Smart Fallback
export async function generateAIResponse(
  messages: Message[],
  provider: AIProvider = 'groq',
  model?: string
): Promise<string> {
  // Add system context
  const hasSystemMessage = messages.some(m => m.role === 'system');
  const messagesWithContext = hasSystemMessage ? messages : [getSystemContext(), ...messages];

  // Try providers in order: Groq (fastest) → OpenAI → Gemini → Hugging Face → Mock
  const providers: Array<{ name: AIProvider; fn: () => Promise<string> }> = [
    { name: 'groq', fn: () => callGroq(messagesWithContext, model) },
    { name: 'openai', fn: () => callOpenAI(messagesWithContext, model) },
    { name: 'gemini', fn: () => callGemini(messagesWithContext) },
    { name: 'huggingface', fn: () => callHuggingFace(messagesWithContext) }
  ];

  // If specific provider requested, try it first
  if (provider !== 'mock') {
    const requestedProvider = providers.find(p => p.name === provider);
    if (requestedProvider) {
      try {
        return await requestedProvider.fn();
      } catch (error) {
        console.warn(`${provider} failed, trying fallback providers...`);
      }
    }
  }

  // Try all providers in order
  for (const { name, fn } of providers) {
    if (name === provider) continue; // Skip if already tried
    try {
      return await fn();
    } catch (error) {
      console.warn(`${name} failed, trying next provider...`);
    }
  }

  // Final fallback to mock AI
  console.log('All providers failed, using mock AI');
  return callMockAI(messagesWithContext);
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
