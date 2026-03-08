import AIProvider from './base.js';
import fetch from 'node-fetch';

export default class G4FProvider extends AIProvider {
  constructor(config) {
    super({
      name: 'g4f',
      baseUrl: 'https://api.g4f.dev',
      priority: 3, // High priority - 200+ models, unlimited!
      ...config
    });
  }

  async chat(messages, options = {}) {
    const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
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
      const error = await response.json().catch(() => ({}));
      throw new Error(`G4F API Error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  async listModels() {
    const response = await fetch(`${this.baseUrl}/v1/models`, {
      timeout: 10000
    });

    if (!response.ok) {
      // Return default models if API fails
      return this.getDefaultModels();
    }

    const data = await response.json();
    
    return data.data.map(model => ({
      id: model.id,
      name: model.id,
      provider: 'g4f',
      created: model.created
    }));
  }

  getDefaultModels() {
    return [
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'g4f' },
      { id: 'gpt-4o', name: 'GPT-4o', provider: 'g4f' },
      { id: 'claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'g4f' },
      { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', provider: 'g4f' },
      { id: 'llama-3.3-70b', name: 'Llama 3.3 70B', provider: 'g4f' },
      { id: 'deepseek-v3', name: 'DeepSeek V3', provider: 'g4f' }
    ];
  }

  formatMessages(messages) {
    return messages.map(msg => ({
      role: msg.role || 'user',
      content: msg.content
    }));
  }

  async healthCheck() {
    try {
      const response = await fetch(`${this.baseUrl}/v1/models`, {
        timeout: 5000
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}
