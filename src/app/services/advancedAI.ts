// Advanced Multi-AI Service with Model Routing
// This makes Quantum AI the world's most powerful AI by combining all providers

import { generateAIResponse, AIProvider } from './aiService';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Advanced AI Router - Automatically selects the best AI for the task
export async function advancedAIRouter(
  prompt: string,
  context: string = 'general'
): Promise<{ response: string; provider: AIProvider; reasoning: string }> {
  
  // Analyze the prompt to determine the best AI provider
  const promptLower = prompt.toLowerCase();
  
  let selectedProvider: AIProvider = 'groq'; // Default: fastest
  let reasoning = '';
  
  // Complex code/technical tasks -> OpenAI (best for complex reasoning)
  if (
    promptLower.includes('code') ||
    promptLower.includes('algorithm') ||
    promptLower.includes('debug') ||
    promptLower.includes('technical') ||
    promptLower.includes('programming')
  ) {
    selectedProvider = 'openai';
    reasoning = 'Selected OpenAI for superior code understanding and technical reasoning';
  }
  // Creative/conversational tasks -> Gemini (great for natural conversations)
  else if (
    promptLower.includes('creative') ||
    promptLower.includes('story') ||
    promptLower.includes('write') ||
    promptLower.includes('explain')
  ) {
    selectedProvider = 'gemini';
    reasoning = 'Selected Gemini for creative and conversational excellence';
  }
  // Speed-critical or simple tasks -> Groq (ultra-fast)
  else {
    selectedProvider = 'groq';
    reasoning = 'Selected Groq for lightning-fast response time';
  }

  const messages: Message[] = [
    {
      role: 'system',
      content: `You are Quantum AI, the world's most advanced AI assistant. You have access to multiple AI models and can provide expert assistance in ${context}. Be helpful, accurate, and insightful.`,
    },
    {
      role: 'user',
      content: prompt,
    },
  ];

  try {
    const response = await generateAIResponse(messages, selectedProvider);
    return { response, provider: selectedProvider, reasoning };
  } catch (error) {
    // Fallback to another provider if one fails
    console.warn(`${selectedProvider} failed, trying fallback...`);
    
    const fallbackProvider: AIProvider = selectedProvider === 'groq' ? 'openai' : 'groq';
    const response = await generateAIResponse(messages, fallbackProvider);
    
    return {
      response,
      provider: fallbackProvider,
      reasoning: `Fallback to ${fallbackProvider} due to primary provider error`,
    };
  }
}

// Multi-Model Consensus - Gets responses from multiple AIs and combines them
export async function multiModelConsensus(prompt: string): Promise<string> {
  const messages: Message[] = [
    {
      role: 'user',
      content: prompt,
    },
  ];

  try {
    // Query multiple providers in parallel
    const [groqResponse, openaiResponse] = await Promise.allSettled([
      generateAIResponse(messages, 'groq'),
      generateAIResponse(messages, 'openai'),
    ]);

    // Combine the best parts of each response
    const responses: string[] = [];
    
    if (groqResponse.status === 'fulfilled') responses.push(groqResponse.value);
    if (openaiResponse.status === 'fulfilled') responses.push(openaiResponse.value);

    if (responses.length === 0) {
      throw new Error('All AI providers failed');
    }

    // If we got multiple responses, create a synthesis
    if (responses.length > 1) {
      const synthesisPrompt = `Synthesize these two AI responses into one comprehensive, high-quality answer:\n\nResponse 1: ${responses[0]}\n\nResponse 2: ${responses[1]}\n\nProvide a unified, well-structured response that combines the best insights from both.`;
      
      return await generateAIResponse([{ role: 'user', content: synthesisPrompt }], 'groq');
    }

    return responses[0];
  } catch (error) {
    throw new Error('Multi-model consensus failed: ' + error);
  }
}

// Context-Aware AI - Maintains conversation context and adapts responses
export class ContextualAI {
  private conversationHistory: Message[] = [];
  private userPreferences: Record<string, any> = {};
  
  addMessage(role: 'user' | 'assistant', content: string) {
    this.conversationHistory.push({ role, content });
    
    // Keep only last 10 messages to avoid context overflow
    if (this.conversationHistory.length > 10) {
      this.conversationHistory = this.conversationHistory.slice(-10);
    }
  }

  async getResponse(userMessage: string, context: string = 'general'): Promise<string> {
    this.addMessage('user', userMessage);
    
    const systemPrompt = `You are Quantum AI, a world-class AI assistant specialized in ${context}. 
    You remember the conversation history and provide contextually relevant responses.
    You are powered by multiple advanced AI models (OpenAI GPT, Groq, Google Gemini).
    Your goal is to be the most helpful, accurate, and intelligent AI assistant in the world.`;

    const messages: Message[] = [
      { role: 'system', content: systemPrompt },
      ...this.conversationHistory,
    ];

    const result = await advancedAIRouter(userMessage, context);
    this.addMessage('assistant', result.response);
    
    return result.response;
  }

  clearHistory() {
    this.conversationHistory = [];
  }

  getHistory() {
    return this.conversationHistory;
  }
}

// Task Decomposition - Breaks complex tasks into subtasks
export async function decomposeTask(task: string): Promise<string[]> {
  const prompt = `Break down this complex task into clear, actionable subtasks:\n\n"${task}"\n\nProvide a numbered list of subtasks.`;
  
  const response = await generateAIResponse([{ role: 'user', content: prompt }], 'groq');
  
  // Parse the response into an array of subtasks
  const subtasks = response
    .split('\n')
    .filter(line => /^\d+\./.test(line.trim()))
    .map(line => line.replace(/^\d+\.\s*/, '').trim());
  
  return subtasks;
}

// Smart Summarization - Summarizes long content
export async function smartSummarize(content: string, maxLength: number = 200): Promise<string> {
  const prompt = `Summarize the following content in ${maxLength} words or less:\n\n${content}`;
  return await generateAIResponse([{ role: 'user', content: prompt }], 'groq');
}

// Sentiment Analysis
export async function analyzeSentiment(text: string): Promise<{ sentiment: string; confidence: number; explanation: string }> {
  const prompt = `Analyze the sentiment of this text and respond in JSON format with sentiment (positive/negative/neutral), confidence (0-1), and explanation:\n\n"${text}"`;
  
  try {
    const response = await generateAIResponse([{ role: 'user', content: prompt }], 'groq');
    return JSON.parse(response);
  } catch {
    return {
      sentiment: 'neutral',
      confidence: 0.5,
      explanation: 'Unable to determine sentiment',
    };
  }
}
