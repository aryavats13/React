import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Home({ movies, favorites, addToFav }) {
  const [search, setSearch] = useState("");
  const [movieInfo, setMovieInfo] = useState(movies);
  
  const token = import.meta.env.VITE_TMDB_TOKEN;
  
  React.useEffect(() => {
    setMovieInfo(movies);
  }, [movies]);
  
  const searching = async () => {
    if (!search) {
      setMovieInfo(movies);
      return;
    }
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(search)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (data.results) {
        setMovieInfo(data.results);
      } else {
        setMovieInfo([]);
      }
    } catch (err) {
      alert("Error fetching:", err);
    }
  };
  
  return (
    <div className="home-container">
      <div className="page-header">
        <h1 className="page-title">Cinema Collection</h1>
        <p className="page-subtitle">Discover and curate your favorite films</p>
      </div>
      
      <div className="search-bar">
        <input
          placeholder="Search for movies..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && searching()}
        />
        <button onClick={searching}>Search</button>
        <Link to="/favorites">Favorites</Link>
      </div>
      
      {movieInfo.length === 0 ? (
        <div className="empty-state">
          <p>No movies found. Try searching for something!</p>
        </div>
      ) : (
        <div className="movie-list">
          {movieInfo.map(m => (
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
                  <button onClick={(e) => {
                    e.preventDefault();
                    addToFav(m);
                  }}>
                    Add to Favorites
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;