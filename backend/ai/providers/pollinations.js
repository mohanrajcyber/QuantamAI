import AIProvider from './base.js';
import fetch from 'node-fetch';

export default class PollinationsProvider extends AIProvider {
  constructor(config) {
    super({
      name: 'pollinations',
      baseUrl: 'https://text.pollinations.ai',
      priority: 2, // High priority - free and unlimited!
      ...config
    });
  }

  async chat(messages, options = {}) {
    // Pollinations uses a simple text endpoint
    const lastMessage = messages[messages.length - 1];
    const prompt = lastMessage.content;

    // Build context from previous messages
    let context = '';
    if (messages.length > 1) {
      context = messages.slice(0, -1)
        .map(m => `${m.role}: ${m.content}`)
        .join('\n') + '\n\n';
    }

    const model = options.model || 'openai';
    const url = `${this.baseUrl}/${encodeURIComponent(context + prompt)}?model=${model}`;

    const response = await fetch(url, {
      method: 'GET',
      timeout: this.timeout
    });

    if (!response.ok) {
      throw new Error(`Pollinations API Error: ${response.statusText}`);
    }

    return await response.text();
  }

  async listModels() {
    // Pollinations supports multiple models
    return [
      { id: 'openai', name: 'OpenAI', provider: 'pollinations' },
      { id: 'mistral', name: 'Mistral', provider: 'pollinations' },
      { id: 'claude', name: 'Claude', provider: 'pollinations' },
      { id: 'gemini', name: 'Gemini', provider: 'pollinations' },
      { id: 'deepseek-v3', name: 'DeepSeek V3', provider: 'pollinations' },
      { id: 'qwen-coder', name: 'Qwen Coder', provider: 'pollinations' }
    ];
  }

  async healthCheck() {
    try {
      const response = await fetch(`${this.baseUrl}/hello`, {
        timeout: 5000
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}
