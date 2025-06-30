// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { DarkModeProvider } from './context/DarkModeContext';
import useIsMobile from './hooks/useIsMobile';

// Import Pages
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage'; // Student Dashboard
import HomePage from './pages/HomePage';
import OpportunitiesPage from './pages/OpportunitiesPage';
import OpportunityDetailsPage from './pages/OpportunityDetailsPage';
import MyApplicationsPage from './pages/MyApplicationsPage';
import SavedOpportunitiesPage from './pages/SavedOpportunitiesPage';
import LandingSplash from './pages/LandingSplash';
import MessagesPage from './pages/MessagesPage'; // Previously added MessagesPage
import EditProfilePage from './pages/EditProfilePage';// NEW: For editing own profile
import PublicProfilePage from './pages/PublicProfilePage';// NEW: For viewing others' profiles

// NEW: Import Resources Pages
import ResourcesPage from './pages/ResourcesPage'; // <-- NEW IMPORT
import ArticleDetailPage from './pages/ArticleDetailPage'; // <-- NEW IMPORT

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


function App() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();

  // A more robust PrivateRoute that can also check user role
  const PrivateRoute = ({ children, allowedRoles = [] }) => {
    if (loading) {
      return (
        <div className="flex justify-center items-center min-h-screen text-blue-600 text-2xl font-heading">
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
        <div className="flex justify-center items-center min-h-screen text-red-600 text-xl font-body p-4">
          Access Denied: You do not have permission to view this page.
        </div>
      );
    }
    return children;
  };

  // Determine if the current path is a company path for header/footer logic
  const isCompanyPath = location.pathname.startsWith('/company');
  const isAuthOrHomePage = location.pathname === '/auth' || location.pathname === '/';
  const isSplash = location.pathname === '/';

  return (
    <DarkModeProvider>
      <div className="min-h-screen flex flex-col font-body text-grey-600 -900 bg-gray-100 dark:bg-gray-900 dark:text-grey-600 -100">
        {/* Show LandingSplash only on mobile root, HomePage on desktop root */}
        {isSplash ? (
          isMobile ? <LandingSplash /> : <HomePage />
        ) : (
          <>
            {/* Conditional Header Rendering */}
            {!isAuthOrHomePage && (
              <>
                {/* Desktop Header */}
                <div className="hidden md:block">
                  <Header />
                </div>
                {/* Mobile Header for authenticated pages (handled by individual pages for dynamic titles) */}
                <div className="md:hidden">
                  {/* The MobileHeader component is included within pages like DashboardPage, ResourcesPage, etc. */}
                </div>
              </>
            )}
            {/* Specific MobileHeader for auth page only, but not on splash */}
            {location.pathname === '/auth' && !isSplash && (
              <div className="block md:hidden">
                <MobileHeader user={null} />
              </div>
            )}
            {/* Header for Home Page (if not logged in) */}
            {location.pathname === '/' && !user && <Header />}

            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/" element={isMobile ? <LandingSplash /> : <HomePage />} />

                {/* General Protected Routes (accessible by both student and company) */}
                <Route path="/messages" element={<PrivateRoute allowedRoles={['student', 'company']}><MessagesPage /></PrivateRoute>} />
                <Route path="/company/messages" element={<PrivateRoute allowedRoles={['company']}><CompanyMessagesPage /></PrivateRoute>} />

                {/* NEW: Resources Routes */}
                <Route path="/resources" element={<PrivateRoute allowedRoles={['student', 'company']}><ResourcesPage /></PrivateRoute>} />
                <Route path="/resources/:id" element={<PrivateRoute allowedRoles={['student', 'company']}><ArticleDetailPage /></PrivateRoute>} /> {/* Route for full article */}

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
                      <div className="min-h-screen flex items-center justify-center bg-gray-100">
                        <h1 className="text-3xl font-heading text-blue-900">Apply Page for ID: {/* Use useParams to get ID */} (Coming Soon!)</h1>
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
                      <OpportunityDetailsPage /> {/* This will show application details for the specific opportunity */}
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
                      <div className="min-h-screen flex items-center justify-center bg-gray-100">
                        <h1 className="text-3xl font-heading text-blue-900">Edit Opportunity ID: {/* Use useParams to get ID */} (Coming Soon!)</h1>
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
                  <div className="min-h-screen flex items-center justify-center bg-gray-100">
                    <h1 className="text-3xl font-heading text-red-600">404 - Page Not Found</h1>
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
            {['/', '/about', '/faq', '/contact', '/privacy', '/terms', '/cookies', '/blog', '/resources'].includes(location.pathname) && !isSplash && (
              <Footer />
            )}
          </>
        )}
      </div>
    </DarkModeProvider>
  );
}

export default App;