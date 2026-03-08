import express from 'express';
import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class OllamaFreeAPI {
  constructor() {
    this.modelsData = {};
    this.families = {};
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;
    
    try {
      await this.loadModelsData();
      this.extractFamilies();
      this.initialized = true;
      console.log('OllamaFreeAPI initialized successfully');
    } catch (error) {
      console.error('Failed to initialize OllamaFreeAPI:', error);
      throw error;
    }
  }

  async loadModelsData() {
    const jsonDir = path.join(__dirname, '../ollama_json');
    
    try {
      const files = await fs.readdir(jsonDir);
      const jsonFiles = files.filter(file => file.endsWith('.json'));
      
      for (const jsonFile of jsonFiles) {
        try {
          const filePath = path.join(jsonDir, jsonFile);
          const data = await fs.readFile(filePath, 'utf-8');
          const jsonData = JSON.parse(data);
          const familyName = path.basename(jsonFile, '.json').toLowerCase();
          
          const models = this.extractModelsFromData(jsonData);
          if (models && models.length > 0) {
            // Remove digest and perf_response_text fields
            models.forEach(model => {
              if (typeof model === 'object') {
                delete model.digest;
                delete model.perf_response_text;
              }
            });
            
            // Sort models by size (largest first)
            models.sort((a, b) => {
              const sizeA = parseInt(a.size || 0);
              const sizeB = parseInt(b.size || 0);
              return sizeB - sizeA;
            });
            
            this.modelsData[familyName] = models;
          }
        } catch (error) {
          console.error(`Error loading ${jsonFile}:`, error.message);
        }
      }
    } catch (error) {
      console.error('Error reading ollama_json directory:', error);
      // Initialize with empty data if directory doesn't exist
      this.modelsData = {};
    }
  }

  extractModelsFromData(data) {
    if (Array.isArray(data)) {
      return data;
    }
    if (data.props && data.props.pageProps) {
      return data.props.pageProps.models || [];
    }
    return data.models || [];
  }

  extractFamilies() {
    this.families = {};
    
    for (const [familyName, models] of Object.entries(this.modelsData)) {
      const modelNames = [];
      
      for (const model of models) {
        if (typeof model !== 'object') continue;
        
        const modelName = this.getModelName(model);
        if (modelName) {
          modelNames.push(modelName);
        }
      }
      
      if (modelNames.length > 0) {
        this.families[familyName] = modelNames;
      }
    }
  }

  getModelName(model) {
    return model.model_name || model.model || model.name;
  }

  listFamilies() {
    return Object.keys(this.families);
  }

  listModels(family = null) {
    if (family === null) {
      return Object.values(this.families).flat();
    }
    return this.families[family.toLowerCase()] || [];
  }

  getModelInfo(modelName) {
    for (const models of Object.values(this.modelsData)) {
      for (const model of models) {
        if (typeof model === 'object') {
          if (model.model_name === modelName || model.model === modelName) {
            return model;
          }
        }
      }
    }
    throw new Error(`Model '${modelName}' not found`);
  }

  getModelServers(modelName) {
    const servers = [];
    
    for (const models of Object.values(this.modelsData)) {
      for (const model of models) {
        if (model.model_name === modelName) {
          const serverInfo = {
            url: model.ip_port,
            location: {
              city: model.ip_city_name_en,
              country: model.ip_country_name_en,
              continent: model.ip_continent_name_en
            },
            organization: model.ip_organization,
            performance: {
              tokens_per_second: model.perf_tokens_per_second,
              last_tested: model.perf_last_tested
            }
          };
          servers.push(serverInfo);
        }
      }
    }
    
    return servers;
  }

  async chat(prompt, modelName = null, options = {}) {
    if (!modelName) {
      const allModels = this.listModels();
      if (allModels.length === 0) {
        throw new Error('No models available');
      }
      modelName = allModels[Math.floor(Math.random() * allModels.length)];
      console.log(`Selected model: ${modelName}`);
    }

    const servers = this.getModelServers(modelName);
    if (servers.length === 0) {
      throw new Error(`No servers available for model '${modelName}'`);
    }

    // Shuffle servers for load balancing
    const shuffledServers = [...servers].sort(() => Math.random() - 0.5);
    
    let lastError = null;
    
    for (const server of shuffledServers) {
      try {
        const payload = {
          model: modelName,
          prompt: prompt,
          options: {
            temperature: options.temperature || 0.7,
            top_p: options.top_p || 0.9,
            stop: options.stop || [],
            num_predict: options.num_predict || 128,
            ...options
          }
        };

        const response = await axios.post(`${server.url}/api/generate`, payload, {
          timeout: 30000,
          headers: {
            'Content-Type': 'application/json'
          }
        });

        return response.data.response;
      } catch (error) {
        lastError = error;
        console.error(`Server ${server.url} failed:`, error.message);
        continue;
      }
    }

    throw new Error(`All servers failed for model '${modelName}'. Last error: ${lastError?.message}`);
  }
}

