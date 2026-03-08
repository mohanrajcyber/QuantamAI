import { useEffect, useState } from 'react';
import { Sparkles, X } from 'lucide-react';

export function WelcomeToast() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show welcome toast after 1 second
    const timer = setTimeout(() => {
      const hasSeenWelcome = localStorage.getItem('quantum-ai-welcome-seen');
      if (!hasSeenWelcome) {
        setIsVisible(true);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('quantum-ai-welcome-seen', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-20 right-8 z-50 max-w-md animate-in slide-in-from-right-5 fade-in duration-500">
      <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-xl border border-blue-500/30 rounded-xl p-4 shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex-shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-1">Welcome to Quantum AI! 🚀</h3>
            <p className="text-sm text-gray-300 mb-3">
              Your AI-powered workspace is ready with:
            </p>
            <ul className="text-sm text-gray-300 space-y-1 mb-3">
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span><strong>Quantum Agent</strong> - Career, Business & Healthcare AI</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span><strong>Code Assistant</strong> - Generate & debug code</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span><strong>Quantum IDE</strong> - Full development environment</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span><strong>3 AI Providers</strong> - OpenAI, Groq & Gemini</span>
              </li>
            </ul>
            <p className="text-xs text-blue-300">
              Click any option in the sidebar to get started!
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-white/10 rounded transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}