import AIProvider from './base.js';
import fetch from 'node-fetch';

export default class GroqProvider extends AIProvider {
  constructor(config) {
    super({
      name: 'groq',
      baseUrl: 'https://api.groq.com/openai/v1',
      ...config,
      rateLimit: {
        requestsPerSecond: 0.5 // 30 requests per minute
      }
    });
  }

  async chat(messages, options = {}) {
    await this.checkRateLimit();

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: options.model || 'llama-3.3-70b-versatile',
        messages: this.formatMessages(messages),
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 2000,
        stream: false
      }),
      timeout: this.timeout
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Groq API Error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  async listModels() {
    const response = await fetch(`${this.baseUrl}/models`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      },
      timeout: 10000
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Groq models: ${response.statusText}`);
    }

    const data = await response.json();

    return data.data.map(model => ({
      id: model.id,
      name: model.id,
      provider: 'groq',
      created: model.created,
      owned_by: model.owned_by,
      context_window: model.context_window
    }));
  }

  formatMessages(messages) {
    return messages.map(msg => ({
      role: msg.role || 'user',
      content: msg.content
    }));
  }
}
