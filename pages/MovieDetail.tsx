import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MovieDetail as MovieDetailType, CastMember } from '../types';
import { tmdbService } from '../services/api';
import { Star, Calendar, Clock, ArrowLeft, Globe, DollarSign, Heart } from 'lucide-react';

interface MovieDetailProps {
  favorites: MovieDetailType[]; // Reuse base movie type logic essentially
  toggleFavorite: (movie: any) => void;
}

export const MovieDetail: React.FC<MovieDetailProps> = ({ favorites, toggleFavorite }) => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetailType | null>(null);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const [movieData, creditsData] = await Promise.all([
          tmdbService.getMovieDetails(id),
          tmdbService.getMovieCredits(id)
        ]);
        setMovie(movieData);
        setCast(creditsData.cast.slice(0, 6)); // Top 6 cast
      } catch (err: any) {
        setError(err.message || "Failed to load details");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return <div className="h-[60vh] flex items-center justify-center"><div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (error || !movie) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl text-red-500 font-bold mb-4">Error Loading Movie</h2>
        <Link to="/" className="text-secondary hover:underline">Return Home</Link>
      </div>
    );
  }

  const isFavorite = favorites.some(f => f.id === movie.id);
  const backdropUrl = tmdbService.getImageUrl(movie.backdrop_path, 'original');
  const posterUrl = tmdbService.getImageUrl(movie.poster_path, 'w500');

  return (
    <div className="min-h-screen bg-slate-900 pb-12">
      {/* Hero Section with Backdrop */}
      <div 
        className="relative w-full h-[40vh] md:h-[60vh] bg-cover bg-center"
        style={{ 
          backgroundImage: backdropUrl ? `url(${backdropUrl})` : 'none',
          backgroundColor: '#0f172a' 
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
        
        <div className="container mx-auto px-4 h-full relative z-10 flex items-end pb-8">
           <Link to="/" className="absolute top-8 left-4 flex items-center gap-2 text-white/80 hover:text-white bg-black/30 p-2 rounded-full backdrop-blur-sm transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="pr-2 text-sm font-medium">Back</span>
           </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-32 relative z-20">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Poster */}
          <div className="flex-shrink-0 w-48 md:w-80 mx-auto md:mx-0 rounded-xl overflow-hidden shadow-2xl ring-4 ring-slate-800">
             {posterUrl ? (
                <img src={posterUrl} alt={movie.title} className="w-full h-auto object-cover" />
             ) : (
                <div className="w-full h-[450px] bg-slate-800 flex items-center justify-center text-slate-500">No Poster</div>
             )}
          </div>

          {/* Info */}
          <div className="flex-grow pt-4 md:pt-16 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
               <h1 className="text-3xl md:text-5xl font-bold text-white">{movie.title}</h1>
               <button 
                onClick={() => toggleFavorite(movie)}
                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold transition-all transform hover:scale-105 ${
                  isFavorite 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-slate-700 text-white hover:bg-secondary'
                }`}
               >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                  {isFavorite ? 'Remove Favorite' : 'Add to Favorites'}
               </button>
            </div>

            <p className="text-xl text-secondary font-medium mb-6 italic">{movie.tagline}</p>

            <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm md:text-base text-slate-300 mb-8">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <span className="font-bold text-white">{movie.vote_average.toFixed(1)}</span>
                <span className="text-slate-500">/ 10</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-secondary" />
                <span>{movie.runtime} min</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-secondary" />
                <span>{movie.release_date}</span>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-bold text-white mb-2">Overview</h3>
              <p className="text-slate-300 leading-relaxed text-lg">{movie.overview}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
               <div>
                 <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Genres</h3>
                 <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    {movie.genres.map(g => (
                      <span key={g.id} className="px-3 py-1 bg-slate-800 rounded-full text-sm text-slate-300 border border-slate-700">
                        {g.name}
                      </span>
                    ))}
                 </div>
               </div>
               <div>
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Stats</h3>
                  <div className="space-y-1 text-slate-300">
                    <p className="flex items-center gap-2 justify-center md:justify-start"><DollarSign className="w-4 h-4 text-green-500"/> Budget: ${(movie.budget / 1000000).toFixed(1)}M</p>
                    <p className="flex items-center gap-2 justify-center md:justify-start"><DollarSign className="w-4 h-4 text-green-500"/> Revenue: ${(movie.revenue / 1000000).toFixed(1)}M</p>
                  </div>
               </div>
            </div>

            {movie.homepage && (
               <a 
                 href={movie.homepage} 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 className="inline-flex items-center gap-2 text-secondary hover:text-white transition-colors mb-8"
               >
                 <Globe className="w-5 h-5" />
                 Visit Official Website
               </a>
            )}

            <div className="border-t border-slate-800 pt-8">
              <h3 className="text-xl font-bold text-white mb-4">Top Cast</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {cast.map(actor => (
                  <div key={actor.id} className="text-center">
                    <div className="w-full aspect-[2/3] bg-slate-800 rounded-lg overflow-hidden mb-2">
                      {actor.profile_path ? (
                        <img 
                          src={tmdbService.getImageUrl(actor.profile_path, 'w500')!} 
                          alt={actor.name} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs">No Image</div>
                      )}
                    </div>
                    <p className="font-medium text-white text-sm line-clamp-1">{actor.name}</p>
                    <p className="text-xs text-slate-500 line-clamp-1">{actor.character}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
