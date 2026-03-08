import { ArrowLeft, BookOpen, FileText, Shield, Bug, Download, Keyboard, ChevronRight, ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface HelpSupportProps {
  onBack: () => void;
}

type HelpCategory = 'helpCenter' | 'releaseNotes' | 'termsPolicy' | 'reportBug' | 'downloadApps' | 'shortcuts';

export function HelpSupport({ onBack }: HelpSupportProps) {
  const [activeCategory, setActiveCategory] = useState<HelpCategory>('helpCenter');

  const categories = [
    { id: 'helpCenter' as HelpCategory, icon: BookOpen, label: 'Help center', description: 'Get help and support' },
    { id: 'releaseNotes' as HelpCategory, icon: FileText, label: 'Release notes', description: 'Latest updates' },
    { id: 'termsPolicy' as HelpCategory, icon: Shield, label: 'Terms & policies', description: 'Legal information' },
    { id: 'reportBug' as HelpCategory, icon: Bug, label: 'Report Bug', description: 'Report issues' },
    { id: 'downloadApps' as HelpCategory, icon: Download, label: 'Download apps', description: 'Get mobile apps' },
    { id: 'shortcuts' as HelpCategory, icon: Keyboard, label: 'Keyboard shortcuts', description: 'Quick actions' },
  ];

  const renderContent = () => {
    switch (activeCategory) {
      case 'helpCenter':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-100 mb-2">Help Center</h2>
              <p className="text-gray-400">Find answers to common questions</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: 'Getting Started', desc: 'Learn the basics of Quantum AI', icon: '🚀' },
                { title: 'AI Providers', desc: 'Understanding different AI models', icon: '🤖' },
                { title: 'Code Assistant', desc: 'How to use code generation', icon: '💻' },
                { title: 'Voice Commands', desc: 'Using voice assistant features', icon: '🎤' },
                { title: 'Image Generation', desc: 'Creating AI-generated images', icon: '🎨' },
                { title: 'Troubleshooting', desc: 'Common issues and solutions', icon: '🔧' },
              ].map((item) => (
                <button
                  key={item.title}
                  className="bg-[#1a2539] border border-gray-700/50 rounded-xl p-6 text-left hover:border-blue-500/50 transition-all group"
                >
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-200 mb-1 group-hover:text-blue-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </button>
              ))}
            </div>

            <div className="bg-[#1a2539] border border-gray-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-200 mb-4">Contact Support</h3>
              <p className="text-gray-400 mb-4">Can't find what you're looking for? Get in touch with our support team.</p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all flex items-center gap-2">
                <span>Contact us</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        );

      case 'releaseNotes':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-100 mb-2">Release Notes</h2>
              <p className="text-gray-400">Stay updated with the latest features and improvements</p>
            </div>

            <div className="space-y-4">
              {[
                {
                  version: 'v2.1.0',
                  date: 'February 9, 2026',
                  features: [
                    'Added collapsible sidebars with auto-expand on hover',
                    'Integrated TalkingHead AI Avatar with hologram dropdown',
                    'Improved chat interface with full-width messages',
                    'Added current date/time context to AI responses',
                  ],
                },
                {
                  version: 'v2.0.0',
                  date: 'January 15, 2026',
                  features: [
                    'New Quantum AI backend with 6 AI providers',
                    'Voice assistant with real-time transcription',
                    'Document analyzer with PDF support',
                    'Image generation with multiple models',
                  ],
                },
                {
                  version: 'v1.5.0',
                  date: 'December 1, 2025',
                  features: [
                    'Code assistant with syntax highlighting',
                    'Quantum IDE with live preview',
                    'Enhanced UI with gradient effects',
                  ],
                },
              ].map((release) => (
                <div key={release.version} className="bg-[#1a2539] border border-gray-700/50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-100">{release.version}</h3>
                    <span className="text-sm text-gray-500">{release.date}</span>
                  </div>
                  <ul className="space-y-2">
                    {release.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-300">
                        <span className="text-blue-400 mt-1">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        );

      case 'termsPolicy':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-100 mb-2">Terms & Policies</h2>
              <p className="text-gray-400">Legal information and policies</p>
            </div>

            <div className="space-y-3">
              {[
                { title: 'Terms of Service', desc: 'Our terms and conditions', updated: 'Updated Jan 2026' },
                { title: 'Privacy Policy', desc: 'How we handle your data', updated: 'Updated Jan 2026' },
                { title: 'Cookie Policy', desc: 'Information about cookies', updated: 'Updated Dec 2025' },
                { title: 'Acceptable Use Policy', desc: 'Guidelines for using our service', updated: 'Updated Nov 2025' },
              ].map((item) => (
                <button
                  key={item.title}
                  className="w-full bg-[#1a2539] border border-gray-700/50 rounded-xl p-6 text-left hover:border-blue-500/50 transition-all group flex items-center justify-between"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-200 mb-1 group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-400">{item.desc}</p>
                    <p className="text-xs text-gray-500 mt-2">{item.updated}</p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-gray-500 group-hover:text-blue-400 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        );

      case 'reportBug':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-100 mb-2">Report a Bug</h2>
              <p className="text-gray-400">Help us improve by reporting issues</p>
            </div>

            <div className="bg-[#1a2539] border border-gray-700/50 rounded-xl p-6">
              <form className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Bug Title</label>
                  <input
                    type="text"
                    className="w-full bg-[#0f1c2e] border border-gray-700 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
                    placeholder="Brief description of the issue"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Category</label>
                  <select className="w-full bg-[#0f1c2e] border border-gray-700 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500">
                    <option>UI/UX Issue</option>
                    <option>AI Response Error</option>
                    <option>Performance Issue</option>
                    <option>Feature Request</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Description</label>
                  <textarea
                    rows={6}
                    className="w-full bg-[#0f1c2e] border border-gray-700 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500 resize-none"
                    placeholder="Detailed description of the bug..."
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Priority</label>
                  <div className="flex gap-3">
                    {['Low', 'Medium', 'High', 'Critical'].map((priority) => (
                      <label key={priority} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="priority" className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
                        <span className="text-gray-300">{priority}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg shadow-blue-500/20"
                >
                  Submit Bug Report
                </button>
              </form>
            </div>
          </div>
        );

      case 'downloadApps':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-100 mb-2">Download Apps</h2>
              <p className="text-gray-400">Get Quantum AI on all your devices</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { platform: 'Windows', icon: '🪟', version: 'v2.1.0', size: '125 MB' },
                { platform: 'macOS', icon: '🍎', version: 'v2.1.0', size: '118 MB' },
                { platform: 'Linux', icon: '🐧', version: 'v2.1.0', size: '132 MB' },
                { platform: 'Android', icon: '🤖', version: 'v2.0.5', size: '45 MB' },
                { platform: 'iOS', icon: '📱', version: 'v2.0.5', size: '42 MB' },
                { platform: 'Web Extension', icon: '🌐', version: 'v1.8.0', size: '8 MB' },
              ].map((app) => (
                <div
                  key={app.platform}
                  className="bg-[#1a2539] border border-gray-700/50 rounded-xl p-6 hover:border-blue-500/50 transition-all"
                >
                  <div className="text-4xl mb-3">{app.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-200 mb-2">{app.platform}</h3>
                  <div className="flex items-center gap-3 text-sm text-gray-400 mb-4">
                    <span>{app.version}</span>
                    <span>•</span>
                    <span>{app.size}</span>
                  </div>
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'shortcuts':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-100 mb-2">Keyboard Shortcuts</h2>
              <p className="text-gray-400">Work faster with keyboard shortcuts</p>
            </div>

            <div className="space-y-6">
              {[
                {
                  category: 'General',
                  shortcuts: [
                    { keys: ['Ctrl', 'N'], action: 'New chat' },
                    { keys: ['Ctrl', 'K'], action: 'Quick search' },
                    { keys: ['Ctrl', ','], action: 'Open settings' },
                    { keys: ['Ctrl', '/'], action: 'Show shortcuts' },
                  ],
                },
                {
                  category: 'Chat',
                  shortcuts: [
                    { keys: ['Enter'], action: 'Send message' },
                    { keys: ['Shift', 'Enter'], action: 'New line' },
                    { keys: ['Ctrl', 'R'], action: 'Regenerate response' },
                    { keys: ['Ctrl', 'C'], action: 'Copy last response' },
                  ],
                },
                {
                  category: 'Navigation',
                  shortcuts: [
                    { keys: ['Ctrl', '1'], action: 'Go to home' },
                    { keys: ['Ctrl', '2'], action: 'Code assistant' },
                    { keys: ['Ctrl', '3'], action: 'Image generator' },
                    { keys: ['Esc'], action: 'Close modal' },
                  ],
                },
              ].map((section) => (
                <div key={section.category} className="bg-[#1a2539] border border-gray-700/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-200 mb-4">{section.category}</h3>
                  <div className="space-y-3">
                    {section.shortcuts.map((shortcut, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="text-gray-300">{shortcut.action}</span>
                        <div className="flex items-center gap-1">
                          {shortcut.keys.map((key, keyIdx) => (
                            <span key={keyIdx}>
                              <kbd className="px-3 py-1 bg-[#0f1c2e] border border-gray-700 rounded text-sm text-gray-300 font-mono">
                                {key}
                              </kbd>
                              {keyIdx < shortcut.keys.length - 1 && (
                                <span className="mx-1 text-gray-500">+</span>
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Left Sidebar - Categories */}
      <aside className="w-64 bg-[#0b1525] border-r border-gray-800/50 overflow-y-auto custom-scrollbar">
        <div className="p-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-2 mb-4 hover:bg-gray-800/50 rounded-lg transition-colors text-gray-300 hover:text-white w-full"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </button>

          <h2 className="text-lg font-bold text-gray-100 mb-4">Help & Support</h2>

          <nav className="space-y-1">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.id;
              
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20'
                      : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{category.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Right Content Area */}
      <main className="flex-1 overflow-y-auto custom-scrollbar bg-[#0f1c2e]">
        <div className="max-w-4xl mx-auto p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
