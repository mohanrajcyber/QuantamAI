import { useState, useEffect } from 'react';
import { LeftSidebar } from './components/LeftSidebar';
import { WelcomeSection } from './components/WelcomeSection';
import { RightInfoPanel } from './components/RightInfoPanel';
import { StatsFooter } from './components/StatsFooter';
import { CodeAssistant } from './components/CodeAssistant';
import { QuantumIDE } from './components/QuantumIDE';
import { QuantumAgent } from './components/QuantumAgent';
import { WelcomeToast } from './components/WelcomeToast';
import { ToastContainer } from './components/Toast';
// import BackendTest from './components/BackendTest'; // Temporarily disabled for deployment
import { ImageGenerator } from './components/ImageGenerator';
import { VoiceAssistant } from './components/VoiceAssistant';
import { DocumentAnalyzer } from './components/DocumentAnalyzer';
import { DataAnalytics } from './components/DataAnalytics';
import { ModelPlayground } from './components/ModelPlayground';
import { AIWorkflows } from './components/AIWorkflows';
import { Settings } from './components/Settings';
import { HelpSupport } from './components/HelpSupport';
import MasterControlDashboard from './components/MasterControlDashboard';
import AuthPage from './components/AuthPage';
import { Bell, User, Globe } from 'lucide-react';
import { Language, translations, languageNames, languageFlags } from './utils/translations';

export type ViewType = 'home' | 'chat' | 'codeAssistant' | 'quantumIDE' | 'quantumAgent' | 'imageGenerator' | 'voiceAssistant' | 'documentAnalyzer' | 'dataAnalytics' | 'modelPlayground' | 'aiWorkflows' | 'hologram' | 'settings' | 'helpSupport' | 'masterControl';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [isMasterMode, setIsMasterMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  // Load saved language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('quantum_language') as Language;
    if (savedLanguage && ['en', 'ta', 'hi'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language preference
  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem('quantum_language', newLanguage);
    setShowLanguageMenu(false);
  };

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('quantum_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setCurrentUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('quantum_user');
      }
    }
  }, []);

  // Check for force logout query parameter (for testing)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('logout') === 'force') {
      localStorage.removeItem('quantum_user');
      window.location.href = window.location.origin;
    }
  }, []);

  // Handle successful authentication
  const handleAuthSuccess = (userData: any) => {
    setCurrentUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('quantum_user', JSON.stringify(userData));
  };

  // Handle logout
  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setIsMasterMode(false);
    localStorage.removeItem('quantum_user');
  };

  // Handle master access activation
  const handleMasterAccess = () => {
    setIsMasterMode(true);
    setCurrentView('masterControl');
  };

  // Show auth page if not authenticated
  if (!isAuthenticated) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  // If in master mode, show only the dashboard
  if (isMasterMode) {
    return <MasterControlDashboard />;
  }

  const renderMainContent = () => {
    switch (currentView) {
      case 'home':
        return <WelcomeSection onNavigate={setCurrentView} onMasterAccess={handleMasterAccess} language={language} />;
      case 'codeAssistant':
        return <CodeAssistant />;
      case 'quantumIDE':
        return <QuantumIDE />;
      case 'quantumAgent':
        return <QuantumAgent />;
      case 'imageGenerator':
        return <ImageGenerator onBack={() => setCurrentView('home')} language={language} />;
      case 'voiceAssistant':
        return <VoiceAssistant onBack={() => setCurrentView('home')} />;
      case 'documentAnalyzer':
        return <DocumentAnalyzer onBack={() => setCurrentView('home')} />;
      case 'hologram':
        // Hologram opens in external tab, fallback to home
        return <WelcomeSection onNavigate={setCurrentView} language={language} />;
      case 'dataAnalytics':
        return <DataAnalytics onBack={() => setCurrentView('home')} />;
      case 'modelPlayground':
        return <ModelPlayground onBack={() => setCurrentView('home')} />;
      case 'aiWorkflows':
        return <AIWorkflows onBack={() => setCurrentView('home')} />;
      case 'settings':
        return <Settings onBack={() => setCurrentView('home')} />;
      case 'helpSupport':
        return <HelpSupport onBack={() => setCurrentView('home')} />;
      default:
        return <WelcomeSection onNavigate={setCurrentView} language={language} />;
    }
  };

  const showStatsFooter = currentView === 'home';
  const showRightPanel = currentView === 'home'; // Only show on home
  const showHeader = true; // Always show header
  const showSidebar = true; // Always show sidebar

  return (
    <div className="flex h-screen bg-[#0a1628] text-white overflow-hidden">
      {/* Left Sidebar */}
      {showSidebar && <LeftSidebar currentView={currentView} onNavigate={setCurrentView} language={language} />}
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#0f1c2e]">
        {/* Top Header Bar */}
        {showHeader && (
          <div className="flex items-center justify-between px-8 py-3 border-b border-gray-800/50 bg-[#0a1628]/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-400">
                {(() => {
                  switch (currentView) {
                    case 'home': return 'Home';
                    case 'codeAssistant': return 'Code Assistant';
                    case 'quantumIDE': return 'Quantum IDE';
                    case 'quantumAgent': return 'Quantum Agent';
                    case 'imageGenerator': return 'Image Generator';
                    case 'voiceAssistant': return 'Voice Assistant';
                    case 'documentAnalyzer': return 'Document Analyzer';
                    case 'hologram': return 'Quantum Hologram';
                    case 'dataAnalytics': return 'Data Analytics';
                    case 'modelPlayground': return 'Model Playground';
                    case 'aiWorkflows': return 'AI Workflows';
                    case 'settings': return 'Settings';
                    case 'helpSupport': return 'Help & Support';
                    case 'chat': return 'Chat';
                    default: return 'Unknown';
                  }
                })()}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                  className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors flex items-center gap-2"
                  title="Change Language"
                >
                  <Globe className="w-5 h-5" />
                  <span className="text-sm">{languageFlags[language]} {languageNames[language]}</span>
                </button>
                
                {showLanguageMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50">
                    <div className="p-2">
                      {(['en', 'ta', 'hi'] as Language[]).map((lang) => (
                        <button
                          key={lang}
                          onClick={() => handleLanguageChange(lang)}
                          className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                            language === lang
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-300 hover:bg-gray-700'
                          }`}
                        >
                          <span className="text-lg">{languageFlags[lang]}</span>
                          <span>{languageNames[lang]}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <button
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg text-sm font-medium transition-all shadow-lg shadow-blue-500/20 transform hover:scale-105 active:scale-100 cursor-pointer"
              >
                {translations[language].upgradeToPro}
              </button>
              <button className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors relative cursor-pointer">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </button>
              <div className="relative group">
                <button className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg hover:opacity-80 transition-opacity cursor-pointer">
                  <User className="w-5 h-5" />
                </button>
                {/* User dropdown */}
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="p-3 border-b border-gray-700">
                    <p className="text-sm font-semibold text-white">{currentUser?.name}</p>
                    <p className="text-xs text-gray-400">{currentUser?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors cursor-pointer"
                  >
                    {translations[language].logout}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {renderMainContent()}
          {showStatsFooter && <StatsFooter />}
        </div>
      </main>

      {/* Right Info Panel - only show on home */}
      {showRightPanel && <RightInfoPanel />}

      {/* Welcome Toast */}
      <WelcomeToast />
      
      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
}