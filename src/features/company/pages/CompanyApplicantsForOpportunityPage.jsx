// src/pages/CompanyApplicantsForOpportunityPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { opportunityService } from '../../../services'; // Adjust path if needed
import { useAuth } from '../../../hooks/useAuth';
import CompanyDashboardSidebar from '../../../components/company/CompanyDashboardSidebar'; // Your sidebar component
import MobileHeader from '../dashboard/MobileHeader'; // Your mobile header component
import Loader from '../../../components/ui/Loader'; // Your Loader component
import ErrorMessage from '../../../components/ui/ErrorMessage'; // Your ErrorMessage component
import { ChevronLeftIcon, DocumentTextIcon, EnvelopeIcon } from '@heroicons/react/24/outline'; // Icons
import { toast } from 'react-toastify'; // For toast notifications

const CompanyApplicantsForOpportunityPage = () => {
    const { opportunityId } = useParams(); // Get opportunity ID from the URL
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [opportunity, setOpportunity] = useState(null);
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatingStatusId, setUpdatingStatusId] = useState(null); // Track which application status is being updated

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            // Authentication check: Ensure user is logged in and is a company
            if (!user || user.role !== 'company') {
                setError(new Error("Access Denied: Only authenticated company users can view this page."));
                setLoading(false);
                return;
            }

            try {
                // Fetch the specific opportunity details
                const fetchedOpportunity = await opportunityService.getOpportunityById(opportunityId);
                if (!fetchedOpportunity) {
                    setError(new Error("Opportunity not found."));
                    setLoading(false);
                    return;
                }

                // Authorization check: Ensure the logged-in company owns this opportunity
                if (fetchedOpportunity.company_id !== user.id) {
                    setError(new Error("Access Denied: You do not own this opportunity."));
                    setLoading(false);
                    return;
                }
                setOpportunity(fetchedOpportunity);

                // Fetch applications for this opportunity
                const fetchedApplicants = await opportunityService.getOpportunityApplications(opportunityId);
                setApplicants(fetchedApplicants);

            } catch (err) {
                console.error("Error fetching opportunity or applicants:", err);
                setError(err.message || "Failed to load opportunity details or applicants.");
            } finally {
                setLoading(false);
            }
        };

        // Only fetch data once authentication state is resolved
        if (!authLoading) {
            fetchData();
        }
    }, [opportunityId, user, authLoading]); // Re-run when opportunityId, user, or authLoading changes

    const handleStatusChange = async (applicationId, newStatus) => {
        if (!window.confirm(`Are you sure you want to change this application's status to "${newStatus}"?`)) {
            return;
        }

        setUpdatingStatusId(applicationId); // Set loading state for this specific application
        try {
            const updatedApp = await opportunityService.updateApplicationStatus(applicationId, newStatus);
            // Optimistically update the UI with the new status
            setApplicants(prevApplicants =>
                prevApplicants.map(app =>
                    app.id === applicationId ? { ...app, status: updatedApp.status } : app
                )
            );
            toast.success(`Application status updated to "${newStatus}"!`);
        } catch (err) {
            console.error("Error updating application status:", err);
            toast.error(err.message || "Failed to update application status.");
        } finally {
            setUpdatingStatusId(null); // Clear loading state
        }
    };

    // Show loader while authenticating or loading data
    if (authLoading || loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader message="Loading Opportunity and Applicants..." />
            </div>
        );
    }

    // Display error message if there's an authentication or data loading error
    if (error) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen p-4">
                <ErrorMessage message={error.message} />
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 text-vuka-blue hover:underline flex items-center"
                >
                    <ChevronLeftIcon className="h-5 w-5 mr-1" /> Go Back
                </button>
            </div>
        );
    }

    // If opportunity is null after loading, it means it wasn't found (and error was already set)
    if (!opportunity) {
        return null;
    }

    // Options for the application status dropdown
    const applicationStatusOptions = [
        { value: 'pending', label: 'Pending' },
        { value: 'reviewed', label: 'Reviewed' },
        { value: 'interview', label: 'Interview' },
        { value: 'rejected', label: 'Rejected' },
        { value: 'hired', label: 'Hired' },
    ];

    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen flex flex-col md:flex-row">
            {/* Mobile Header */}
            <div className="md:hidden">
                <MobileHeader
                    title="Applicants"
                    showBack={true}
                    showBell={true}
                    showProfile={true}
                    onMenuClick={toggleSidebar}
                />
            </div>

            {/* Company Dashboard Sidebar for desktop and mobile */}
            <CompanyDashboardSidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />

            <div className="flex-grow p-4 md:p-8 md:ml-64 transition-all duration-300">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8 w-full">
                    <div className="flex items-center mb-6">
                        <button
                            onClick={() => navigate(-1)}
                            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 mr-3 p-1 rounded-full hover:bg-grey-500  dark:hover:bg-gray-700"
                            title="Go back to opportunities"
                        >
                            <ChevronLeftIcon className="h-6 w-6" />
                        </button>
                        <h1 className="text-2xl md:text-3xl font-heading text-vuka-blue dark:text-gray-100">
                            Applicants for "{opportunity.title}"
                        </h1>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                        View and manage applications for your "{opportunity.title}" opportunity.
                    </p>

                    {applicants.length === 0 ? (
                        <div className="text-center py-10 text-gray-500 dark:text-gray-400 text-lg">
                            No applicants found for this opportunity yet.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Applicant
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Applied On
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th scope="col" className="relative px-6 py-3">
                                            <span className="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {applicants.map((application) => (
                                        <tr key={application.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <img
                                                            className="h-10 w-10 rounded-full object-cover"
                                                            src={application.student.avatarUrl}
                                                            alt={application.student.fullName}
                                                        />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-gray-200">
                                                            {/* Link to the public student profile page */}
                                                            <Link
                                                                to={`/profiles/student/${application.student.id}`}
                                                                className="text-vuka-blue hover:underline dark:text-blue-400 dark:hover:text-blue-300"
                                                            >
                                                                {application.student.fullName}
                                                            </Link>
                                                        </div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                                            {application.student.headline || 'Student'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(application.applied_at).toLocaleDateString('en-GH')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                <select
                                                    value={application.status}
                                                    onChange={(e) => handleStatusChange(application.id, e.target.value)}
                                                    className={`block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-gray-100
                                                        ${application.status === 'pending' ? 'text-yellow-700 bg-yellow-100 dark:bg-yellow-700 dark:text-yellow-100' :
                                                          application.status === 'reviewed' ? 'text-blue-700 bg-blue-100 dark:bg-blue-700 dark:text-blue-100' :
                                                          application.status === 'interview' ? 'text-purple-700 bg-purple-100 dark:bg-purple-700 dark:text-purple-100' :
                                                          application.status === 'rejected' ? 'text-red-700 bg-red-100 dark:bg-red-700 dark:text-red-100' :
                                                          application.status === 'hired' ? 'text-green-700 bg-green-100 dark:bg-green-700 dark:text-green-100' : ''
                                                        }`}
                                                    disabled={updatingStatusId === application.id} // Disable during update
                                                >
                                                    {applicationStatusOptions.map(option => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex space-x-3 justify-end">
                                                    {application.resume_url && (
                                                        <a
                                                            href={application.resume_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-vuka-blue hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center p-1 rounded-md hover:bg-grey-500  dark:hover:bg-gray-700"
                                                            title="View Resume"
                                                        >
                                                            <DocumentTextIcon className="h-5 w-5 mr-1" /> Resume
                                                        </a>
                                                    )}
                                                    {application.cover_letter_url && (
                                                        <a
                                                            href={application.cover_letter_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-vuka-blue hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center p-1 rounded-md hover:bg-grey-500  dark:hover:bg-gray-700"
                                                            title="View Cover Letter"
                                                        >
                                                            <EnvelopeIcon className="h-5 w-5 mr-1" /> Cover Letter
                                                        </a>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CompanyApplicantsForOpportunityPage;