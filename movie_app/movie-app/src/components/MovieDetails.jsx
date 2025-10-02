import React from 'react';
import { useParams, Link } from 'react-router-dom';

function MovieDetails({ movies, favorites, addToFav }) {
  const { id } = useParams(); 
  const movieId = parseInt(id, 10); 
  const movie = movies.find(m => m.id === movieId);

  if (!movie) {
    return (
      <div className="movie-details">
        <p>Movie not found!</p>
        <Link to="/">← Back to Home</Link>
      </div>
    );
  }

  const isFavorite = favorites.some(m => m.id === movie.id);

  return (
    <div className="movie-details">
      <Link to="/">← Back to Home</Link>
      
      <div className="movie-details-content">
        {movie.poster_path && (
          <div className="movie-details-poster">
            <img 
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
              alt={movie.title}
            />
          </div>
        )}
        
        <div className="movie-details-info">
          <h2>{movie.title}</h2>
          <div className="movie-year">
            {movie.release_date?.split("-")[0] || "N/A"}
          </div>
          <p>{movie.overview || "No description available."}</p>
          
          {!isFavorite ? (
            <button onClick={() => addToFav(movie)}>Add to Favorites</button>
          ) : (
            <span className="already-favorite">✓ In Favorites</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;