import { useState, useRef, useEffect } from 'react';
import { Code, Send, Sparkles, Copy, Download, RefreshCw, Settings, Loader2, CheckCircle } from 'lucide-react';
import { generateCode, explainCode, debugCode, refactorCode, AIProvider } from '../services/aiService';

export function CodeAssistant() {
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [mode, setMode] = useState<'generate' | 'explain' | 'debug' | 'refactor'>('generate');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [provider, setProvider] = useState<AIProvider>('groq');
  const [copied, setCopied] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

  const languages = [
    'javascript', 'typescript', 'python', 'java', 'cpp', 'c', 'csharp',
    'go', 'rust', 'php', 'ruby', 'swift', 'kotlin', 'sql', 'html', 'css'
  ];

  const modes = [
    { value: 'generate', label: 'Generate Code', icon: Code },
    { value: 'explain', label: 'Explain Code', icon: Sparkles },
    { value: 'debug', label: 'Debug Code', icon: RefreshCw },
    { value: 'refactor', label: 'Refactor Code', icon: Settings },
  ];

  const handleSubmit = async () => {
    if (!prompt.trim() && mode !== 'explain' && mode !== 'debug' && mode !== 'refactor') return;
    if ((mode === 'explain' || mode === 'debug' || mode === 'refactor') && !code.trim()) return;

    setIsLoading(true);
    setOutput('');

    try {
      let result = '';
      
      switch (mode) {
        case 'generate':
          result = await generateCode(prompt, language, provider);
          break;
        case 'explain':
          result = await explainCode(code, language, provider);
          break;
        case 'debug':
          result = await debugCode(code, language, prompt, provider);
          break;
        case 'refactor':
          result = await refactorCode(code, language, provider);
          break;
      }

      setOutput(result);
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadCode = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${language}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-[#0f1c2e]">
      {/* Header */}
      <div className="border-b border-gray-800/50 bg-[#0a1628]/80 backdrop-blur-sm px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Code className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Code Assistant</h1>
              <p className="text-xs text-gray-400">AI-powered code generation and analysis</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value as AIProvider)}
              className="px-3 py-2 bg-[#1a2539] border border-gray-700/50 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-blue-500"
            >
              <option value="groq">Groq (Fast)</option>
              <option value="openai">OpenAI GPT</option>
              <option value="gemini">Google Gemini</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex">
        {/* Left Panel - Input */}
        <div className="w-1/2 border-r border-gray-800/50 flex flex-col">
          {/* Mode Selection */}
          <div className="p-4 border-b border-gray-800/50">
            <div className="grid grid-cols-4 gap-2">
              {modes.map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.value}
                    onClick={() => setMode(m.value as any)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-all ${
                      mode === m.value
                        ? 'bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/50'
                        : 'bg-[#1a2539] border border-gray-700/50 hover:border-gray-600'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${mode === m.value ? 'text-purple-400' : 'text-gray-400'}`} />
                    <span className="text-xs text-gray-300">{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Language Selection */}
          <div className="p-4 border-b border-gray-800/50">
            <label className="block text-sm text-gray-400 mb-2">Programming Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-4 py-2 bg-[#1a2539] border border-gray-700/50 rounded-lg text-gray-300 focus:outline-none focus:border-blue-500"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Input Area */}
          <div className="flex-1 flex flex-col p-4 overflow-hidden">
            {mode === 'generate' ? (
              <div className="flex-1 flex flex-col">
                <label className="block text-sm text-gray-400 mb-2">Describe what you want to create</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="E.g., Create a function to sort an array of objects by date..."
                  className="flex-1 bg-[#1a2539] border border-gray-700/50 rounded-lg px-4 py-3 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>
            ) : (
              <>
                <label className="block text-sm text-gray-400 mb-2">
                  {mode === 'explain' ? 'Paste code to explain' : mode === 'debug' ? 'Paste code to debug' : 'Paste code to refactor'}
                </label>
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Paste your code here..."
                  className="flex-1 bg-[#1a2539] border border-gray-700/50 rounded-lg px-4 py-3 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none font-mono text-sm"
                />
                {mode === 'debug' && (
                  <div className="mt-3">
                    <label className="block text-sm text-gray-400 mb-2">Error message (optional)</label>
                    <input
                      type="text"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Paste error message here..."
                      className="w-full bg-[#1a2539] border border-gray-700/50 rounded-lg px-4 py-2 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                )}
              </>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="mt-4 w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>{mode === 'generate' ? 'Generate' : mode === 'explain' ? 'Explain' : mode === 'debug' ? 'Debug' : 'Refactor'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Panel - Output */}
        <div className="w-1/2 flex flex-col">
          {/* Output Header */}
          <div className="p-4 border-b border-gray-800/50 flex items-center justify-between">
            <div className="text-sm text-gray-400">
              {output ? 'Result' : 'Output will appear here'}
            </div>
            {output && (
              <div className="flex items-center gap-2">
                <button
                  onClick={copyToClipboard}
                  className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors group"
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400 group-hover:text-gray-300" />
                  )}
                </button>
                <button
                  onClick={downloadCode}
                  className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors group"
                  title="Download"
                >
                  <Download className="w-4 h-4 text-gray-400 group-hover:text-gray-300" />
                </button>
              </div>
            )}
          </div>

          {/* Output Content */}
          <div ref={outputRef} className="flex-1 overflow-y-auto p-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-400">AI is working on your request...</p>
                </div>
              </div>
            ) : output ? (
              <pre className="bg-[#1a2539] border border-gray-700/50 rounded-lg px-4 py-3 text-gray-300 text-sm font-mono whitespace-pre-wrap">
                {output}
              </pre>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-purple-400" />
                  </div>
                  <p className="text-gray-400">Start by selecting a mode and entering your request</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
