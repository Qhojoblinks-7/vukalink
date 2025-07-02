// src/features/auth/pages/AuthPage.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, registerStudent, registerCompany } from '../authSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthForm from '../components/AuthForm';

const AuthPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // IMPORTANT: Include 'role' in your useSelector
  const { isAuthenticated, role, status, error } = useSelector((state) => state.auth);

  // The 'from' state is useful if a user tries to access a protected route
  // and is redirected to login. After successful login, they go back to 'from'.
  // However, for initial login/registration, we'll use role-based redirection.
  const from = location.state?.from;

  const [formType, setFormType] = useState('login'); // 'login', 'register-student', 'register-company'

  useEffect(() => {
    // --- Role-based Redirection Logic ---
    if (isAuthenticated && role) { // Ensure isAuthenticated and role are available
      if (role === 'student') {
        navigate('/student/dashboard', { replace: true });
      } else if (role === 'company_admin') { // Assuming this is your company role name
        navigate('/company/dashboard', { replace: true });
      } else if (role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        // Fallback for any other authenticated role or if 'from' is relevant
        console.warn(`Unhandled user role: ${role}. Redirecting to default dashboard.`);
        navigate(from || '/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, role, navigate, from]); // Add 'role' to dependency array

  const handleLogin = async (credentials) => {
    await dispatch(login(credentials));
  };

  const handleRegisterStudent = async (userData) => {
    await dispatch(registerStudent(userData));
  };

  const handleRegisterCompany = async (companyData) => {
    await dispatch(registerCompany(companyData));
  };

  const currentPath = location.pathname;
  useEffect(() => {
    // This useEffect determines the initial form type based on the URL path.
    if (currentPath.includes('register-student')) setFormType('register-student');
    else if (currentPath.includes('register-company')) setFormType('register-company');
    else setFormType('login');
  }, [currentPath]);


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="mt-6 text-center text-3xl font-heading font-extrabold text-gray-900 dark:text-white">
          {formType === 'login' && 'Sign in to your account'}
          {formType === 'register-student' && 'Create Student Account'}
          {formType === 'register-company' && 'Register Your Company'}
        </h2>
        {error && <p className="text-red-500 text-center">{error}</p>}

        <AuthForm
          formType={formType}
          onLogin={handleLogin}
          onRegisterStudent={handleRegisterStudent}
          onRegisterCompany={handleRegisterCompany}
          loading={status === 'loading'}
          setFormType={setFormType}
        />
      </div>
    </div>
  );
};

export default AuthPage;