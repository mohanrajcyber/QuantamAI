/**
 * AI Router with Intelligent Fallback
 * Routes requests to available providers with automatic failover
 */

import { getEnabledProviders } from './providers/index.js';

export default class AIRouter {
  constructor(providers) {
    this.providers = providers;
    this.stats = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      providerStats: {}
    };

    // Initialize stats for each provider
    this.providers.forEach(p => {
      this.stats.providerStats[p.name] = {
        requests: 0,
        successes: 0,
        failures: 0,
        avgResponseTime: 0
      };
    });
  }

  /**
   * Route a chat request through available providers
   * @param {Array} messages - Chat messages
   * @param {Object} options - Request options
   * @returns {Promise<Object>}
   */
  async route(messages, options = {}) {
    this.stats.totalRequests++;

    const enabledProviders = getEnabledProviders(this.providers);
    
    if (enabledProviders.length === 0) {
      return this.intelligentFallback(messages);
    }

    // Try each provider in priority order
    for (const provider of enabledProviders) {
      const startTime = Date.now();
      
      try {
        console.log(`🔄 Trying provider: ${provider.name}`);
        
        const response = await provider.chat(messages, options);
        const responseTime = Date.now() - startTime;

        // Update stats
        this.updateStats(provider.name, true, responseTime);
        this.stats.successfulRequests++;

        console.log(`✅ ${provider.name} succeeded in ${responseTime}ms`);

        return {
          success: true,
          provider: provider.name,
          response,
          responseTime,
          model: options.model || 'default'
        };

      } catch (error) {
        const responseTime = Date.now() - startTime;
        this.updateStats(provider.name, false, responseTime);

        console.log(`❌ ${provider.name} failed: ${error.message}`);
        
        // Continue to next provider
        continue;
      }
    }

    // All providers failed - use intelligent fallback
    this.stats.failedRequests++;
    console.log('⚠️  All providers failed, using intelligent fallback');
    
    return this.intelligentFallback(messages);
  }

  /**
   * Update provider statistics
   * @param {string} providerName
   * @param {boolean} success
   * @param {number} responseTime
   */
  updateStats(providerName, success, responseTime) {
    const stats = this.stats.providerStats[providerName];
    
    stats.requests++;
    if (success) {
      stats.successes++;
      // Update average response time
      stats.avgResponseTime = 
        (stats.avgResponseTime * (stats.successes - 1) + responseTime) / stats.successes;
    } else {
      stats.failures++;
    }
  }

  /**
   * Intelligent fallback when all providers fail
   * @param {Array} messages
   * @returns {Object}
   */
  intelligentFallback(messages) {
    const lastMessage = messages[messages.length - 1];
    const userMessage = lastMessage.content.toLowerCase();

    // Context-aware responses
    const responses = {
      greeting: [
        "Hello! I'm Quantum AI, created by Mohanraj. How can I assist you today?",
        "Hi there! I'm Quantum AI. I'm here to help. What would you like to know?",
        "Greetings! I'm Quantum AI, your intelligent assistant."
      ],
      creator: [
        "Quantum AI was created and developed by Mohanraj, a Cybersecurity Researcher and AI Developer, and the architect of the Quantum AI platform.",
        "I was designed and developed by Mohanraj, a Cybersecurity Researcher, AI Developer, and the creator of the Quantum AI platform.",
        "Quantum AI was created by Mohanraj, a Cybersecurity Researcher and AI Developer, with the vision of building an ethical AI platform."
      ],
      help: [
        "I can help you with various tasks including answering questions, providing information, and assisting with problem-solving. What specific help do you need?",
        "I'm here to assist! I can answer questions, provide explanations, help with coding, and much more. What would you like help with?"
      ],
      coding: [
        "I can help with coding! Please share your code or describe the programming problem you're facing.",
        "I'm ready to assist with your coding needs. What programming language or problem are you working on?"
      ],
      math: [
        "I can help with mathematical problems. Please share the equation or concept you'd like help with.",
        "I'm here to assist with math! What calculation or mathematical concept do you need help understanding?"
      ],
      default: [
        "I understand you're asking about: " + userMessage.substring(0, 50) + "... While I'm currently experiencing connectivity issues with my AI providers, I'm designed to help with a wide range of topics. Could you rephrase your question or try again in a moment?",
        "I'm processing your request about: " + userMessage.substring(0, 50) + "... I'm currently working to restore full functionality. In the meantime, could you provide more specific details about what you need?"
      ]
    };

    // Determine response category
    let category = 'default';
    if (/^(hi|hello|hey|greetings)/i.test(userMessage)) {
      category = 'greeting';
    } else if (/who (created|made|built|developed)|creator|developer|architect|founder/i.test(userMessage)) {
      category = 'creator';
    } else if (/help|assist|support/i.test(userMessage)) {
      category = 'help';
    } else if (/code|program|function|debug|error/i.test(userMessage)) {
      category = 'coding';
    } else if (/math|calculate|equation|formula/i.test(userMessage)) {
      category = 'math';
    }

    const responseList = responses[category];
    const response = responseList[Math.floor(Math.random() * responseList.length)];

    return {
      success: true,
      provider: 'fallback',
      response,
      responseTime: 0,
      model: 'intelligent-fallback',
      note: 'This is a fallback response. AI providers are currently unavailable.'
    };
  }

  /**
   * Get router statistics
   * @returns {Object}
   */
  getStats() {
    return {
      ...this.stats,
      successRate: this.stats.totalRequests > 0 
        ? (this.stats.successfulRequests / this.stats.totalRequests * 100).toFixed(2) + '%'
        : '0%'
    };
  }

  /**
   * Reset statistics
   */
  resetStats() {
    this.stats.totalRequests = 0;
    this.stats.successfulRequests = 0;
    this.stats.failedRequests = 0;
    
    Object.keys(this.stats.providerStats).forEach(key => {
      this.stats.providerStats[key] = {
        requests: 0,
        successes: 0,
        failures: 0,
        avgResponseTime: 0
      };
    });
  }

  /**
   * Get best performing provider
   * @returns {string|null}
   */
  getBestProvider() {
    let bestProvider = null;
    let bestScore = -1;

    Object.entries(this.stats.providerStats).forEach(([name, stats]) => {
      if (stats.requests === 0) return;
      
      const successRate = stats.successes / stats.requests;
      const score = successRate * (1000 / (stats.avgResponseTime || 1000));
      
      if (score > bestScore) {
        bestScore = score;
        bestProvider = name;
      }
    });

    return bestProvider;
  }
}
