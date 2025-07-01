import React, { lazy, Suspense } from 'react'; // Fix: import from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { DarkModeProvider } from './context/DarkModeContext';
import useIsMobile from './hooks/useIsMobile';

// 1. Convert direct imports to lazy imports for larger pages
const AuthPage = lazy(() => import('./pages/AuthPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const HomePage = lazy(() => import('./pages/HomePage'));
const OpportunitiesPage = lazy(() => import('./pages/OpportunitiesPage'));
const OpportunityDetailsPage = lazy(() => import('./pages/OpportunityDetailsPage'));
const MyApplicationsPage = lazy(() => import('./pages/MyApplicationsPage'));
const SavedOpportunitiesPage = lazy(() => import('./pages/SavedOpportunitiesPage'));
const LandingSplash = lazy(() => import('./pages/LandingSplash'));
const MessagesPage = lazy(() => import('./pages/MessagesPage'));
const EditProfilePage = lazy(() => import('./pages/EditProfilePage'));
const PublicProfilePage = lazy(() => import('./pages/PublicProfilePage'));
const ResourcesPage = lazy(() => import('./pages/ResourcesPage'));
const ArticleDetailPage = lazy(() => import('./pages/ArticleDetailPage'));

// Company Pages
const CompanyDashboardPage = lazy(() => import('./pages/CompanyDashboardPage'));
const CompanyManageOpportunitiesPage = lazy(() => import('./pages/CompanyManageOpportunitiesPage'));
const CompanyPostOpportunityPage = lazy(() => import('./pages/CompanyPostOpportunityPage'));
const CompanyApplicantsForOpportunityPage = lazy(() => import('./pages/CompanyApplicantsForOpportunityPage'));
const CompanyMessagesPage = lazy(() => import('./pages/CompanyMessagesPage'));


// Import Common Components (these are likely small and shared, so direct import is fine)
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import MobileBottomNav from './components/dashboard/MobileBottomNav';
import MobileHeader from './components/dashboard/MobileHeader';


function App() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();

  const noHeaderPaths = [
    '/auth',
    '/login',
    '/register-student',
    '/register-company',
  ];

  const shouldRenderHeader = !noHeaderPaths.includes(location.pathname);
  const isRootPath = location.pathname === '/';

  const PrivateRoute = ({ children, allowedRoles = [] }) => {
    if (loading) {
      return (
        <div className="flex justify-center items-center min-h-screen text-blue-600 text-2xl font-heading">
          Loading App...
        </div>
      );
    }
    if (!user) {
      return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
    }
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      return (
        <div className="flex justify-center items-center min-h-screen text-red-600 text-xl font-body p-4">
          Access Denied: You do not have permission to view this page.
        </div>
      );
    }
    return children;
  };

  const isCompanyPath = location.pathname.startsWith('/company');


  return (
    <DarkModeProvider>
      <div className="min-h-screen flex flex-col font-body text-grey-600 -900 bg-gray-100 dark:bg-gray-900 dark:text-grey-600 -100">
        {shouldRenderHeader && (
          <div className="hidden md:block">
            <Header />
          </div>
        )}

        {shouldRenderHeader && isMobile && !user && !isRootPath && null}

        <main className="flex-grow">
          {/* 2. Wrap your Routes with Suspense */}
          <Suspense fallback={
            <div className="flex justify-center items-center min-h-screen text-blue-600 text-2xl font-heading">
              Loading Page...
            </div>
          }>
            <Routes>
              {/* Public Routes */}
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/login" element={<AuthPage />} />
              <Route path="/register-student" element={<AuthPage />} />
              <Route path="/register-company" element={<AuthPage />} />

              <Route path="/" element={isMobile ? <LandingSplash /> : <HomePage />} />

              {/* General Protected Routes */}
              <Route path="/messages" element={<PrivateRoute allowedRoles={['student', 'company']}><MessagesPage /></PrivateRoute>} />
              <Route path="/company/messages" element={<PrivateRoute allowedRoles={['company']}><CompanyMessagesPage /></PrivateRoute>} />

              {/* Resources Routes */}
              <Route path="/resources" element={<PrivateRoute allowedRoles={['student', 'company']}><ResourcesPage /></PrivateRoute>} />
              <Route path="/resources/:id" element={<PrivateRoute allowedRoles={['student', 'company']}><ArticleDetailPage /></PrivateRoute>} />

              <Route path="/profile/edit" element={<PrivateRoute allowedRoles={['student', 'company']}><EditProfilePage /></PrivateRoute>} />
              <Route path="/profile/view/:userId" element={<PrivateRoute allowedRoles={['student', 'company']}><PublicProfilePage /></PrivateRoute>} />

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
                    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                      <h1 className="text-3xl font-heading text-blue-900 dark:text-blue-200">Apply Page for ID: {/* Use useParams to get ID */} (Coming Soon!)</h1>
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
                    <OpportunityDetailsPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/saved"
                element={<PrivateRoute allowedRoles={['student']}><SavedOpportunitiesPage /></PrivateRoute>}
              />

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
                    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                      <h1 className="text-3xl font-heading text-blue-900 dark:text-blue-200">Edit Opportunity ID: {/* Use useParams to get ID */} (Coming Soon!)</h1>
                    </div>
                  </PrivateRoute>
                }
              />
              <Route path="/company/account-settings/password" element={<PrivateRoute allowedRoles={['company']}><div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-grey-600 -900 dark:text-grey-100">Company Password Settings</div></PrivateRoute>} />
              <Route path="/company/account-settings/notifications" element={<PrivateRoute allowedRoles={['company']}><div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-grey-600 -900 dark:text-grey-100">Company Notification Settings</div></PrivateRoute>} />
              <Route path="/company/account-settings/privacy" element={<PrivateRoute allowedRoles={['company']}><div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-grey-600 -900 dark:text-grey-100">Company Privacy Settings</div></PrivateRoute>} />
              <Route path="/company/account-settings/team-management" element={<PrivateRoute allowedRoles={['company']}><div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-grey-600 -900 dark:text-grey-100">Company Team Management</div></PrivateRoute>} />


              {/* Public Footer Pages */}
              <Route path="/about" element={<div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-grey-600 -900 dark:text-grey-100">About Us Page</div>} />
              <Route path="/faq" element={<div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-grey-600 -900 dark:text-grey-100">FAQ Page</div>} />
              <Route path="/contact" element={<div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-grey-600 -900 dark:text-grey-100">Contact Page</div>} />

              {/* Catch-all route for 404 */}
              <Route path="*" element={
                <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                  <h1 className="text-3xl font-heading text-red-600 dark:text-red-400">404 - Page Not Found</h1>
                </div>
              } />
            </Routes>
          </Suspense>
        </main>

        {user && isMobile && !noHeaderPaths.includes(location.pathname) && (
          <div className="block md:hidden">
            <MobileBottomNav isCompany={isCompanyPath} />
          </div>
        )}
        
        {['/', '/about', '/faq', '/contact', '/privacy', '/terms', '/cookies', '/blog', '/resources'].includes(location.pathname) && !isRootPath && !noHeaderPaths.includes(location.pathname) && (
          <Footer />
        )}
      </div>
    </DarkModeProvider>
  );
}

export default App;