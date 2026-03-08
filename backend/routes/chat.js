/**
 * Chat Routes - New Architecture
 * Uses the provider abstraction and intelligent routing
 */

import express from 'express';
const router = express.Router();

// Import new AI architecture
import { initializeProviders, checkAllProvidersHealth } from '../ai/providers/index.js';
import AIRouter from '../ai/router.js';
import { getCacheManager } from '../ai/cache.js';

// Initialize providers and router
const providers = initializeProviders();
const aiRouter = new AIRouter(providers);
const cacheManager = getCacheManager();

console.log('🚀 Chat routes initialized with new architecture');

/**
 * POST /api/chat
 * Main chat endpoint with intelligent routing
 */
router.post('/', async (req, res) => {
  try {
    const { 
      prompt, 
      messages, 
      provider, 
      model,
      temperature,
      maxTokens,
      conversationId = 'default',
      useCache = true
    } = req.body;

    if (!prompt && (!messages || messages.length === 0)) {
      return res.status(400).json({ 
        error: 'Either prompt or messages array is required' 
      });
    }

    // Convert prompt to messages format if needed
    const chatMessages = messages || [{ role: 'user', content: prompt }];

    // Check cache first (if enabled)
    if (useCache) {
      const cached = cacheManager.getChatResponse(chatMessages, { model, temperature });
      if (cached) {
        return res.json({
          ...cached,
          cached: true,
          conversationId
        });
      }
    }

    // Route through AI providers
    const options = {
      model,
      temperature: temperature || 0.7,
      maxTokens: maxTokens || 2000
    };

    const result = await aiRouter.route(chatMessages, options);

    // Cache successful responses
    if (result.success && useCache) {
      cacheManager.setChatResponse(chatMessages, options, result);
    }

    res.json({
      choices: [{
        message: {
          content: result.response,
          role: 'assistant'
        }
      }],
      provider: result.provider,
      model: result.model,
      responseTime: result.responseTime,
      conversationId,
      cached: false,
      note: result.note
    });

  } catch (error) {
    console.error('Chat Error:', error);
    res.status(500).json({
      error: 'Chat request failed',
      message: error.message
    });
  }
});

/**
 * GET /api/chat/models
 * List all available models from all providers
 */
router.get('/models', async (req, res) => {
  try {
    const { provider, refresh } = req.query;

    // Clear cache if refresh requested
    if (refresh === 'true') {
      cacheManager.clearModels();
    }

    const allModels = [];

    for (const p of providers) {
      if (!p.enabled) continue;

      // Check cache first
      let models = cacheManager.getModels(p.name);

      if (!models) {
        try {
          models = await p.listModels();
          cacheManager.setModels(p.name, models);
        } catch (error) {
          console.error(`Failed to fetch models from ${p.name}:`, error.message);
          continue;
        }
      }

      // Filter by provider if specified
      if (!provider || provider === p.name) {
        allModels.push(...models);
      }
    }

    res.json({
      models: allModels,
      count: allModels.length,
      providers: providers.map(p => ({
        name: p.name,
        enabled: p.enabled,
        priority: p.priority
      }))
    });

  } catch (error) {
    console.error('Models Error:', error);
    res.status(500).json({
      error: 'Failed to fetch models',
      message: error.message
    });
  }
});

/**
 * GET /api/chat/providers
 * List all configured providers and their status
 */
router.get('/providers', async (req, res) => {
  try {
    const providerList = providers.map(p => p.getStatus());
    
    res.json({
      providers: providerList,
      count: providerList.length,
      enabled: providerList.filter(p => p.enabled).length
    });

  } catch (error) {
    console.error('Providers Error:', error);
    res.status(500).json({
      error: 'Failed to fetch providers',
      message: error.message
    });
  }
});

/**
 * GET /api/chat/health
 * Check health of all providers
 */
router.get('/health', async (req, res) => {
  try {
    const health = await checkAllProvidersHealth(providers);
    
    const healthyCount = Object.values(health).filter(h => h.healthy).length;
    const totalCount = Object.keys(health).length;

    res.json({
      status: healthyCount > 0 ? 'healthy' : 'degraded',
      providers: health,
      summary: {
        healthy: healthyCount,
        total: totalCount,
        percentage: ((healthyCount / totalCount) * 100).toFixed(2) + '%'
      }
    });

  } catch (error) {
    console.error('Health Check Error:', error);
    res.status(500).json({
      error: 'Health check failed',
      message: error.message
    });
  }
});

/**
 * GET /api/chat/stats
 * Get router and cache statistics
 */
router.get('/stats', (req, res) => {
  try {
    const routerStats = aiRouter.getStats();
    const cacheStats = cacheManager.getStats();

    res.json({
      router: routerStats,
      cache: cacheStats,
      bestProvider: aiRouter.getBestProvider()
    });

  } catch (error) {
    console.error('Stats Error:', error);
    res.status(500).json({
      error: 'Failed to fetch stats',
      message: error.message
    });
  }
});

/**
 * POST /api/chat/cache/clear
 * Clear cache (admin only)
 */
router.post('/cache/clear', (req, res) => {
  try {
    const { type = 'all' } = req.body;

    if (type === 'models') {
      cacheManager.clearModels();
    } else if (type === 'responses') {
      cacheManager.clearResponses();
    } else {
      cacheManager.clearAll();
    }

    res.json({
      success: true,
      message: `${type} cache cleared`
    });

  } catch (error) {
    console.error('Cache Clear Error:', error);
    res.status(500).json({
      error: 'Failed to clear cache',
      message: error.message
    });
  }
});

/**
 * POST /api/chat/stats/reset
 * Reset statistics (admin only)
 */
router.post('/stats/reset', (req, res) => {
  try {
    aiRouter.resetStats();
    cacheManager.resetStats();

    res.json({
      success: true,
      message: 'Statistics reset'
    });

  } catch (error) {
    console.error('Stats Reset Error:', error);
    res.status(500).json({
      error: 'Failed to reset stats',
      message: error.message
    });
  }
});

export default router;
