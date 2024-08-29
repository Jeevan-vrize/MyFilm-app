import React from 'react';
import './Navbar.css'; // Make sure to include your CSS file for styling

const Navbar = () => {
  return (
    <header className="home-header">
      <div className="logo">
        <span>My Films</span>
      </div>
      <nav className="home-nav">
        <a href="#home" className="nav-item active">Home</a>
        <a href="#watchlist-section" className="nav-item">Watchlist</a>
        <a href="#favourite-movies" className="nav-item">Favourite</a>
      </nav>
    </header>
  );
};

export default Navbar;
