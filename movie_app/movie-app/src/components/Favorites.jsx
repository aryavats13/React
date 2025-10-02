import React from 'react';
import { Link } from 'react-router-dom';

function Favorites({ favorites }) {
  return (
    <div className="fav-list">
      <h3>Your Favorites</h3>
      <Link to="/">← Back to Home</Link>

      {favorites.length === 0 ? (
        <p>No favorites yet. Start adding movies you love!</p>
      ) : (
        <div className="movie-list">
          {favorites.map(m => (
            <Link to={`/movie/${m.id}`} key={m.id} style={{ textDecoration: 'none' }}>
              <div className="movie-card">
                {m.poster_path && (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${m.poster_path}`}
                    alt={m.title}
                  />
                )}
                <div className="movie-card-content">
                  <h3>{m.title}</h3>
                  <p>{m.overview || "No description available."}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;