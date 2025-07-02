// src/App.jsx
import React, { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAuth } from './hooks/useAuth';
import { DarkModeProvider } from './context/DarkModeContext';
import useIsMobile from './hooks/useIsMobile';
import { getCurrentUser } from './features/auth/authSlice'; // Ensure this path is correct

// Components (these are generally small and shared, so direct import is fine for now)
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import MobileBottomNav from './features/dashboard/MobileBottomNav';
import MobileHeader from './features/dashboard/MobileHeader';

// Lazy Imports for Features/Pages (paths adjusted to new structure)
const AuthPage = lazy(() => import('./features/auth/pages/AuthPage'));
const DashboardPage = lazy(() => import('./features/dashboard/pages/DashboardPage'));
const HomePage = lazy(() => import('./pages/HomePage'));
const OpportunitiesPage = lazy(() => import('./features/opportunities/pages/OpportunitiesPage'));
const OpportunityDetailsPage = lazy(() => import('./features/opportunities/pages/OpportunityDetailsPage'));
const MyApplicationsPage = lazy(() => import('./features/applications/pages/MyApplicationsPage'));
const SavedOpportunitiesPage = lazy(() => import('./features/savedOpportunities/pages/SavedOpportunitiesPage'));
const LandingSplash = lazy(() => import('./pages/LandingSplash'));
const MessagesPage = lazy(() => import('./features/messages/pages/MessagesPage'));
const EditProfilePage = lazy(() => import('./features/user/pages/EditProfilePage'));
const PublicProfilePage = lazy(() => import('./features/user/pages/PublicProfilePage'));
const ResourcesPage = lazy(() => import('./features/resources/pages/ResourcesPage'));
const ArticleDetailPage = lazy(() => import('./features/resources/pages/ArticleDetailPage'));

// Company Pages
const CompanyDashboardPage = lazy(() => import('./features/company/pages/CompanyDashboardPage'));
const CompanyManageOpportunitiesPage = lazy(() => import('./features/company/pages/CompanyManageOpportunitiesPage'));
const CompanyPostOpportunityPage = lazy(() => import('./features/company/pages/CompanyPostOpportunityPage'));
const CompanyApplicantsForOpportunityPage = lazy(() => import('./features/company/pages/CompanyApplicantsForOpportunityPage'));
const CompanyMessagesPage = lazy(() => import('./features/company/pages/CompanyMessagesPage'));

// Application Details Page
const ApplicationDetailsPage = lazy(() => import('./features/applications/pages/ApplicationDetailsPage'));

