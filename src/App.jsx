// src/App.jsx (Updated)
import React, { lazy, Suspense, useEffect, useState, useCallback } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAuth } from './hooks/useAuth';
import { DarkModeProvider } from './context/DarkModeContext';
import useIsMobile from './hooks/useIsMobile';
import { getCurrentUser } from './features/auth/authSlice';

// Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import MobileBottomNav from './features/dashboard/MobileBottomNav';
import MobileHeader from './features/dashboard/MobileHeader';
import ToastNotification from './components/common/ToastNotification'; // <-- NEW IMPORT

// Lazy Imports for Features/Pages
const AuthPage = lazy(() => import('./features/auth/pages/AuthPage'));
const DashboardPage = lazy(() => import('./features/dashboard/pages/DashboardPage'));
const HomePage = lazy(() => import('./pages/HomePage'));
const OpportunitiesPage = lazy(() => import('./features/opportunities/pages/OpportunitiesPage'));
const OpportunityDetailsPage = lazy(() => import('./features/opportunities/pages/OpportunityDetailsPage'));
const MyApplicationsPage = lazy(() => import('./features/applications/pages/MyApplicationsPage'));
// Corrected import path for SavedOpportunitiesPage to match typical src/pages or src/features/savedOpportunities/pages
const SavedOpportunitiesPage = lazy(() => import('./pages/SavedOpportunitiesPage')); // Assuming it's in src/pages as per your example
// OR if it's within a feature folder:
// const SavedOpportunitiesPage = lazy(() => import('./features/savedOpportunities/pages/SavedOpportunitiesPage'));

const LandingSplash = lazy(() => import('./pages/LandingSplash'));
const StudentMessagesPage = lazy(() => import('./features/messages/pages/MessagesPage'));
const EditProfilePage = lazy(() => import('./features/user/pages/EditProfilePage'));
const PublicProfilePage = lazy(() => import('./features/user/pages/PublicProfilePage'));
const ResourcesPage = lazy(() => import('./features/resources/pages/ResourcesPage'));
const ArticleDetailPage = lazy(() => import('./features/resources/pages/ArticleDetailPage'));

// Company Pages
const CompanyDashboardPage = lazy(() => import('./features/company/pages/CompanyDashboardPage'));
const CompanyManageOpportunitiesPage = lazy(() => import('./features/company/pages/CompanyManageOpportunitiesPage'));
const CompanyPostOpportunityPage = lazy(() => import('./features/company/pages/CompanyPostOpportunityPage'));
const CompanyApplicantsForOpportunityPage = lazy(() => import('./features/company/pages/CompanyApplicantsForOpportunityPage'));
const CompanyMessagesPage = lazy(() => import('./features/messages/pages/CompanyMessagesPage'));

// Application Details Page
const ApplicationDetailsPage = lazy(() => import('./features/applications/pages/ApplicationDetailsPage'));


