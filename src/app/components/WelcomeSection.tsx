import { MessageSquare, Code, Lightbulb, Sparkles, Send, Clock, TrendingUp, Zap, Image, Mic, FileText, Bot, BarChart3, Briefcase, Workflow } from 'lucide-react';
import { useState } from 'react';
import { ChatInterface } from './ChatInterface';
import { ViewType } from '../App';
import { Language, translations } from '../utils/translations';

interface WelcomeSectionProps {
  onNavigate: (view: ViewType) => void;
  onMasterAccess?: () => void;
  language?: Language;
}

export function WelcomeSection({ onNavigate, onMasterAccess, language = 'en' }: WelcomeSectionProps) {
  const t = translations[language];
  const [searchQuery, setSearchQuery] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [initialMessage, setInitialMessage] = useState('');

  const handleSubmit = () => {
    if (searchQuery.trim()) {
      setInitialMessage(searchQuery.trim());
      setShowChat(true);
      setSearchQuery('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSuggestionClick = (suggestionText: string) => {
    setInitialMessage(suggestionText);
    setShowChat(true);
  };

  const actionCards = [
    {
      icon: MessageSquare,
      title: t.startChat,
      description: t.askAnything,
      gradient: 'from-blue-500/10 to-blue-600/10',
      iconColor: 'text-blue-400',
      borderColor: 'border-blue-500/30',
      action: () => setShowChat(true),
    },
    {
      icon: Code,
      title: t.generateCode,
      description: t.aiPoweredCoding,
      gradient: 'from-purple-500/10 to-purple-600/10',
      iconColor: 'text-purple-400',
      borderColor: 'border-purple-500/30',
      action: () => onNavigate('codeAssistant'),
    },
    {
      icon: Image,
      title: t.createImages,
      description: t.aiImageGeneration,
      gradient: 'from-pink-500/10 to-pink-600/10',
      iconColor: 'text-pink-400',
      borderColor: 'border-pink-500/30',
      action: () => onNavigate('imageGenerator'),
    },
    {
      icon: Mic,
      title: t.voiceChat,
      description: t.speakWithAI,
      gradient: 'from-green-500/10 to-green-600/10',
      iconColor: 'text-green-400',
      borderColor: 'border-green-500/30',
      action: () => onNavigate('voiceAssistant'),
    },
    {
      icon: FileText,
      title: t.analyzeDocuments,
      description: t.documentInsights,
      gradient: 'from-orange-500/10 to-orange-600/10',
      iconColor: 'text-orange-400',
      borderColor: 'border-orange-500/30',
      action: () => onNavigate('documentAnalyzer'),
    },
    {
      icon: BarChart3,
      title: t.dataAnalyticsCard,
      description: t.usageInsights,
      gradient: 'from-cyan-500/10 to-cyan-600/10',
      iconColor: 'text-cyan-400',
      borderColor: 'border-cyan-500/30',
      action: () => onNavigate('dataAnalytics'),
    },
    {
      icon: Briefcase,
      title: t.career,
      description: t.jobCareerGuidance,
      gradient: 'from-indigo-500/10 to-indigo-600/10',
      iconColor: 'text-indigo-400',
      borderColor: 'border-indigo-500/30',
      action: () => window.open('http://localhost:5175', '_blank'),
    },
    {
      icon: Workflow,
      title: t.aiWorkflowsCard,
      description: t.automatedTasks,
      gradient: 'from-emerald-500/10 to-emerald-600/10',
      iconColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/30',
      action: () => onNavigate('aiWorkflows'),
    },
    {
      icon: Bot,
      title: t.quantumAgentCard,
      description: t.advancedAI,
      gradient: 'from-cyan-500/10 to-cyan-600/10',
      iconColor: 'text-cyan-400',
      borderColor: 'border-cyan-500/30',
      action: () => onNavigate('quantumAgent'),
    },
    {
      icon: Lightbulb,
      title: t.brainstorm,
      description: t.ideasSolutions,
      gradient: 'from-amber-500/10 to-amber-600/10',
      iconColor: 'text-amber-400',
      borderColor: 'border-amber-500/30',
      action: () => setShowChat(true),
    },
    {
      icon: Sparkles,
      title: t.creativeMode,
      description: t.artContent,
      gradient: 'from-pink-500/10 to-pink-600/10',
      iconColor: 'text-pink-400',
      borderColor: 'border-pink-500/30',
      action: () => setShowChat(true),
    },
  ];

  const suggestions = [
    { text: 'Explain quantum computing', icon: Zap },
    { text: 'Write Python code for API', icon: Code },
    { text: 'Plan marketing strategy', icon: TrendingUp },
    { text: 'Create social media post', icon: Sparkles },
  ];

  const recentChats = [
    { title: 'React component optimization', time: '2h ago' },
    { title: 'Database design discussion', time: '5h ago' },
    { title: 'AI model training tips', time: '1d ago' },
  ];

  // Show chat interface if chat is started
  if (showChat) {
    return <ChatInterface onBack={() => setShowChat(false)} initialMessage={initialMessage} onMasterAccess={onMasterAccess} language={language} />;
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Hero Section with Centered Search */}
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-8 py-12 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 w-full max-w-3xl">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl shadow-lg shadow-blue-500/20">
              <Sparkles className="w-10 h-10" />
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {t.welcome || 'Quantum AI'}
            </h1>
            <p className="text-xl text-gray-400 mb-2">{t.welcomeBack || 'Welcome back!'}</p>
            <p className="text-base text-gray-500">{t.howCanIHelp || 'How can I assist you today?'}</p>
          </div>

          {/* Main Search Bar */}
          <div className="mb-8">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
              <div className="relative flex items-center bg-[#1a2539] border border-gray-700/50 rounded-xl overflow-hidden shadow-xl">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t.typeMessage || 'Ask me anything...'}
                  className="flex-1 bg-transparent px-6 py-4 text-base text-gray-200 placeholder-gray-500 focus:outline-none"
                />
                <button 
                  onClick={handleSubmit}
                  disabled={!searchQuery.trim()}
                  className="m-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-100"
                >
                  <span>{t.send}</span>
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Suggestions */}
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              {suggestions.map((suggestion, index) => {
                const Icon = suggestion.icon;
                return (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion.text)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#1a2539] hover:bg-[#1f2d42] border border-gray-700/50 rounded-lg text-sm text-gray-300 transition-all hover:border-gray-600 cursor-pointer"
                  >
                    <Icon className="w-3 h-3" />
                    <span>{suggestion.text}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Action Cards Section */}
      <div className="px-8 pb-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-semibold mb-6 text-gray-300">{t.whatWouldYouLikeToDo}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {actionCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <button
                  key={index}
                  className={`bg-gradient-to-br ${card.gradient} border ${card.borderColor} rounded-xl p-6 text-left hover:border-opacity-100 transition-all hover:scale-105 hover:shadow-2xl group animate-slide-up cursor-pointer`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={card.action}
                >
                  <div className={`${card.iconColor} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-semibold mb-1 text-white">{card.title}</h3>
                  <p className="text-xs text-gray-400">{card.description}</p>
                </button>
              );
            })}
          </div>

          {/* Recent Chats */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-300">{t.recentConversations}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentChats.map((chat, index) => (
                <button
                  key={index}
                  className="flex items-start gap-3 p-4 bg-[#1a2539] hover:bg-[#1f2d42] border border-gray-700/50 rounded-xl text-left transition-all hover:border-gray-600 hover:scale-105 group animate-fade-in cursor-pointer"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                    <Clock className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-200 mb-1 truncate">{chat.title}</h3>
                    <p className="text-xs text-gray-500">{chat.time}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}