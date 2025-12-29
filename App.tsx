import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { MovieDetail } from './pages/MovieDetail';
import { Favorites } from './pages/Favorites';
import { Movie } from './types';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Movie[]>(() => {
    // Initialize from local storage
    try {
      const saved = localStorage.getItem('cine_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to parse favorites", e);
      return [];
    }
  });
  
  // Track if we are missing the API key to show alert in UI
  const [apiKeyMissing, setApiKeyMissing] = useState(false);

  useEffect(() => {
    localStorage.setItem('cine_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    const key = (import.meta as any).env?.VITE_TMDB_API_KEY || localStorage.getItem('tmdb_api_key');
    setApiKeyMissing(!key);
  }, []);

  const toggleFavorite = (movie: Movie) => {
    setFavorites(prev => {
      const exists = prev.find(m => m.id === movie.id);
      if (exists) {
        return prev.filter(m => m.id !== movie.id);
      }
      return [...prev, movie];
    });
  };

  const handleSetApiKey = (key: string) => {
    localStorage.setItem('tmdb_api_key', key);
    setApiKeyMissing(false);
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-secondary selection:text-white">
        <Navbar 
          onSearch={setSearchQuery} 
          apiKeyMissing={apiKeyMissing} 
          setApiKey={handleSetApiKey} 
        />
        
        <main>
          {apiKeyMissing && (
            <div className="bg-red-500/10 border-b border-red-500/20 px-4 py-2 text-center text-sm text-red-400">
              ⚠️ API Key missing. Please click the Settings icon to configure your TMDB Key.
            </div>
          )}
          
          <Routes>
            <Route 
              path="/" 
              element={
                <Home 
                  searchQuery={searchQuery} 
                  favorites={favorites} 
                  toggleFavorite={toggleFavorite} 
                />
              } 
            />
            <Route 
              path="/movie/:id" 
              element={
                <MovieDetail 
                  favorites={favorites} 
                  toggleFavorite={toggleFavorite} 
                />
              } 
            />
            <Route 
              path="/favorites" 
              element={
                <Favorites 
                  favorites={favorites} 
                  toggleFavorite={toggleFavorite} 
                />
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer className="bg-slate-950 py-8 border-t border-slate-800 mt-auto">
          <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
            <p className="mb-2">Built with React, TypeScript & Tailwind CSS</p>
            <p>Data provided by <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer" className="text-secondary hover:underline">TMDb</a></p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;