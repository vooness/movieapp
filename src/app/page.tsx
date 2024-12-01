'use client';

import { useEffect, useState } from 'react';
import SearchBar from './Components/SearchBar';
import HeroSection from './Components/HeroSection';
import MovieList from './Components/MovieList';
import Footer from './Components/Footer';

interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Genre?: string;
  Plot?: string;
}

export default function Home() {
  const [query, setQuery] = useState(''); // Search query
  const [movies, setMovies] = useState<Movie[]>([]); // Search results
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]); // Trending movies
  const [loadingTrending, setLoadingTrending] = useState(true); // Loading state for trending movies
  const [loading, setLoading] = useState(false); // Loading state for search results
  const [error, setError] = useState<string | null>(null); // Error state
  const [currentPage, setCurrentPage] = useState(1); // Current page for search
  const [totalResults, setTotalResults] = useState(0); // Total results for pagination
  const API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY || '42096017'; // OMDB API key (use environment variable for better security)

  // Fetch trending movies on initial load
  useEffect(() => {
    fetchTrendingMovies();
  }, []);

  // Fetch movies whenever query or page changes
  useEffect(() => {
    if (query) {
      fetchMovies(query, currentPage);
    }
  }, [query, currentPage]);

  // Fetch movies by search query
  const fetchMovies = async (searchQuery: string, page: number) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(searchQuery)}&page=${page}`
      );
      const data = await res.json();

      if (data.Response === 'True') {
        setMovies(data.Search || []);
        setTotalResults(Number(data.totalResults) || 0);
      } else {
        setMovies([]);
        setError(data.Error || 'No results found.');
      }
    } catch (err) {
      setError('An error occurred while fetching data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch trending movies for the HeroSection
  const fetchTrendingMovies = async () => {
    setLoadingTrending(true);
    const trendingIDs = ['tt3896198', 'tt4154796', 'tt0111161', 'tt1375666', 'tt0109830']; // Example IMDb IDs

    try {
      const trendingMovies = await Promise.all(
        trendingIDs.map(async (id) => {
          const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}&plot=short`);
          return await res.json();
        })
      );
      setTrendingMovies(trendingMovies.filter((movie) => movie.Response === 'True'));
    } catch (err) {
      console.error('Error fetching trending movies:', err);
    } finally {
      setLoadingTrending(false);
    }
  };

  // Handle search action from SearchBar
  const handleSearchAction = (searchQuery: string) => {
    setQuery(searchQuery);
    setCurrentPage(1); // Reset to the first page for a new search
  };

  // Handle pagination actions
  const handlePageChange = (direction: 'next' | 'prev') => {
    const newPage =
      direction === 'next'
        ? Math.min(currentPage + 1, Math.ceil(totalResults / 10))
        : Math.max(currentPage - 1, 1);

    setCurrentPage(newPage);
  };

  return (
    <div className="bg-gray-900 text-white flex flex-col min-h-screen">
      {/* Search Bar */}
      <div className="sticky top-0 z-50 bg-black shadow-lg">
        <SearchBar onSearchAction={handleSearchAction} />
      </div>

      {/* Hero Section */}
      <div className="mb-8">
        <HeroSection movies={trendingMovies} loading={loadingTrending} />
      </div>

      {/* Results Section */}
      <div className="container mx-auto px-4 flex-grow">
        {/* Error Message */}
        {error && <p className="text-center text-red-500 font-bold">{error}</p>}

        <MovieList />



        {/* Pagination Controls */}
        {query && !loading && movies.length > 0 && (
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={() => handlePageChange('prev')}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg disabled:cursor-not-allowed disabled:bg-gray-600"
            >
              Previous
            </button>
            <p className="text-gray-400">
              Page {currentPage} of {Math.ceil(totalResults / 10)}
            </p>
            <button
              onClick={() => handlePageChange('next')}
              disabled={currentPage >= Math.ceil(totalResults / 10)}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg disabled:cursor-not-allowed disabled:bg-gray-600"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
