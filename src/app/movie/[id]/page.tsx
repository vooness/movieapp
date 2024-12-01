'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Footer from '@/app/Components/Footer';
import SearchBar from '@/app/Components/SearchBar';
import MovieGrid from '@/app/Components/MovieList';

import { useParams } from 'next/navigation';

// Movie type definition
interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Genre?: string;
  Plot?: string;
  imdbRating?: string;
}

// Loading Animation Component
function LoadingAnimation({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      {/* Spinning Circle */}
      <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      {/* Loading Text */}
      <p className="text-red-500 text-xl font-bold">{text}</p>
    </div>
  );
}

export default function MovieDetails() {
  const params = useParams(); // Use `useParams` to access dynamic route params
  const id = params?.id; // Extract the movie ID from dynamic route params
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY || '42096017';

  // Fetch movie details
  useEffect(() => {
    if (!id) return; // Ensure the ID exists before fetching data

    const fetchMovieDetails = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}&plot=full`);
        const data = await res.json();
        if (data.Response === 'True') {
          setMovie(data);
        } else {
          setError(data.Error || 'Movie not found.');
        }
      } catch (err) {
        setError('An error occurred while fetching movie details.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  // Display loading state with animation
  if (loading) {
    return <LoadingAnimation text="Loading movie details..." />;
  }

  // Display error state
  if (error || !movie) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p>{error || 'An error occurred.'}</p>
      </div>
    );
  }

  // Render movie details
  return (
    <div className="bg-gray-900 text-white flex flex-col min-h-screen">
      {/* Search Bar */}
      <div className="sticky top-0 z-50 bg-black shadow-lg">
        <SearchBar onSearchAction={(query) => console.log(query)} />
      </div>

      {/* Movie Details */}
      <div className="container mx-auto p-6 flex-grow">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Movie Poster */}
          <Image
            src={movie.Poster !== 'N/A' ? movie.Poster : '/no-image.jpg'}
            alt={movie.Title}
            width={300}
            height={450}
            className="rounded-lg shadow-lg"
          />

          {/* Movie Details Section */}
          <div className="flex flex-col justify-end flex-grow">
            <div className="mt-auto">
              <h1 className="text-4xl font-bold mb-4">{movie.Title}</h1>
              <p className="text-lg text-gray-400 mb-2">
                <strong>Year:</strong> {movie.Year}
              </p>
              <p className="text-lg text-gray-400 mb-2">
                <strong>Genre:</strong> {movie.Genre || 'Unknown'}
              </p>
              <p className="text-lg text-gray-400 mb-2">
                <strong>IMDB Rating:</strong> ⭐ {movie.imdbRating || 'N/A'}
              </p>
              <p className="text-lg text-gray-400">
                <strong>Plot:</strong> {movie.Plot || 'No plot available.'}
              </p>
            </div>
          </div>
        </div>

        {/* Trailer Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Trailer</h2>
          <div className="relative w-full" style={{ paddingBottom: '56.25%', height: 0 }}>
            <iframe
              src={`https://www.youtube.com/embed/example_video_id`} // Replace with actual video ID
              title="Movie Trailer"
              className="absolute top-0 left-0 w-full h-full rounded-lg"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
