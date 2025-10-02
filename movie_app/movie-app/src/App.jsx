import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

import Home from './components/Home';
import Favorites from './components/Favorites';
import MovieDetails from './components/MovieDetails';

function App() {
  const token = import.meta.env.VITE_TMDB_TOKEN;

  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchPopularMovies();
  }, []);

  const fetchPopularMovies = async () => {
    try {
      const res = await fetch(
        'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (data.results) setMovies(data.results);
      else setMovies([]);
    } catch (err) {
      alert("Error fetching movies: " + err);
    }
  };

  const addToFav = (movie) => {
    if (!favorites.some(m => m.id === movie.id)) {
      setFavorites(prev => [...prev, movie]);
    }
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Home
            movies={movies}
            favorites={favorites}
            addToFav={addToFav}
          />
        }
      />
      <Route path="/favorites" element={<Favorites favorites={favorites} />} />
      <Route
        path="/movie/:id"
        element={
          <MovieDetails
            movies={movies}
            favorites={favorites}
            addToFav={addToFav}
          />
        }
      />
    </Routes>
  );
}

export default App;