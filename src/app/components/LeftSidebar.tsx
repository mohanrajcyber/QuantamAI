import { MessageSquare, Bot, Code, Box, Sparkles, Mic, Image, FolderOpen, FileText, Settings, HelpCircle, Volume2, FileSearch, ChevronRight, ChevronLeft } from 'lucide-react';
import { ViewType } from '../App';
import { useState } from 'react';
import { Language, translations } from '../utils/translations';

interface LeftSidebarProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  language?: Language;
}

export function LeftSidebar({ currentView, onNavigate, language = 'en' }: LeftSidebarProps) {
  const t = translations[language];
  const [showHologramMenu, setShowHologramMenu] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true); // Start collapsed
  const [isHovered, setIsHovered] = useState(false);
  
  // Close hologram menu when view changes (not on home)
  const isHomeView = currentView === 'home';
  
  const mainMenuItems = [
    { icon: MessageSquare, label: t.chat || 'New Chat', view: 'home' as ViewType },
    { icon: Bot, label: t.quantumAgent || 'Quantum Agent', view: 'quantumAgent' as ViewType },
    { icon: Code, label: t.codeAssistant || 'Code Assistant', view: 'codeAssistant' as ViewType },
    { icon: Box, label: t.quantumIDE || 'Quantum IDE', view: 'quantumIDE' as ViewType },
    { icon: Image, label: t.imageGenerator || 'Image Generator', view: 'imageGenerator' as ViewType },
    { icon: Volume2, label: t.voiceAssistant || 'Voice Assistant', view: 'voiceAssistant' as ViewType },
    { icon: FileSearch, label: t.documentAnalyzer || 'Document Analyzer', view: 'documentAnalyzer' as ViewType },
    { icon: Sparkles, label: t.hologram || 'Hologram', view: 'hologram' as ViewType, isExternal: true },
  ];

  const projectItems = [
    { icon: FolderOpen, label: 'Current Project' },
    { icon: FileText, label: 'Dataset Reports' },
  ];

  return (
    <aside 
      className={`${(isCollapsed && !isHovered) ? 'w-16' : 'w-56'} bg-[#0b1525] border-r border-gray-800/50 flex flex-col transition-all duration-300 ease-out relative`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: (isCollapsed && !isHovered) ? 'translateX(0)' : 'translateX(0)',
        boxShadow: (isCollapsed && !isHovered) 
          ? '6px 0 6px rgba(0, 0, 0, 0.15)' 
          : '6px 0 22px rgba(59, 130, 246, 0.35)',
        transition: 'all 0.26s cubic-bezier(0.2, 0.8, 0.2, 1)'
      }}
    >
      {/* Logo - No collapse button, just mouse control */}
      <div 
        className="p-4 border-b border-gray-800/50 flex items-center justify-center"
        style={{
          opacity: (isCollapsed && !isHovered) ? 1 : 1,
          transform: (isCollapsed && !isHovered) ? 'scale(1)' : 'scale(1)',
          transition: 'all 0.26s cubic-bezier(0.2, 0.8, 0.2, 1)'
        }}
      >
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <span 
            className="font-semibold text-base whitespace-nowrap"
            style={{
              opacity: (isCollapsed && !isHovered) ? 0 : 1,
              maxWidth: (isCollapsed && !isHovered) ? '0px' : '200px',
              overflow: 'hidden',
              transition: 'opacity 0.2s ease-out, max-width 0.26s cubic-bezier(0.2, 0.8, 0.2, 1)'
            }}
          >
            Quantum AI
          </span>
        </div>
      </div>

      {/* Main Menu */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="px-3 space-y-1">
          {mainMenuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = currentView === item.view && item.view !== 'home';
            
            // Special handling for external hologram link with dropdown
            if (item.isExternal && item.view === 'hologram') {
              return (
                <div key={index} className="relative">
                  <button
                    onClick={() => setShowHologramMenu(!showHologramMenu)}
                    className={`w-full flex items-center ${(isCollapsed && !isHovered) ? 'justify-center' : 'gap-3'} px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white transition-all hover:shadow-lg hover:shadow-blue-500/20`}
                    title={(isCollapsed && !isHovered) ? item.label : ''}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {!(isCollapsed && !isHovered) && (
                      <>
                        <span
                          className="whitespace-nowrap"
                          style={{
                            opacity: (isCollapsed && !isHovered) ? 0 : 1,
                            maxWidth: (isCollapsed && !isHovered) ? '0px' : '200px',
                            overflow: 'hidden',
                            transition: 'opacity 0.2s ease-out, max-width 0.26s cubic-bezier(0.2, 0.8, 0.2, 1)'
                          }}
                        >
                          {item.label}
                        </span>
                        <ChevronRight className={`ml-auto w-4 h-4 transition-transform ${showHologramMenu ? 'rotate-90' : ''}`} />
                      </>
                    )}
                  </button>
                  
                  {/* Dropdown Menu - Only show when expanded or hovered AND on home view */}
                  {showHologramMenu && !(isCollapsed && !isHovered) && isHomeView && (
                    <div className="ml-4 mt-1 space-y-1 border-l-2 border-blue-500/30 pl-2">
                      <button
                        onClick={() => {
                          window.open('http://localhost:8000', '_blank');
                          setShowHologramMenu(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-400 hover:bg-blue-600/20 hover:text-blue-300 transition-all"
                      >
                        <Bot className="w-3 h-3" />
                        <span>AI Avatar</span>
                        <span className="ml-auto text-xs opacity-60">↗</span>
                      </button>
                      <button
                        onClick={() => {
                          window.open('http://localhost:5174', '_blank');
                          setShowHologramMenu(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-400 hover:bg-purple-600/20 hover:text-purple-300 transition-all"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>3D Particles</span>
                        <span className="ml-auto text-xs opacity-60">↗</span>
                      </button>
                    </div>
                  )}
                  
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && showHologramMenu && (
                    <div className="absolute left-full ml-2 top-0 bg-gray-900 border border-gray-700 rounded-lg p-2 space-y-1 z-50 shadow-xl">
                      <button
                        onClick={() => {
                          window.open('http://localhost:8000', '_blank');
                          setShowHologramMenu(false);
                        }}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-400 hover:bg-blue-600/20 hover:text-blue-300 transition-all whitespace-nowrap"
                      >
                        <Bot className="w-3 h-3" />
                        <span>AI Avatar</span>
                      </button>
                      <button
                        onClick={() => {
                          window.open('http://localhost:5174', '_blank');
                          setShowHologramMenu(false);
                        }}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-400 hover:bg-purple-600/20 hover:text-purple-300 transition-all whitespace-nowrap"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>3D Particles</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            }
            
            return (
              <button
                key={index}
                onClick={() => onNavigate(item.view)}
                className={`w-full flex items-center ${(isCollapsed && !isHovered) ? 'justify-center' : 'gap-3'} px-3 py-2.5 rounded-lg text-sm transition-all overflow-hidden ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20'
                    : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
                }`}
                title={(isCollapsed && !isHovered) ? item.label : ''}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span 
                  className="whitespace-nowrap"
                  style={{
                    opacity: (isCollapsed && !isHovered) ? 0 : 1,
                    maxWidth: (isCollapsed && !isHovered) ? '0px' : '200px',
                    overflow: 'hidden',
                    transition: 'opacity 0.2s ease-out, max-width 0.26s cubic-bezier(0.2, 0.8, 0.2, 1)'
                  }}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Projects Section */}
        {!(isCollapsed && !isHovered) && (
          <div className="mt-6 px-3">
            <div className="text-xs text-gray-500 px-3 mb-2 uppercase tracking-wider">
              Projects
            </div>
            <div className="space-y-1">
              {projectItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={index}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-gray-800/50 hover:text-gray-200 transition-colors"
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-800/50 space-y-2">
        <button 
          onClick={() => onNavigate('settings')}
          className={`w-full flex items-center ${(isCollapsed && !isHovered) ? 'justify-center' : 'gap-3'} px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-gray-800/50 hover:text-gray-200 transition-colors`}
          title={(isCollapsed && !isHovered) ? 'Settings' : ''}
        >
          <Settings className="w-4 h-4 flex-shrink-0" />
          <span
            className="whitespace-nowrap"
            style={{
              opacity: (isCollapsed && !isHovered) ? 0 : 1,
              maxWidth: (isCollapsed && !isHovered) ? '0px' : '200px',
              overflow: 'hidden',
              transition: 'opacity 0.2s ease-out, max-width 0.26s cubic-bezier(0.2, 0.8, 0.2, 1)'
            }}
          >
            Settings
          </span>
        </button>
        <button 
          onClick={() => onNavigate('helpSupport')}
          className={`w-full flex items-center ${(isCollapsed && !isHovered) ? 'justify-center' : 'gap-3'} px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-gray-800/50 hover:text-gray-200 transition-colors overflow-hidden`}
          title={(isCollapsed && !isHovered) ? 'Help & Support' : ''}
        >
          <HelpCircle className="w-4 h-4 flex-shrink-0" />
          <span
            className="whitespace-nowrap"
            style={{
              opacity: (isCollapsed && !isHovered) ? 0 : 1,
              maxWidth: (isCollapsed && !isHovered) ? '0px' : '200px',
              overflow: 'hidden',
              transition: 'opacity 0.2s ease-out, max-width 0.26s cubic-bezier(0.2, 0.8, 0.2, 1)'
            }}
          >
            Help & Support
          </span>
        </button>
      </div>
    </aside>
  );
}