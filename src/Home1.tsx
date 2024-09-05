import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import { FaPlus, FaHeart, FaSun, FaMoon } from 'react-icons/fa';  
import { ToastContainer, toast } from 'react-toastify';  
import 'react-toastify/dist/ReactToastify.css';  

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
  const [theme, setTheme] = useState<string>('light');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [watchlists, setWatchlists] = useState<Movie[]>([]);
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [showAllWatchlists, setShowAllWatchlists] = useState<boolean>(false);
  const [showAllFavorites, setShowAllFavorites] = useState<boolean>(false);

  useEffect(() => {
    
    fetch('https://api.themoviedb.org/3/discover/movie?api_key=79b50518d885029cb7d87a12f699111a')
      .then(response => response.json())
      .then(data => {
        setMovies(data.results || []);
        setWatchlists(data.results.slice(5, 10) || []); 
        setFavorites(data.results.slice(10, 15) || []); 
        setPopularMovies(data.results || []);
      })
      .catch(error => console.error('Error fetching movies:', error));
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleSearchNavigate = () => {
    navigate(`/search?query=${searchQuery}`);
  };

  const handleAddToWatchlist = (movie: Movie) => {
    if (!watchlists.some((watchlistMovie) => watchlistMovie.id === movie.id)) {
      setWatchlists([...watchlists, movie]);
      toast.success(`${movie.title} added to Watchlist!`);
    }
  };

  const handleAddToFavorites = (movie: Movie) => {
    if (!favorites.some((favoriteMovie) => favoriteMovie.id === movie.id)) {
      setFavorites([...favorites, movie]);
      toast.success(`${movie.title} added to Favorites!`);
    }
  };

  const handleRemoveFromWatchlist = (movieId: number) => {
    const updatedWatchlist = watchlists.filter(movie => movie.id !== movieId);
    setWatchlists(updatedWatchlist);
    toast.info('Movie removed from Watchlist.');
  };


  const handleRemoveFromFavorites = (movieId: number) => {
    const updatedFavorites = favorites.filter(movie => movie.id !== movieId);
    setFavorites(updatedFavorites);
    toast.info('Movie removed from Favorites.');
  };
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const visibleWatchlists = showAllWatchlists ? watchlists : watchlists.slice(0, 5);
  const visibleFavorites = showAllFavorites ? favorites : favorites.slice(0, 5);

  return (
    <div className="home-container">
    <ToastContainer />
    <header className="home-header">
      <div className="logo">
        <span>My Films</span>
      </div>
      <nav className="home-nav">
        <a href="#home" className="nav-item active">Home</a>
        <a href="#favorites" className="nav-item">Favorites</a>
        <a href="#watchlist" className="nav-item">Watchlist</a>
      </nav>
      <div className="theme-toggle" onClick={toggleTheme}>
        {theme === 'light' ? <FaMoon /> : <FaSun />}
      </div>
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

   
      <section className="popular-movies-section" id="popular-movies">
        <h3>Popular Movies</h3>
        <br />
        <div className="popular-movies-grid">
          {popularMovies.length > 0 ? (
            popularMovies.map((movie) => (
              <div className="popular-movies-card" key={movie.id}>
                <div className="icon-container">
                  <div
                    className="watchlist-icon"
                    onClick={() => handleAddToWatchlist(movie)}
                  >
                    <FaPlus />
                  </div>
                </div>
                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                <div className="watchlist-details">
                  <h4>{movie.title}</h4>
                  <p>{movie.release_date}</p>
                  <p>Imdb {movie.vote_average} ⭐</p>
                  <div
                    className="favorite-icon"
                    onClick={() => handleAddToFavorites(movie)}
                  >
                    <FaHeart />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No popular movies available.</p>
          )}
        </div>
      </section>


      <section className="watchlist-section" id="favorites">
        <h3>Favorite Movies</h3>
        <br />
        <div className={`watchlist-grid ${showAllFavorites ? 'expanded' : ''}`}>
          {visibleFavorites.length > 0 ? (
            visibleFavorites.map((movie) => (
              <div className="watchlist-card" key={movie.id}>
                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                <div className="watchlist-details">
                  <h4>{movie.title}</h4>
                  <p>{movie.release_date}</p>
                  <p>Imdb {movie.vote_average} ⭐</p>
                  <div className="RemoveHeart">
                  <button onClick={() => handleRemoveFromFavorites(movie.id)}>
                 
                    Remove
                  </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No favorite movies available.</p>
          )}
        </div>
      </section>
      <a href="#" className="view-all" onClick={() => setShowAllFavorites(!showAllFavorites)}>
        {showAllFavorites ? 'Show Less' : 'View All'}
      </a>

   
      <section className="watchlist-section" id="watchlist">
        <h3>Watchlist</h3>
        <br />
        <div className={`watchlist-grid ${showAllWatchlists ? 'expanded' : ''}`}>
          {visibleWatchlists.length > 0 ? (
            visibleWatchlists.map((movie) => (
              <div className="watchlist-card" key={movie.id}>
                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                <div className="watchlist-details">
                  <h4>{movie.title}</h4>
                  <p>{movie.release_date}</p>
                  <p>Imdb {movie.vote_average} ⭐</p>
                  
                  <button onClick={() => handleRemoveFromWatchlist(movie.id)}>
                    
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No watchlist movies available.</p>
          )}
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