// Main App component
function App() {
  // useAuth should provide isAuthenticated, loading, and the user object with its role.
  // Ensure the 'role' property is available on the 'user' object from useAuth.
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const dispatch = useDispatch();

  // Effect to attempt fetching current user session on app load/refresh
  useEffect(() => {
    // Dispatch getCurrentUser only if not authenticated and not already loading auth status.
    // This prevents redundant calls and ensures session persistence.
    if (!isAuthenticated && !loading) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, isAuthenticated, loading]); // Depend on dispatch, isAuthenticated, and loading

  // Paths where the main header should NOT render (e.g., login/registration pages)
  const noHeaderPaths = [
    '/auth',
    '/login',
    '/register-student',
    '/register-company',
  ];

  const shouldRenderHeader = !noHeaderPaths.includes(location.pathname);
  const isRootPath = location.pathname === '/';

  /**
   * PrivateRoute component for role-based access control.
   * Redirects based on authentication status and user roles.
   * @param {object} props
   * @param {React.ReactNode} props.children - The child components to render if authorized.
   * @param {Array<string>} [props.allowedRoles=[]] - An array of roles allowed to access this route.
   */
  const PrivateRoute = ({ children, allowedRoles = [] }) => {
    // Show a loading indicator while authentication status is being determined.
    if (loading) {
      return (
        <div className="flex justify-center items-center min-h-screen text-blue-600 text-2xl font-heading">
          Loading App...
        </div>
      );
    }

    // If the user is not authenticated, redirect them to the authentication page.
    if (!isAuthenticated) {
      // Pass current path as 'from' state to redirect back after successful login.
      return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
    }

    // If allowedRoles are specified and the authenticated user's role is not included,
    // redirect them to their specific dashboard or an access denied page.
    if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
      console.warn("Access Denied: User role does not match allowed roles.");
      console.log("  PrivateRoute Debug: isAuthenticated:", isAuthenticated);
      console.log("  PrivateRoute Debug: user:", user); // Crucial: what does this user object contain?
      console.log("  PrivateRoute Debug: user.role:", user ? user.role : 'N/A'); // What is the role here?
      console.log("  PrivateRoute Debug: allowedRoles for this route:", allowedRoles); // What are the allowedRoles?

      // Redirect to specific dashboard based on the user's actual role
      if (user.role === 'student') {
        return <Navigate to="/student/dashboard" replace />;
      } else if (user.role === 'company_admin') {
        return <Navigate to="/company/dashboard" replace />;
      } else if (user.role === 'admin') {
        return <Navigate to="/admin/dashboard" replace />;
      }
      // Fallback for an authenticated user with an unexpected or unhandled role
      return (
        <div className="flex justify-center items-center min-h-screen text-red-600 text-xl font-body p-4">
          Access Denied: You do not have permission to view this page.
        </div>
      );
    }

    // If authenticated and authorized, render the protected content.
    return children;
  };

  // Determine if the current path is a company-specific path for MobileBottomNav
  const isCompanyPath = location.pathname.startsWith('/company');
  // Determine if the current path is a student-specific path (useful for future nav logic)
  const isStudentPath = location.pathname.startsWith('/student');


  return (
    <DarkModeProvider>
      <div className="min-h-screen flex flex-col font-body text-gray-900 bg-gray-100 dark:bg-gray-900 dark:text-gray-100">
        {shouldRenderHeader && (
          <div className="hidden md:block">
            <Header />
          </div>
        )}

        {shouldRenderHeader && isMobile && (
          <MobileHeader
            // Adjust MobileHeader title logic to reflect new paths
            title={
              location.pathname.startsWith('/student/dashboard') ? 'Student Dashboard' :
              location.pathname.startsWith('/student/opportunities') ? 'Opportunities' :
              location.pathname.startsWith('/student/saved') ? 'Saved' :
              location.pathname.startsWith('/student/profile') ? 'Profile' :
              location.pathname.startsWith('/company/dashboard') ? 'Company Dashboard' :
              location.pathname.startsWith('/company/manage-opportunities') ? 'Manage Opps' :
              location.pathname.startsWith('/company/post-opportunity') ? 'Post Opp' :
              location.pathname.startsWith('/company/profile') ? 'Company Profile' :
              'Vuka' // Default or fallback title
            }
            showBack={!isRootPath && !noHeaderPaths.includes(location.pathname) && location.pathname !== '/student/dashboard' && location.pathname !== '/company/dashboard'}
            showBell={true}
            showProfile={true}
          />
        )}

        <main className="flex-grow">
          <Suspense fallback={
            <div className="flex justify-center items-center min-h-screen text-blue-600 text-2xl font-heading">
              Loading Page...
            </div>
          }>
            <Routes>
              {/* Public/Authentication Routes */}
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/login" element={<AuthPage />} /> {/* Alias for /auth if needed */}
              <Route path="/register-student" element={<AuthPage />} />
              <Route path="/register-company" element={<AuthPage />} />

              <Route path="/" element={isMobile ? <LandingSplash /> : <HomePage />} />

              {/* General Protected Routes (accessible by multiple roles, adjust as needed) */}
              <Route path="/messages" element={<PrivateRoute allowedRoles={['student', 'company_admin']}><MessagesPage /></PrivateRoute>} />
              <Route path="/company/messages" element={<PrivateRoute allowedRoles={['company_admin']}><CompanyMessagesPage /></PrivateRoute>} />

              <Route path="/resources" element={<PrivateRoute allowedRoles={['student', 'company_admin']}><ResourcesPage /></PrivateRoute>} />
              <Route path="/resources/:id" element={<PrivateRoute allowedRoles={['student', 'company_admin']}><ArticleDetailPage /></PrivateRoute>} />

              {/* Note: Profile edit/view might need more granular access if certain fields are role-specific */}
              <Route path="/profile/edit" element={<PrivateRoute allowedRoles={['student', 'company_admin']}><EditProfilePage /></PrivateRoute>} />
              <Route path="/profile/view/:userId" element={<PrivateRoute allowedRoles={['student', 'company_admin']}><PublicProfilePage /></PrivateRoute>} />

              {/* STUDENT Protected Routes - All student-specific routes are now prefixed with /student/ */}
              <Route
                path="/student/dashboard"
                element={<PrivateRoute allowedRoles={['student']}><DashboardPage /></PrivateRoute>}
              />
              <Route
                path="/student/opportunities"
                element={<PrivateRoute allowedRoles={['student']}><OpportunitiesPage /></PrivateRoute>}
              />
              <Route
                path="/student/opportunities/details/:id"
                element={<PrivateRoute allowedRoles={['student']}><OpportunityDetailsPage /></PrivateRoute>}
              />
              <Route
                path="/student/opportunities/:id/apply"
                element={
                  <PrivateRoute allowedRoles={['student']}>
                    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                      <h1 className="text-3xl font-heading text-blue-900 dark:text-blue-200">Apply Page for ID (Coming Soon!)</h1>
                    </div>
                  </PrivateRoute>
                }
              />
              <Route
                path="/student/applications"
                element={<PrivateRoute allowedRoles={['student']}><MyApplicationsPage /></PrivateRoute>}
              />
              <Route
                path="/student/applications/details/:id"
                element={
                  <PrivateRoute allowedRoles={['student', 'company_admin']}> {/* Both roles can view application details */}
                    <ApplicationDetailsPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/student/saved"
                element={<PrivateRoute allowedRoles={['student']}><SavedOpportunitiesPage /></PrivateRoute>}
              />

              {/* COMPANY Protected Routes - All company-specific routes are prefixed with /company/ */}
              <Route
                path="/company/dashboard"
                element={<PrivateRoute allowedRoles={['company_admin']}><CompanyDashboardPage /></PrivateRoute>}
              />
              <Route
                path="/company/post-opportunity"
                element={<PrivateRoute allowedRoles={['company_admin']}><CompanyPostOpportunityPage /></PrivateRoute>}
              />
              <Route
                path="/company/manage-opportunities"
                element={<PrivateRoute allowedRoles={['company_admin']}><CompanyManageOpportunitiesPage /></PrivateRoute>}
              />
              <Route
                path="/company/opportunities/:id/applicants"
                element={<PrivateRoute allowedRoles={['company_admin']}><CompanyApplicantsForOpportunityPage /></PrivateRoute>}
              />
              <Route
                path="/company/opportunities/:id/edit"
                element={
                  <PrivateRoute allowedRoles={['company_admin']}>
                    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                      <h1 className="text-3xl font-heading text-blue-900 dark:text-blue-200">Edit Opportunity ID (Coming Soon!)</h1>
                    </div>
                  </PrivateRoute>
                }
              />
              {/* Company Account Settings */}
              <Route path="/company/account-settings/password" element={<PrivateRoute allowedRoles={['company_admin']}><div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">Company Password Settings</div></PrivateRoute>} />
              <Route path="/company/account-settings/notifications" element={<PrivateRoute allowedRoles={['company_admin']}><div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">Company Notification Settings</div></PrivateRoute>} />
              <Route path="/company/account-settings/privacy" element={<PrivateRoute allowedRoles={['company_admin']}><div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">Company Privacy Settings</div></PrivateRoute>} />
              <Route path="/company/account-settings/team-management" element={<PrivateRoute allowedRoles={['company_admin']}><div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">Company Team Management</div></PrivateRoute>} />


              {/* Public Footer Pages */}
              <Route path="/about" element={<div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">About Us Page</div>} />
              <Route path="/faq" element={<div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">FAQ Page</div>} />
              <Route path="/contact" element={<div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">Contact Page</div>} />

              {/* Catch-all route for 404 - Should be the last route */}
              <Route path="*" element={
                <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                  <h1 className="text-3xl font-heading text-red-600 dark:text-red-400">404 - Page Not Found</h1>
                </div>
              } />
            </Routes>
          </Suspense>
        </main>

        {/* Conditional rendering for Mobile Bottom Navigation */}
        {user && isAuthenticated && isMobile && !noHeaderPaths.includes(location.pathname) && (
          <div className="block md:hidden">
            {/* Pass the current role or path information to MobileBottomNav to render correct links */}
            <MobileBottomNav
              // isCompany prop should be derived from user.role directly for robust logic
              isCompany={user?.role === 'company_admin'}
              isStudent={user?.role === 'student'}
              // You might want to pass user.role directly to MobileBottomNav for more complex logic
              // userRole={user?.role}
            />
          </div>
        )}

        {shouldRenderHeader && (
          <Footer />
        )}
      </div>
    </DarkModeProvider>
  );
}

export default App;