function App() {
    const { user, loading, isAuthenticated, role } = useAuth();
    const location = useLocation();
    const isMobile = useIsMobile();
    const dispatch = useDispatch();

    // <-- NEW STATE FOR TOAST NOTIFICATION -->
    const [toast, setToast] = useState({ message: null, type: 'info' });

    // Function to show toast
    const showToast = useCallback((message, type = 'info') => {
        setToast({ message, type });
        // Auto-dismiss after 5 seconds
        const timer = setTimeout(() => {
            setToast({ message: null, type: 'info' });
        }, 5000);
        return () => clearTimeout(timer); // Cleanup on unmount or re-render
    }, []);

    // Function to dismiss toast
    const dismissToast = useCallback(() => {
        setToast({ message: null, type: 'info' });
    }, []);
    // <-- END NEW STATE FOR TOAST NOTIFICATION -->


    useEffect(() => {
        // Dispatch getCurrentUser to check user session on app load
        dispatch(getCurrentUser());
    }, [dispatch]);

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

        if (!isAuthenticated) {
            // Only show toast if it's not already showing the same message
            if (!toast.message || toast.message !== "Please log in to access this page.") {
                showToast("Please log in to access this page.", "error");
            }
            return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
        }

        if (allowedRoles.length > 0 && role && !allowedRoles.includes(role)) {
            console.warn("Access Denied: User role does not match allowed roles. Current role:", role, "Allowed roles:", allowedRoles);
            // Only show toast if it's not already showing the same message
            if (!toast.message || toast.message !== "Access Denied: You do not have permission to view this page.") {
                showToast("Access Denied: You do not have permission to view this page.", "error");
            }

            // Redirect based on current role
            if (role === 'student') {
                return <Navigate to="/student/dashboard" replace />;
            } else if (role === 'company_admin') {
                return <Navigate to="/company/dashboard" replace />;
            } else if (role === 'admin') {
                // Assuming an admin dashboard exists, otherwise redirect to a generic home
                return <Navigate to="/admin/dashboard" replace />;
            }
            // Fallback for unexpected roles or if no specific dashboard
            return (
                <div className="flex justify-center items-center min-h-screen text-red-600 text-xl font-body p-4">
                    Access Denied: You do not have permission to view this page.
                </div>
            );
        }

        return React.cloneElement(children, { showToast }); // Pass showToast prop to children
    };

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
                        user={user}
                        title={
                            location.pathname.startsWith('/student/dashboard') ? 'Student Dashboard' :
                            location.pathname.startsWith('/opportunities') ? 'Opportunities' : // Changed to /opportunities for consistency
                            location.pathname.startsWith('/student/saved-opportunities') ? 'Saved' :
                            location.pathname.startsWith('/student/applications') ? 'My Applications' :
                            location.pathname.startsWith('/student/messages') ? 'Messages' :
                            location.pathname.startsWith('/profile/edit') ? 'Edit Profile' :
                            location.pathname.startsWith('/profile/view') ? 'Public Profile' :
                            location.pathname.startsWith('/company/dashboard') ? 'Company Dashboard' :
                            location.pathname.startsWith('/company/manage-opportunities') ? 'Manage Opps' :
                            location.pathname.startsWith('/company/post-opportunity') ? 'Post Opp' :
                            location.pathname.startsWith('/company/applicants') ? 'Applicants' :
                            location.pathname.startsWith('/company/messages') ? 'Messages' :
                            location.pathname.startsWith('/resources') ? 'Resources' :
                            'VukaLink' // Default or fallback title
                        }
                        showBack={!isRootPath && !noHeaderPaths.includes(location.pathname) && !['/student/dashboard', '/company/dashboard'].includes(location.pathname)}
                        showBell={true}
                        showProfile={true}
                    />
                )}

                <main className="flex-grow">
                    {/* <-- NEW: Render ToastNotification here --> */}
                    <ToastNotification
                        message={toast.message}
                        type={toast.type}
                        onDismiss={dismissToast}
                    />

                    <Suspense fallback={
                        <div className="flex justify-center items-center min-h-screen text-blue-600 text-2xl font-heading">
                            Loading Page...
                        </div>
                    }>
                        <Routes>
                            {/* Public/Authentication Routes */}
                            {/* Pass showToast to AuthPage and all its sub-routes */}
                            <Route path="/auth" element={<AuthPage showToast={showToast} />} />
                            <Route path="/login" element={<AuthPage showToast={showToast} />} />
                            <Route path="/register-student" element={<AuthPage showToast={showToast} />} />
                            <Route path="/register-company" element={<AuthPage showToast={showToast} />} />

                            <Route path="/" element={isMobile ? <LandingSplash /> : <HomePage />} />

                            {/* Public Opportunities Routes (viewable by anyone) */}
                            {/* Pass showToast here */}
                            <Route path="/opportunities" element={<OpportunitiesPage showToast={showToast} />} />
                            <Route path="/opportunities/details/:id" element={<OpportunityDetailsPage showToast={showToast} />} />

                            {/* General Protected Routes */}
                            {/* PrivateRoute automatically passes showToast */}
                            <Route path="/resources" element={<PrivateRoute allowedRoles={['student', 'company_admin']}><ResourcesPage /></PrivateRoute>} />
                            <Route path="/resources/:id" element={<PrivateRoute allowedRoles={['student', 'company_admin']}><ArticleDetailPage /></PrivateRoute>} />

                            <Route path="/profile/edit" element={<PrivateRoute allowedRoles={['student', 'company_admin']}><EditProfilePage /></PrivateRoute>} />
                            <Route path="/profile/view/:userId" element={<PrivateRoute allowedRoles={['student', 'company_admin']}><PublicProfilePage /></PrivateRoute>} />

                            {/* STUDENT Protected Routes */}
                            <Route
                                path="/student/dashboard"
                                element={<PrivateRoute allowedRoles={['student']}><DashboardPage /></PrivateRoute>}
                            />
                            <Route
                                path="/student/opportunities/:id/apply"
                                element={
                                    <PrivateRoute allowedRoles={['student']}>
                                        {/* This is a placeholder, when implemented, it will also receive showToast */}
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
                                    <PrivateRoute allowedRoles={['student', 'company_admin']}>
                                        <ApplicationDetailsPage />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/student/saved-opportunities"
                                element={<PrivateRoute allowedRoles={['student']}><SavedOpportunitiesPage /></PrivateRoute>}
                            />
                            <Route
                                path="/student/messages"
                                element={<PrivateRoute allowedRoles={['student']}><StudentMessagesPage /></PrivateRoute>}
                            />

                            {/* COMPANY Protected Routes */}
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
                                        {/* Placeholder, will also receive showToast when implemented */}
                                        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                                            <h1 className="text-3xl font-heading text-blue-900 dark:text-blue-200">Edit Opportunity ID (Coming Soon!)</h1>
                                        </div>
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/company/messages"
                                element={<PrivateRoute allowedRoles={['company_admin']}><CompanyMessagesPage /></PrivateRoute>}
                            />
                            {/* Company Account Settings - Pass showToast to these once actual components exist */}
                            <Route path="/company/account-settings/password" element={<PrivateRoute allowedRoles={['company_admin']}><div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">Company Password Settings</div></PrivateRoute>} />
                            <Route path="/company/account-settings/notifications" element={<PrivateRoute allowedRoles={['company_admin']}><div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">Company Notification Settings</div></PrivateRoute>} />
                            <Route path="/company/account-settings/privacy" element={<PrivateRoute allowedRoles={['company_admin']}><div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">Company Privacy Settings</div></PrivateRoute>} />
                            <Route path="/company/account-settings/team-management" element={<PrivateRoute allowedRoles={['company_admin']}><div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">Company Team Management</div></PrivateRoute>} />


                            {/* Public Footer Pages */}
                            {/* For these static pages, you might not need to pass showToast unless they have forms/interactions */}
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
                        <MobileBottomNav
                            isCompany={user?.profile?.role === 'company_admin'} // Use user.profile.role consistently
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