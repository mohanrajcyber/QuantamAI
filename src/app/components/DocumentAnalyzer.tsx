import React, { useState } from 'react';
import { FileText, Upload, Search, Download, Eye, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

interface DocumentAnalyzerProps {
  onBack?: () => void;
}

interface AnalysisResult {
  summary: string;
  keyPoints: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  wordCount: number;
  readingTime: number;
}

export function DocumentAnalyzer({ onBack }: DocumentAnalyzerProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setAnalysisResult(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const analyzeDocument = async () => {
    if (!uploadedFile) return;
    
    setIsAnalyzing(true);
    
    // Simulate analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockResult: AnalysisResult = {
      summary: "This document discusses the fundamentals of artificial intelligence and machine learning, covering key concepts, applications, and future trends in the field.",
      keyPoints: [
        "AI and ML are transforming various industries",
        "Deep learning has shown remarkable progress in recent years",
        "Ethical considerations are crucial for AI development",
        "Future applications include autonomous systems and personalized medicine"
      ],
      sentiment: 'positive',
      wordCount: 2847,
      readingTime: 11
    };
    
    setAnalysisResult(mockResult);
    setIsAnalyzing(false);
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
        <div className="absolute top-20 left-20 w-72 h-72 bg-orange-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-red-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gradient-to-br from-orange-600 via-red-600 to-pink-600 rounded-2xl shadow-lg shadow-orange-500/20">
            <FileText className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
            Document Analyzer
          </h1>
          <p className="text-gray-400">AI-powered document analysis and insights</p>
        </div>

        {/* Upload Area */}
        <div className="mb-8">
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              dragOver
                ? 'border-orange-500 bg-orange-500/10'
                : 'border-gray-600 hover:border-gray-500'
            }`}
          >
            {uploadedFile ? (
              <div className="space-y-4">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto" />
                <div>
                  <p className="text-lg font-medium text-gray-200">{uploadedFile.name}</p>
                  <p className="text-sm text-gray-400">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={analyzeDocument}
                  disabled={isAnalyzing}
                  className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-all flex items-center gap-2 mx-auto"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      <span>Analyze Document</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                <div>
                  <p className="text-lg font-medium text-gray-300">Drop your document here</p>
                  <p className="text-sm text-gray-500">or click to browse</p>
                </div>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a2539] hover:bg-[#1f2d42] border border-gray-600 rounded-lg cursor-pointer transition-colors"
                >
                  <Upload className="w-5 h-5" />
                  <span>Choose File</span>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Analysis Results */}
        {analysisResult && (
          <div className="space-y-6">
            {/* Summary */}
            <div className="bg-[#1a2539] border border-gray-700/50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-orange-400" />
                Summary
              </h2>
              <p className="text-gray-300 leading-relaxed">{analysisResult.summary}</p>
            </div>

            {/* Key Points */}
            <div className="bg-[#1a2539] border border-gray-700/50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-200 mb-4">Key Points</h2>
              <ul className="space-y-3">
                {analysisResult.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#1a2539] border border-gray-700/50 rounded-xl p-6 text-center">
                <div className="text-2xl font-bold text-orange-400 mb-2">
                  {analysisResult.wordCount.toLocaleString()}
                </div>
                <div className="text-gray-400">Words</div>
              </div>
              
              <div className="bg-[#1a2539] border border-gray-700/50 rounded-xl p-6 text-center">
                <div className="text-2xl font-bold text-blue-400 mb-2">
                  {analysisResult.readingTime} min
                </div>
                <div className="text-gray-400">Reading Time</div>
              </div>
              
              <div className="bg-[#1a2539] border border-gray-700/50 rounded-xl p-6 text-center">
                <div className={`text-2xl font-bold mb-2 capitalize ${
                  analysisResult.sentiment === 'positive' ? 'text-green-400' :
                  analysisResult.sentiment === 'negative' ? 'text-red-400' : 'text-yellow-400'
                }`}>
                  {analysisResult.sentiment}
                </div>
                <div className="text-gray-400">Sentiment</div>
              </div>
            </div>

            {/* Export Options */}
            <div className="bg-[#1a2539] border border-gray-700/50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-200 mb-4">Export Analysis</h2>
              <div className="flex flex-wrap gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                  <span>PDF Report</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                  <span>JSON Data</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                  <span>Summary Text</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}