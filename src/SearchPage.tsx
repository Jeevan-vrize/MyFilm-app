import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchPage.css';

interface Movie {
  id: number;
  title: string;
  release_date: string;
  vote_average: number;
  poster_path: string;
}

const SearchPage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isListView, setIsListView] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const moviesPerPage = 10;

  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://api.themoviedb.org/3/discover/movie?api_key=79b50518d885029cb7d87a12f699111a')
      .then(response => response.json())
      .then(data => setMovies(data.results as Movie[]))
      .catch(error => console.error('Error fetching movies:', error));
  }, []);

  const toggleView = (): void => {
    setIsListView(!isListView);
  };

  const handleSearch = (): void => {
    navigate(`/search?query=${searchQuery}`);
  };

  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);

  const paginate = (pageNumber: number): void => setCurrentPage(pageNumber);

  return (
    <div className="search-page">
      <header className="home-header">
        <div className="logo">
          <span>My Films</span>
        </div>
        <nav className="home-nav">
          <a href="/" className="nav-item">Home</a>
          
        </nav>
      </header>

      {/* Search bar with aligned buttons */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search here"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select className="select-box">
          <option>Select Type</option>
          {/* Add your type options here */}
        </select>

        <select className="select-box">
          <option>Select Year</option>
          {/* Add your year options here */}
        </select>

        <button className="select-box" onClick={() => setSearchQuery('')}>
          Reset
        </button>

        <button className="search-btn" onClick={handleSearch}>
          <i className="search-icon">Search 🔍</i>
        </button>
      </div>

      {/* Toggle Button */}
      <div className="toggle-buttons">
        <button onClick={toggleView}>
          {isListView ? 'Switch to Grid View' : 'Switch to List View'}
        </button>
      </div>

      {/* Conditionally Render List or Grid */}
      {isListView ? (
        <div className="list-view">
          {currentMovies.map((movie) => (
            <div className="movie-list-item" key={movie.id}>
              <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
              <div className="movie-details">
                <h4>{movie.title}</h4>
                <p>{movie.release_date} · {movie.vote_average} ⭐</p>
              </div>
              <div className="movie-actions">
                <button className="watchlist-btn">Add to Watchlist</button>
                <button className="fav-btn">❤️ Favorite</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="movies-grid">
          {currentMovies.map((movie) => (
            <div className="movie-card" key={movie.id}>
              <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
              <div className="movie-details">
                <h4>{movie.title}</h4>
                <p>{movie.release_date} </p>
                <p>Imdb {movie.vote_average} ⭐</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="pagination">
     
        <button onClick={() => paginate(1)}>01</button>
        <button onClick={() => paginate(2)}>02</button>
        <button onClick={() => paginate(3)}>03</button>
        <button onClick={() => paginate(3)}>..</button>
        
        
        
      </div>

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

export default SearchPage;
