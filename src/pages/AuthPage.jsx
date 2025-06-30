// src/pages/AuthPage.jsx
import React, { useState, useEffect } from 'react'; // Import useEffect
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import Button from '../components/ui/Button';

const AuthPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  // Effect for Redirection:
  // Best Practice: Use useEffect for side effects like navigation based on state changes.
  useEffect(() => {
    if (!loading && user) {
      // If user is logged in and loading is complete, redirect.
      navigate('/dashboard'); // Use navigate directly here, not return null from component render.
    }
  }, [user, loading, navigate]); // Dependencies array: ensures effect re-runs only when these change.

  // Conditional Rendering for Loading State: Show a clear message while authenticating.
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-blue-900  text-2xl font-heading">
        Loading VukaLink...
      </div>
    );
  }

  // If `user` is present after loading, useEffect will handle redirection.
  // No need for `if (!loading && user) { return null; }` directly in the render.

  return (
    // Main Container Styling: Centered content, background.
    <div className="min-h-screen flex items-center justify-center bg-gray-100     p-4">
      {/* Form Card Styling: Responsive width, shadow, rounded corners. */}
      <div className="bg-white  rounded-lg shadow-xl p-8 w-full max-w-md">
        {/* Dynamic Heading: Changes based on form mode. */}
        <h1 className="text-3xl font-heading font-extrabold text-blue-900  text-center mb-6">
          {isLogin ? 'Welcome Back!' : 'Join VukaLink Today!'}
        </h1>

        {/* Conditional Form Rendering: Displaying one form at a time. */}
        {isLogin ? <LoginForm /> : <RegisterForm />}

        {/* Toggle between Login/Register */}
        <div className="text-center mt-6">
          <p className="text-grey-500">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            {' '}
            {/* Button Component: Reusing `Button` for consistency. */}
            <Button variant="ghost" size="sm" onClick={() => setIsLogin(!isLogin)} className="font-bold">
              {isLogin ? 'Sign Up' : 'Log In'}
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;