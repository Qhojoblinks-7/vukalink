// src/components/layout/Header.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; // Adjust path as needed
import Button from '../ui/Button'; // Assuming you have a Button component
import logo from '../../assets/logo.svg'; // Path to your logo.svg

import NotificationBell from '../common/NotificationBell';
import SearchBox from '../common/SearchBox';
import { useDarkMode } from '../../context/DarkModeContext';

const Header = () => {
  const { user, logout } = useAuth();
  const { darkMode, setDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Toggle dark mode using context only
  const handleToggleDarkMode = () => {
    console.log('[Header] Toggling dark mode. Current:', darkMode);
    setDarkMode(!darkMode);
    setTimeout(() => {
      console.log('[Header] After toggle. darkMode:', darkMode, 'DOM class:', document.documentElement.classList.contains('dark'));
    }, 100);
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md py-4 px-6 md:px-10 flex justify-between items-center">
      {/* Logo Section */}
      <div className="flex items-center">
        <Link
          to={
            user
              ? user.role === 'student'
                ? '/dashboard'
                : '/company/dashboard'
              : '/'
          }
          className="flex items-center space-x-2"
        >
          <img src={logo} alt="VukaLink Logo" className="h-10 w-auto" />
          <h1 className="text-blue-900 text-2xl font-bold -ml-4 mt-4">ukaLink</h1>
        </Link>
      </div>
      <nav className="flex items-center space-x-6">
        {user ? (
          // Logged In State Navigation
          <>
            {/* Dashboard link changes based on role */}
            {user.role === 'student' ? (
              <Link to="/dashboard" className="text-grey-600 -900 hover:text-blue-600 transition-colors font-medium">Dashboard</Link>
            ) : (
              <Link to="/company/dashboard" className="text-grey-600 -900 hover:text-blue-600 transition-colors font-medium">Dashboard</Link>
            )}
            {/* Only students see Find Internships */}
            {user.role === 'student' && (
              <Link to="/find-internships" className="text-grey-600 -900 hover:text-blue-600 transition-colors font-medium">Find Internships</Link>
            )}
            {/* Only students see My Applications and Saved */}
            {user.role === 'student' && (
              <>
                <Link to="/applications" className="text-blue-600 font-semibold">My Applications</Link>
                <Link to="/saved" className="text-grey-600 -900 hover:text-blue-600 transition-colors font-medium">Saved</Link>
              </>
            )}
            <Link
              to={user.role === 'student' ? '/profile/edit' : '/profile/edit'}
              className="text-grey-600 -900 hover:text-blue-600 transition-colors font-medium"
            >
              Profile
            </Link>
            {/* Messages: role-based navigation */}
            {user.role === 'student' ? (
              <Link to="/messages" className="text-grey-600 -900 hover:text-blue-600 transition-colors font-medium">Messages</Link>
            ) : (
              <Link to="/company/messages" className="text-grey-600 -900 hover:text-blue-600 transition-colors font-medium">Messages</Link>
            )}
            <Link to="/resources" className="text-grey-600 -900 hover:text-blue-600 transition-colors font-medium">Resources</Link>
            {/* Search Box for desktop */}
            <div className="ml-4">
              <SearchBox />
            </div>
            <div className="flex items-center space-x-4 ml-6">
              <NotificationBell />
              {/* User Avatar/Menu */}
              <div className="relative" ref={dropdownRef}>
                <button
                  className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold focus:outline-none"
                  onClick={() => setDropdownOpen((open) => !open)}
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen}
                >
                  {user.email ? user.email[0].toUpperCase() : 'U'}
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
                    <Link
                      to={user.role === 'student' ? '/profile/edit' : '/profile/edit'}
                      className="block px-4 py-2 text-grey-600 -700 hover:bg-gray-100    "
                      onClick={() => setDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to={user.role === 'student' ? '/messages' : '/company/messages'}
                      className="block px-4 py-2 text-grey-600 -700 hover:bg-gray-100    "
                      onClick={() => setDropdownOpen(false)}
                    >
                      Messages
                    </Link>
                    <Link
                      to="/resources"
                      className="block px-4 py-2 text-grey-600 -700 hover:bg-gray-100    "
                      onClick={() => setDropdownOpen(false)}
                    >
                      Resources
                    </Link>
                    <button
                      onClick={handleToggleDarkMode}
                      className="block w-full text-left px-4 py-2 text-blue-600 dark:text-blue-300 hover:bg-gray-100     dark:hover:bg-gray-700"
                    >
                      {darkMode ? 'Light Mode' : 'Dark Mode'}
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100     dark:hover:bg-gray-700"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          // Logged Out State Navigation
          <>
          <Link to="/opportunities" className="text-grey-600 -900 hover:text-blue-600 transition-colors font-medium">Browse Opportunities</Link>
          <Link to="/about" className="text-grey-600 -900 hover:text-blue-600 transition-colors font-medium">About Us</Link>
          <Link to="/faq" className="text-grey-600 -900 hover:text-blue-600 transition-colors font-medium">FAQ</Link>
          <Link to="/contact" className="text-grey-600 -900 hover:text-blue-600 transition-colors font-medium">Contact Us</Link>
            <div className="flex items-center space-x-4 ml-6">
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/register-student">
                <Button>Sign Up</Button>
              </Link>
            </div>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;