import React, { useEffect, useState } from 'react';
import { Movie, ApiError } from '../types';
import { tmdbService } from '../services/api';
import { MovieCard } from '../components/MovieCard';
import { Pagination } from '../components/Pagination';
import { Loader2 } from 'lucide-react';

interface HomeProps {
  searchQuery: string;
  favorites: Movie[];
  toggleFavorite: (movie: Movie) => void;
}

export const Home: React.FC<HomeProps> = ({ searchQuery, favorites, toggleFavorite }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    // Reset page when search query changes
    setPage(1);
  }, [searchQuery]);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = searchQuery
          ? await tmdbService.searchMovies(searchQuery, page)
          : await tmdbService.getPopularMovies(page);

        setMovies(data.results);
        setTotalPages(Math.min(data.total_pages, 500)); // TMDb limit
      } catch (err: any) {
        if (err.message === "API_KEY_MISSING") {
           setError("API Key is missing. Please click the Settings icon in the navbar to add your TMDB API Key.");
        } else {
           setError(err.message || "Failed to fetch movies.");
        }
      } finally {
        setLoading(false);
      }
    };

    // Debounce search slightly to avoid rapid API calls
    const timeoutId = setTimeout(() => {
        fetchMovies();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, page]);

  if (loading && movies.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-secondary animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h2 className="text-2xl font-bold text-red-500 mb-2">Oops! Something went wrong.</h2>
        <p className="text-slate-400 max-w-md">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          {searchQuery ? `Search Results for "${searchQuery}"` : "Popular Movies"}
        </h1>
        <p className="text-slate-400">
          {searchQuery ? "Browse movies matching your search." : "Discover the most popular movies trending right now."}
        </p>
      </div>

      {movies.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <p className="text-xl">No movies found.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                isFavorite={favorites.some((f) => f.id === movie.id)}
                toggleFavorite={toggleFavorite}
              />
            ))}
          </div>
          
          <Pagination 
            currentPage={page} 
            totalPages={totalPages} 
            onPageChange={(p) => {
              setPage(p);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
          />
        </>
      )}
    </div>
  );
};
