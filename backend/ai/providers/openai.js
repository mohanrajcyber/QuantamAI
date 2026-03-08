import AIProvider from './base.js';
import fetch from 'node-fetch';

export default class OpenAIProvider extends AIProvider {
  constructor(config) {
    super({
      name: 'openai',
      baseUrl: 'https://api.openai.com/v1',
      ...config
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
        model: options.model || 'gpt-4o-mini',
        messages: this.formatMessages(messages),
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 2000,
        stream: false
      }),
      timeout: this.timeout
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API Error: ${error.error?.message || response.statusText}`);
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
      throw new Error(`Failed to fetch OpenAI models: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Filter to chat models only
    const chatModels = data.data.filter(model => 
      model.id.includes('gpt') && 
      !model.id.includes('instruct') &&
      !model.id.includes('embedding')
    );

    return chatModels.map(model => ({
      id: model.id,
      name: model.id,
      provider: 'openai',
      created: model.created,
      owned_by: model.owned_by
    }));
  }

  formatMessages(messages) {
    // Ensure messages have correct format
    return messages.map(msg => ({
      role: msg.role || 'user',
      content: msg.content
    }));
  }
}
