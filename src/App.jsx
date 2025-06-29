// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { DarkModeProvider } from './context/DarkModeContext';

// Import Pages
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage'; // Student Dashboard
import HomePage from './pages/HomePage';
// import ProfilePage from './pages/ProfilePage'; // This old ProfilePage will be replaced by EditProfilePage for editing own, and PublicProfilePage for viewing others.
import OpportunitiesPage from './pages/OpportunitiesPage';
import OpportunityDetailsPage from './pages/OpportunityDetailsPage';
import MyApplicationsPage from './pages/MyApplicationsPage';
import SavedOpportunitiesPage from './pages/SavedOpportunitiesPage';
import LandingSplash from './pages/LandingSplash';

// Import Company Pages
import CompanyDashboardPage from './pages/CompanyDashboardPage'; // Placeholder for Company Dashboard
import CompanyManageOpportunitiesPage from './pages/CompanyManageOpportunitiesPage';
import CompanyPostOpportunityPage from './pages/CompanyPostOpportunityPage';
import CompanyApplicantsForOpportunityPage from './pages/CompanyApplicantsForOpportunityPage';
import CompanyMessagesPage from './pages/CompanyMessagesPage';

// Import Common Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import MobileBottomNav from './components/dashboard/MobileBottomNav';
import MobileHeader from './components/dashboard/MobileHeader'; // Used for mobile-specific header logic
import MessagesPage from './pages/MessagesPage'; // Previously added MessagesPage
import EditProfilePage from './pages/EditProfilePage';      // NEW: For editing own profile
import PublicProfilePage from './pages/PublicProfilePage';  // NEW: For viewing others' profiles


