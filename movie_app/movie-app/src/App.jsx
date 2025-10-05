import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

import Home from './components/Home';
import Favorites from './components/Favorites';
import Watchlist from './components/Watchlist';
import MovieDetails from './components/MovieDetails';

function App() {
  const token = import.meta.env.VITE_TMDB_TOKEN;
  
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPopularMovies(1);
    
    // Load favorites and watchlist from localStorage
    const savedFavorites = localStorage.getItem('movieFavorites');
    const savedWatchlist = localStorage.getItem('movieWatchlist');
    
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    if (savedWatchlist) {
      setWatchlist(JSON.parse(savedWatchlist));
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('movieFavorites', JSON.stringify(favorites));
  }, [favorites]);

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('movieWatchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const fetchPopularMovies = async (page) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      if (!res.ok) throw new Error('Failed to fetch movies');
      
      const data = await res.json();
      
      if (page === 1) {
        setMovies(data.results || []);
      } else {
        // Append new movies for pagination
        setMovies(prev => [...prev, ...(data.results || [])]);
      }
      
      setCurrentPage(data.page);
      setTotalPages(data.total_pages);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching movies:", err);
    } finally {
      setLoading(false);
    }
  };

  const searchMovies = async (query, page = 1) => {
    if (!query.trim()) {
      fetchPopularMovies(1);
      setSearchQuery('');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&language=en-US&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      if (!res.ok) throw new Error('Search failed');
      
      const data = await res.json();
      
      if (page === 1) {
        setMovies(data.results || []);
      } else {
        setMovies(prev => [...prev, ...(data.results || [])]);
      }
      
      setCurrentPage(data.page);
      setTotalPages(data.total_pages);
    } catch (err) {
      setError(err.message);
      console.error("Error searching movies:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreMovies = () => {
    if (currentPage < totalPages && !loading) {
      const nextPage = currentPage + 1;
      if (searchQuery) {
        searchMovies(searchQuery, nextPage);
      } else {
        fetchPopularMovies(nextPage);
      }
    }
  };

  // Favorites functions
  const addToFav = (movie) => {
    if (!favorites.some(m => m.id === movie.id)) {
      setFavorites(prev => [...prev, movie]);
    }
  };

  const removeFromFav = (movieId) => {
    setFavorites(prev => prev.filter(m => m.id !== movieId));
  };

  const toggleFavorite = (movie) => {
    if (favorites.some(m => m.id === movie.id)) {
      removeFromFav(movie.id);
    } else {
      addToFav(movie);
    }
  };

  // Watchlist functions
  const addToWatchlist = (movie) => {
    if (!watchlist.some(m => m.id === movie.id)) {
      setWatchlist(prev => [...prev, movie]);
    }
  };

  const removeFromWatchlist = (movieId) => {
    setWatchlist(prev => prev.filter(m => m.id !== movieId));
  };

  const toggleWatchlist = (movie) => {
    if (watchlist.some(m => m.id === movie.id)) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
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
            watchlist={watchlist}
            toggleFavorite={toggleFavorite}
            toggleWatchlist={toggleWatchlist}
            loading={loading}
            error={error}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchMovies={searchMovies}
            loadMoreMovies={loadMoreMovies}
            currentPage={currentPage}
            totalPages={totalPages}
          />
        }
      />
      <Route 
        path="/favorites" 
        element={
          <Favorites 
            favorites={favorites}
            watchlist={watchlist}
            toggleFavorite={toggleFavorite}
            toggleWatchlist={toggleWatchlist}
          />
        } 
      />
      <Route 
        path="/watchlist" 
        element={
          <Watchlist 
            watchlist={watchlist}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            toggleWatchlist={toggleWatchlist}
          />
        } 
      />
      <Route
        path="/movie/:id"
        element={
          <MovieDetails
            favorites={favorites}
            watchlist={watchlist}
            toggleFavorite={toggleFavorite}
            toggleWatchlist={toggleWatchlist}
            token={token}
          />
        }
      />
    </Routes>
  );
}

export default App;