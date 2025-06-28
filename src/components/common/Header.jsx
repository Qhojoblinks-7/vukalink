// src/components/common/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { signOut } from '../../services/auth';
import Button from '../ui/Button';
import Logo from '../../assets/logo.svg'; // Importing logo for bundler compatibility

// Functional Component: Using a functional component with React Hooks.
// Best Practice: Prefer functional components for new React development.
const Header = () => {
  // Destructuring props/hooks: Clear and concise way to get values.
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Event Handler: Defined inside the component for direct access to state/props.
  // Async/Await: Proper error handling for asynchronous operations.
  const handleLogout = async () => {
    // Guard Clause: Early exit for clearer logic.
    if (loading) {
      console.warn('Attempted logout while auth state is loading.');
      return;
    }

    const { error } = await signOut(); // signOut is a pure function from services/auth.js

    if (error) {
      console.error('Logout failed:', error.message);
      // Best Practice: Provide user feedback (e.g., a toast notification) in a real app.
      // alert('Failed to log out. Please try again.'); // Simple alert for development
    } else {
      console.log('User logged out successfully.');
      // Best Practice: Navigate after successful state change.
      // AuthContext's onAuthStateChange listener will update 'user' to null,
      // and App.jsx's PrivateRoute will handle the actual redirection.
      // navigate('/auth'); // This might be redundant if App.jsx handles it, but ensures redirect
    }
  };

  return (
    // Semantic HTML: Using <header> for page header.
    <header className="bg-white  shadow-sm py-4 px-6 md:px-8 flex items-center justify-between">
      {/* Logo - links to dashboard if logged in, or auth page */}
      <div className="flex items-center space-x-4">
        {/* Conditional Link Target: Directs users based on auth status. */}
        <Link to={user ? "/dashboard" : "/auth"}>
          {/* Image Optimization & Accessibility: Using `alt` text for screen readers. */}
          {/* Static Asset Reference: Using absolute path for images in `public` folder. */}
          <img
            src={Logo}
            alt="VukaLink Logo"
            className="h-10 sm:h-12 w-auto"
          />
        </Link>
        {/* Responsive Design: `hidden sm:block` for mobile-first approach. */}
        <h1 className="text-xl sm:text-2xl font-heading font-bold text-blue-900  hidden sm:block">
          VukaLink
        </h1>
      </div>

      {/* Navigation and User Info */}
      {/* Semantic HTML: Using <nav> for navigation links. */}
      <nav className="flex items-center space-x-4 sm:space-x-6">
        {/* Conditional Rendering: Only show navigation links if user is authenticated. */}
        {user && (
          <>
            {/* Link Components: Using React Router's Link for client-side navigation. */}
            <Link to="/dashboard" className="text-vuka-text hover:text-blue-700 font-medium transition-colors duration-200">
              Dashboard
            </Link>
            <Link to="/opportunities" className="text-vuka-text hover:text-blue-900  font-medium transition-colors duration-200">
              Opportunities
            </Link>
            <Link to="/profile" className="text-vuka-text hover:text-blue-700 font-medium transition-colors duration-200">
              Profile
            </Link>
          </>
        )}

        {/* User Email and Logout Button */}
        {user ? (
          <div className="flex items-center space-x-3">
            {/* Conditional Display: Hide email on smaller screens. */}
            <span className="text-grey-500 text-sm hidden md:block">
              {user.email}
            </span>
            {/* Button Component: Reusing the `Button` component for consistency. */}
            {/* Disabled State: Preventing multiple clicks while an action is pending. */}
            <Button onClick={handleLogout} variant="outline" size="sm" disabled={loading}>
              {loading ? '...' : 'Log Out'} {/* User feedback for loading state */}
            </Button>
          </div>
        ) : (
          // Render a login button if not logged in (e.g., if Header is shown on a public home page)
          // For this app, `App.jsx` handles redirection to `/auth` directly,
          // so this specific `Link` might not always be visible.
          <Link to="/auth">
             <Button variant="primary" size="sm">Log In</Button>
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;