// src/components/layout/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; // Adjust path as needed
import Button from '../ui/Button'; // Assuming you have a Button component
import logo from '../../assets/logo.svg'; // Path to your logo.svg
import { BellIcon } from '@heroicons/react/24/outline'; // Install: npm install @heroicons/react

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
        <Link to={user ? '/dashboard' : '/'} className="flex items-center space-x-2">
          <img src={logo} alt="VukaLink Logo" className="h-10 w-auto" />
          <h1 className="text-blue-900 text-2xl font-bold -ml-4 mt-4">ukaLink</h1>
        </Link>
      </div>
      <nav className="flex items-center space-x-6">
        {user ? (
          // Logged In State Navigation
          <>
            <Link to="/dashboard" className="text-vuka-text hover:text-blue transition-colors font-medium">Dashboard</Link>
            <Link to="/find-internships" className="text-vuka-text hover:text-blue transition-colors font-medium">Find Internships</Link>
            <Link to="/applications" className="text-blue font-semibold">My Applications</Link> {/* Highlighted from image */}
            <Link to="/saved" className="text-vuka-text hover:text-blue transition-colors font-medium">Saved</Link>
            <Link to="/profile" className="text-vuka-text hover:text-blue transition-colors font-medium">Profile</Link>
            <Link to="/messages" className="text-vuka-text hover:text-blue transition-colors font-medium">Messages</Link>
            <Link to="/resources" className="text-vuka-text hover:text-blue transition-colors font-medium">Resources</Link>
            
            <div className="flex items-center space-x-4 ml-6"> {/* Separate group for icons/avatar */}
              <BellIcon className="h-6 w-6 text-gray-200 cursor-pointer hover:text-blue transition-colors" />
              {/* Placeholder for User Avatar/Menu - You'd put the actual avatar image here */}
              <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold">
                {user.email ? user.email[0].toUpperCase() : 'U'} {/* Fallback initial */}
              </div>
              {/* Or if you have a full avatar from profile, use:
              <img src={profile?.avatar_url || getGravatarUrl(user.email)} alt="User Avatar" className="w-9 h-9 rounded-full object-cover" />
              */}
            </div>
            {/* If you still want a logout button here, add it, but it's often in a dropdown */}
            {/* <Button onClick={handleLogout} variant="ghost" className="text-blue-900  hover:text-blue-900 -dark">Logout</Button> */}
          </>
        ) : (
          // Logged Out State Navigation (from image_3411ff.png)
          <>
            <Link to="/opportunities" className="text-vuka-text hover:text-blue transition-colors font-medium">Browse Opportunities</Link>
            <Link to="/about" className="text-vuka-text hover:text-blue transition-colors font-medium">About Us</Link>
            <Link to="/faq" className="text-vuka-text hover:text-blue transition-colors font-medium">FAQ</Link>
            <Link to="/contact" className="text-vuka-text hover:text-blue transition-colors font-medium">Contact Us</Link>

            <div className="flex items-center space-x-4 ml-6"> {/* Separate group for auth buttons */}
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/register-student">
                <Button>Sign Up</Button> {/* Changed from Register to Sign Up as per image */}
              </Link>
            </div>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;