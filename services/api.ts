import { MovieResponse, MovieDetail, CreditsResponse } from '../types';

// NOTE: In a production environment, this should be in process.env.REACT_APP_TMDB_API_KEY
// For this demo to work immediately if the user doesn't have an env var, we check localStorage.
const BASE_URL = 'https://api.themoviedb.org/3';

const getApiKey = (): string | null => {
  // Priority: Vite Env -> LocalStorage
  return (import.meta as any).env?.VITE_TMDB_API_KEY || localStorage.getItem('tmdb_api_key');
};

const headers = (token: string) => ({
  accept: 'application/json',
  Authorization: `Bearer ${token}`
});

// Helper to handle API requests
async function fetchFromTMDB<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const apiKey = getApiKey();
  
  // We support both v3 query param auth and Bearer token. 
  // Most users getting a key from TMDB get an API Key string (query param).
  // Read Access Token (Bearer) is also possible. We'll assume API Key (query param) primarily as it's common.
  
  if (!apiKey) {
    throw new Error("API_KEY_MISSING");
  }

  const queryParams = new URLSearchParams(params);
  // If the key is long (Read Access Token), usage might differ, but usually v3 endpoint accepts ?api_key=
  // Let's assume standard API Key (short string).
  queryParams.append('api_key', apiKey);

  const url = `${BASE_URL}${endpoint}?${queryParams.toString()}`;

  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 401) {
       throw new Error("Invalid API Key");
    }
    if (response.status === 404) {
      throw new Error("Resource not found");
    }
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

export const tmdbService = {
  getPopularMovies: (page = 1) => 
    fetchFromTMDB<MovieResponse>('/movie/popular', { page: page.toString() }),

  searchMovies: (query: string, page = 1) => 
    fetchFromTMDB<MovieResponse>('/search/movie', { query, page: page.toString() }),

  getMovieDetails: (id: string) => 
    fetchFromTMDB<MovieDetail>(`/movie/${id}`),
    
  getMovieCredits: (id: string) =>
    fetchFromTMDB<CreditsResponse>(`/movie/${id}/credits`),

  getImageUrl: (path: string | null, size: 'w500' | 'original' = 'w500') => 
    path ? `https://image.tmdb.org/t/p/${size}${path}` : null
};