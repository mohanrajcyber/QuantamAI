/**
 * Model Cache Manager
 * Caches model lists and responses for better performance
 */

import NodeCache from 'node-cache';

class CacheManager {
  constructor(options = {}) {
    // Model cache - 5 minutes TTL
    this.modelCache = new NodeCache({
      stdTTL: options.modelTTL || 300,
      checkperiod: 60
    });

    // Response cache - 1 hour TTL (for identical queries)
    this.responseCache = new NodeCache({
      stdTTL: options.responseTTL || 3600,
      checkperiod: 120,
      maxKeys: options.maxResponseKeys || 1000
    });

    this.stats = {
      modelCacheHits: 0,
      modelCacheMisses: 0,
      responseCacheHits: 0,
      responseCacheMisses: 0
    };
  }

  /**
   * Get cached models for a provider
   * @param {string} providerName
   * @returns {Array|null}
   */
  getModels(providerName) {
    const key = `models_${providerName}`;
    const cached = this.modelCache.get(key);
    
    if (cached) {
      this.stats.modelCacheHits++;
      console.log(`📦 Cache HIT: ${key}`);
      return cached;
    }
    
    this.stats.modelCacheMisses++;
    console.log(`📭 Cache MISS: ${key}`);
    return null;
  }

  /**
   * Cache models for a provider
   * @param {string} providerName
   * @param {Array} models
   */
  setModels(providerName, models) {
    const key = `models_${providerName}`;
    this.modelCache.set(key, models);
    console.log(`💾 Cached ${models.length} models for ${providerName}`);
  }

  /**
   * Get all cached models from all providers
   * @returns {Object}
   */
  getAllCachedModels() {
    const keys = this.modelCache.keys();
    const result = {};
    
    keys.forEach(key => {
      if (key.startsWith('models_')) {
        const providerName = key.replace('models_', '');
        result[providerName] = this.modelCache.get(key);
      }
    });
    
    return result;
  }

  /**
   * Generate cache key for a chat request
   * @param {Array} messages
   * @param {Object} options
   * @returns {string}
   */
  generateChatKey(messages, options = {}) {
    const messageText = messages.map(m => `${m.role}:${m.content}`).join('|');
    const optionsText = JSON.stringify(options);
    
    // Simple hash function
    let hash = 0;
    const text = messageText + optionsText;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    return `chat_${Math.abs(hash)}`;
  }

  /**
   * Get cached response for a chat request
   * @param {Array} messages
   * @param {Object} options
   * @returns {Object|null}
   */
  getChatResponse(messages, options = {}) {
    const key = this.generateChatKey(messages, options);
    const cached = this.responseCache.get(key);
    
    if (cached) {
      this.stats.responseCacheHits++;
      console.log(`💬 Response cache HIT: ${key}`);
      return { ...cached, cached: true };
    }
    
    this.stats.responseCacheMisses++;
    return null;
  }

  /**
   * Cache a chat response
   * @param {Array} messages
   * @param {Object} options
   * @param {Object} response
   */
  setChatResponse(messages, options, response) {
    const key = this.generateChatKey(messages, options);
    this.responseCache.set(key, response);
    console.log(`💾 Cached response: ${key}`);
  }

  /**
   * Clear all caches
   */
  clearAll() {
    this.modelCache.flushAll();
    this.responseCache.flushAll();
    console.log('🗑️  All caches cleared');
  }

  /**
   * Clear model cache only
   */
  clearModels() {
    this.modelCache.flushAll();
    console.log('🗑️  Model cache cleared');
  }

  /**
   * Clear response cache only
   */
  clearResponses() {
    this.responseCache.flushAll();
    console.log('🗑️  Response cache cleared');
  }

  /**
   * Get cache statistics
   * @returns {Object}
   */
  getStats() {
    const modelKeys = this.modelCache.keys().length;
    const responseKeys = this.responseCache.keys().length;
    
    const modelHitRate = this.stats.modelCacheHits + this.stats.modelCacheMisses > 0
      ? (this.stats.modelCacheHits / (this.stats.modelCacheHits + this.stats.modelCacheMisses) * 100).toFixed(2)
      : 0;
    
    const responseHitRate = this.stats.responseCacheHits + this.stats.responseCacheMisses > 0
      ? (this.stats.responseCacheHits / (this.stats.responseCacheHits + this.stats.responseCacheMisses) * 100).toFixed(2)
      : 0;

    return {
      modelCache: {
        keys: modelKeys,
        hits: this.stats.modelCacheHits,
        misses: this.stats.modelCacheMisses,
        hitRate: `${modelHitRate}%`
      },
      responseCache: {
        keys: responseKeys,
        hits: this.stats.responseCacheHits,
        misses: this.stats.responseCacheMisses,
        hitRate: `${responseHitRate}%`
      }
    };
  }

  /**
   * Reset statistics
   */
  resetStats() {
    this.stats = {
      modelCacheHits: 0,
      modelCacheMisses: 0,
      responseCacheHits: 0,
      responseCacheMisses: 0
    };
  }
}

// Singleton instance
let cacheManager = null;

export function getCacheManager(options) {
  if (!cacheManager) {
    cacheManager = new CacheManager(options);
  }
  return cacheManager;
}

export { CacheManager };
