// src/components/PrivateRoute.jsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { getCurrentUser } from '../features/auth/authSlice';

const PrivateRoute = ({ allowedRoles }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, role, status } = useSelector((state) => state.auth);

  useEffect(() => {
    // If not authenticated and not currently loading, try to get current user session
    // This is important for page refreshes
    if (!isAuthenticated && status === 'idle') {
      dispatch(getCurrentUser());
    }
  }, [isAuthenticated, status, dispatch]);

  if (status === 'loading') {
    // Display a loading indicator while we check auth status
    return <div style={{ textAlign: 'center', padding: '20px' }}>Loading authentication...</div>;
  }

  if (!isAuthenticated) {
    // If not authenticated (after loading check), redirect to login
    return <Navigate to="/login" replace />;
  }

  // If authenticated but not authorized for this specific route
  // Redirect to their default dashboard or an unauthorized page
  if (allowedRoles && !allowedRoles.includes(role)) {
    console.warn(`User with role '${role}' attempted to access route restricted to: ${allowedRoles.join(', ')}`);
    if (role === 'student') return <Navigate to="/student/dashboard" replace />;
    if (role === 'company_admin') return <Navigate to="/company/dashboard" replace />;
    if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    // Fallback if role is authenticated but doesn't match any dashboard
    return <Navigate to="/unauthorized" replace />;
  }

  // User is authenticated and authorized, render the child routes
  return <Outlet />;
};

export default PrivateRoute;