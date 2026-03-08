import AIProvider from './base.js';
import fetch from 'node-fetch';

export default class GeminiProvider extends AIProvider {
  constructor(config) {
    super({
      name: 'gemini',
      baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
      ...config
    });
  }

  async chat(messages, options = {}) {
    await this.checkRateLimit();

    const model = options.model || 'gemini-2.0-flash-exp';
    const url = `${this.baseUrl}/models/${model}:generateContent?key=${this.apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: this.formatMessages(messages),
        generationConfig: {
          temperature: options.temperature || 0.7,
          maxOutputTokens: options.maxTokens || 2000,
        }
      }),
      timeout: this.timeout
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Gemini API Error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('Gemini returned no candidates');
    }

    return data.candidates[0].content.parts[0].text;
  }

  async listModels() {
    const url = `${this.baseUrl}/models?key=${this.apiKey}`;
    
    const response = await fetch(url, {
      timeout: 10000
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Gemini models: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Filter to generative models only
    const generativeModels = data.models.filter(model => 
      model.supportedGenerationMethods?.includes('generateContent')
    );

    return generativeModels.map(model => ({
      id: model.name.split('/').pop(),
      name: model.displayName || model.name,
      provider: 'gemini',
      description: model.description,
      inputTokenLimit: model.inputTokenLimit,
      outputTokenLimit: model.outputTokenLimit
    }));
  }

  formatMessages(messages) {
    // Convert OpenAI format to Gemini format
    return messages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));
  }
}
