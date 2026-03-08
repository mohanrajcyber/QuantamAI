import AIProvider from './base.js';
import fetch from 'node-fetch';

export default class OllamaProvider extends AIProvider {
  constructor(config) {
    super({
      name: 'ollama',
      baseUrl: config.baseUrl || 'http://localhost:11434',
      priority: 1, // Highest priority - free and unlimited!
      ...config
    });
  }

  async chat(messages, options = {}) {
    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: options.model || 'llama3.2',
        messages: this.formatMessages(messages),
        stream: false,
        options: {
          temperature: options.temperature || 0.7,
          num_predict: options.maxTokens || 2000
        }
      }),
      timeout: this.timeout
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Ollama API Error: ${error || response.statusText}`);
    }

    const data = await response.json();
    return data.message.content;
  }

  async listModels() {
    const response = await fetch(`${this.baseUrl}/api/tags`, {
      timeout: 10000
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Ollama models: ${response.statusText}`);
    }

    const data = await response.json();

    return data.models.map(model => ({
      id: model.name,
      name: model.name,
      provider: 'ollama',
      size: model.size,
      modified: model.modified_at,
      digest: model.digest,
      details: model.details
    }));
  }

  formatMessages(messages) {
    return messages.map(msg => ({
      role: msg.role || 'user',
      content: msg.content
    }));
  }

  async healthCheck() {
    try {
      const response = await fetch(`${this.baseUrl}/api/version`, {
        timeout: 5000
      });
      return response.ok;
    } catch (error) {
      console.error('Ollama health check failed:', error.message);
      return false;
    }
  }

  /**
   * Pull a model from Ollama library
   * @param {string} modelName - Model name (e.g., 'llama3.2', 'mistral')
   * @returns {Promise<Object>}
   */
  async pullModel(modelName) {
    const response = await fetch(`${this.baseUrl}/api/pull`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: modelName,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to pull model ${modelName}: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Delete a model from Ollama
   * @param {string} modelName
   * @returns {Promise<boolean>}
   */
  async deleteModel(modelName) {
    const response = await fetch(`${this.baseUrl}/api/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: modelName
      })
    });

    return response.ok;
  }
}
