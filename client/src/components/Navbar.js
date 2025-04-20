import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { VideoIcon } from './Icons';
import '../styles/Navbar.css';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate('/login');
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-brand">
        <VideoIcon />
        <Link to="/">VCall</Link>
      </div>

      <button
        className={`menu-toggle ${isMenuOpen ? 'active' : ''}`}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
        <ul className="nav-links">
          <li>
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className={location.pathname === '/' ? 'active' : ''}
            >
              Home
            </Link>
          </li>
          {isAuthenticated ? (
            <>
              <li>
                <Link
                  to="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className={location.pathname === '/dashboard' ? 'active' : ''}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className={location.pathname === '/profile' ? 'active' : ''}
                >
                  Profile
                </Link>
              </li>
              <li>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className={location.pathname === '/login' ? 'active' : ''}
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className={location.pathname === '/register' ? 'active' : ''}
                >
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;