// src/pages/AuthPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';

const AuthPage = () => {
  // *** THIS IS THE CRITICAL CHANGE ***
  // Destructure 'userRole' and 'organizationId' from useAuth
  const { user, loading, userRole, organizationId } = useAuth();
  // **********************************

  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  useEffect(() => {
    console.log('AuthPage useEffect triggered:');
    console.log('  Loading:', loading);
    console.log('  User:', user);
    // Log the custom userRole from AuthContext/profiles
    console.log('  User Role (from AuthContext/Profile):', userRole);
    console.log('  Organization ID (from AuthContext/Profile):', organizationId);


    // *** Use 'userRole' for redirection logic ***
    if (!loading && user && userRole) {
      console.log('  All conditions met for redirection. User role is:', userRole);
      if (userRole === 'student') { // Use userRole here
        navigate('/dashboard', { replace: true });
      } else if (userRole === 'company_owner' || userRole === 'company_member') { // Use userRole here
        navigate('/company/dashboard', { replace: true });
      } else {
        console.warn("User has an unhandled role:", userRole, "Redirecting to default dashboard."); // Use userRole here
        navigate('/dashboard', { replace: true }); // Fallback redirect
      }
    } else {
      console.log('  Conditions not met for redirection. Waiting for data...');
    }
  }, [user, loading, userRole, organizationId, navigate]); // *** Add userRole and organizationId to dependencies ***

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-blue-900 text-2xl font-heading">
        Loading VukaLink...
      </div>
    );
  }

  return (
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