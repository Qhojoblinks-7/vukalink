// src/features/applications/pages/ApplicationDetailsPage.jsx
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchApplicationById, clearCurrentApplication } from '../../opportunities/opportunitiesSlice';
import { format } from 'date-fns';

// Accept showToast prop
const ApplicationDetailsPage = ({ showToast }) => {
    const { id: applicationId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { currentApplication, status, error } = useSelector(state => state.opportunities);
    const { user: currentUser } = useSelector(state => state.auth);

    useEffect(() => {
        if (applicationId) {
            dispatch(fetchApplicationById(applicationId));
        }
        return () => {
            dispatch(clearCurrentApplication());
        };
    }, [dispatch, applicationId]);

    const isStudent = currentUser?.profile?.role === 'student';
    const isCompanyAdmin = currentUser?.profile?.role === 'company_admin';

    const canView = currentApplication && (
        (isStudent && currentApplication.student_id === currentUser.id) ||
        (isCompanyAdmin && currentApplication.opportunity?.company?.id === currentUser.id)
    );

    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center min-h-screen text-xl text-gray-700 dark:text-gray-300">
                Loading application details...
            </div>
        );
    }

    if (status === 'failed') {
        // Display toast and navigate back
        if (error && !window.__toastShownForError__) { // Simple flag to prevent multiple toasts on quick re-renders
          showToast(`Error fetching details: ${error}`, 'error');
          window.__toastShownForError__ = true; // Set flag
          setTimeout(() => { window.__toastShownForError__ = false; }, 1000); // Reset flag after a short delay
        }
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-xl text-red-600 dark:text-red-400 p-4">
                <p>Could not load application details.</p>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Go Back
                </button>
            </div>
        );
    }

    if (!currentApplication || !canView) {
        if (!window.__toastShownForError__) { // Prevent multiple toasts
          showToast("Application not found or you don't have permission.", 'error');
          window.__toastShownForError__ = true;
          setTimeout(() => { window.__toastShownForError__ = false; }, 1000);
        }
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-xl text-gray-700 dark:text-gray-300 p-4">
                <p>Application not found or you do not have permission to view it.</p>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Go Back
                </button>
            </div>
        );
    }

    const {
        status: applicationStatus,
        applied_at,
        updated_at,
        student,
        opportunity
    } = currentApplication;

    const companyName = opportunity?.company?.full_name || 'N/A';
    const companyLogo = opportunity?.company?.avatar_url;
    const jobTitle = opportunity?.title || 'N/A';
    const opportunityType = opportunity?.type || 'N/A';
    const location = opportunity?.location || 'N/A';
    const locationType = opportunity?.location_type || 'N/A';
    const companyDescription = opportunity?.company?.description || 'No company description available.';
    const opportunityDescription = opportunity?.description || 'No opportunity description available.';

    const getStatusClasses = (status) => {
        switch (status.toLowerCase()) {
            case 'applied': return 'bg-blue-100 text-blue-800';
            case 'interview': return 'bg-purple-100 text-purple-800';
            case 'reviewed': return 'bg-gray-100 text-gray-800';
            case 'offer': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            case 'withdrawn': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl bg-white dark:bg-gray-800 shadow-lg rounded-lg">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Application Details</h1>
                <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                    Back to Applications
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Application Summary */}
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Application Summary</h2>
                    <p className="mb-2 text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Status:</span>{' '}
                        <span className={`px-2 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusClasses(applicationStatus)}`}>
                            {applicationStatus}
                        </span>
                    </p>
                    <p className="mb-2 text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Applied On:</span>{' '}
                        {applied_at ? format(new Date(applied_at), 'dd MMMM, yyyy') : 'N/A'}
                    </p>
                    <p className="mb-2 text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Last Updated:</span>{' '}
                        {updated_at ? format(new Date(updated_at), 'dd MMMM, yyyy') : 'N/A'}
                    </p>
                </div>

                {/* Opportunity Details */}
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Opportunity Details</h2>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{jobTitle}</h3>
                    <div className="flex items-center mb-2">
                        {companyLogo && (
                            <img src={companyLogo} alt={companyName} className="w-8 h-8 rounded-full mr-2 object-cover" />
                        )}
                        <p className="text-gray-700 dark:text-gray-300 font-medium">{companyName}</p>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">{opportunityType} | {location}, {locationType}</p>
                    <div className="text-gray-600 dark:text-gray-400 text-sm max-h-24 overflow-hidden overflow-y-auto mb-2">
                        <p className="font-medium mb-1">Description:</p>
                        <p>{opportunityDescription}</p>
                    </div>
                    {/* Add more opportunity details as needed */}
                </div>
            </div>

            {/* Student Profile Overview (for company_admin) */}
            {isCompanyAdmin && student && (
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-sm mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Applicant Details</h2>
                    <div className="flex items-center mb-4">
                        {student.avatar_url && (
                            <img src={student.avatar_url} alt={student.full_name} className="w-16 h-16 rounded-full mr-4 object-cover" />
                        )}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{student.full_name || 'N/A'}</h3>
                            <p className="text-gray-600 dark:text-gray-400">{student.email}</p>
                        </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{student.bio || 'No bio provided.'}</p>
                    <button
                        onClick={() => navigate(`/profile/view/${student.id}`)}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        View Full Profile
                    </button>
                </div>
            )}

            {/* Actions for Company Admin (e.g., Change Status, View Resume - Coming Soon) */}
            {isCompanyAdmin && (
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Company Actions</h2>
                    <div className="flex flex-wrap gap-4">
                        <button className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
                            Change Status (Coming Soon)
                        </button>
                        <button className="px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed">
                            View Resume (Coming Soon)
                        </button>
                        {/* Other actions like messaging, scheduling interview etc. */}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApplicationDetailsPage;