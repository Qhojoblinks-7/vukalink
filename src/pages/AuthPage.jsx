// src/pages/AuthPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import Button from '../components/ui/Button';

const AuthPage = () => {
  const { user, loading } = useAuth(); // Get user and loading state from context
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true); // State to toggle between login and register

  // Redirect if user is already logged in and not loading
  if (!loading && user) {
    navigate('/dashboard'); // Or wherever your main app dashboard is
    return null; // Don't render anything if redirecting
  }

  if (loading) {
    // You might have a global loading spinner in AuthProvider,
    // or a local one here if AuthProvider's loading state is too quick.
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-vuka-blue text-lg">Loading authentication...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-vuka-background p-4">
      <div className="bg-vuka-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-heading font-extrabold text-vuka-blue text-center mb-6">
          {isLogin ? 'Welcome Back!' : 'Join VukaLink Today!'}
        </h1>

        {isLogin ? <LoginForm /> : <RegisterForm />}

        <div className="text-center mt-6">
          <p className="text-vuka-medium-grey">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            {' '}
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