// Initialize the Ollama client
const ollamaClient = new OllamaFreeAPI();

// Copy ollama_json files from the uploaded folder
async function copyOllamaJsonFiles() {
  const sourceDir = path.join(process.cwd(), 'ollamafreeapi-main/ollamafreeapi/ollama_json');
  const targetDir = path.join(__dirname, '../ollama_json');
  
  try {
    // Create target directory if it doesn't exist
    await fs.mkdir(targetDir, { recursive: true });
    
    // Check if source directory exists before trying to copy
    try {
      const files = await fs.readdir(sourceDir);
      const jsonFiles = files.filter(file => file.endsWith('.json'));
      
      for (const file of jsonFiles) {
        const sourcePath = path.join(sourceDir, file);
        const targetPath = path.join(targetDir, file);
        await fs.copyFile(sourcePath, targetPath);
      }
      
      console.log(`Copied ${jsonFiles.length} JSON files to backend/ollama_json`);
    } catch (sourceError) {
      console.warn('Source ollama_json directory not found, using existing backend/ollama_json');
    }
  } catch (error) {
    console.error('Error copying ollama_json files:', error);
  }
}

// Initialize on startup
(async () => {
  try {
    await copyOllamaJsonFiles();
    await ollamaClient.initialize();
  } catch (error) {
    console.error('Failed to initialize Ollama client:', error);
  }
})();

// Routes

// List all model families
router.get('/families', async (req, res) => {
  try {
    await ollamaClient.initialize();
    const families = ollamaClient.listFamilies();
    res.json({ families });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// List models (optionally filtered by family)
router.get('/models', async (req, res) => {
  try {
    await ollamaClient.initialize();
    const { family } = req.query;
    const models = ollamaClient.listModels(family);
    res.json({ models, family: family || 'all' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get model information
router.get('/models/:modelName', async (req, res) => {
  try {
    await ollamaClient.initialize();
    const { modelName } = req.params;
    const modelInfo = ollamaClient.getModelInfo(modelName);
    res.json(modelInfo);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Get model servers
router.get('/models/:modelName/servers', async (req, res) => {
  try {
    await ollamaClient.initialize();
    const { modelName } = req.params;
    const servers = ollamaClient.getModelServers(modelName);
    res.json({ model: modelName, servers });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Chat with a model
router.post('/chat', async (req, res) => {
  try {
    await ollamaClient.initialize();
    const { prompt, model, options = {} } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    
    const response = await ollamaClient.chat(prompt, model, options);
    res.json({ 
      response, 
      model: model || 'auto-selected',
      prompt 
    });
  } catch (error) {
    console.error('Ollama chat error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get API status and statistics
router.get('/status', async (req, res) => {
  try {
    await ollamaClient.initialize();
    const families = ollamaClient.listFamilies();
    const allModels = ollamaClient.listModels();
    
    let totalServers = 0;
    const familyStats = {};
    
    for (const family of families) {
      const models = ollamaClient.listModels(family);
      familyStats[family] = {
        modelCount: models.length,
        models: models.slice(0, 5) // Show first 5 models
      };
      
      // Count servers for this family
      for (const model of models.slice(0, 3)) { // Check first 3 models to avoid too many requests
        try {
          const servers = ollamaClient.getModelServers(model);
          totalServers += servers.length;
        } catch (error) {
          // Ignore errors for individual models
        }
      }
    }
    
    res.json({
      status: 'active',
      statistics: {
        totalFamilies: families.length,
        totalModels: allModels.length,
        estimatedServers: totalServers,
        familyBreakdown: familyStats
      },
      initialized: ollamaClient.initialized
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;