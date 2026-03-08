import { Cloud, MapPin, Music, Youtube, Radio, Newspaper, ChevronRight, ChevronLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AIAvatarVideo } from './AIAvatarVideo';
import { EntertainmentPanel } from './EntertainmentPanel';

export function RightInfoPanel() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [aiState, setAIState] = useState<'idle' | 'userTyping' | 'thinking' | 'confident' | 'neutral' | 'confused' | 'error' | 'greeting'>('greeting');
  const [isCollapsed, setIsCollapsed] = useState(true); // Start collapsed
  const [isHovered, setIsHovered] = useState(false);
  const [entertainmentType, setEntertainmentType] = useState<'music' | 'youtube' | 'radio' | 'news' | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Listen for AI state changes from the app
    const handleAIStateChange = (event: CustomEvent) => {
      setAIState(event.detail.state);
    };

    // Listen for YouTube play requests from AI chat
    const handleYouTubePlay = (event: CustomEvent) => {
      const { query } = event.detail;
      console.log('🎬 YouTube play request:', query);
      setEntertainmentType('youtube');
      // Store the search query for EntertainmentPanel to use
      sessionStorage.setItem('youtubeAutoSearch', query);
    };

    window.addEventListener('aiStateChange' as any, handleAIStateChange);
    window.addEventListener('youtubePlay' as any, handleYouTubePlay);

    // Return to idle after greeting
    const greetingTimer = setTimeout(() => {
      if (aiState === 'greeting') {
        setAIState('idle');
      }
    }, 3000);

    return () => {
      clearInterval(timer);
      clearTimeout(greetingTimer);
      window.removeEventListener('aiStateChange' as any, handleAIStateChange);
      window.removeEventListener('youtubePlay' as any, handleYouTubePlay);
    };
  }, [aiState]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <aside 
      className={`${(isCollapsed && !isHovered) ? 'w-1' : 'w-80'} bg-[#0b1525] border-l border-gray-800/50 overflow-y-auto custom-scrollbar transition-all duration-300`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* No collapse button - just mouse control */}
      {!(isCollapsed && !isHovered) && (
        <div className="p-4 border-b border-gray-800/50 flex items-center justify-center">
          <span className="text-sm font-medium text-gray-400">Info Panel</span>
        </div>
      )}

      {!(isCollapsed && !isHovered) && (
        <div className="p-6 space-y-6">
        {/* Live Time Widget */}
        <div className="bg-[#1a2539] rounded-xl p-5 border border-gray-800/50">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="uppercase tracking-wider">LIVE</span>
          </div>
          <div className="text-3xl font-semibold mb-1">{formatTime(currentTime)}</div>
          <div className="text-xs text-gray-400">{formatDate(currentTime)}</div>

          {/* Weather */}
          <div className="mt-4 pt-4 border-t border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                  <Cloud className="w-3 h-3" />
                  <span>Weather</span>
                </div>
                <div className="text-2xl font-semibold">24°C</div>
                <div className="text-xs text-gray-500">Cloudy</div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                  <MapPin className="w-3 h-3" />
                  <span>Location</span>
                </div>
                <div className="text-base font-medium">Mumbai</div>
                <div className="text-xs text-gray-500">India</div>
              </div>
            </div>
          </div>
        </div>

        {/* Robot Avatar - No card, just floating freely */}
        <div className="px-6 pt-6">
          <AIAvatarVideo state={aiState} />
        </div>

        {/* Entertainment Section - replacing Population */}
        <div className="bg-[#1a2539] rounded-xl p-5 border border-gray-800/50">
          <div className="text-xs text-gray-400 uppercase tracking-wider mb-4">
            Entertainment
          </div>

          {/* Entertainment Options */}
          <div className="space-y-3">
            <button 
              onClick={() => setEntertainmentType('music')}
              className="w-full flex items-center gap-3 p-3 bg-[#0f1c2e] hover:bg-[#152333] rounded-lg transition-colors group"
            >
              <div className="flex items-center justify-center w-10 h-10 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors">
                <Music className="w-5 h-5 text-purple-400" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-sm font-medium text-gray-200">Music</div>
                <div className="text-xs text-gray-500">Listen now</div>
              </div>
            </button>

            <button 
              onClick={() => setEntertainmentType('youtube')}
              className="w-full flex items-center gap-3 p-3 bg-[#0f1c2e] hover:bg-[#152333] rounded-lg transition-colors group"
            >
              <div className="flex items-center justify-center w-10 h-10 bg-red-500/10 rounded-lg group-hover:bg-red-500/20 transition-colors">
                <Youtube className="w-5 h-5 text-red-400" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-sm font-medium text-gray-200">YouTube</div>
                <div className="text-xs text-gray-500">Watch videos</div>
              </div>
            </button>

            <button 
              onClick={() => setEntertainmentType('radio')}
              className="w-full flex items-center gap-3 p-3 bg-[#0f1c2e] hover:bg-[#152333] rounded-lg transition-colors group"
            >
              <div className="flex items-center justify-center w-10 h-10 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                <Radio className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-sm font-medium text-gray-200">Radio</div>
                <div className="text-xs text-gray-500">Live stations</div>
              </div>
            </button>

            <button 
              onClick={() => setEntertainmentType('news')}
              className="w-full flex items-center gap-3 p-3 bg-[#0f1c2e] hover:bg-[#152333] rounded-lg transition-colors group"
            >
              <div className="flex items-center justify-center w-10 h-10 bg-orange-500/10 rounded-lg group-hover:bg-orange-500/20 transition-colors">
                <Newspaper className="w-5 h-5 text-orange-400" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-sm font-medium text-gray-200">News</div>
                <div className="text-xs text-gray-500">Latest updates</div>
              </div>
            </button>
          </div>
        </div>
      </div>
      )}

      {/* Entertainment Panel */}
      {entertainmentType && (
        <EntertainmentPanel
          type={entertainmentType}
          onClose={() => setEntertainmentType(null)}
        />
      )}
    </aside>
  );
}