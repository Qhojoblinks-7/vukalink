// src/pages/CompanyApplicationsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // To get opportunityId from URL
import { useAuth } from '../../../hooks/useAuth';
import { applicationService } from '../../../services'; // Import your applicationService
import { opportunityService } from '../../../services'; // Might need to fetch opportunity title
import Loader from '../../../components/ui/Loader';
import ErrorMessage from '../../../components/ui/ErrorMessage';
import CompanyDashboardSidebar from '../../../components/company/CompanyDashboardSidebar';
import MobileHeader from '../../dashboard/MobileHeader'; // For mobile header
import SelectField from '../../../components/forms/SelectField'; // Assuming you have a SelectField component
import Button from '../../../components/ui/Button'; // Assuming a Button component
import {
    EnvelopeIcon // Icon for viewing applicant profile (could be UserIcon, DocumentTextIcon etc.)
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom'; // For linking to applicant profile

const CompanyApplicationsPage = () => {
    const { opportunityId } = useParams(); // Get opportunityId from URL params
    const navigate = useNavigate();
    const { user, loading: authLoading, error: authError } = useAuth();

    const [applications, setApplications] = useState([]);
    const [opportunityTitle, setOpportunityTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const fetchApplicationsAndOpportunity = async () => {
            setLoading(true);
            setError(null);

            // Basic access control: ensure user is logged in and is a company
            if (!user || (user.role !== 'company' && !user.isCompany) || !user.id) {
                setLoading(false);
                setError(new Error("Access Denied: Only authenticated company users can view this page."));
                return;
            }

            if (!opportunityId) {
                setLoading(false);
                setError(new Error("Opportunity ID is missing from the URL."));
                return;
            }

            try {
                // Fetch opportunity details to display title and verify ownership (optional, RLS should secure this)
                const opp = await opportunityService.getOpportunityById(opportunityId);
                if (!opp) {
                    setError(new Error("Opportunity not found."));
                    setLoading(false);
                    return;
                }
                if (opp.company_id !== user.id) {
                    setError(new Error("You do not have permission to view applications for this opportunity."));
                    setLoading(false);
                    return;
                }
                setOpportunityTitle(opp.title);

                // Fetch applications for the specific opportunity
                const fetchedApplications = await applicationService.getApplicationsForOpportunity(opportunityId);
                setApplications(fetchedApplications || []);
            } catch (err) {
                console.error("Error fetching applications:", err);
                setError(err.message || "Failed to load applications.");
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading && user) { // Fetch only after auth state is resolved
            fetchApplicationsAndOpportunity();
        }
    }, [opportunityId, user, authLoading]); // Depend on opportunityId and user for re-fetching

    const handleStatusChange = async (applicationId, newStatus) => {
        try {
            await applicationService.updateApplicationStatus(applicationId, newStatus);
            setApplications(prevApps => prevApps.map(app =>
                app.id === applicationId ? { ...app, status: newStatus } : app
            ));
            // Consider using react-toastify here for better UX instead of alert
            alert(`Application status updated to ${newStatus}`);
        } catch (err) {
            console.error('Error updating status:', err);
            // Consider using react-toastify here for better UX instead of alert
            alert(`Failed to update status: ${err.message}`);
        }
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    if (authLoading || loading) {
        return (
            <div className="flex justify-center items-center min-h-screen text-blue-600 text-2xl font-heading">
                <Loader message="Loading Applications..." />
            </div>
        );
    }

    if (authError || error) {
        return (
            <div className="flex justify-center items-center min-h-screen text-red-600 text-xl font-body p-4">
                <ErrorMessage message={authError ? `Authentication error: ${authError.message}` : `Error: ${error.message}`} />
            </div>
        );
    }

    const getStatusClasses = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Reviewed': return 'bg-blue-100 text-blue-800';
            case 'Accepted': return 'bg-green-100 text-green-800';
            case 'Rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col md:flex-row">
            <div className="md:hidden">
                <MobileHeader
                    title={`Applications for ${opportunityTitle || 'Opportunity'}`}
                    showBack={true}
                    showBell={true}
                    showProfile={true}
                    onMenuClick={toggleSidebar}
                    onBackClick={() => navigate('/company/manage-opportunities')} // Go back to manage opportunities
                />
            </div>

            <CompanyDashboardSidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />

            <div className="flex-grow p-4 md:p-8 md:ml-64 transition-all duration-300">
                <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 w-full">
                    <h1 className="text-2xl md:text-3xl font-heading text-blue-900 mb-6 border-b pb-4">
                        Applications for "{opportunityTitle}"
                    </h1>

                    {applications.length === 0 ? (
                        <p className="text-center text-gray-500 py-10">
                            No applications have been submitted for this opportunity yet.
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Applicant Name
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Application Date
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {applications.map((app) => (
                                        <tr key={app.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {/* Check if app.profiles exists before accessing properties */}
                                                {app.profiles?.avatar_url ? (
                                                    <img
                                                        src={app.profiles.avatar_url}
                                                        alt={app.profiles.full_name}
                                                        className="h-8 w-8 rounded-full inline-block mr-2 object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-8 w-8 rounded-full inline-block mr-2 bg-blue-200 flex items-center justify-center text-blue-800 font-bold">
                                                        {app.profiles?.full_name ? app.profiles.full_name.charAt(0).toUpperCase() : 'N/A'}
                                                    </div>
                                                )}
                                                {/* Link to applicant's detailed profile page */}
                                                <Link to={`/company/applicant/${app.student_id}`} className="text-blue-600 hover:underline">
                                                    {app.profiles?.full_name || 'N/A'}
                                                </Link>
                                                {/* Access headline from student_data JSONB if it exists */}
                                                {app.profiles?.student_data?.headline && (
                                                    <p className="text-gray-500 text-xs italic">{app.profiles.student_data.headline}</p>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(app.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(app.status)}`}>
                                                    {app.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center space-x-2">
                                                    <Button
                                                        onClick={() => navigate(`/company/applicant/${app.student_id}`)}
                                                        variant="ghost" // Assuming 'ghost' variant for a subtle button
                                                        size="sm"
                                                        title="View Applicant Profile"
                                                    >
                                                        <EnvelopeIcon className="h-5 w-5 text-gray-600" />
                                                    </Button>
                                                    <SelectField
                                                        label="Update Status" // Add a more descriptive label for screen readers
                                                        id={`status-${app.id}`}
                                                        name="status"
                                                        value={app.status}
                                                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                                                        options={[
                                                            { value: 'Pending', label: 'Pending' },
                                                            { value: 'Reviewed', label: 'Reviewed' },
                                                            { value: 'Accepted', label: 'Accepted' },
                                                            { value: 'Rejected', label: 'Rejected' },
                                                        ]}
                                                        className="w-32" // Adjust width as needed
                                                    />
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

export default CompanyApplicationsPage;