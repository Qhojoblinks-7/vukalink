// src/pages/MyApplicationsPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DesktopApplicationsLayout from '../../../components/applications/DesktopApplicationsLayout';
import MobileApplicationsLayout from '../../../components/applications/MobileApplicationsLayout';
import { useAuth } from '../../../hooks/useAuth';
import { opportunityService } from '../../../services';
import Loader from '../../../components/ui/Loader';
import ErrorMessage from '../../../components/ui/ErrorMessage';

const MyApplicationsPage = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchApplications = async () => {
            setLoading(true);
            setError(null);

            if (!user || user.role !== 'student') {
                setError(new Error("Access Denied: Please log in as a student to view your applications."));
                setLoading(false);
                return;
            }

            try {
                const fetchedApplications = await opportunityService.getStudentApplications(user.id);

                const formattedApplications = fetchedApplications.map(app => ({
                    id: app.id,
                    jobTitle: app.opportunity?.title || 'N/A',
                    company: app.opportunity?.company?.fullName || 'N/A',
                    companyLogo: app.opportunity?.company?.avatarUrl || '/images/default-company-avatar.png',
                    // Use 'en-US' for consistency with how you format in ApplicationTable
                    dateApplied: new Date(app.applied_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
                    currentStatus: app.status,
                    lastStatusUpdate: app.updated_at ? new Date(app.updated_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A',
                    opportunityId: app.opportunity?.id,
                    companyId: app.opportunity?.company?.id,
                    // *** THESE ARE THE NEWLY ADDED FIELDS ***
                    type: app.opportunity?.type,
                    locationType: app.opportunity?.location_type,
                    location: app.opportunity?.location,
                }));
                
                setApplications(formattedApplications);

            } catch (err) {
                console.error("Error fetching applications:", err);
                setError(err.message || "Failed to load your applications.");
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading) {
            fetchApplications();
        }
    }, [user, authLoading]);

    if (authLoading || loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader message="Loading My Applications..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen p-4">
                <ErrorMessage message={error.message} />
                {user ? (
                    <button
                        onClick={() => navigate('/')}
                        className="mt-4 text-vuka-blue hover:underline"
                    >
                        Go to Homepage
                    </button>
                ) : (
                    <Link to="/login" className="mt-4 text-vuka-blue hover:underline">
                        Log In
                    </Link>
                )}
            </div>
        );
    }

    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen flex flex-col">
            {/* Desktop View */}
            <div className="hidden md:flex flex-grow bg-white dark:bg-gray-900">
                <DesktopApplicationsLayout applications={applications} />
            </div>

            {/* Mobile View */}
            <div className="md:hidden flex-grow flex flex-col bg-white dark:bg-gray-900">
                <MobileApplicationsLayout applications={applications} />
            </div>
        </div>
    );
};

export default MyApplicationsPage;