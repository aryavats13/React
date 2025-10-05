import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './MovieDetails.css';

function MovieDetails({ favorites, watchlist, toggleFavorite, toggleWatchlist, token }) {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [videos, setVideos] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMovieDetails();
    fetchMovieCredits();
    fetchMovieVideos();
    fetchSimilarMovies();
  }, [id]);

  const fetchMovieDetails = async () => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?language=en-US`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      if (!res.ok) throw new Error('Failed to fetch movie details');
      
      const data = await res.json();
      setMovie(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching movie details:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMovieCredits = async () => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/credits?language=en-US`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      if (!res.ok) throw new Error('Failed to fetch credits');
      
      const data = await res.json();
      setCredits(data);
    } catch (err) {
      console.error("Error fetching credits:", err);
    }
  };

  const fetchMovieVideos = async () => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      if (!res.ok) throw new Error('Failed to fetch videos');
      
      const data = await res.json();
      // Filter for trailers and teasers
      const trailers = data.results.filter(
        video => video.type === 'Trailer' || video.type === 'Teaser'
      );
      setVideos(trailers);
    } catch (err) {
      console.error("Error fetching videos:", err);
    }
  };

  const fetchSimilarMovies = async () => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/similar?language=en-US&page=1`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      if (!res.ok) throw new Error('Failed to fetch similar movies');
      
      const data = await res.json();
      setSimilarMovies(data.results.slice(0, 6)); // Get top 6 similar movies
    } catch (err) {
      console.error("Error fetching similar movies:", err);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading movie details...</p>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="error-container">
        <h2>Error loading movie details</h2>
        <p>{error || 'Movie not found'}</p>
        <Link to="/" className="back-link">← Back to Home</Link>
      </div>
    );
  }

  const isFavorite = favorites.some(m => m.id === movie.id);
  const isInWatchlist = watchlist.some(m => m.id === movie.id);
  const mainTrailer = videos.find(v => v.type === 'Trailer') || videos[0];

  return (
    <div className="movie-details">
      <Link to="/" className="back-link">← Back to Home</Link>
      
      <div 
        className="movie-backdrop"
        style={{
          backgroundImage: movie.backdrop_path 
            ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
            : 'none'
        }}
      >
        <div className="backdrop-overlay"></div>
      </div>

      <div className="movie-content">
        <div className="movie-header">
          <img
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : 'https://via.placeholder.com/500x750?text=No+Image'
            }
            alt={movie.title}
            className="movie-poster"
          />
          
          <div className="movie-info">
            <h1>{movie.title}</h1>
            <div className="movie-meta">
              <span className="rating">⭐ {movie.vote_average.toFixed(1)}</span>
              <span className="release-date">
                {new Date(movie.release_date).getFullYear()}
              </span>
              <span className="runtime">{movie.runtime} min</span>
            </div>
            
            <div className="genres">
              {movie.genres.map(genre => (
                <span key={genre.id} className="genre-tag">
                  {genre.name}
                </span>
              ))}
            </div>

            <p className="tagline">{movie.tagline}</p>
            <p className="overview">{movie.overview}</p>

            <div className="action-buttons">
              <button
                onClick={() => toggleFavorite(movie)}
                className={`action-btn ${isFavorite ? 'active' : ''}`}
              >
                {isFavorite ? '❤️ Remove from Favorites' : '🤍 Add to Favorites'}
              </button>
              <button
                onClick={() => toggleWatchlist(movie)}
                className={`action-btn ${isInWatchlist ? 'active' : ''}`}
              >
                {isInWatchlist ? '✓ In Watchlist' : '+ Add to Watchlist'}
              </button>
            </div>

            <div className="additional-info">
              <div className="info-item">
                <strong>Budget:</strong> 
                {movie.budget > 0 
                  ? ` $${movie.budget.toLocaleString()}` 
                  : ' N/A'}
              </div>
              <div className="info-item">
                <strong>Revenue:</strong> 
                {movie.revenue > 0 
                  ? ` $${movie.revenue.toLocaleString()}` 
                  : ' N/A'}
              </div>
              <div className="info-item">
                <strong>Status:</strong> {movie.status}
              </div>
              {movie.production_companies.length > 0 && (
                <div className="info-item">
                  <strong>Production:</strong>{' '}
                  {movie.production_companies.map(c => c.name).join(', ')}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Trailer Section */}
        {mainTrailer && (
          <div className="trailer-section">
            <h2>Watch Trailer</h2>
            <div className="trailer-container">
              <iframe
                width="100%"
                height="500"
                src={`https://www.youtube.com/embed/${mainTrailer.key}`}
                title={mainTrailer.name}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}

        {/* Cast Section */}
        {credits && credits.cast && credits.cast.length > 0 && (
          <div className="cast-section">
            <h2>Cast</h2>
            <div className="cast-grid">
              {credits.cast.slice(0, 8).map(person => (
                <div key={person.id} className="cast-card">
                  <img
                    src={
                      person.profile_path
                        ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
                        : 'https://via.placeholder.com/185x278?text=No+Photo'
                    }
                    alt={person.name}
                  />
                  <h4>{person.name}</h4>
                  <p>{person.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Similar Movies Section */}
        {similarMovies.length > 0 && (
          <div className="similar-section">
            <h2>Similar Movies</h2>
            <div className="similar-grid">
              {similarMovies.map(similarMovie => (
                <Link
                  key={similarMovie.id}
                  to={`/movie/${similarMovie.id}`}
                  className="similar-card"
                >
                  <img
                    src={
                      similarMovie.poster_path
                        ? `https://image.tmdb.org/t/p/w300${similarMovie.poster_path}`
                        : 'https://via.placeholder.com/300x450?text=No+Image'
                    }
                    alt={similarMovie.title}
                  />
                  <div className="similar-info">
                    <h4>{similarMovie.title}</h4>
                    <span className="similar-rating">
                      ⭐ {similarMovie.vote_average.toFixed(1)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MovieDetails;