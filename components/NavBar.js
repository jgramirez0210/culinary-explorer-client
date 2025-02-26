import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut } from '../utils/auth';

export default function NavBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="custom-navbar">
      <div className="navbar-container">
        <Link href="/" className="navbar-brand-custom">
          Culinary Explorer
        </Link>

        <button
          className="navbar-toggler"
          onClick={toggleMenu}
          style={{ display: 'none' }} // Temporarily hidden, add proper toggle button styling
        >
          Menu
        </button>

        <div className={`navbar-links ${isMenuOpen ? 'show' : ''}`}>
          <Link href="/food_log/new" className="navbar-link">
            Add To Food Log
          </Link>
          <Link href="/restaurant_map/restaurant_map" className="navbar-link">
            Restaurant Map
          </Link>
          <button className="sign-out-btn" onClick={signOut}>
            Sign Out
          </button>

          <form className="search-form" onSubmit={handleSearchSubmit}>
            <input type="search" placeholder="Search" className="search-input" value={searchQuery} onChange={handleSearchChange} aria-label="Search" />
          </form>
        </div>
      </div>
    </nav>
  );
}
