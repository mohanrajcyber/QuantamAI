import { useState } from 'react';
import { 
  Sparkles, Briefcase, TrendingUp, Heart, Search, Target, 
  FileText, Presentation, BookOpen, BarChart, DollarSign, 
  Users, Activity, Clipboard, Lightbulb, Send, Cpu, Zap, Brain
} from 'lucide-react';
import { advancedAIRouter } from '../services/advancedAI';

type AdvisorMode = 'career' | 'business' | 'healthcare';

interface TaskCard {
  icon: any;
  title: string;
  description: string;
  badge: string;
  badgeIcon: any;
  status: string;
  gradient: string;
}

interface QuickAction {
  icon: any;
  label: string;
  iconColor: string;
}

interface ProgressItem {
  title: string;
  subtitle: string;
  progress?: number;
  icon: any;
}

export function QuantumAgent() {
  const [advisorMode, setAdvisorMode] = useState<AdvisorMode>('career');
  const [userInput, setUserInput] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);

  const advisorModes = [
    { id: 'career' as AdvisorMode, label: 'Career Advisor', icon: Briefcase },
    { id: 'business' as AdvisorMode, label: 'Business Advisor', icon: TrendingUp },
    { id: 'healthcare' as AdvisorMode, label: 'Healthcare Advisor', icon: Heart },
  ];

  const quickActions: Record<AdvisorMode, QuickAction[]> = {
    career: [
      { icon: Search, label: 'Find the best career for me', iconColor: 'text-purple-400' },
      { icon: Target, label: 'Build a career roadmap', iconColor: 'text-blue-400' },
      { icon: FileText, label: 'Create a professional interview prep', iconColor: 'text-indigo-400' },
    ],
    business: [
      { icon: BarChart, label: 'Market Research', iconColor: 'text-purple-400' },
      { icon: Target, label: 'Develop a business strategy', iconColor: 'text-blue-400' },
      { icon: Users, label: 'Analyze competitors', iconColor: 'text-indigo-400' },
    ],
    healthcare: [
      { icon: Search, label: 'Diagnose a medical condition', iconColor: 'text-purple-400' },
      { icon: Activity, label: "Monitor a patient's condition", iconColor: 'text-blue-400' },
      { icon: Clipboard, label: 'Create a treatment plan', iconColor: 'text-indigo-400' },
    ],
  };

  const taskCards: Record<AdvisorMode, TaskCard[]> = {
    career: [
      {
        icon: Search,
        title: 'Find the right path for you',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        badge: 'Course Research',
        badgeIcon: BookOpen,
        status: 'Agent: Processing',
        gradient: 'from-purple-600 to-purple-700',
      },
      {
        icon: FileText,
        title: 'Resume & Projects',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        badge: '3 tasks',
        badgeIcon: null,
        status: 'Agent: Processing',
        gradient: 'from-indigo-600 to-indigo-700',
      },
      {
        icon: Target,
        title: 'Career Roadmap',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        badge: '6 steps',
        badgeIcon: null,
        status: 'Agent: Processing',
        gradient: 'from-blue-500 to-blue-600',
      },
      {
        icon: BarChart,
        title: 'Market Research',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        badge: 'Agent Processing',
        badgeIcon: null,
        status: '',
        gradient: 'from-purple-600 to-purple-700',
      },
      {
        icon: TrendingUp,
        title: 'Business Strategy',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        badge: '4 steps',
        badgeIcon: null,
        status: '',
        gradient: 'from-indigo-600 to-indigo-700',
      },
      {
        icon: Users,
        title: 'Competitor Analysis',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        badge: '3 steps',
        badgeIcon: null,
        status: '',
        gradient: 'from-blue-500 to-blue-600',
      },
    ],
    business: [
      {
        icon: BarChart,
        title: 'Market Research',
        description: 'Research the target market, users and trends.',
        badge: 'Agent Processing',
        badgeIcon: null,
        status: '',
        gradient: 'from-purple-600 to-purple-700',
      },
      {
        icon: Target,
        title: 'Business Strategy',
        description: 'Map out a solid strategy and growth plan.',
        badge: '4 steps',
        badgeIcon: null,
        status: 'Finalist Completed',
        gradient: 'from-indigo-600 to-indigo-700',
      },
      {
        icon: Users,
        title: 'Competitor Analysis',
        description: 'Compare strengths and weaknesses on competitors.',
        badge: '3 steps',
        badgeIcon: null,
        status: 'Finalist Completed',
        gradient: 'from-blue-500 to-blue-600',
      },
      {
        icon: DollarSign,
        title: 'Financial Planning',
        description: 'Calculate budget and profit projections.',
        badge: '3 tasks',
        badgeIcon: null,
        status: '',
        gradient: 'from-purple-600 to-purple-700',
      },
      {
        icon: Presentation,
        title: 'Marketing Campaign',
        description: 'Plan an effective marketing campaign.',
        badge: '4 tasks',
        badgeIcon: null,
        status: '',
        gradient: 'from-indigo-600 to-indigo-700',
      },
      {
        icon: TrendingUp,
        title: 'Startup Roadmap',
        description: 'Create a clear roadmap for your startup.',
        badge: '5 steps',
        badgeIcon: null,
        status: '',
        gradient: 'from-blue-500 to-blue-600',
      },
    ],
    healthcare: [
      {
        icon: Search,
        title: 'Disease Diagnosis',
        description: 'Diagnose symptoms & recommend tests.',
        badge: 'Agent Processing',
        badgeIcon: null,
        status: '',
        gradient: 'from-purple-600 to-purple-700',
      },
      {
        icon: Activity,
        title: 'Patient Monitoring',
        description: 'Map out a solid strategy and growth plan.',
        badge: '5 tasks',
        badgeIcon: null,
        status: '',
        gradient: 'from-indigo-600 to-indigo-700',
      },
      {
        icon: Clipboard,
        title: 'Treatment Plan',
        description: 'Create a safe and effective treatment plan.',
        badge: '6 steps',
        badgeIcon: null,
        status: '',
        gradient: 'from-blue-500 to-blue-600',
      },
      {
        icon: DollarSign,
        title: 'Financial Planning',
        description: 'Calculate budget and profit projections.',
        badge: '2 tasks',
        badgeIcon: null,
        status: '',
        gradient: 'from-purple-600 to-purple-700',
      },
      {
        icon: Heart,
        title: 'Mental Health Support',
        description: 'Develop counseling and therapy plans.',
        badge: '4 tasks',
        badgeIcon: null,
        status: '',
        gradient: 'from-indigo-600 to-indigo-700',
      },
      {
        icon: TrendingUp,
        title: 'Startup Roadmap',
        description: 'Create a clear roadmap for your startup.',
        badge: '5 steps',
        badgeIcon: null,
        status: '',
        gradient: 'from-blue-500 to-blue-600',
      },
    ],
  };

  const toolkitItems: Record<AdvisorMode, Array<{ icon: any; title: string; subtitle: string }>> = {
    career: [
      { icon: Lightbulb, title: 'Idea Generator', subtitle: 'Swift. Faster' },
      { icon: FileText, title: 'Landing Page Builder', subtitle: '' },
      { icon: Presentation, title: 'Presentation Creator', subtitle: '' },
      { icon: BookOpen, title: 'Doc Processor', subtitle: '' },
    ],
    business: [
      { icon: Lightbulb, title: 'Idea Generator', subtitle: 'Swift. Faster' },
      { icon: FileText, title: 'Landing Page Builder', subtitle: '' },
      { icon: Presentation, title: 'Presentation Creator', subtitle: '' },
      { icon: BookOpen, title: 'Doc Processor', subtitle: '' },
    ],
    healthcare: [
      { icon: Activity, title: 'Symptom Checker', subtitle: 'Diagnose' },
      { icon: Heart, title: 'Medical Chat', subtitle: 'Consult' },
      { icon: Search, title: 'Research Guide', subtitle: '' },
      { icon: FileText, title: 'Report Analyzer', subtitle: 'Review' },
    ],
  };

  const progressData: Record<AdvisorMode, ProgressItem[]> = {
    career: [
      { title: 'Learning Path', subtitle: '82% Rewarded SQL Course', progress: 82, icon: BookOpen },
      { title: 'Skill Assessment', subtitle: 'Intermediate', progress: 0, icon: Target },
      { title: 'Resume Quality', subtitle: 'Steambow - 4 designer', progress: 0, icon: FileText },
    ],
    business: [
      { title: 'AI Startup Research', subtitle: 'Completed', progress: 100, icon: Search },
      { title: 'SWOT Analysis', subtitle: 'In Progress', progress: 60, icon: BarChart },
      { title: 'Financial Plan', subtitle: 'Calculating Budget', progress: 45, icon: DollarSign },
      { title: 'Go-to-Market Strategy', subtitle: 'Next AGP Target', progress: 0, icon: Target },
    ],
    healthcare: [
      { title: 'Pending: John D.', subtitle: '', progress: 0, icon: Clipboard },
      { title: 'Routine Diagnosis', subtitle: 'Daily Checkups', progress: 0, icon: Activity },
      { title: 'SWOT Analysis', subtitle: 'In Progress', progress: 0, icon: BarChart },
      { title: 'Medication Plan', subtitle: 'Next Dose Adjustments', progress: 0, icon: Heart },
    ],
  };

  const handleSubmit = () => {
    if (!userInput.trim()) return;
    
    const input = userInput.toLowerCase().trim();
    setChatMessages([{ role: 'user', content: userInput }]);
    setUserInput('');
    setShowChat(true);
    
    // Advanced AI response with intelligent routing
    setTimeout(async () => {
      let response = '';
      
      if (input === 'hi' || input === 'hello' || input === 'hey') {
        response = "Hey 😊\n\nHow's it going?";
        setChatMessages(prev => [...prev, { role: 'assistant', content: response }]);
      } else {
        try {
          // Use advanced AI router for intelligent responses
          const result = await advancedAIRouter(userInput, advisorMode);
          response = result.response;
          
          // Add AI provider badge to response
          const providerEmoji = result.provider === 'openai' ? '🤖' : 
                               result.provider === 'groq' ? '⚡' : '🌟';
          
          setChatMessages(prev => [...prev, { 
            role: 'assistant', 
            content: `${response}\n\n${providerEmoji} Powered by ${result.provider.toUpperCase()}`
          }]);
        } catch (error) {
          setChatMessages(prev => [...prev, { 
            role: 'assistant', 
            content: `I'm your Quantum Agent specialized in ${advisorMode} guidance. I can help you with various tasks and provide expert insights. What would you like to accomplish today?`
          }]);
        }
      }
    }, 500);
  };

  if (showChat) {
    return <QuantumAgentChat messages={chatMessages} onBack={() => setShowChat(false)} />;
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-[#f8f9fc] to-[#f0f2f8] text-gray-900">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-gray-800 mb-2">
            Good afternoon, how can I assist you today?
          </h1>
          
          {/* Input Field */}
          <div className="mt-6 flex items-center gap-3">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Enter your task and submit it to Quantum Agent..."
              className="flex-1 px-6 py-4 bg-white border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 shadow-sm"
            />
            <button
              onClick={handleSubmit}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-sm"
            >
              Submit
            </button>
          </div>

          {/* Advisor Mode Tabs */}
          <div className="mt-6 flex items-center gap-3">
            {advisorModes.map((mode) => {
              const Icon = mode.icon;
              return (
                <button
                  key={mode.id}
                  onClick={() => setAdvisorMode(mode.id)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    advisorMode === mode.id
                      ? 'bg-white text-gray-800 shadow-md'
                      : 'bg-transparent text-gray-500 hover:bg-white/50'
                  }`}
                >
                  {mode.label}
                </button>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="mt-6 flex items-center gap-4">
            {quickActions[advisorMode].map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  className="flex items-center gap-2 px-5 py-3 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 transition-colors shadow-sm"
                >
                  <Icon className={`w-4 h-4 ${action.iconColor}`} />
                  <span>{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Target Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {advisorMode === 'career' ? 'Career Target' : 
               advisorMode === 'business' ? 'Business Target' : 
               'Healthcare Target'}
              <span className="ml-3 text-sm font-normal text-gray-500">Agent: Processing</span>
            </h2>
          </div>

          {/* Task Cards Grid */}
          <div className="grid grid-cols-3 gap-6">
            {taskCards[advisorMode].map((card, index) => {
              const Icon = card.icon;
              return (
                <div
                  key={index}
                  className={`bg-gradient-to-br ${card.gradient} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all cursor-pointer`}
                >
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
                  <p className="text-sm text-white/80 mb-4">{card.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
                      {card.badge}
                    </span>
                    {card.status && (
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
                        Finish
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Toolkit Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {advisorMode === 'career' ? 'Career Toolkit' : 
             advisorMode === 'business' ? 'Business Toolkit' : 
             'Healthcare Toolkit'}
          </h2>
          <div className="grid grid-cols-4 gap-6">
            {toolkitItems[advisorMode].map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all cursor-pointer border border-gray-200"
                >
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-medium text-gray-800 mb-1">{item.title}</h3>
                  {item.subtitle && (
                    <p className="text-sm text-gray-500">{item.subtitle}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Progress Panel */}
      <div className="fixed right-0 top-0 h-full w-80 bg-white border-l border-gray-200 overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">
              {advisorMode === 'career' ? 'Career Progress' : 
               advisorMode === 'business' ? 'Business Progress' : 
               'Healthcare Progress'}
            </h3>
            <button className="text-blue-600 hover:text-blue-700">
              <span className="text-sm">→</span>
            </button>
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-500 mb-3">Growth Milestones</h4>
            <div className="space-y-4">
              {progressData[advisorMode].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index}>
                    <div className="flex items-start gap-3 mb-2">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-800">{item.title}</div>
                        <div className="text-xs text-gray-500">{item.subtitle}</div>
                      </div>
                    </div>
                    {item.progress > 0 && (
                      <div className="ml-11">
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-sm">
            View Dashboard
          </button>

          {/* Task History */}
          <div className="mt-8">
            <h4 className="text-sm font-medium text-gray-500 mb-3">Task History</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <div className="text-sm text-gray-800">Create learning path</div>
                  <div className="text-xs text-gray-500">{advisorMode} • 1 hour ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Chat Interface Component
function QuantumAgentChat({ messages, onBack }: { messages: Array<{ role: string; content: string }>, onBack: () => void }) {
  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-[#0a0a2e] via-[#1a0a3e] to-[#0a0a2e] relative overflow-hidden">
      {/* Cosmic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-8">
        <div className="max-w-2xl w-full">
          {messages.map((msg, index) => (
            <div key={index} className={`mb-8 ${msg.role === 'user' ? 'flex justify-end' : ''}`}>
              {msg.role === 'assistant' && (
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl flex items-center justify-center shadow-lg shadow-purple-500/50 ring-4 ring-purple-500/20">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="bg-gradient-to-br from-purple-900/60 to-blue-900/60 backdrop-blur-xl border border-purple-500/30 rounded-3xl rounded-tl-sm px-8 py-6 shadow-2xl max-w-xl">
                      <p className="text-xl text-gray-100 whitespace-pre-line leading-relaxed">
                        {msg.content}
                      </p>
                    </div>
                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 mt-4 ml-2">
                      <button className="p-3 hover:bg-white/10 rounded-xl transition-colors" title="Reply">
                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                      </button>
                      <button className="p-3 hover:bg-white/10 rounded-xl transition-colors" title="Shield">
                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </button>
                      <button className="p-3 hover:bg-white/10 rounded-xl transition-colors" title="Like">
                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                      </button>
                      <button className="p-3 hover:bg-white/10 rounded-xl transition-colors" title="Dislike">
                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                        </svg>
                      </button>
                      <button className="p-3 hover:bg-white/10 rounded-xl transition-colors" title="Refresh">
                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>
                      <button className="p-3 hover:bg-white/10 rounded-xl transition-colors" title="More">
                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Back Button */}
      <button
        onClick={onBack}
        className="absolute top-6 left-6 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl text-white transition-colors"
      >
        ← Back
      </button>
    </div>
  );
}