// src/pages/AuthPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';

const AuthPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  // Function to toggle between login and register forms
  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  // Effect for Redirection:
  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  // Conditional Rendering for Loading State:
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-blue-900 text-2xl font-heading">
        Loading VukaLink...
      </div>
    );
  }

  return (
    // This div provides the overall page background and centering for the forms.
    // The individual forms (LoginForm/RegisterForm) will contain their own white cards
    // and two-column side-by-side layouts.
    <div className="min-h-screen bg-blue-950 flex items-center justify-center p-4">
      {isLogin ? (
        <LoginForm onToggleForm={toggleForm} />
      ) : (
        <RegisterForm onToggleForm={toggleForm} />
      )}
    </div>
  );
};

export default AuthPage;