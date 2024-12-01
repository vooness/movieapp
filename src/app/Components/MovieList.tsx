'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Plot?: string;
  Genre?: string;
  imdbRating?: string;
}

// At the top of your MovieList.tsx file

interface MovieListProps {
  movies: Movie[];
  loading: boolean;
  placeholderMessage: string;
}


interface MovieGridProps {
  movies: Movie[];
  loading: boolean;
  placeholderMessage: string;
}

const MovieGrid: React.FC<MovieGridProps> = ({ movies, loading, placeholderMessage }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {Array.from({ length: 10 }).map((_, index) => (
          <div
            key={index}
            className="w-full h-72 bg-gray-800 animate-pulse rounded-lg shadow-md"
          ></div>
        ))}
      </div>
    );
  }

  if (movies.length === 0) {
    return <p className="text-gray-400 text-center">{placeholderMessage}</p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {movies.map((movie) => (
        <div
          key={movie.imdbID}
          className="relative bg-gray-800 rounded-lg shadow-md overflow-hidden group"
        >
          <Link href={`/movie/${movie.imdbID}`}>
            <div>
              <div className="w-full aspect-[2/3] bg-gray-700 overflow-hidden relative">
                <img
                  src={movie.Poster !== 'N/A' ? movie.Poster : '/no-image.jpg'}
                  alt={movie.Title}
                  className="w-full h-full object-cover"
                />
                {/* Play Icon on Hover */}
                <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-12 h-12 text-white animate-bounce"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M3 22V2l18 10-18 10z" />
                  </svg>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white break-words">
                  {movie.Title}
                </h3>
                <p className="text-sm text-gray-400">{movie.Year}</p>
                <p className="text-xs text-gray-500 italic">
                  {movie.Genre || 'Neznámý žánr'}
                </p>
                <p className="text-sm text-yellow-500">
                  IMDb hodnocení: {movie.imdbRating || 'N/A'}
                </p>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default function MovieList() {
  const [displayedMovies, setDisplayedMovies] = useState<Movie[]>([]); // Movies to display
  const [searchQuery, setSearchQuery] = useState<string>(''); // Search input
  const [selectedYear, setSelectedYear] = useState<string>(''); // Year filter
  const [loading, setLoading] = useState(false); // Loading state
  const [totalResults, setTotalResults] = useState<number>(0); // Total number of results
  const [currentPage, setCurrentPage] = useState<number>(1); // Current page
  const API_KEY = '42096017'; // Your OMDB API key

  const genres = [
    '',
    'Action',
    'Comedy',
    'Drama',
    'Horror',
    'Sci-Fi',
    'Adventure',
    'Animation',
    'Fantasy',
    'Thriller',
    'Romance',
    'Mystery',
    'Crime',
    'Family',
  ]; // Expanded genres

  const years = Array.from({ length: 25 }, (_, i) => (2000 + i).toString()); // Range: 2000–2024

  const fetchMovies = async (page: number = 1) => {
    setLoading(true);
    try {
      const queryParams = [
        `apikey=${API_KEY}`,
        searchQuery ? `s=${searchQuery}` : 's=movie',
        selectedYear ? `y=${selectedYear}` : '',
        `type=movie`,
        `page=${page}`,
      ]
        .filter(Boolean)
        .join('&');

      const res = await fetch(`https://www.omdbapi.com/?${queryParams}`);
      const data = await res.json();

      if (data.Response === 'True') {
        const detailedMovies = await Promise.all(
          data.Search.map(async (movie: Movie) => {
            const detailsRes = await fetch(
              `https://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}`
            );
            const detailsData = await detailsRes.json();
            return detailsData;
          })
        );
        setDisplayedMovies(detailedMovies);
        setTotalResults(Number(data.totalResults));
      } else {
        setDisplayedMovies([]);
        setTotalResults(0);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      setDisplayedMovies([]);
    } finally {
      setLoading(false);
    }
  };

  // Load movies on mount or when filters change
  useEffect(() => {
    fetchMovies();
  }, [searchQuery, selectedYear]);

  // Handle pagination
  useEffect(() => {
    fetchMovies(currentPage);
  }, [currentPage]);

  const handleSearch = () => {
    setCurrentPage(1); // Reset to the first page
    fetchMovies(1);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-end mb-6">
        <div>
          <label className="text-white text-sm mb-1 block">Rok:</label>
          <select
            className="bg-gray-800 text-white py-2 px-4 rounded-md"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="">Všechny roky</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-white text-sm mb-1 block">Žánr:</label>
          <select
            className="bg-gray-800 text-white py-2 px-4 rounded-md"
            onChange={(e) => setSearchQuery(e.target.value)}
          >
            <option value="">Všechny žánry</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-grow">
          <label className="text-white text-sm mb-1 block">Vyhledávání:</label>
          <input
            className="bg-gray-800 text-white py-2 px-4 rounded-md w-full"
            placeholder="Zadejte název filmu"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div>
          <button
            onClick={handleSearch}
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md"
          >
            Hledat
          </button>
        </div>
      </div>

      {/* Movie Grid */}
      <MovieGrid
        movies={displayedMovies}
        loading={loading}
        placeholderMessage="Žádné filmy nebyly nalezeny."
      />

      {/* Pagination */}
      {!loading && totalResults > 10 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg disabled:cursor-not-allowed disabled:bg-gray-600"
          >
            Předchozí
          </button>
          <p className="text-gray-400">
            Stránka {currentPage} z {Math.ceil(totalResults / 10)}
          </p>
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage >= Math.ceil(totalResults / 10)}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg disabled:cursor-not-allowed disabled:bg-gray-600"
          >
            Další
          </button>
        </div>
      )}
    </div>
  );
}
