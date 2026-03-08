import { X, Play, Pause, Volume2, SkipBack, SkipForward, ExternalLink, Clock, TrendingUp, Radio, Minimize2, Maximize2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { searchYouTubeVideos, getTrendingVideos, type YouTubeVideo } from '../services/youtubeService';

interface EntertainmentPanelProps {
  type: 'music' | 'youtube' | 'radio' | 'news';
  onClose: () => void;
}

export function EntertainmentPanel({ type, onClose }: EntertainmentPanelProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(70);
  const [newsCategory, setNewsCategory] = useState('top');
  const [newsArticles, setNewsArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [youtubeSearchQuery, setYoutubeSearchQuery] = useState('');
  const [currentVideoId, setCurrentVideoId] = useState('jfKfPfyJRdk'); // Default: Lofi Girl
  const [showYouTubeSearch, setShowYouTubeSearch] = useState(false);
  const [youtubeVideos, setYoutubeVideos] = useState<YouTubeVideo[]>([]);
  const [youtubeLoading, setYoutubeLoading] = useState(false);
  const [miniPlayerPosition, setMiniPlayerPosition] = useState({ x: window.innerWidth - 350, y: window.innerHeight - 300 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (type === 'news') {
      fetchNews(newsCategory);
    }
    if (type === 'youtube') {
      // Check for auto-search query from AI chat
      const autoSearch = sessionStorage.getItem('youtubeAutoSearch');
      if (autoSearch) {
        console.log('🎬 Auto-searching YouTube for:', autoSearch);
        setYoutubeSearchQuery(autoSearch);
        handleYouTubeSearch(autoSearch);
        sessionStorage.removeItem('youtubeAutoSearch'); // Clear after use
      } else {
        loadTrendingVideos();
      }
    }
  }, [type, newsCategory]);

  // Handle dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setMiniPlayerPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const handleDragStart = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - miniPlayerPosition.x,
      y: e.clientY - miniPlayerPosition.y
    });
  };

  const loadTrendingVideos = async () => {
    setYoutubeLoading(true);
    try {
      const videos = await getTrendingVideos(20);
      setYoutubeVideos(videos);
    } catch (error) {
      console.error('Failed to load trending videos:', error);
    } finally {
      setYoutubeLoading(false);
    }
  };

  const handleYouTubeSearch = async (query: string) => {
    if (!query.trim()) return;
    
    setYoutubeLoading(true);
    try {
      console.log('Searching YouTube for:', query);
      const videos = await searchYouTubeVideos(query, 20);
      console.log('YouTube search results:', videos);
      setYoutubeVideos(videos);
      
      if (videos.length === 0) {
        alert('No videos found. Try a different search term.');
      }
    } catch (error) {
      console.error('YouTube search failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`YouTube search failed: ${errorMessage}\n\nPlease check:\n1. Internet connection\n2. API key is valid\n3. API quota not exceeded\n\nCheck browser console (F12) for details.`);
    } finally {
      setYoutubeLoading(false);
    }
  };

  const fetchNews = async (category: string) => {
    setLoading(true);
    try {
      // Using NewsAPI (free tier - 100 requests/day)
      const response = await fetch(
        `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=demo`
      );
      const data = await response.json();
      setNewsArticles(data.articles || []);
    } catch (error) {
      console.error('News fetch error:', error);
      // Fallback to mock data
      setNewsArticles(getMockNews(category));
    } finally {
      setLoading(false);
    }
  };

  const getMockNews = (category: string) => {
    return [
      {
        title: 'Breaking: Major Tech Announcement Expected Today',
        description: 'Industry leaders hint at revolutionary AI breakthrough',
        urlToImage: 'https://via.placeholder.com/400x200/667eea/ffffff?text=Tech+News',
        publishedAt: new Date().toISOString(),
        source: { name: 'Tech Daily' },
        url: '#'
      },
      {
        title: 'Global Markets Show Strong Recovery',
        description: 'Stock indices reach new highs amid positive economic data',
        urlToImage: 'https://via.placeholder.com/400x200/f093fb/ffffff?text=Business',
        publishedAt: new Date().toISOString(),
        source: { name: 'Financial Times' },
        url: '#'
      },
      {
        title: 'Climate Summit Reaches Historic Agreement',
        description: 'World leaders commit to ambitious carbon reduction targets',
        urlToImage: 'https://via.placeholder.com/400x200/4ade80/ffffff?text=Environment',
        publishedAt: new Date().toISOString(),
        source: { name: 'Global News' },
        url: '#'
      }
    ];
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderContent = () => {
    switch (type) {
      case 'music':
        return (
          <div className="space-y-6">
            {/* Album Art */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500">
              <img
                src="https://via.placeholder.com/400/667eea/ffffff?text=Now+Playing"
                alt="Album Art"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-2xl font-bold text-white mb-2">Quantum Beats</h3>
                <p className="text-gray-200">AI Generated Music</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={(e) => setCurrentTime(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration || 180)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-6">
              <button className="text-gray-400 hover:text-white transition-colors">
                <SkipBack className="w-6 h-6" />
              </button>
              <button
                onClick={togglePlay}
                className="w-16 h-16 bg-purple-500 hover:bg-purple-600 rounded-full flex items-center justify-center transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8 text-white" />
                ) : (
                  <Play className="w-8 h-8 text-white ml-1" />
                )}
              </button>
              <button className="text-gray-400 hover:text-white transition-colors">
                <SkipForward className="w-6 h-6" />
              </button>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-gray-400" />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <span className="text-sm text-gray-400 w-10">{volume}%</span>
            </div>

            {/* Playlist */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-300 mb-3">Up Next</h4>
              {['Cosmic Waves', 'Digital Dreams', 'Neural Symphony', 'Quantum Flow'].map((song, idx) => (
                <button
                  key={idx}
                  className="w-full flex items-center gap-3 p-3 bg-[#1a2539] hover:bg-[#243447] rounded-lg transition-colors group"
                >
                  <div className="w-10 h-10 bg-purple-500/20 rounded flex items-center justify-center">
                    <Play className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium text-gray-200">{song}</div>
                    <div className="text-xs text-gray-500">AI Generated • 3:24</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 'youtube':
        return (
          <div className="space-y-4">
            {/* YouTube Search Bar */}
            <div className="relative">
              <input
                type="text"
                value={youtubeSearchQuery}
                onChange={(e) => setYoutubeSearchQuery(e.target.value)}
                placeholder="Search YouTube - millions of videos..."
                className="w-full bg-[#1a2539] border border-gray-700 rounded-lg px-4 py-3 pr-24 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && youtubeSearchQuery.trim()) {
                    handleYouTubeSearch(youtubeSearchQuery);
                  }
                }}
              />
              <button 
                onClick={() => youtubeSearchQuery.trim() && handleYouTubeSearch(youtubeSearchQuery)}
                className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-red-500 hover:bg-red-600 rounded-md text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={youtubeLoading || !youtubeSearchQuery.trim()}
              >
                {youtubeLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Searching...</span>
                  </div>
                ) : (
                  'Search'
                )}
              </button>
            </div>

            {/* Quick Search Buttons */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {['lofi music', 'coding music', 'study music', 'chill beats', 'tech tutorials', 'ai news'].map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setYoutubeSearchQuery(term);
                    handleYouTubeSearch(term);
                  }}
                  className="px-4 py-2 bg-[#1a2539] hover:bg-red-500 rounded-lg text-sm text-gray-300 hover:text-white whitespace-nowrap transition-colors"
                  disabled={youtubeLoading}
                >
                  {term}
                </button>
              ))}
            </div>

            {/* Current Video Player */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-gray-800">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=0&rel=0`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>

            {/* Video Results */}
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  {youtubeSearchQuery ? `Results for "${youtubeSearchQuery}"` : 'Trending Videos'}
                  <span className="text-gray-500">({youtubeVideos.length})</span>
                </h4>
                {youtubeLoading && (
                  <div className="animate-spin w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full"></div>
                )}
              </div>

              {youtubeLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-400">Searching millions of videos...</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
                  {youtubeVideos.map((video, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentVideoId(video.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors group ${
                        currentVideoId === video.id 
                          ? 'bg-red-500/20 border border-red-500/50' 
                          : 'bg-[#1a2539] hover:bg-[#243447]'
                      }`}
                    >
                      <div className="relative w-32 h-20 bg-black rounded overflow-hidden flex-shrink-0">
                        <img 
                          src={video.thumbnail} 
                          alt={video.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/320x180/1a2539/ffffff?text=Video';
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <div className={`text-sm font-medium line-clamp-2 mb-1 ${
                          currentVideoId === video.id ? 'text-red-400' : 'text-gray-200'
                        }`}>
                          {video.title}
                        </div>
                        <div className="text-xs text-gray-500">{video.channelTitle}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="bg-[#1a2539] rounded-lg p-4 border border-gray-800">
              <h4 className="text-sm font-semibold text-white mb-2">🎉 Real YouTube Access!</h4>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• Search MILLIONS of videos</li>
                <li>• Real-time YouTube Data API</li>
                <li>• Click any video to play</li>
                <li>• Minimize to PiP mode</li>
              </ul>
            </div>
          </div>
        );

      case 'radio':
        return (
          <div className="space-y-6">
            {/* Now Playing */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500 to-cyan-500">
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4 animate-pulse">
                  <Radio className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Quantum FM</h3>
                <p className="text-white/80 mb-4">Live • 24/7</p>
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span>ON AIR</span>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={togglePlay}
                className="w-16 h-16 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8 text-white" />
                ) : (
                  <Play className="w-8 h-8 text-white ml-1" />
                )}
              </button>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-gray-400" />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <span className="text-sm text-gray-400 w-10">{volume}%</span>
            </div>

            {/* Stations */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-300 mb-3">Popular Stations</h4>
              {[
                { name: 'Quantum FM', genre: 'Electronic', listeners: '12.5K' },
                { name: 'Tech Beats', genre: 'Techno', listeners: '8.2K' },
                { name: 'Chill Vibes', genre: 'Ambient', listeners: '15.3K' },
                { name: 'Code Radio', genre: 'Lo-fi', listeners: '20.1K' }
              ].map((station, idx) => (
                <button
                  key={idx}
                  className="w-full flex items-center gap-3 p-3 bg-[#1a2539] hover:bg-[#243447] rounded-lg transition-colors group"
                >
                  <div className="w-10 h-10 bg-blue-500/20 rounded flex items-center justify-center">
                    <Radio className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium text-gray-200">{station.name}</div>
                    <div className="text-xs text-gray-500">{station.genre} • {station.listeners} listening</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 'news':
        return (
          <div className="space-y-6">
            {/* Category Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {['top', 'business', 'technology', 'sports', 'entertainment', 'health'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setNewsCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    newsCategory === cat
                      ? 'bg-orange-500 text-white'
                      : 'bg-[#1a2539] text-gray-400 hover:text-white'
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>

            {/* News Articles */}
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
                  <p className="text-gray-400 mt-4">Loading news...</p>
                </div>
              ) : (
                newsArticles.slice(0, 10).map((article, idx) => (
                  <a
                    key={idx}
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-[#1a2539] hover:bg-[#243447] rounded-lg overflow-hidden transition-colors group"
                  >
                    {article.urlToImage && (
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          src={article.urlToImage}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200/1a2539/ffffff?text=News';
                          }}
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                        <span className="text-orange-400">{article.source?.name || 'News Source'}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(article.publishedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-white mb-2 line-clamp-2 group-hover:text-orange-400 transition-colors">
                        {article.title}
                      </h3>
                      {article.description && (
                        <p className="text-xs text-gray-400 line-clamp-2">{article.description}</p>
                      )}
                      <div className="flex items-center gap-1 text-xs text-orange-400 mt-3">
                        <span>Read more</span>
                        <ExternalLink className="w-3 h-3" />
                      </div>
                    </div>
                  </a>
                ))
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getTitleAndIcon = () => {
    switch (type) {
      case 'music':
        return { title: 'Music Player', icon: '🎵' };
      case 'youtube':
        return { title: 'YouTube', icon: '📺' };
      case 'radio':
        return { title: 'Radio Stations', icon: '📻' };
      case 'news':
        return { title: 'Latest News', icon: '📰' };
      default:
        return { title: 'Entertainment', icon: '🎬' };
    }
  };

  const { title, icon } = getTitleAndIcon();

  // Minimized view (Picture-in-Picture style) - Draggable!
  if (isMinimized) {
    return (
      <div 
        className="fixed z-50"
        style={{
          left: `${miniPlayerPosition.x}px`,
          top: `${miniPlayerPosition.y}px`,
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
      >
        <div className="bg-[#0b1525] rounded-xl border border-gray-800/50 shadow-2xl w-80 overflow-hidden">
          {/* Mini Header - Draggable */}
          <div 
            className="flex items-center justify-between p-3 bg-[#1a2539] border-b border-gray-800/50 cursor-grab active:cursor-grabbing"
            onMouseDown={handleDragStart}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">{icon}</span>
              <span className="text-sm font-medium text-white">{title}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMinimized(false)}
                className="text-gray-400 hover:text-white transition-colors"
                title="Maximize"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mini Content - NO SEARCH BAR */}
          <div className="p-4">
            {(type === 'music' || type === 'radio') && (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    className="w-12 h-12 bg-purple-500 hover:bg-purple-600 rounded-full flex items-center justify-center transition-colors flex-shrink-0"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 text-white" />
                    ) : (
                      <Play className="w-5 h-5 text-white ml-0.5" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">
                      {type === 'music' ? 'Quantum Beats' : 'Quantum FM'}
                    </div>
                    <div className="text-xs text-gray-400">
                      {type === 'music' ? 'AI Generated Music' : 'Live • 24/7'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <span className="text-xs text-gray-400 w-8">{volume}%</span>
                </div>
              </div>
            )}

            {type === 'youtube' && (
              <div className="space-y-3">
                {/* Mini Video Player - Continues playing! */}
                <div className="aspect-video rounded-lg overflow-hidden bg-black">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=1`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                
                {/* NO SEARCH BAR in minimized mode */}
                <div className="text-xs text-gray-400 text-center">
                  Drag to move • Click to maximize
                </div>
              </div>
            )}

            {type === 'news' && (
              <div className="space-y-2">
                <div className="text-xs text-gray-400 mb-2">Latest Headlines</div>
                {newsArticles.slice(0, 3).map((article, idx) => (
                  <a
                    key={idx}
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-xs text-gray-300 hover:text-white truncate"
                  >
                    • {article.title}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Full view
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0b1525] rounded-2xl border border-gray-800/50 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800/50">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{icon}</span>
            <h2 className="text-xl font-semibold text-white">{title}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMinimized(true)}
              className="text-gray-400 hover:text-white transition-colors"
              title="Minimize (Picture-in-Picture)"
            >
              <Minimize2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
              title="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {renderContent()}
        </div>
      </div>

      {/* Hidden audio element for music/radio */}
      <audio ref={audioRef} />
    </div>
  );
}
