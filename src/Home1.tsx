import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { useSnackbar } from 'notistack';
import { FaPlus, FaHeart, FaMinus } from 'react-icons/fa';
import './App.css';
import { ToastContainer ,toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useJeevan from './customhook';
import { ADD_TO_WATCHLIST, ADD_TO_FAVORITES, DELETE_FROM_FAVORITES, DELETE_FROM_WATCHLIST } from '../src/graphql/mutation';
import { GET_FAVORITES, GET_WATCHLIST } from '../src/graphql/queries';
 
interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date?: string;
  vote_average?: number;
}
 
const Home1: React.FC = () => {
  const { theme, toggleTheme } = useJeevan();
  const { enqueueSnackbar } = useSnackbar();
  const [watchlists, setWatchlists] = useState<Movie[]>([]);
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [showAllWatchlists, setShowAllWatchlists] = useState<boolean>(false);
  const [showAllFavorites, setShowAllFavorites] = useState<boolean>(false);
  const [ratedMovies, setRatedMovies] = useState<Movie[]>([]);
const [recentMovies, setRecentMovies] = useState<Movie[]>([]);
 
  const { data: favoriteData, loading: favoriteLoading, error: favoriteError } = useQuery(GET_FAVORITES);
  const { data: watchlistData, loading: watchlistLoading, error: watchlistError } = useQuery(GET_WATCHLIST);
 
  const [addToWatchlist] = useMutation(ADD_TO_WATCHLIST, {
    refetchQueries: [{ query: GET_WATCHLIST }],
  });
 
  const [addToFavorites] = useMutation(ADD_TO_FAVORITES, {
    refetchQueries: [{ query: GET_FAVORITES }],
  });
 
  const [deleteFavorite] = useMutation(DELETE_FROM_FAVORITES, {
    refetchQueries: [{ query: GET_FAVORITES }],
  });
 
  const [deleteWatchlist] = useMutation(DELETE_FROM_WATCHLIST, {
    refetchQueries: [{ query: GET_WATCHLIST }],
  });
 
  useEffect(() => {
    fetch('https://api.themoviedb.org/3/discover/movie?api_key=79b50518d885029cb7d87a12f699111a')
      .then(response => response.json())
      .then(data => {
        setMovies(data.results || []);
        setPopularMovies(data.results || []);
        setWatchlists(data.results.slice(5, 10) || []);
        setFavorites(data.results.slice(10, 15) || []);
      })
      .catch(error => console.error('Error fetching movies:', error));
  }, []);
  useEffect(() => {
    // Fetch rated movies
    fetch('https://api.themoviedb.org/3/movie/top_rated?api_key=79b50518d885029cb7d87a12f699111a')
      .then(response => response.json())
      .then(data => setRatedMovies(data.results || []));
    })
   
    
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
 
  const handleSearchNavigate = () => {
    navigate(`/search?query=${searchQuery}`);
  };
 
  const handleAddToFavorites = async (movie: Movie, e: React.MouseEvent) => {
    e.stopPropagation();
 
    try {
      const { data } = await addToFavorites({
        variables: {
          id: movie.id,
          movie_app_id: movie.id,
          movie_poster_path: movie.poster_path,
          overview: movie.overview,
          title: movie.title,
          added_at: new Date().toISOString(),
        },
      });
      enqueueSnackbar('Movie added to Favorite!', { variant: 'success' });
      toast.success(`${movie.title} added to Favorite!`);
    } catch (error) {
      console.error("Error adding to Favorite:", error);
      enqueueSnackbar('Failed to add movie to Favorite.', { variant: 'error' });
    }
  };
 
  const handleAddToWatchlist = async (movie: Movie, e: React.MouseEvent) => {
    e.stopPropagation();
 
    try {
      const { data } = await addToWatchlist({
        variables: {
          id: movie.id,
          movie_app_id: movie.id,
          movie_poster_path: movie.poster_path,
          overview: movie.overview,
          title: movie.title,
          added_at: new Date().toISOString(),
        },
      });
      enqueueSnackbar('Movie added to Watchlist!', { variant: 'success' });
      toast.success(`${movie.title} added to Watchlist!`);
    } catch (error) {
      console.error("Error adding to Watchlist:", error);
      enqueueSnackbar('Failed to add movie to Watchlist.', { variant: 'error' });
    }
  };
 
  const handleDelete = async (movie: Movie, mode: 'favorites' | 'watchlist', e: React.MouseEvent) => {
    e.stopPropagation();
 
    try {
      if (mode === 'favorites') {
        const { data } = await deleteFavorite({ variables: { id: movie.id } });
        if (data && data.delete_favorite && data.delete_favorite.affected_rows > 0) {
          enqueueSnackbar('Movie deleted from favorites!', { variant: 'success' });
          toast.success(`${movie.title} deleted from favorite`);
         
        } else {
          enqueueSnackbar('Movie not found in favorites!', { variant: 'info' });
        }
      } else if (mode === 'watchlist') {
        const { data } = await deleteWatchlist({ variables: { id: movie.id } });
        if (data && data.delete_watchlist && data.delete_watchlist.affected_rows > 0) {
          enqueueSnackbar('Movie deleted from watchlist!', { variant: 'success' });
          toast.success(`${movie.title} deleted from watchlist`);
        } else {
          enqueueSnackbar('Movie not found in watchlist!', { variant: 'info' });
        }
      }
    } catch (error) {
      enqueueSnackbar('Error deleting movie.', { variant: 'error' });
    }
  };
 
  const visibleFavorites = showAllFavorites ? favoriteData?.favorite || [] : favoriteData?.favorite.slice(0, 5) || [];
  const visibleWatchlists = showAllWatchlists ? watchlistData?.watchlist || [] : watchlistData?.watchlist.slice(0, 5) || [];
 
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
      {/* Popular Movies Section */}
      <section className="watchlist-section" id="popular-movies">
        <h3>Popular Movies</h3>
        <div className="popular-movies-grid">
          {popularMovies.length > 0 ? (
            popularMovies.map(movie => (
              <div className="popular-movies-card" key={movie.id}>
                <div className="icon-container">
                  <div className="watchlist-icon" onClick={(e) => handleAddToWatchlist(movie, e)}>
                    <FaPlus />
                  </div>
                </div>
                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                <div className="watchlist-details">
                  <h4>{movie.title}</h4>
                  <p>{movie.release_date}</p>
                  <p>Imdb {movie.vote_average} ⭐</p>
                  <div className="favorite-icon" onClick={(e) => handleAddToFavorites(movie, e)}>
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




      <section className="watchlist-section" id="rated-movies">
  <h3>Rated Movies</h3>
  <div className="popular-movies-grid">
    {ratedMovies.map(movie => (
      <div className="movie-card" key={movie.id}>
        
        <div className="icon-container">
                  <div className="watchlist-icon" onClick={(e) => handleAddToWatchlist(movie, e)}>
                    <FaPlus />
                  </div>
                </div>
                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                <div className="watchlist-details">
                  <h4>{movie.title}</h4>
                  <p>{movie.release_date}</p>
                  <p>Imdb {movie.vote_average} ⭐</p>
                  <div className="favorite-icon" onClick={(e) => handleAddToFavorites(movie, e)}>
                    <FaHeart />
                  </div>
                </div>
      </div>
    ))}
  </div>
</section>


 
      {/* Favorite Movies Section */}
      <section className="watchlist-section" id="favorites-movies">
        <h3>Favorite Movies</h3>
        <div className={`watchlist-grid ${showAllFavorites ? 'expanded' : ''}`}>
          {visibleFavorites.length > 0 ? (
            visibleFavorites.map((movie: Movie) => (
              <div className="watchlist-card" key={movie.id}>
                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                <div className="watchlist-details">
                  <h4>{movie.title}</h4>
                  <div className="icon-container">
                  <button onClick={(e) => handleDelete(movie, 'favorites', e)}>
                    Delete
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
      <a href="#" className="view-all" onClick={() => setShowAllWatchlists(!showAllWatchlists)}>
        {showAllWatchlists ? 'Show Less' : 'View All'}
      </a>
 
      {/* Watchlist Section */}
      <section className="watchlist-section" id="watchlist-movies">
        <h3>Watchlist</h3>
        <div className={`watchlist-grid ${showAllWatchlists ? 'expanded' : ''}`}>
          {visibleWatchlists.length > 0 ? (
            visibleWatchlists.map((movie: Movie) => (
              <div className="watchlist-card" key={movie.id}>
                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                <div className="watchlist-details">
                  <h4>{movie.title}</h4>
                  <button className="delete-icon" onClick={(e) => handleDelete(movie, 'watchlist', e)}>
                    Remove
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No movies in the watchlist available.</p>
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
 