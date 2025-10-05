import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home({ 
  movies, 
  favorites, 
  watchlist,
  toggleFavorite, 
  toggleWatchlist,
  loading, 
  error,
  searchQuery,
  setSearchQuery,
  searchMovies,
  loadMoreMovies,
  currentPage,
  totalPages
}) {
  
  const handleSearch = (e) => {
    e.preventDefault();
    searchMovies(searchQuery);
  };

  return (
    <div className="home-container">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-content">
          <h1 className="logo">🎬 MovieHub</h1>
          <div className="nav-links">
            <Link to="/" className="nav-link active">Home</Link>
            <Link to="/favorites" className="nav-link">
              Favorites {favorites.length > 0 && `(${favorites.length})`}
            </Link>
            <Link to="/watchlist" className="nav-link">
              Watchlist {watchlist.length > 0 && `(${watchlist.length})`}
            </Link>
          </div>
        </div>
      </nav>

      {/* Search Bar */}
      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for movies..."
            className="search-input"
          />
          <button type="submit" className="search-btn">
            🔍 Search
          </button>
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                searchMovies('');
              }}
              className="clear-btn"
            >
              ✕ Clear
            </button>
          )}
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <p>⚠️ {error}</p>
        </div>
      )}

      {/* Movies Grid */}
      <div className="movies-section">
        <h2 className="section-title">
          {searchQuery ? `Search Results for "${searchQuery}"` : 'Popular Movies'}
        </h2>
        
        {movies.length === 0 && !loading ? (
          <div className="no-results">
            <h3>No movies found</h3>
            <p>Try a different search term</p>
          </div>
        ) : (
          <div className="movies-grid">
            {movies.map(movie => {
              const isFavorite = favorites.some(m => m.id === movie.id);
              const isInWatchlist = watchlist.some(m => m.id === movie.id);

              return (
                <div key={movie.id} className="movie-card">
                  <Link to={`/movie/${movie.id}`} className="movie-link">
                    <img
                      src={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                          : 'https://via.placeholder.com/500x750?text=No+Image'
                      }
                      alt={movie.title}
                      className="movie-poster"
                    />
                    <div className="movie-overlay">
                      <h3 className="movie-title">{movie.title}</h3>
                      <div className="movie-rating">
                        ⭐ {movie.vote_average.toFixed(1)}
                      </div>
                    </div>
                  </Link>
                  
                  <div className="card-actions">
                    <button
                      onClick={() => toggleFavorite(movie)}
                      className={`action-icon ${isFavorite ? 'active' : ''}`}
                      title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                    >
                      {isFavorite ? '❤️' : '🤍'}
                    </button>
                    <button
                      onClick={() => toggleWatchlist(movie)}
                      className={`action-icon ${isInWatchlist ? 'active' : ''}`}
                      title={isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                    >
                      {isInWatchlist ? '✓' : '+'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="loading-section">
            <div className="spinner"></div>
            <p>Loading movies...</p>
          </div>
        )}

        {/* Load More Button */}
        {!loading && movies.length > 0 && currentPage < totalPages && (
          <div className="load-more-section">
            <button onClick={loadMoreMovies} className="load-more-btn">
              Load More Movies
            </button>
            <p className="page-info">
              Page {currentPage} of {totalPages}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;