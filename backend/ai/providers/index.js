/**
 * Provider Registry
 * Central place to manage all AI providers
 */

import OpenAIProvider from './openai.js';
import GeminiProvider from './gemini.js';
import GroqProvider from './groq.js';
import OllamaProvider from './ollama.js';
import PollinationsProvider from './pollinations.js';
import G4FProvider from './g4f.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Initialize all providers based on configuration
 * @returns {Array<AIProvider>}
 */
export function initializeProviders() {
  const providers = [];

  // Ollama (Priority 1 - Free, unlimited, local)
  if (process.env.ENABLE_OLLAMA !== 'false') {
    providers.push(new OllamaProvider({
      enabled: true,
      baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
      priority: 1
    }));
  }

  // Pollinations (Priority 2 - Free, unlimited, no signup)
  if (process.env.ENABLE_POLLINATIONS !== 'false') {
    providers.push(new PollinationsProvider({
      enabled: true,
      priority: 2
    }));
  }

  // G4F (Priority 3 - Free, 200+ models, unlimited)
  if (process.env.ENABLE_G4F !== 'false') {
    providers.push(new G4FProvider({
      enabled: true,
      priority: 3
    }));
  }

  // Groq (Priority 4 - Free tier, rate limited)
  if (process.env.GROQ_API_KEY) {
    providers.push(new GroqProvider({
      enabled: true,
      apiKey: process.env.GROQ_API_KEY,
      priority: 4
    }));
  }

  // Gemini (Priority 5 - Free tier available)
  if (process.env.GEMINI_API_KEY) {
    providers.push(new GeminiProvider({
      enabled: true,
      apiKey: process.env.GEMINI_API_KEY,
      priority: 5
    }));
  }

  // OpenAI (Priority 6 - Paid, but high quality)
  if (process.env.OPENAI_API_KEY) {
    providers.push(new OpenAIProvider({
      enabled: true,
      apiKey: process.env.OPENAI_API_KEY,
      priority: 6
    }));
  }

  // Sort by priority (lower number = higher priority)
  providers.sort((a, b) => a.priority - b.priority);

  console.log(`✅ Initialized ${providers.length} AI providers:`);
  providers.forEach(p => {
    console.log(`   - ${p.name} (priority: ${p.priority}, enabled: ${p.enabled})`);
  });

  return providers;
}

/**
 * Get provider by name
 * @param {string} name
 * @param {Array<AIProvider>} providers
 * @returns {AIProvider|null}
 */
export function getProviderByName(name, providers) {
  return providers.find(p => p.name === name) || null;
}

/**
 * Get all enabled providers
 * @param {Array<AIProvider>} providers
 * @returns {Array<AIProvider>}
 */
export function getEnabledProviders(providers) {
  return providers.filter(p => p.enabled);
}

/**
 * Check health of all providers
 * @param {Array<AIProvider>} providers
 * @returns {Promise<Object>}
 */
export async function checkAllProvidersHealth(providers) {
  const results = {};
  
  await Promise.all(
    providers.map(async (provider) => {
      const isHealthy = await provider.healthCheck();
      results[provider.name] = {
        healthy: isHealthy,
        enabled: provider.enabled,
        priority: provider.priority
      };
    })
  );

  return results;
}

// Export provider classes for direct use
export {
  OpenAIProvider,
  GeminiProvider,
  GroqProvider,
  OllamaProvider,
  PollinationsProvider,
  G4FProvider
};
