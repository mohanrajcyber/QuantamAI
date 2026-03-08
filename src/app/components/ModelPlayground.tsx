import React, { useState } from 'react';
import { Play, Settings, Zap, Brain, ArrowLeft, Sliders, RotateCcw } from 'lucide-react';

interface ModelPlaygroundProps {
  onBack?: () => void;
}

interface ModelConfig {
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
}

export function ModelPlayground({ onBack }: ModelPlaygroundProps) {
  const [selectedModel, setSelectedModel] = useState('mock');
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [config, setConfig] = useState<ModelConfig>({
    temperature: 0.7,
    maxTokens: 150,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  });

  const models = [
    { id: 'mock', name: 'Mock AI', description: 'Always available for testing', color: 'bg-green-500' },
    { id: 'openai', name: 'GPT-4', description: 'Most capable model', color: 'bg-blue-500' },
    { id: 'groq', name: 'Llama 3', description: 'Fast inference', color: 'bg-purple-500' },
    { id: 'gemini', name: 'Gemini Pro', description: 'Google\'s latest', color: 'bg-orange-500' },
    { id: 'ollama', name: 'Ollama Free', description: '650+ free models', color: 'bg-cyan-500' },
  ];

  const presetPrompts = [
    "Explain quantum computing in simple terms",
    "Write a Python function to sort a list",
    "Create a short story about AI",
    "Analyze the benefits of renewable energy",
    "Describe the future of space exploration"
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate API call with different response times based on model
    const delay = selectedModel === 'groq' ? 500 : selectedModel === 'mock' ? 1000 : 2000;
    await new Promise(resolve => setTimeout(resolve, delay));
    
    const mockResponses = {
      mock: `Mock AI Response (Temperature: ${config.temperature}): This is a simulated response based on your prompt "${prompt}". The response varies based on the temperature setting - higher values produce more creative outputs.`,
      openai: `GPT-4 would provide a comprehensive and nuanced response to "${prompt}" with high accuracy and detailed explanations.`,
      groq: `Llama 3 via Groq would deliver a fast, efficient response to "${prompt}" with excellent performance.`,
      gemini: `Gemini Pro would offer a well-structured response to "${prompt}" with Google's advanced AI capabilities.`,
      ollama: `Ollama's free models would provide an open-source response to "${prompt}" without any API costs.`
    };
    
    setResponse(mockResponses[selectedModel as keyof typeof mockResponses]);
    setIsGenerating(false);
  };

  const resetConfig = () => {
    setConfig({
      temperature: 0.7,
      maxTokens: 150,
      topP: 0.9,
      frequencyPenalty: 0,
      presencePenalty: 0,
    });
  };

  return (
    <div className="flex-1 overflow-y-auto relative">
      {/* Back Button */}
      {onBack && (
        <div className="sticky top-0 z-20 bg-[#0f1c2e]/80 backdrop-blur-sm border-b border-gray-800/50 px-8 py-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-800/50 rounded-lg transition-colors text-gray-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Home</span>
          </button>
        </div>
      )}

      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-indigo-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 rounded-2xl shadow-lg shadow-indigo-500/20">
            <Brain className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
            Model Playground
          </h1>
          <p className="text-gray-400">Experiment with different AI models and parameters</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Configuration */}
          <div className="space-y-6">
            {/* Model Selection */}
            <div className="bg-[#1a2539] border border-gray-700/50 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-indigo-400" />
                <h2 className="text-lg font-semibold text-gray-200">Model Selection</h2>
              </div>
              <div className="space-y-3">
                {models.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => setSelectedModel(model.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                      selectedModel === model.id
                        ? 'border-indigo-500 bg-indigo-500/10'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full ${model.color}`}></div>
                    <div className="text-left">
                      <div className="text-sm font-medium text-gray-200">{model.name}</div>
                      <div className="text-xs text-gray-400">{model.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Parameters */}
            <div className="bg-[#1a2539] border border-gray-700/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-indigo-400" />
                  <h2 className="text-lg font-semibold text-gray-200">Parameters</h2>
                </div>
                <button
                  onClick={resetConfig}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  title="Reset to defaults"
                >
                  <RotateCcw className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Temperature: {config.temperature}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={config.temperature}
                    onChange={(e) => setConfig({...config, temperature: parseFloat(e.target.value)})}
                    className="w-full accent-indigo-500"
                  />
                  <div className="text-xs text-gray-500 mt-1">Controls randomness</div>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Max Tokens: {config.maxTokens}
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="500"
                    step="10"
                    value={config.maxTokens}
                    onChange={(e) => setConfig({...config, maxTokens: parseInt(e.target.value)})}
                    className="w-full accent-indigo-500"
                  />
                  <div className="text-xs text-gray-500 mt-1">Maximum response length</div>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Top P: {config.topP}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={config.topP}
                    onChange={(e) => setConfig({...config, topP: parseFloat(e.target.value)})}
                    className="w-full accent-indigo-500"
                  />
                  <div className="text-xs text-gray-500 mt-1">Nucleus sampling</div>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Frequency Penalty: {config.frequencyPenalty}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={config.frequencyPenalty}
                    onChange={(e) => setConfig({...config, frequencyPenalty: parseFloat(e.target.value)})}
                    className="w-full accent-indigo-500"
                  />
                  <div className="text-xs text-gray-500 mt-1">Reduces repetition</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Playground */}
          <div className="lg:col-span-2 space-y-6">
            {/* Prompt Input */}
            <div className="bg-[#1a2539] border border-gray-700/50 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-200 mb-4">Prompt</h2>
              
              {/* Preset Prompts */}
              <div className="mb-4">
                <div className="text-sm text-gray-400 mb-2">Quick prompts:</div>
                <div className="flex flex-wrap gap-2">
                  {presetPrompts.map((preset, index) => (
                    <button
                      key={index}
                      onClick={() => setPrompt(preset)}
                      className="text-xs px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your prompt here..."
                className="w-full bg-[#0f1c2e] border border-gray-600 rounded-lg px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none"
                rows={4}
              />

              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="mt-4 w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-all flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    <span>Generate Response</span>
                  </>
                )}
              </button>
            </div>

            {/* Response */}
            {response && (
              <div className="bg-[#1a2539] border border-gray-700/50 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-gray-200 mb-4">Response</h2>
                <div className="bg-[#0f1c2e] rounded-lg p-4">
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{response}</p>
                </div>
                
                {/* Response Stats */}
                <div className="mt-4 flex items-center gap-6 text-sm text-gray-400">
                  <span>Model: {models.find(m => m.id === selectedModel)?.name}</span>
                  <span>Tokens: ~{response.split(' ').length}</span>
                  <span>Temperature: {config.temperature}</span>
                </div>
              </div>
            )}

            {/* Model Comparison */}
            <div className="bg-[#1a2539] border border-gray-700/50 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-200 mb-4">Model Comparison</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#0f1c2e] rounded-lg p-4">
                  <h3 className="font-medium text-gray-200 mb-2">Speed Comparison</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Groq (Llama)</span>
                      <span className="text-green-400">~0.5s</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Mock AI</span>
                      <span className="text-yellow-400">~1.0s</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>GPT-4</span>
                      <span className="text-orange-400">~2.0s</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#0f1c2e] rounded-lg p-4">
                  <h3 className="font-medium text-gray-200 mb-2">Quality Rating</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>GPT-4</span>
                      <span className="text-green-400">★★★★★</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Gemini Pro</span>
                      <span className="text-green-400">★★★★☆</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Llama 3</span>
                      <span className="text-yellow-400">★★★☆☆</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}