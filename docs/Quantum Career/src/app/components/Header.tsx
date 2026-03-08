import { Search, Bell, User, Briefcase, Zap, X, Bot } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { searchJobs, type Job } from "../lib/jobService";

interface HeaderProps {
  onLoginClick: () => void;
  onProfileClick: () => void;
  onPortalLoginClick: () => void;
  onAIAssistantClick: () => void;
  isLoggedIn: boolean;
  userName?: string;
  onSearchResults?: (jobs: Job[]) => void;
}

export function Header({ onLoginClick, onProfileClick, onPortalLoginClick, onAIAssistantClick, isLoggedIn, userName, onSearchResults }: HeaderProps) {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchError(null);

    try {
      const { jobs, totalResults } = await searchJobs({
        query: searchQuery.trim(),
        page: 1,
        limit: 20
      });

      console.log(`✅ Found ${totalResults} jobs for "${searchQuery}"`);
      
      // Pass results to parent component
      if (onSearchResults) {
        onSearchResults(jobs);
      }

      // Close search bar after successful search
      setShowSearch(false);
      setSearchQuery("");
    } catch (error) {
      console.error('Search failed:', error);
      setSearchError('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <header className="bg-[#1a1a1a] border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-blue-500 p-2 rounded-lg">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-white text-xl font-semibold">Quantum Career</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => window.location.hash = 'find-job'}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Find Job
            </button>
            <button 
              onClick={onAIAssistantClick}
              className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"
            >
              <Bot className="w-4 h-4 text-blue-500" />
              AI Assistant
            </button>
            <button 
              onClick={onPortalLoginClick}
              className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"
            >
              <Zap className="w-4 h-4 text-yellow-500" />
              Portal Login
            </button>
            <button 
              onClick={() => alert('Messages feature coming soon!')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Messages
            </button>
            <button 
              onClick={() => alert('Hiring feature coming soon!')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Hiring
            </button>
            <button 
              onClick={() => alert('Community feature coming soon!')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Community
            </button>
            <button 
              onClick={() => alert('FAQ page coming soon!')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              FAQ
            </button>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            {isLoggedIn && userName && (
              <span className="text-gray-400 text-sm hidden lg:block">Hello, {userName}!</span>
            )}
            
            {/* Search Icon */}
            <button 
              onClick={() => setShowSearch(!showSearch)}
              className="text-gray-300 hover:text-white transition-colors"
              title="Search jobs"
            >
              <Search className="w-5 h-5" />
            </button>
            
            <button 
              onClick={() => alert('Notifications feature coming soon!')}
              className="text-gray-300 hover:text-white transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
            </button>
            {isLoggedIn ? (
              <button 
                onClick={onProfileClick}
                className="text-gray-300 hover:text-white flex items-center gap-2 transition-colors"
                title="Profile"
              >
                <User className="w-5 h-5" />
              </button>
            ) : (
              <Button onClick={onLoginClick} className="bg-white text-black hover:bg-gray-200">
                Sign In
              </Button>
            )}
            <Button 
              onClick={() => alert('Post a Job feature coming soon!')}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Post a Job
            </Button>
          </div>
        </div>

        {/* Search Bar - Slides down when search icon is clicked */}
        {showSearch && (
          <div className="pb-4 animate-in slide-in-from-top duration-300">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search jobs, companies, skills... (Press Enter)"
                className="w-full pl-12 pr-12 py-3 bg-[#2a2a2a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                autoFocus
                disabled={isSearching}
              />
              {isSearching ? (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500">
                  <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setShowSearch(false);
                    setSearchQuery("");
                    setSearchError(null);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            {searchError && (
              <p className="text-red-400 text-sm text-center mt-2">{searchError}</p>
            )}
          </div>
        )}
      </div>
    </header>
  );
}