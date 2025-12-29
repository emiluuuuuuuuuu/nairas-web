import React from 'react';
import { Movie } from '../types';
import { MovieCard } from '../components/MovieCard';
import { Heart, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FavoritesProps {
  favorites: Movie[];
  toggleFavorite: (movie: Movie) => void;
}

export const Favorites: React.FC<FavoritesProps> = ({ favorites, toggleFavorite }) => {
  return (
    <div className="container mx-auto px-4 py-8 min-h-[80vh]">
      <div className="flex items-center gap-3 mb-8 border-b border-slate-800 pb-4">
        <Heart className="w-8 h-8 text-red-500 fill-current" />
        <h1 className="text-3xl font-bold text-white">My Favorites</h1>
        <span className="ml-auto bg-slate-800 text-slate-300 px-3 py-1 rounded-full text-sm font-medium">
          {favorites.length} {favorites.length === 1 ? 'Movie' : 'Movies'}
        </span>
      </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center">
          <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6">
            <Heart className="w-10 h-10 text-slate-600" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">No favorites yet</h2>
          <p className="text-slate-400 mb-6 max-w-sm">Start exploring and save your favorite movies to watch them later!</p>
          <Link 
            to="/" 
            className="flex items-center gap-2 bg-secondary hover:bg-cyan-600 text-white px-6 py-3 rounded-full font-medium transition-all"
          >
            <Home className="w-5 h-5" />
            Browse Movies
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {favorites.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isFavorite={true}
              toggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
};
