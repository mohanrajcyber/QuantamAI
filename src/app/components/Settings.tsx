import { ArrowLeft, User, Bell, Palette, Grid, Shield, Lock, Trash2, ChevronRight, Check, Upload, X } from 'lucide-react';
import { useState, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface SettingsProps {
  onBack: () => void;
}

type SettingsCategory = 'general' | 'notifications' | 'personalization' | 'apps' | 'dataControls' | 'security' | 'account';
type AIPersonality = 'professional' | 'friendly' | 'technical' | 'creative';
type ResponseLength = 'concise' | 'balanced' | 'detailed';

interface AppConnection {
  name: string;
  connected: boolean;
}

export function Settings({ onBack }: SettingsProps) {
  const [activeCategory, setActiveCategory] = useState<SettingsCategory>('general');
  const wallpaperInputRef = useRef<HTMLInputElement>(null);
  
  // Use Theme Context
  const {
    theme,
    setTheme,
    colorTheme,
    setColorTheme,
    customPrimaryColor,
    setCustomPrimaryColor,
    customAccentColor,
    setCustomAccentColor,
    fontFamily,
    setFontFamily,
    fontSize,
    setFontSize,
    bubbleStyle,
    setBubbleStyle,
    wallpaper,
    setWallpaper,
  } = useTheme();
  
  // General settings (local state)
  const [language, setLanguage] = useState('en-US');
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [defaultProvider, setDefaultProvider] = useState('openai');
  
  // Personalization settings (local state)
  const [aiPersonality, setAIPersonality] = useState<AIPersonality>('professional');
  const [responseLength, setResponseLength] = useState<ResponseLength>('balanced');
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState({
    newFeatures: true,
    productUpdates: true,
    weeklyDigest: true,
    securityAlerts: true,
  });
  const [pushNotifications, setPushNotifications] = useState({
    chatResponses: true,
    taskCompletions: true,
    systemUpdates: true,
  });
  
  // Apps
  const [apps, setApps] = useState<AppConnection[]>([
    { name: 'GitHub', connected: true },
    { name: 'VS Code', connected: true },
    { name: 'Slack', connected: false },
    { name: 'Discord', connected: false },
  ]);
  
  // Data controls
  const [saveChatHistory, setSaveChatHistory] = useState(true);
  const [improveAI, setImproveAI] = useState(false);
  const [shareAnalytics, setShareAnalytics] = useState(false);
  
  // Security
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  
  // Account
  const [email, setEmail] = useState('your@email.com');
  const [username, setUsername] = useState('username');
  
  // Color theme presets
  const colorThemes = {
    quantum: { primary: '#3b82f6', accent: '#a855f7', name: 'Quantum', gradient: 'from-blue-600 to-purple-600' },
    cyberpunk: { primary: '#ec4899', accent: '#06b6d4', name: 'Cyberpunk', gradient: 'from-pink-500 to-cyan-500' },
    matrix: { primary: '#10b981', accent: '#059669', name: 'Matrix', gradient: 'from-green-500 to-emerald-600' },
    sunset: { primary: '#f97316', accent: '#ec4899', name: 'Sunset', gradient: 'from-orange-500 to-pink-500' },
    ocean: { primary: '#0ea5e9', accent: '#14b8a6', name: 'Ocean', gradient: 'from-sky-500 to-teal-500' },
    forest: { primary: '#22c55e', accent: '#84cc16', name: 'Forest', gradient: 'from-green-500 to-lime-500' },
    midnight: { primary: '#6366f1', accent: '#8b5cf6', name: 'Midnight', gradient: 'from-indigo-500 to-violet-500' },
    rose: { primary: '#f43f5e', accent: '#fb7185', name: 'Rose', gradient: 'from-rose-500 to-rose-400' },
  };
  
  // Font options
  const fonts = [
    { value: 'inter', name: 'Inter', class: 'font-sans' },
    { value: 'roboto', name: 'Roboto', class: 'font-roboto' },
    { value: 'poppins', name: 'Poppins', class: 'font-poppins' },
    { value: 'jetbrains', name: 'JetBrains Mono', class: 'font-mono' },
    { value: 'fira', name: 'Fira Code', class: 'font-mono' },
    { value: 'ubuntu', name: 'Ubuntu', class: 'font-ubuntu' },
  ];
  
  const handleWallpaperUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setWallpaper(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const removeWallpaper = () => {
    setWallpaper(null);
    if (wallpaperInputRef.current) {
      wallpaperInputRef.current.value = '';
    }
  };
  
  const toggleApp = (appName: string) => {
    setApps(apps.map(app => 
      app.name === appName ? { ...app, connected: !app.connected } : app
    ));
  };
  
  const clearChatHistory = () => {
    if (confirm('Are you sure you want to clear all chat history? This cannot be undone.')) {
      alert('Chat history cleared successfully!');
    }
  };
  
  const exportData = () => {
    const data = {
      settings: { language, timezone, defaultProvider, theme, aiPersonality, responseLength },
      notifications: { emailNotifications, pushNotifications },
      apps,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quantum-ai-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  const deleteAccount = () => {
    if (confirm('⚠️ WARNING: This will permanently delete your account and all data. This cannot be undone. Are you absolutely sure?')) {
      alert('Account deletion initiated. You will receive a confirmation email.');
    }
  };

  const categories = [
    { id: 'general' as SettingsCategory, icon: User, label: 'General', description: 'Basic settings and preferences' },
    { id: 'notifications' as SettingsCategory, icon: Bell, label: 'Notifications', description: 'Manage notification preferences' },
    { id: 'personalization' as SettingsCategory, icon: Palette, label: 'Personalization', description: 'Customize your experience' },
    { id: 'apps' as SettingsCategory, icon: Grid, label: 'Apps', description: 'Connected applications' },
    { id: 'dataControls' as SettingsCategory, icon: Shield, label: 'Data controls', description: 'Manage your data' },
    { id: 'security' as SettingsCategory, icon: Lock, label: 'Security', description: 'Security and privacy settings' },
    { id: 'account' as SettingsCategory, icon: Trash2, label: 'Account', description: 'Account management' },
  ];

  // World languages list
  const languages = [
    { code: 'en-US', name: 'English (US)' },
    { code: 'en-GB', name: 'English (UK)' },
    { code: 'ta-IN', name: 'Tamil (தமிழ்)' },
    { code: 'hi-IN', name: 'Hindi (हिन्दी)' },
    { code: 'es-ES', name: 'Spanish (Español)' },
    { code: 'fr-FR', name: 'French (Français)' },
    { code: 'de-DE', name: 'German (Deutsch)' },
    { code: 'zh-CN', name: 'Chinese Simplified (简体中文)' },
    { code: 'zh-TW', name: 'Chinese Traditional (繁體中文)' },
    { code: 'ja-JP', name: 'Japanese (日本語)' },
    { code: 'ko-KR', name: 'Korean (한국어)' },
    { code: 'ar-SA', name: 'Arabic (العربية)' },
    { code: 'ru-RU', name: 'Russian (Русский)' },
    { code: 'pt-BR', name: 'Portuguese (Português)' },
    { code: 'it-IT', name: 'Italian (Italiano)' },
    { code: 'nl-NL', name: 'Dutch (Nederlands)' },
    { code: 'pl-PL', name: 'Polish (Polski)' },
    { code: 'tr-TR', name: 'Turkish (Türkçe)' },
    { code: 'vi-VN', name: 'Vietnamese (Tiếng Việt)' },
    { code: 'th-TH', name: 'Thai (ไทย)' },
  ];

  // World timezones
  const timezones = [
    { value: 'Asia/Kolkata', label: 'Asia/Kolkata (IST, UTC+5:30)' },
    { value: 'America/New_York', label: 'America/New York (EST, UTC-5)' },
    { value: 'America/Los_Angeles', label: 'America/Los Angeles (PST, UTC-8)' },
    { value: 'America/Chicago', label: 'America/Chicago (CST, UTC-6)' },
    { value: 'Europe/London', label: 'Europe/London (GMT, UTC+0)' },
    { value: 'Europe/Paris', label: 'Europe/Paris (CET, UTC+1)' },
    { value: 'Europe/Berlin', label: 'Europe/Berlin (CET, UTC+1)' },
    { value: 'Asia/Tokyo', label: 'Asia/Tokyo (JST, UTC+9)' },
    { value: 'Asia/Shanghai', label: 'Asia/Shanghai (CST, UTC+8)' },
    { value: 'Asia/Dubai', label: 'Asia/Dubai (GST, UTC+4)' },
    { value: 'Asia/Singapore', label: 'Asia/Singapore (SGT, UTC+8)' },
    { value: 'Australia/Sydney', label: 'Australia/Sydney (AEDT, UTC+11)' },
    { value: 'Pacific/Auckland', label: 'Pacific/Auckland (NZDT, UTC+13)' },
    { value: 'Africa/Cairo', label: 'Africa/Cairo (EET, UTC+2)' },
    { value: 'America/Sao_Paulo', label: 'America/Sao Paulo (BRT, UTC-3)' },
    { value: 'America/Mexico_City', label: 'America/Mexico City (CST, UTC-6)' },
    { value: 'Asia/Seoul', label: 'Asia/Seoul (KST, UTC+9)' },
    { value: 'Asia/Hong_Kong', label: 'Asia/Hong Kong (HKT, UTC+8)' },
    { value: 'Europe/Moscow', label: 'Europe/Moscow (MSK, UTC+3)' },
    { value: 'Pacific/Honolulu', label: 'Pacific/Honolulu (HST, UTC-10)' },
  ];

  const renderContent = () => {
    switch (activeCategory) {
      case 'general':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-100 mb-2">General</h2>
              <p className="text-gray-400">Manage your general settings and preferences</p>
            </div>

            <div className="space-y-4">
              <div className="bg-[#1a2539] border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-200 mb-4">Language & Region</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Language</label>
                    <select 
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full bg-[#0f1c2e] border border-gray-700 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
                    >
                      {languages.map(lang => (
                        <option key={lang.code} value={lang.code}>{lang.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Time Zone</label>
                    <select 
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full bg-[#0f1c2e] border border-gray-700 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
                    >
                      {timezones.map(tz => (
                        <option key={tz.value} value={tz.value}>{tz.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-[#1a2539] border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-200 mb-4">Default AI Provider</h3>
                <select 
                  value={defaultProvider}
                  onChange={(e) => setDefaultProvider(e.target.value)}
                  className="w-full bg-[#0f1c2e] border border-gray-700 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="openai">OpenAI (GPT)</option>
                  <option value="groq">Groq (Fast)</option>
                  <option value="gemini">Gemini</option>
                  <option value="ollama">Ollama (Free)</option>
                  <option value="pollinations">Pollinations</option>
                </select>
              </div>
              
              <div className="bg-green-900/20 border border-green-700/50 rounded-xl p-4">
                <p className="text-green-400 text-sm flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  Settings saved automatically
                </p>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-100 mb-2">Notifications</h2>
              <p className="text-gray-400">Choose what notifications you want to receive</p>
            </div>

            <div className="space-y-4">
              <div className="bg-[#1a2539] border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-200 mb-4">Email Notifications</h3>
                <div className="space-y-3">
                  {Object.entries(emailNotifications).map(([key, value]) => (
                    <label key={key} className="flex items-center justify-between cursor-pointer group">
                      <span className="text-gray-300 group-hover:text-gray-100">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </span>
                      <input 
                        type="checkbox" 
                        checked={value}
                        onChange={(e) => setEmailNotifications({...emailNotifications, [key]: e.target.checked})}
                        className="w-5 h-5 rounded bg-[#0f1c2e] border-gray-700 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-[#1a2539] border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-200 mb-4">Push Notifications</h3>
                <div className="space-y-3">
                  {Object.entries(pushNotifications).map(([key, value]) => (
                    <label key={key} className="flex items-center justify-between cursor-pointer group">
                      <span className="text-gray-300 group-hover:text-gray-100">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </span>
                      <input 
                        type="checkbox" 
                        checked={value}
                        onChange={(e) => setPushNotifications({...pushNotifications, [key]: e.target.checked})}
                        className="w-5 h-5 rounded bg-[#0f1c2e] border-gray-700 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'personalization':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-100 mb-2">Personalization</h2>
              <p className="text-gray-400">Customize your Quantum AI experience</p>
            </div>

            <div className="space-y-6">
              {/* Theme Mode */}
              <div className="bg-[#1a2539] border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-200 mb-4">Theme Mode</h3>
                <div className="grid grid-cols-3 gap-3">
                  {(['dark', 'light', 'auto'] as Theme[]).map((themeOption) => (
                    <button
                      key={themeOption}
                      onClick={() => setTheme(themeOption)}
                      className={`px-4 py-3 rounded-lg border transition-all capitalize ${
                        theme === themeOption
                          ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/30'
                          : 'bg-[#0f1c2e] border-gray-700 text-gray-300 hover:border-gray-600'
                      }`}
                    >
                      {themeOption}
                    </button>
                  ))}
                </div>
                {theme === 'light' && (
                  <p className="text-yellow-400 text-sm mt-3">⚠️ Light theme is experimental</p>
                )}
              </div>

              {/* Color Themes */}
              <div className="bg-[#1a2539] border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-200 mb-4">Color Theme</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {(Object.keys(colorThemes) as ColorTheme[]).map((themeKey) => {
                    const themeData = colorThemes[themeKey];
                    return (
                      <button
                        key={themeKey}
                        onClick={() => setColorTheme(themeKey)}
                        className={`relative p-4 rounded-lg border transition-all ${
                          colorTheme === themeKey
                            ? 'border-blue-500 ring-2 ring-blue-500/50'
                            : 'border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        <div className={`h-16 rounded-lg bg-gradient-to-br ${themeData.gradient} mb-2`}></div>
                        <p className="text-sm text-gray-300 text-center">{themeData.name}</p>
                        {colorTheme === themeKey && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Colors */}
              <div className="bg-[#1a2539] border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-200 mb-4">Custom Colors</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Primary Color</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={customPrimaryColor}
                        onChange={(e) => setCustomPrimaryColor(e.target.value)}
                        className="w-16 h-10 rounded-lg cursor-pointer bg-transparent border border-gray-700"
                      />
                      <input
                        type="text"
                        value={customPrimaryColor}
                        onChange={(e) => setCustomPrimaryColor(e.target.value)}
                        className="flex-1 bg-[#0f1c2e] border border-gray-700 rounded-lg px-3 py-2 text-gray-200 text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Accent Color</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={customAccentColor}
                        onChange={(e) => setCustomAccentColor(e.target.value)}
                        className="w-16 h-10 rounded-lg cursor-pointer bg-transparent border border-gray-700"
                      />
                      <input
                        type="text"
                        value={customAccentColor}
                        onChange={(e) => setCustomAccentColor(e.target.value)}
                        className="flex-1 bg-[#0f1c2e] border border-gray-700 rounded-lg px-3 py-2 text-gray-200 text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Wallpaper Upload */}
              <div className="bg-[#1a2539] border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-200 mb-4">Custom Wallpaper</h3>
                <p className="text-sm text-gray-400 mb-4">Upload a custom background image for your interface</p>
                
                {wallpaper ? (
                  <div className="relative">
                    <div className="h-40 rounded-lg overflow-hidden border border-gray-700">
                      <img src={wallpaper} alt="Wallpaper preview" className="w-full h-full object-cover" />
                    </div>
                    <button
                      onClick={removeWallpaper}
                      className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-500 rounded-lg transition-all"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                    <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Wallpaper applied successfully
                    </p>
                  </div>
                ) : (
                  <div>
                    <input
                      ref={wallpaperInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleWallpaperUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => wallpaperInputRef.current?.click()}
                      className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Upload className="w-5 h-5" />
                      <span>Upload Wallpaper</span>
                    </button>
                    <p className="text-xs text-gray-500 mt-2">Supported: JPG, PNG, GIF (Max 5MB)</p>
                  </div>
                )}
              </div>

              {/* Font Selection */}
              <div className="bg-[#1a2539] border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-200 mb-4">Typography</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Font Family</label>
                    <select
                      value={fontFamily}
                      onChange={(e) => setFontFamily(e.target.value as FontFamily)}
                      className="w-full bg-[#0f1c2e] border border-gray-700 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
                    >
                      {fonts.map(font => (
                        <option key={font.value} value={font.value}>{font.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Font Size: {fontSize}px</label>
                    <input
                      type="range"
                      min="12"
                      max="20"
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Small</span>
                      <span>Medium</span>
                      <span>Large</span>
                    </div>
                  </div>
                  <div className="bg-[#0f1c2e] border border-gray-700 rounded-lg p-4">
                    <p className="text-gray-300" style={{ fontSize: `${fontSize}px` }}>
                      Preview: The quick brown fox jumps over the lazy dog
                    </p>
                  </div>
                </div>
              </div>

              {/* Chat Bubble Styles */}
              <div className="bg-[#1a2539] border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-200 mb-4">Chat Bubble Style</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { value: 'rounded' as BubbleStyle, name: 'Rounded', class: 'rounded-2xl' },
                    { value: 'sharp' as BubbleStyle, name: 'Sharp', class: 'rounded-sm' },
                    { value: 'pill' as BubbleStyle, name: 'Pill', class: 'rounded-full' },
                    { value: 'minimal' as BubbleStyle, name: 'Minimal', class: 'rounded-lg' },
                  ].map((style) => (
                    <button
                      key={style.value}
                      onClick={() => setBubbleStyle(style.value)}
                      className={`relative p-4 rounded-lg border transition-all ${
                        bubbleStyle === style.value
                          ? 'border-blue-500 ring-2 ring-blue-500/50'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <div className={`h-12 bg-gradient-to-br from-blue-600 to-purple-600 ${style.class} mb-2`}></div>
                      <p className="text-sm text-gray-300 text-center">{style.name}</p>
                      {bubbleStyle === style.value && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Personality */}
              <div className="bg-[#1a2539] border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-200 mb-4">AI Personality</h3>
                <select 
                  value={aiPersonality}
                  onChange={(e) => setAIPersonality(e.target.value as AIPersonality)}
                  className="w-full bg-[#0f1c2e] border border-gray-700 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500 capitalize"
                >
                  <option value="professional">Professional</option>
                  <option value="friendly">Friendly</option>
                  <option value="technical">Technical</option>
                  <option value="creative">Creative</option>
                </select>
              </div>

              {/* Response Length */}
              <div className="bg-[#1a2539] border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-200 mb-4">Response Length</h3>
                <div className="space-y-3">
                  {(['concise', 'balanced', 'detailed'] as ResponseLength[]).map((length) => (
                    <label key={length} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="radio" 
                        name="responseLength" 
                        checked={responseLength === length}
                        onChange={() => setResponseLength(length)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                      />
                      <span className="text-gray-300 group-hover:text-gray-100 capitalize">{length}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'apps':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-100 mb-2">Apps</h2>
              <p className="text-gray-400">Manage connected applications and integrations</p>
            </div>

            <div className="space-y-3">
              {apps.map((app) => (
                <div key={app.name} className="bg-[#1a2539] border border-gray-700/50 rounded-xl p-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-200">{app.name}</h3>
                    <p className={`text-sm ${app.connected ? 'text-green-400' : 'text-gray-500'}`}>
                      {app.connected ? 'Connected' : 'Not Connected'}
                    </p>
                  </div>
                  <button 
                    onClick={() => toggleApp(app.name)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      app.connected
                        ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30'
                        : 'bg-blue-600 text-white hover:bg-blue-500'
                    }`}
                  >
                    {app.connected ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'dataControls':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-100 mb-2">Data controls</h2>
              <p className="text-gray-400">Manage how your data is used and stored</p>
            </div>

            <div className="space-y-4">
              <div className="bg-[#1a2539] border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-200 mb-4">Chat History</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between cursor-pointer group">
                    <span className="text-gray-300 group-hover:text-gray-100">Save chat history</span>
                    <input 
                      type="checkbox" 
                      checked={saveChatHistory}
                      onChange={(e) => setSaveChatHistory(e.target.checked)}
                      className="w-5 h-5 rounded bg-[#0f1c2e] border-gray-700 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                    />
                  </label>
                  <button 
                    onClick={clearChatHistory}
                    className="w-full px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-all"
                  >
                    Clear all chat history
                  </button>
                </div>
              </div>

              <div className="bg-[#1a2539] border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-200 mb-4">Data Usage</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between cursor-pointer group">
                    <span className="text-gray-300 group-hover:text-gray-100">Improve AI with my data</span>
                    <input 
                      type="checkbox" 
                      checked={improveAI}
                      onChange={(e) => setImproveAI(e.target.checked)}
                      className="w-5 h-5 rounded bg-[#0f1c2e] border-gray-700 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer group">
                    <span className="text-gray-300 group-hover:text-gray-100">Share analytics</span>
                    <input 
                      type="checkbox" 
                      checked={shareAnalytics}
                      onChange={(e) => setShareAnalytics(e.target.checked)}
                      className="w-5 h-5 rounded bg-[#0f1c2e] border-gray-700 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                    />
                  </label>
                </div>
              </div>

              <div className="bg-[#1a2539] border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-200 mb-4">Export Data</h3>
                <p className="text-sm text-gray-400 mb-3">Download all your data in JSON format</p>
                <button 
                  onClick={exportData}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all"
                >
                  Export my data
                </button>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-100 mb-2">Security</h2>
              <p className="text-gray-400">Protect your account and data</p>
            </div>

            <div className="space-y-4">
              <div className="bg-[#1a2539] border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-200 mb-4">Password</h3>
                <button 
                  onClick={() => alert('Password change form would open here')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all"
                >
                  Change password
                </button>
              </div>

              <div className="bg-[#1a2539] border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-200 mb-4">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300">Add an extra layer of security</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Status: <span className={twoFactorEnabled ? 'text-green-400' : 'text-red-400'}>
                        {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      setTwoFactorEnabled(!twoFactorEnabled);
                      alert(twoFactorEnabled ? '2FA disabled' : '2FA enabled successfully!');
                    }}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      twoFactorEnabled 
                        ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30'
                        : 'bg-blue-600 text-white hover:bg-blue-500'
                    }`}
                  >
                    {twoFactorEnabled ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>

              <div className="bg-[#1a2539] border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-200 mb-4">Active Sessions</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-gray-300">Windows • Chrome</p>
                      <p className="text-sm text-gray-500">Current session</p>
                    </div>
                    <span className="text-green-400 text-sm">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'account':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-100 mb-2">Account</h2>
              <p className="text-gray-400">Manage your account settings</p>
            </div>

            <div className="space-y-4">
              <div className="bg-[#1a2539] border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-200 mb-4">Profile Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#0f1c2e] border border-gray-700 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Username</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-[#0f1c2e] border border-gray-700 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
                      placeholder="username"
                    />
                  </div>
                  <button 
                    onClick={() => alert('Profile updated successfully!')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all"
                  >
                    Save changes
                  </button>
                </div>
              </div>

              <div className="bg-[#1a2539] border border-red-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-red-400 mb-2">Danger Zone</h3>
                <p className="text-sm text-gray-400 mb-4">Once you delete your account, there is no going back</p>
                <button 
                  onClick={deleteAccount}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-all"
                >
                  Delete account
                </button>
              </div>
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

          <h2 className="text-lg font-bold text-gray-100 mb-4">Settings</h2>

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
