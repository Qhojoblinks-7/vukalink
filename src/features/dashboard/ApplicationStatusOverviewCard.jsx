// src/components/dashboard/ApplicationStatusOverviewCard.jsx
import React, { useState, useEffect } from 'react';
import { BriefcaseIcon, CloudArrowUpIcon, DocumentMagnifyingGlassIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; // Assuming your useAuth hook is here
import { applicationService } from '../../services'; // Import your applicationService
import Loader from '../../components/ui/Loader'; // Assuming you have a Loader component
import ErrorMessage from '../../components/ui/ErrorMessage'; // Assuming you have an ErrorMessage component

const StatusItem = ({ icon: Icon, count, label, colorClass }) => (
    <div className="flex flex-col items-center p-3">
        <Icon className={`h-8 w-8 mb-1 ${colorClass}`} />
        <span className="text-2xl font-bold text-blue-900 mb-0.5">{count}</span>
        <span className="text-grey-600 text-center text-sm">{label}</span>
    </div>
);

const ApplicationStatusOverviewCard = () => {
    const { user } = useAuth(); // Get the authenticated user object
    const [counts, setCounts] = useState({
        totalApplications: 0,
        underReview: 0,
        interviewInvites: 0,
        offersReceived: 0,
        // Add more statuses if your application workflow has them
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchApplicationStatuses = async () => {
            if (!user?.id) {
                setLoading(false);
                setError("User not authenticated to view application statuses.");
                return;
            }

            setLoading(true);
            setError(null);

            try {
                // Fetch all applications for the current user
                const applications = await applicationService.getMyApplications();

                if (applications) {
                    const newCounts = {
                        totalApplications: applications.length,
                        // Filter applications by their status.
                        // IMPORTANT: Ensure these string values ('Under Review', 'Interview Scheduled', 'Offer Received')
                        // match the actual status values in your Supabase 'applications' table.
                        underReview: applications.filter(app => app.status === 'Under Review').length,
                        interviewInvites: applications.filter(app => app.status === 'Interview Scheduled').length,
                        offersReceived: applications.filter(app => app.status === 'Offer Received').length,
                    };
                    setCounts(newCounts);
                } else {
                    setCounts({ totalApplications: 0, underReview: 0, interviewInvites: 0, offersReceived: 0 });
                }
            } catch (err) {
                console.error("Failed to fetch application statuses:", err);
                setError(err.message || "Failed to load application statuses.");
                setCounts({ totalApplications: 0, underReview: 0, interviewInvites: 0, offersReceived: 0 }); // Reset on error
            } finally {
                setLoading(false);
            }
        };

        fetchApplicationStatuses();
    }, [user]); // Depend on 'user' to refetch if user object (and thus ID) changes

    if (loading) {
        return (
            <div className="flex justify-center items-center p-4 min-h-[180px] bg-white rounded-lg shadow-md">
                <Loader />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center p-4 min-h-[180px] bg-white rounded-lg shadow-md">
                <ErrorMessage message={error} />
            </div>
        );
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow-md flex flex-col justify-between sm:p-6">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-blue-900">Application Status Overview</h3>
                <Link to="/applications" className="text-grey-600 cursor-pointer hover:text-blue-900">
                    <ArrowTopRightOnSquareIcon className="h-5 w-5" />
                </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                <StatusItem icon={BriefcaseIcon} count={counts.totalApplications} label="Total Applications" colorClass="text-blue-900" />
                <StatusItem icon={CloudArrowUpIcon} count={counts.underReview} label="Under Review" colorClass="text-blue-400" />
                <StatusItem icon={DocumentMagnifyingGlassIcon} count={counts.interviewInvites} label="Interview Invites" colorClass="text-green-500" />
                <StatusItem icon={CheckCircleIcon} count={counts.offersReceived} label="Offers Received" colorClass="text-orange-500" />
            </div>
        </div>
    );
};

export default ApplicationStatusOverviewCard;