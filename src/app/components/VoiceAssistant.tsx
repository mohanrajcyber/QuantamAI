import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Play, Pause, ArrowLeft, Waveform } from 'lucide-react';

interface VoiceAssistantProps {
  onBack?: () => void;
}

export function VoiceAssistant({ onBack }: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [volume, setVolume] = useState(0.8);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const startListening = () => {
    setIsListening(true);
    // Simulate speech recognition
    setTimeout(() => {
      setTranscript("Hello, I'd like to know about quantum computing");
      setIsListening(false);
      handleVoiceResponse();
    }, 3000);
  };

  const stopListening = () => {
    setIsListening(false);
  };

  const handleVoiceResponse = () => {
    setIsSpeaking(true);
    const mockResponse = "Quantum computing is a revolutionary technology that uses quantum mechanical phenomena to process information in ways that classical computers cannot.";
    setResponse(mockResponse);
    
    // Simulate speaking duration
    setTimeout(() => {
      setIsSpeaking(false);
    }, 5000);
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
        <div className="absolute top-20 left-20 w-72 h-72 bg-green-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-gradient-to-br from-green-600 via-blue-600 to-purple-600 rounded-full shadow-lg shadow-green-500/20">
            <Mic className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Voice Assistant
          </h1>
          <p className="text-xl text-gray-400">Speak naturally with AI</p>
        </div>

        {/* Main Voice Interface */}
        <div className="text-center mb-12">
          <div className="relative inline-block">
            {/* Main Microphone Button */}
            <button
              onClick={isListening ? stopListening : startListening}
              className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
                isListening
                  ? 'bg-red-500 hover:bg-red-400 animate-pulse'
                  : 'bg-gradient-to-br from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500'
              } shadow-2xl`}
            >
              {isListening ? (
                <MicOff className="w-12 h-12 text-white" />
              ) : (
                <Mic className="w-12 h-12 text-white" />
              )}
            </button>

            {/* Listening Animation */}
            {isListening && (
              <div className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping"></div>
            )}
          </div>

          <p className="mt-6 text-lg text-gray-300">
            {isListening ? 'Listening...' : 'Tap to speak'}
          </p>
        </div>

        {/* Voice Controls */}
        <div className="bg-[#1a2539] border border-gray-700/50 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`p-3 rounded-lg transition-colors ${
                  voiceEnabled ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'
                }`}
              >
                {voiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
              <span className="text-gray-300">Voice Output</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-sm">Volume</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-24 accent-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Conversation Display */}
        <div className="space-y-6">
          {/* User Speech */}
          {transcript && (
            <div className="flex justify-end">
              <div className="max-w-2xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl rounded-tr-sm px-6 py-4">
                <div className="flex items-center gap-2 mb-2">
                  <Mic className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-blue-400">You said:</span>
                </div>
                <p className="text-gray-100">{transcript}</p>
              </div>
            </div>
          )}

          {/* AI Response */}
          {response && (
            <div className="flex justify-start">
              <div className="max-w-2xl bg-gradient-to-br from-green-900/40 to-blue-900/40 border border-green-500/30 rounded-2xl rounded-tl-sm px-6 py-4">
                <div className="flex items-center gap-2 mb-2">
                  <Volume2 className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-400">AI Response:</span>
                  {isSpeaking && (
                    <div className="flex items-center gap-1">
                      <div className="w-1 h-3 bg-green-400 rounded animate-pulse"></div>
                      <div className="w-1 h-2 bg-green-400 rounded animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-1 h-4 bg-green-400 rounded animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  )}
                </div>
                <p className="text-gray-100">{response}</p>
              </div>
            </div>
          )}
        </div>

        {/* Voice Commands Help */}
        <div className="mt-12 bg-[#1a2539] border border-gray-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-300 mb-4">Voice Commands</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-400">"Ask me about..."</p>
              <p className="text-sm text-gray-400">"Generate code for..."</p>
              <p className="text-sm text-gray-400">"Explain quantum computing"</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-400">"What's the weather like?"</p>
              <p className="text-sm text-gray-400">"Help me with..."</p>
              <p className="text-sm text-gray-400">"Tell me a joke"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}