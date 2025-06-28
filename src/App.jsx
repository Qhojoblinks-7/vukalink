// src/App.jsx
import React from 'react';
// React Router DOM: Using BrowserRouter (as Router), Routes, Route, and Navigate.
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Import Pages: Organize imports for clarity.
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
// Placeholder imports for future pages.
// import HomePage from './pages/HomePage';
// import ProfilePage from './pages/ProfilePage';
// import OpportunitiesPage from './pages/OpportunitiesPage';

// Import Common Components:
import Header from './components/common/Header';
import ProfilePage from './pages/ProfilePage';

function App() {
  // AuthContext: Accessing global authentication state.
  const { user, loading } = useAuth();

  // PrivateRoute Component: Encapsulates protected route logic.
  // Best Practice: Centralize authorization logic for routes.
  const PrivateRoute = ({ children }) => {
    if (loading) {
      // Global Loading Indicator: Provides user feedback during auth check.
      return (
        <div className="flex justify-center items-center min-h-screen text-vuka-blue text-2xl font-heading">
          Loading App...
        </div>
      );
    }
    // Conditional Navigation: Redirect unauthenticated users.
    return user ? children : <Navigate to="/auth" replace />;
  };

  return (
    // Router Wrapper: Essential for React Router to function.
    <Router>
      {/* Main App Container: Global styling and flex layout. */}
      <div className="min-h-screen flex flex-col font-body text-vuka-text bg-vuka-background">

        {/* Conditional Header Rendering:
            Best Practice: Avoid showing header on pages like AuthPage where it's not needed,
            unless the user is already logged in (in which case they'll be redirected anyway).
            This prevents a momentary flash of the header before redirection.
        */}
        {(window.location.pathname !== '/auth' || user) && <Header />}

        {/* Main Content Area: Takes up remaining vertical space. */}
        <main className="flex-grow">
          {/* Routes Definition: Centralized place for all application routes. */}
          <Routes>
            {/* Public Routes: Accessible to all users. */}
            <Route path="/auth" element={<AuthPage />} />
            {/* Example: <Route path="/" element={<HomePage />} /> */}

            {/* Protected Routes: Wrapped by PrivateRoute for authentication check. */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/opportunities"
              element={
                <PrivateRoute>
                  {/* Placeholder Content: Good for showing progress before full implementation. */}
                  <div className="min-h-screen flex items-center justify-center bg-vuka-background">
                    <h1 className="text-3xl font-heading text-vuka-blue">Opportunities Page (Coming Soon!)</h1>
                  </div>
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />

            {/* Root Path Redirection: Directs users based on their authentication status. */}
            <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/auth" replace />} />

            {/* Catch-all Route: Handles unmatched paths (404 Not Found).
                Best Practice: Place as the last route to ensure other routes are matched first.
            */}
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