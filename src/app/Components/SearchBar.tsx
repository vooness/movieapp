'use client';

import { ChangeEvent, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Používáme Next.js navigaci
import { FaSearch, FaFilm } from 'react-icons/fa';

interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
}

interface SearchBarProps {
  onSearchAction: (query: string) => void;
}

export default function SearchBar({ onSearchAction }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const API_KEY = '42096017'; // Váš OMDB API klíč

  // Debounce uživatelský vstup
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch návrhů při změně debouncedQuery
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedQuery.trim()) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${API_KEY}&s=${debouncedQuery}&type=movie`
        );
        const data = await res.json();
        setSuggestions(data.Search?.slice(0, 10) || []);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  const handleSelectMovie = (movie: Movie) => {
    setSearchQuery('');
    setSuggestions([]);
    router.push(`/movie/${movie.imdbID}`);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearchAction(searchQuery);
      setSuggestions([]);
    }
  };

  return (
    <header className="bg-gray-900 py-4 px-4 shadow-md">
      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-4xl mx-auto gap-4">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => router.push('/')} // Kliknutí na logo vrátí na domovskou stránku
        >
          <FaFilm className="text-red-600 text-3xl" />
          <h1 className="text-white text-2xl font-bold tracking-wide">Filmová databáze</h1>
        </div>

        {/* Sekce vyhledávání */}
        <div className="relative w-full max-w-lg">
          <input
            type="text"
            placeholder="Search for movies..."
            className="w-full py-3 pl-4 pr-12 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600"
            value={searchQuery}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            aria-label="Search movies"
          />
          <button
            onClick={handleSearch}
            className="absolute top-0 right-0 h-full px-4 bg-red-600 text-white rounded-r-lg flex items-center justify-center hover:bg-red-700 focus:outline-none"
            aria-label="Search"
          >
            <FaSearch className="text-lg" />
          </button>

          {/* Dropdown s návrhy */}
          {suggestions.length > 0 && (
            <ul className="absolute top-full left-0 w-full bg-gray-800 text-white rounded-lg shadow-lg mt-2 max-h-60 overflow-y-auto z-10">
              {loading ? (
                <li className="px-4 py-2 text-gray-400">Loading...</li>
              ) : (
                suggestions.map((movie) => (
                  <li
                    key={movie.imdbID}
                    className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                    onClick={() => handleSelectMovie(movie)}
                  >
                    {movie.Title} ({movie.Year})
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      </div>
    </header>
  );
}
