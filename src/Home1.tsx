import React, { useEffect, useState,useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import { FaPlus, FaHeart, FaSun, FaMoon } from 'react-icons/fa';  
import { ToastContainer, toast } from 'react-toastify';  
import 'react-toastify/dist/ReactToastify.css';  
import useJeevan from './customhook';



interface Movie {
  id: number;
  title: string;
  release_date: string;
  vote_average: number;
  poster_path: string;
}
type ActionType = 
  | { type: 'ADD_MOVIE'; payload: Movie }
  | { type: 'REMOVE_MOVIE'; payload: number };

const watchlistReducer = (state: Movie[], action: ActionType): Movie[] => {
  switch (action.type) {
    case 'ADD_MOVIE':
      return state.some(movie => movie.id === action.payload.id)
        ? state
        : [...state, action.payload];
    case 'REMOVE_MOVIE':
      return state.filter(movie => movie.id !== action.payload);
    default:
      return state;
  }
};

const favoritesReducer = (state: Movie[], action: ActionType): Movie[] => {
  switch (action.type) {
    case 'ADD_MOVIE':
      return state.some(movie => movie.id === action.payload.id)
        ? state
        : [...state, action.payload];
    case 'REMOVE_MOVIE':
      return state.filter(movie => movie.id !== action.payload);
    default:
      return state;
  }
};


const Home1: React.FC = () => {

  const { theme, toggleTheme } = useJeevan();
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigate = useNavigate();
 
  const [movies, setMovies] = useState<Movie[]>([]);
  
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [showAllWatchlists, setShowAllWatchlists] = useState<boolean>(false);

  const [showAllFavorites, setShowAllFavorites] = useState<boolean>(false);
  const [watchlists, dispatchWatchlist] = useReducer(watchlistReducer, []);
  const [favorites, dispatchFavorites] = useReducer(favoritesReducer, []);
 
  
  
  useEffect(() => {
    
    fetch('https://api.themoviedb.org/3/discover/movie?api_key=79b50518d885029cb7d87a12f699111a')
      .then(response => response.json())
      .then(data => {
        setMovies(data.results || []);
        const initialMovies = data.results.slice(5, 10);
        const initialMovies1 = data.results.slice(11, 16);
        setMovies(data.results || []);
        setPopularMovies(data.results || []);

        // Initialize with 5 movies
        initialMovies.forEach((movie: Movie) => {
          
          dispatchFavorites({ type: 'ADD_MOVIE', payload: movie }); 
      
      });
      initialMovies1.forEach((movie: Movie) => {
        dispatchWatchlist({ type: 'ADD_MOVIE', payload: movie });
        
    });
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
    dispatchWatchlist({ type: 'ADD_MOVIE', payload: movie });
    toast.success(`${movie.title} added to Watchlist!`);
  };

  const handleRemoveFromWatchlist = (movieId: number) => {
    dispatchWatchlist({ type: 'REMOVE_MOVIE', payload: movieId });
    toast.info('Movie removed from Watchlist.');
  };

 
  const handleAddToFavorites = (movie: Movie) => {
    dispatchFavorites({ type: 'ADD_MOVIE', payload: movie });
    toast.success(`${movie.title} added to Favorites!`);
  };

  const handleRemoveFromFavorites = (movieId: number) => {
    dispatchFavorites({ type: 'REMOVE_MOVIE', payload: movieId });
    toast.info('Movie removed from Favorites.');
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
        <a href="#favorites-movies" className="nav-item active">Favorites</a>
        <a href="#watchlist-movies" className="nav-item active">Watchlist</a>
      </nav>
      <button onClick={toggleTheme}>
          {theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        </button>
      
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

   
      <section className="watchlist-section" id="popular-movies">
        <h3>Popular Movies</h3>
        
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


      <section className="watchlist-section" id="favorites-movies">
        <h3>Favorite Movies</h3>
      
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

   
      <section className="watchlist-section" id="watchlist-movies">
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