import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import { FaPlus } from 'react-icons/fa';

interface Movie {
  id: number;
  title: string;
  release_date: string;
  vote_average: number;
  poster_path: string;
}

const Home1: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [watchlists, setWatchlists] = useState<Movie[]>([]);
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [showAllWatchlists, setShowAllWatchlists] = useState<boolean>(false);
  const [showAllFavorites, setShowAllFavorites] = useState<boolean>(false);

  useEffect(() => {
    // Fetch movies from the API
    fetch('https://api.themoviedb.org/3/discover/movie?api_key=79b50518d885029cb7d87a12f699111a')
      .then(response => response.json())
      .then(data => setMovies(data.results))
      .catch(error => console.error('Error fetching movies:', error));

    // Fetch watchlists and favorites from the API
    fetch('https://api.themoviedb.org/3/discover/movie?api_key=79b50518d885029cb7d87a12f699111a')
      .then(response => response.json())
      .then(data => {
        setWatchlists(data.results);
        setFavorites(data.results);
      })
      .catch(error => console.error('Error fetching watchlists and favorites:', error));
  }, []);

  const handleSearchNavigate = () => {
    navigate(`/search?query=${searchQuery}`);
  };

  const visibleWatchlists = showAllWatchlists ? watchlists : watchlists.slice(0, 5);
  const visibleFavorites = showAllFavorites ? favorites : favorites.slice(0, 5);

  return (
    <div className="home-container" id="home">
      <header className="home-header">
        <div className="logo">
          <span>My Films</span>
        </div>
        <nav className="home-nav">
          <a href="#home" className="nav-item active">Home</a>
          <a href="#favorites" className="nav-item">Favorite</a>
          <a href="#watchlist" className="nav-item">Watchlist</a>
        </nav>
      </header>

      <section className="welcome-section">
        <h1>Welcome to My Films,</h1>
        <h2>Your favorite Movies & Series all in one place</h2>
        <div className="search-box1" onClick={() => navigate('/search')}>
          <input
            type="text"
            placeholder="Search here"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={handleSearchNavigate}><i className="search-icon">🔍</i></button>
        </div>
      </section>

      {/* Favorite Section */}
      <section className="watchlist-section" id="favorites">
        <h3>Favorite Movies</h3>
        <br />
        <div className={`watchlist-grid ${showAllFavorites ? 'expanded' : ''}`}>
          {visibleFavorites.map((movie) => (
            <div className="watchlist-card" key={movie.id}>
              {/* Watchlist Icon */}
              <div className="watchlist-icon">
                <FaPlus />
              </div>
              <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
              <div className="watchlist-details">
                <h4>{movie.title}</h4>
                <p>{movie.release_date}</p>
                <p>Imdb {movie.vote_average} ⭐</p>
                <p>❤️</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <a href="#" className="view-all" onClick={() => setShowAllFavorites(!showAllFavorites)}>
        {showAllFavorites ? 'Show Less' : 'View All'}
      </a>

      {/* Watchlist Section */}
      <section className="watchlist-section" id="watchlist">
        <h3>Watchlist</h3>
        <br />
        <div className={`watchlist-grid ${showAllWatchlists ? 'expanded' : ''}`}>
          {visibleWatchlists.map((movie) => (
            <div className="watchlist-card" key={movie.id}>
              <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
              <div className="watchlist-details">
                <h4>{movie.title}</h4>
                <p>{movie.release_date} · {movie.vote_average} ⭐</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <a href="#" className="view-all" onClick={() => setShowAllWatchlists(!showAllWatchlists)}>
        {showAllWatchlists ? 'Show Less' : 'View All'}
      </a>

      <footer className="home-footer">
        <p>Copyright © 2024 My Films. All rights reserved.</p>
        <div className="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms and Conditions</a>
        </div>
      </footer>
    </div>
  );
};

export default Home1;
