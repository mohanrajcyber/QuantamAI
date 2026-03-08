import React, { useState } from 'react';
import { Image, Download, Sparkles, Wand2, Palette, Camera, ArrowLeft } from 'lucide-react';
import { Language, translations } from '../utils/translations';
import { showToast } from './Toast';
import { ButtonSpinner } from './LoadingSpinner';

interface ImageGeneratorProps {
  onBack?: () => void;
  language?: Language;
}

export function ImageGenerator({ onBack, language = 'en' }: ImageGeneratorProps) {
  const t = translations[language];
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [selectedStyle, setSelectedStyle] = useState('realistic');

  const styles = [
    { id: 'realistic', name: t.realistic, icon: Camera },
    { id: 'artistic', name: t.artistic, icon: Palette },
    { id: 'anime', name: t.anime, icon: Sparkles },
    { id: 'digital', name: t.digitalArt, icon: Wand2 },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    showToast(t.generating || 'Generating images...', 'info');
    
    // Simulate image generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock generated images
    const mockImages = [
      'https://picsum.photos/512/512?random=1',
      'https://picsum.photos/512/512?random=2',
      'https://picsum.photos/512/512?random=3',
      'https://picsum.photos/512/512?random=4',
    ];
    
    setGeneratedImages(mockImages);
    setIsGenerating(false);
    showToast('Images generated successfully! ✨', 'success');
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
            <span className="text-sm">{t.backToHome}</span>
          </button>
        </div>
      )}

      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gradient-to-br from-pink-600 via-purple-600 to-blue-600 rounded-2xl shadow-lg shadow-purple-500/20">
            <Image className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
            {t.imageGenerator}
          </h1>
          <p className="text-gray-400">{t.createStunningImages}</p>
        </div>

        {/* Generation Interface */}
        <div className="bg-[#1a2539] border border-gray-700/50 rounded-xl p-6 mb-8">
          <div className="space-y-6">
            {/* Prompt Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t.describeYourImage}
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A beautiful sunset over mountains, digital art style..."
                className="w-full bg-[#0f1c2e] border border-gray-600 rounded-lg px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
                rows={3}
              />
            </div>

            {/* Style Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                {t.artStyle}
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {styles.map((style) => {
                  const Icon = style.icon;
                  return (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style.id)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-all ${
                        selectedStyle === style.id
                          ? 'border-purple-500 bg-purple-500/10'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <Icon className="w-6 h-6 text-purple-400" />
                      <span className="text-sm text-gray-300">{style.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className="w-full py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-100"
            >
              {isGenerating ? (
                <>
                  <ButtonSpinner />
                  <span>{t.generating}</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  <span>{t.generate} Images</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Generated Images */}
        {generatedImages.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-300">Generated Images</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {generatedImages.map((image, index) => (
                <div key={index} className="group relative bg-[#1a2539] rounded-lg overflow-hidden border border-gray-700/50">
                  <img
                    src={image}
                    alt={`Generated ${index + 1}`}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors">
                      <Download className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}