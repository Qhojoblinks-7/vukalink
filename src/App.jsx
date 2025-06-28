// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; // Import useAuth hook

import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
// Import other pages as you create them
// import HomePage from './pages/HomePage';
// import ProfilePage from './pages/ProfilePage';
// import OpportunitiesPage from './pages/OpportunitiesPage';

function App() {
  const { user, loading } = useAuth(); // Get user and loading state from AuthContext

  // A simple PrivateRoute component for protected routes
  const PrivateRoute = ({ children }) => {
    if (loading) {
      // You could render a loading spinner here
      return (
        <div className="flex justify-center items-center min-h-screen text-vuka-blue text-2xl font-heading">
          Loading App...
        </div>
      );
    }
    return user ? children : <Navigate to="/auth" replace />;
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col font-body text-vuka-text bg-vuka-background">
        {/* Optional: Add your Header/Navbar component here if it's global */}
        {/* <Header /> */}

        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/auth" element={<AuthPage />} />
            {/* You might have a public home page too */}
            {/* <Route path="/" element={<HomePage />} /> */}

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              }
            />
            {/* Add other protected routes here */}
            {/* <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} /> */}
            {/* <Route path="/opportunities" element={<PrivateRoute><OpportunitiesPage /></PrivateRoute>} /> */}


            {/* Redirect root to dashboard if logged in, otherwise to auth */}
            <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/auth" replace />} />

            {/* Catch-all route for 404 - make sure this is the last route */}
            <Route path="*" element={
              <div className="min-h-screen flex items-center justify-center bg-vuka-background">
                <h1 className="text-3xl font-heading text-vuka-danger">404 - Page Not Found</h1>
              </div>
            } />
          </Routes>
        </main>

        {/* Optional: Add your Footer component here if it's global */}
        {/* <Footer /> */}
      </div>
    </Router>
  );
}

export default App;