function App() {
  const { user, loading } = useAuth();

  // A more robust PrivateRoute that can also check user role
  const PrivateRoute = ({ children, allowedRoles = [] }) => {
    if (loading) {
      return (
        <div className="flex justify-center items-center min-h-screen text-vuka-blue text-2xl font-heading">
          Loading App...
        </div>
      );
    }
    if (!user) {
      // If not logged in, redirect to auth page
      return <Navigate to="/auth" replace />;
    }
    // If roles are specified and user's role is not among allowed roles, deny access
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      return (
        <div className="flex justify-center items-center min-h-screen text-vuka-danger text-xl font-body p-4">
          Access Denied: You do not have permission to view this page.
        </div>
      );
    }
    return children;
  };

  // Determine if the current path is a company path for header/footer logic
  const isCompanyPath = window.location.pathname.startsWith('/company');
  const isAuthOrHomePage = window.location.pathname === '/auth' || window.location.pathname === '/';
  const isSplash = window.location.pathname === '/';

  return (
    <DarkModeProvider>
      <Router>
        <div className="min-h-screen flex flex-col font-body text-vuka-text bg-vuka-background dark:bg-gray-900 dark:text-gray-100">
          {/* Show only LandingSplash on root, no header/footer/nav */}
          {isSplash ? (
            <LandingSplash />
          ) : (
            <>
              {/* Conditional Header Rendering */}
              {!isAuthOrHomePage && (
                <>
                  {/* Desktop Header */}
                  <div className="hidden md:block">
                    <Header />
                  </div>
                  {/* Mobile Header for authenticated pages */}
                  <div className="md:hidden">
                    {/* MobileHeader on other pages will be handled by the page components themselves for dynamic titles */}
                    {/* e.g., EditProfilePage will render MobileHeader with "My Profile" */}
                    {/* PublicProfilePage will render MobileHeader with "<User/Company Name>'s Profile" */}
                    {/* If you need a generic mobile header here, you'd pass user prop to it. */}
                  </div>
                </>
              )}
              {/* Specific MobileHeader for auth page only */}
              {window.location.pathname === '/auth' && (
                <div className="block md:hidden">
                  <MobileHeader user={null} />
                </div>
              )}
              {/* Header for Home Page (if not logged in) */}
              {window.location.pathname === '/' && !user && <Header />}

              <main className="flex-grow">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/" element={user ? (user.role === 'company' ? <Navigate to="/company/dashboard" replace /> : <Navigate to="/dashboard" replace />) : <LandingSplash />} />

                  {/* General Protected Routes (accessible by both student and company) */}
                  <Route path="/messages" element={<PrivateRoute allowedRoles={['student', 'company']}><MessagesPage /></PrivateRoute>} />
                  <Route path="/company/messages" element={<PrivateRoute allowedRoles={['company']}><CompanyMessagesPage /></PrivateRoute>} />
                  <Route path="/resources" element={<PrivateRoute allowedRoles={['student', 'company']}><div className="min-h-screen flex items-center justify-center">Resources Page (Both Roles)</div></PrivateRoute>} />
                  <Route path="/profile/edit" element={<PrivateRoute allowedRoles={['student', 'company']}><EditProfilePage /></PrivateRoute>} /> {/* NEW EDIT PROFILE ROUTE */}
                  <Route path="/profile/view/:userId" element={<PrivateRoute allowedRoles={['student', 'company']}><PublicProfilePage /></PrivateRoute>} /> {/* NEW PUBLIC PROFILE ROUTE */}


                  {/* Student Protected Routes */}
                  <Route
                    path="/dashboard"
                    element={<PrivateRoute allowedRoles={['student']}><DashboardPage /></PrivateRoute>}
                  />
                  <Route
                    path="/opportunities"
                    element={<PrivateRoute allowedRoles={['student']}><OpportunitiesPage /></PrivateRoute>}
                  />
                  <Route
                    path="/opportunities/details/:id"
                    element={<PrivateRoute allowedRoles={['student']}><OpportunityDetailsPage /></PrivateRoute>}
                  />
                  <Route
                    path="/opportunities/:id/apply"
                    element={
                      <PrivateRoute allowedRoles={['student']}>
                        <div className="min-h-screen flex items-center justify-center bg-vuka-background">
                          <h1 className="text-3xl font-heading text-vuka-strong">Apply Page for ID: {/* Use useParams to get ID */} (Coming Soon!)</h1>
                        </div>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/applications"
                    element={<PrivateRoute allowedRoles={['student']}><MyApplicationsPage /></PrivateRoute>}
                  />
                  <Route
                    path="/applications/details/:id"
                    element={
                      <PrivateRoute allowedRoles={['student']}>
                        <div className="min-h-screen flex items-center justify-center bg-vuka-background">
                          <h1 className="text-3xl font-heading text-vuka-strong">Application Details for ID: {/* Use useParams to get ID */} (Coming Soon!)</h1>
                        </div>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/saved"
                    element={<PrivateRoute allowedRoles={['student']}><SavedOpportunitiesPage /></PrivateRoute>}
                  />
                  {/* The old /profile route is effectively replaced by /profile/edit for students */}
                  {/* <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} /> */}


                  {/* Company Protected Routes */}
                  <Route
                    path="/company/dashboard"
                    element={<PrivateRoute allowedRoles={['company']}><CompanyDashboardPage /></PrivateRoute>}
                  />
                  <Route
                    path="/company/post-opportunity"
                    element={<PrivateRoute allowedRoles={['company']}><CompanyPostOpportunityPage /></PrivateRoute>}
                  />
                  <Route
                    path="/company/manage-opportunities"
                    element={<PrivateRoute allowedRoles={['company']}><CompanyManageOpportunitiesPage /></PrivateRoute>}
                  />
                  <Route
                    path="/company/opportunities/:id/applicants"
                    element={<PrivateRoute allowedRoles={['company']}><CompanyApplicantsForOpportunityPage /></PrivateRoute>}
                  />
                  <Route
                    path="/company/opportunities/:id/edit"
                    element={
                      <PrivateRoute allowedRoles={['company']}>
                        <div className="min-h-screen flex items-center justify-center bg-vuka-background">
                          <h1 className="text-3xl font-heading text-vuka-strong">Edit Opportunity ID: {/* Use useParams to get ID */} (Coming Soon!)</h1>
                        </div>
                      </PrivateRoute>
                    }
                  />
                  {/* Placeholder routes for company account settings if needed (as linked from CompanyEditProfileForm) */}
                  <Route path="/company/account-settings/password" element={<PrivateRoute allowedRoles={['company']}><div className="min-h-screen flex items-center justify-center">Company Password Settings</div></PrivateRoute>} />
                  <Route path="/company/account-settings/notifications" element={<PrivateRoute allowedRoles={['company']}><div className="min-h-screen flex items-center justify-center">Company Notification Settings</div></PrivateRoute>} />
                  <Route path="/company/account-settings/privacy" element={<PrivateRoute allowedRoles={['company']}><div className="min-h-screen flex items-center justify-center">Company Privacy Settings</div></PrivateRoute>} />
                  <Route path="/company/account-settings/team-management" element={<PrivateRoute allowedRoles={['company']}><div className="min-h-screen flex items-center justify-center">Company Team Management</div></PrivateRoute>} />


                  {/* Public Footer Pages */}
                  <Route path="/about" element={<div className="min-h-screen flex items-center justify-center">About Us Page</div>} />
                  <Route path="/faq" element={<div className="min-h-screen flex items-center justify-center">FAQ Page</div>} />
                  <Route path="/contact" element={<div className="min-h-screen flex items-center justify-center">Contact Page</div>} />
                  <Route path="/register-student" element={<AuthPage />} /> {/* Could potentially point to a specific registration form if AuthPage handles both */}
                  <Route path="/register-company" element={<AuthPage />} /> {/* Could potentially point to a specific registration form if AuthPage handles both */}

                  {/* Catch-all route for 404 */}
                  <Route path="*" element={
                    <div className="min-h-screen flex items-center justify-center bg-vuka-background">
                      <h1 className="text-3xl font-heading text-vuka-danger">404 - Page Not Found</h1>
                    </div>
                  } />
                </Routes>
              </main>

              {/* Conditional MobileBottomNav Rendering */}
              {/* Only show if user is logged in AND on mobile AND NOT on auth/home page */}
              {user && !isAuthOrHomePage && (
                <div className="block md:hidden"> {/* Only show on screens smaller than md */}
                  <MobileBottomNav isCompany={isCompanyPath} />
                </div>
              )}
              {/* Footer only on public informational pages and home page */}
              {['/', '/about', '/faq', '/contact', '/privacy', '/terms', '/cookies', '/blog'].includes(window.location.pathname) && !isSplash && (
                <Footer />
              )}
            </>
          )}
        </div>
      </Router>
    </DarkModeProvider>
  );
}

export default App;