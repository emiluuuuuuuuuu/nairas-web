import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, Calendar } from 'lucide-react';
import { Movie } from '../types';
import { tmdbService } from '../services/api';

interface MovieCardProps {
  movie: Movie;
  isFavorite: boolean;
  toggleFavorite: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, isFavorite, toggleFavorite }) => {
  const posterUrl = tmdbService.getImageUrl(movie.poster_path, 'w500');

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(movie);
  };

  return (
    <div className="group relative bg-slate-800 rounded-xl overflow-hidden shadow-lg transition-transform hover:-translate-y-1 hover:shadow-2xl flex flex-col h-full">
      <Link to={`/movie/${movie.id}`} className="block relative aspect-[2/3] overflow-hidden bg-slate-900">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              // Fallback if image fails to load
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        
        {/* Fallback for missing or error images */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-slate-800 text-slate-500 ${posterUrl ? 'hidden' : ''}`}>
          <FilmIcon />
          <span className="text-sm mt-2">Poster Not Available</span>
        </div>

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Link>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/movie/${movie.id}`} className="font-bold text-lg text-white hover:text-secondary line-clamp-1" title={movie.title}>
            {movie.title}
          </Link>
          <button
            onClick={handleFavoriteClick}
            className={`p-1.5 rounded-full transition-colors ${
              isFavorite ? 'text-red-500 bg-red-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        <div className="flex items-center gap-4 text-sm text-slate-400 mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span>{movie.vote_average.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}</span>
          </div>
        </div>

        <p className="text-sm text-slate-400 line-clamp-3 mb-4 flex-grow">
          {movie.overview || "No overview available."}
        </p>

        <Link
          to={`/movie/${movie.id}`}
          className="w-full text-center py-2 px-4 rounded-lg bg-slate-700 hover:bg-secondary text-white text-sm font-medium transition-colors mt-auto"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

const FilmIcon = () => (
  <svg className="w-12 h-12 opacity-20" fill="currentColor" viewBox="0 0 24 24">
    <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zM5 15h14v3H5v-3zm0-8h14v3H5V7z" />
  </svg>
);
