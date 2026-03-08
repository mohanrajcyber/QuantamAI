/**
 * Base AI Provider Class
 * All AI providers must extend this class
 */

export default class AIProvider {
  constructor(config) {
    this.name = config.name;
    this.enabled = config.enabled !== false;
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl;
    this.priority = config.priority || 999;
    this.models = config.models || [];
    this.rateLimit = config.rateLimit || null;
    this.timeout = config.timeout || 60000; // 60 seconds default
  }

  /**
   * Send chat completion request
   * @param {Array} messages - Array of message objects
   * @param {Object} options - Additional options (model, temperature, etc.)
   * @returns {Promise<string>} - AI response
   */
  async chat(messages, options = {}) {
    throw new Error(`${this.name}: chat() method must be implemented`);
  }

  /**
   * List available models from this provider
   * @returns {Promise<Array>} - Array of model objects
   */
  async listModels() {
    throw new Error(`${this.name}: listModels() method must be implemented`);
  }

  /**
   * Check if provider is healthy and accessible
   * @returns {Promise<boolean>}
   */
  async healthCheck() {
    try {
      await this.listModels();
      return true;
    } catch (error) {
      console.error(`${this.name} health check failed:`, error.message);
      return false;
    }
  }

  /**
   * Get provider status information
   * @returns {Object}
   */
  getStatus() {
    return {
      name: this.name,
      enabled: this.enabled,
      priority: this.priority,
      hasApiKey: !!this.apiKey,
      baseUrl: this.baseUrl,
      modelCount: this.models.length
    };
  }

  /**
   * Format messages for this provider's API
   * @param {Array} messages
   * @returns {Array}
   */
  formatMessages(messages) {
    // Default implementation - override if needed
    return messages;
  }

  /**
   * Handle rate limiting
   * @returns {Promise<void>}
   */
  async checkRateLimit() {
    if (!this.rateLimit) return;
    
    const now = Date.now();
    if (!this.lastRequest) {
      this.lastRequest = now;
      return;
    }

    const timeSinceLastRequest = now - this.lastRequest;
    const minInterval = 1000 / this.rateLimit.requestsPerSecond;

    if (timeSinceLastRequest < minInterval) {
      const waitTime = minInterval - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    this.lastRequest = Date.now();
  }
}
