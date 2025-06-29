// src/components/layout/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; // Adjust path as needed
import Button from '../ui/Button'; // Assuming you have a Button component
import logo from '../../assets/logo.svg'; // Path to your logo.svg

import NotificationBell from '../common/NotificationBell';
import SearchBox from '../common/SearchBox';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <header className=" bg-white shadow-md py-4 px-6 md:px-10 flex justify-between items-center">
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
              <Link to="/dashboard" className="text-vuka-text hover:text-blue transition-colors font-medium">Dashboard</Link>
            ) : (
              <Link to="/company/dashboard" className="text-vuka-text hover:text-blue transition-colors font-medium">Dashboard</Link>
            )}
            {/* Only students see Find Internships */}
            {user.role === 'student' && (
              <Link to="/find-internships" className="text-vuka-text hover:text-blue transition-colors font-medium">Find Internships</Link>
            )}
            {/* Only students see My Applications and Saved */}
            {user.role === 'student' && (
              <>
                <Link to="/applications" className="text-blue font-semibold">My Applications</Link>
                <Link to="/saved" className="text-vuka-text hover:text-blue transition-colors font-medium">Saved</Link>
              </>
            )}
            <Link
              to={user.role === 'student' ? '/profile/edit' : '/profile/edit'}
              className="text-vuka-text hover:text-blue transition-colors font-medium"
            >
              Profile
            </Link>
            <Link to="/messages" className="text-vuka-text hover:text-blue transition-colors font-medium">Messages</Link>
            <Link to="/resources" className="text-vuka-text hover:text-blue transition-colors font-medium">Resources</Link>
            {/* Search Box for desktop */}
            <div className="ml-4">
              <SearchBox />
            </div>
            <div className="flex items-center space-x-4 ml-6">
              <NotificationBell />
              {/* User Avatar/Menu */}
              <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold">
                {user.email ? user.email[0].toUpperCase() : 'U'}
              </div>
            </div>
          </>
        ) : (
          // Logged Out State Navigation
          <>
            <Link to="/opportunities" className="text-vuka-text hover:text-blue transition-colors font-medium">Browse Opportunities</Link>
            <Link to="/about" className="text-vuka-text hover:text-blue transition-colors font-medium">About Us</Link>
            <Link to="/faq" className="text-vuka-text hover:text-blue transition-colors font-medium">FAQ</Link>
            <Link to="/contact" className="text-vuka-text hover:text-blue transition-colors font-medium">Contact Us</Link>
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