import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Film, Heart, Search, Settings, X } from 'lucide-react';

interface NavbarProps {
  onSearch: (query: string) => void;
  apiKeyMissing: boolean;
  setApiKey: (key: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearch, apiKeyMissing, setApiKey }) => {
  const [query, setQuery] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [localKey, setLocalKey] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      navigate('/');
    }
  };

  // Clear search input if we navigate away manually, or keep it? 
  // Usually better to keep it if we are on search results.
  useEffect(() => {
    if (location.pathname !== '/' && query) {
      setQuery('');
    }
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSaveKey = () => {
    setApiKey(localKey);
    setShowSettings(false);
    window.location.reload(); // Reload to refresh API service state
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700 shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-secondary hover:text-white transition-colors">
            <Film className="w-8 h-8" />
            <span>Nairas</span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for movies..."
              className="w-full bg-slate-800 text-slate-100 pl-10 pr-4 py-2 rounded-full border border-slate-600 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
          </form>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link 
              to="/favorites" 
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                location.pathname === '/favorites' 
                  ? 'bg-secondary/20 text-secondary' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Heart className="w-5 h-5" />
              <span className="hidden sm:inline">Favorites</span>
            </Link>

            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-full transition-colors ${apiKeyMissing ? 'text-red-500 bg-red-500/10 animate-pulse' : 'text-slate-300 hover:bg-slate-800'}`}
              title="API Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* API Key Modal/Dropdown */}
      {showSettings && (
        <div className="absolute top-full right-0 mt-2 w-full md:w-96 bg-slate-800 border border-slate-700 rounded-bl-lg shadow-xl p-4 mr-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-white">API Configuration</h3>
            <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-slate-400 mb-3">
            Enter your TMDB API Key (v3) to enable data fetching. This is stored locally in your browser.
          </p>
          <input
            type="text"
            value={localKey}
            onChange={(e) => setLocalKey(e.target.value)}
            placeholder="TMDB API Key"
            className="w-full bg-slate-900 text-white p-2 rounded border border-slate-600 mb-2 text-sm"
          />
          <button 
            onClick={handleSaveKey}
            className="w-full bg-secondary hover:bg-cyan-600 text-white py-2 rounded text-sm font-medium transition-colors"
          >
            Save Key
          </button>
        </div>
      )}
    </nav>
  );
};