import Link from 'next/link';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaPlay } from 'react-icons/fa';

// Movie type definition
interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Genre?: string;
  imdbRating?: string;
}

// Props for HeroSection component
interface HeroSectionProps {
  movies: Movie[]; // Array of movies
  loading: boolean; // Loading state
}

export default function HeroSection({ movies, loading }: HeroSectionProps) {
  const [arrowsVisible, setArrowsVisible] = useState(false);

  // Only display top 10 movies
  const topMovies = (movies || []).slice(0, 10);

  // Slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: arrowsVisible,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <CustomArrow direction="next" />,
    prevArrow: <CustomArrow direction="prev" />,
    responsive: [
      {
        breakpoint: 1024, // Tablet view
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768, // Mobile view
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  // Delay visibility of arrows to avoid overlapping
  useEffect(() => {
    const timer = setTimeout(() => setArrowsVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Handle loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-gray-900">
        <LoadingAnimation text="Databáze načítá..." />
      </div>
    );
  }

  // Render HeroSection
  return (
    <div className="relative flex items-center justify-center w-full h-auto py-16 bg-gray-900 overflow-hidden">
      <div className="px-4 w-full overflow-visible">
        <Slider {...settings} className="relative z-10 overflow-visible">
          {topMovies.map((movie) => (
            <div key={movie.imdbID} className="px-2 animate-slideIn group">
              {/* Movie Link */}
              <Link href={`/movie/${movie.imdbID}`} passHref>
                <div className="relative transition-transform transform hover:scale-105 rounded-lg shadow-xl overflow-visible cursor-pointer">
                  {/* Movie Poster */}
                  <img
                    src={movie.Poster !== 'N/A' ? movie.Poster : '/no-image.jpg'}
                    alt={movie.Title}
                    className="w-full h-[400px] lg:h-[500px] object-cover rounded-lg shadow-xl"
                    loading="lazy"
                  />

                  {/* Play Button (on hover) */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      className="w-16 h-16 flex items-center justify-center bg-white text-black rounded-full shadow-lg hover:scale-110 transition-transform duration-300 focus:outline-none"
                      aria-label="Play Movie"
                    >
                      <FaPlay size={24} />
                    </button>
                  </div>

                  {/* Movie Details */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="text-xl lg:text-2xl font-bold text-white">{movie.Title}</h3>
                    <p className="text-sm lg:text-lg text-gray-300">
                      {movie.Genre || 'Unknown Genre'}
                    </p>
                    <p className="text-lg lg:text-xl text-yellow-400 font-bold">
                      ⭐ {movie.imdbRating || 'N/A'}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
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

// Custom Arrow Component
const CustomArrow = ({ direction, onClick }: { direction: 'next' | 'prev'; onClick?: () => void }) => {
  const isNext = direction === 'next';
  return (
    <button
      onClick={onClick}
      className={`absolute top-1/2 transform -translate-y-1/2 z-30 ${
        isNext ? 'right-6' : 'left-6'
      } bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg focus:outline-none`}
      aria-label={isNext ? 'Next' : 'Previous'}
    >
      {isNext ? <FaChevronRight size={20} /> : <FaChevronLeft size={20} />}
    </button>
  );
};
