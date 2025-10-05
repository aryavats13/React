import React from 'react';
import { Link } from 'react-router-dom';
import './Watchlist.css';

function Watchlist({ watchlist, favorites, toggleFavorite, toggleWatchlist }) {
  if (watchlist.length === 0) {
    return (
      <div className="watchlist-container">
        <div className="header">
          <Link to="/" className="back-link">← Back to Home</Link>
          <h1>My Watchlist</h1>
        </div>
        <div className="empty-state">
          <h2>📋 Your watchlist is empty</h2>
          <p>Add movies you want to watch later!</p>
          <Link to="/" className="browse-btn">Browse Movies</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="watchlist-container">
      <div className="header">
        <Link to="/" className="back-link">← Back to Home</Link>
        <h1>My Watchlist ({watchlist.length})</h1>
      </div>
      
      <div className="watchlist-grid">
        {watchlist.map(movie => {
          const isFavorite = favorites.some(m => m.id === movie.id);
          
          return (
            <div key={movie.id} className="movie-card">
              <Link to={`/movie/${movie.id}`}>
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : 'https://via.placeholder.com/500x750?text=No+Image'
                  }
                  alt={movie.title}
                  className="movie-poster"
                />
              </Link>
              
              <div className="movie-info">
                <Link to={`/movie/${movie.id}`} className="movie-title">
                  <h3>{movie.title}</h3>
                </Link>
                <div className="movie-meta">
                  <span className="rating">⭐ {movie.vote_average.toFixed(1)}</span>
                  <span className="release-year">
                    {new Date(movie.release_date).getFullYear()}
                  </span>
                </div>
                
                <div className="action-buttons">
                  <button
                    onClick={() => toggleFavorite(movie)}
                    className={`icon-btn ${isFavorite ? 'favorite' : ''}`}
                    title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                  >
                    {isFavorite ? '❤️' : '🤍'}
                  </button>
                  <button
                    onClick={() => toggleWatchlist(movie)}
                    className="icon-btn remove"
                    title="Remove from Watchlist"
                  >
                    ✓
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Watchlist;