// src/components/dashboard/MobileApplicationStatus.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth'; // Assuming your useAuth hook is here
import { applicationService } from '../../services'; // Import your applicationService
import Loader from '../../components/ui/Loader'; // Assuming you have a Loader component
import ErrorMessage from '../../components/ui/ErrorMessage'; // Assuming you have an ErrorMessage component

const StatusItem = ({ count, label }) => (
    <div className="flex flex-col items-center p-2 sm:p-3">
        <span className="text-2xl sm:text-3xl font-bold mb-1">{count}</span>
        <span className="text-grey-600 text-center text-xs sm:text-sm">{label}</span>
    </div>
);

const MobileApplicationStatus = () => {
    const { user } = useAuth(); // Get the authenticated user object
    const [counts, setCounts] = useState({
        applied: 0,
        interview: 0,
        offers: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchApplicationStatuses = async () => {
            if (!user?.id) {
                setLoading(false);
                // If no user, default counts to 0 and optionally show an error.
                // setError("User not authenticated to view application statuses.");
                return;
            }

            setLoading(true);
            setError(null); // Clear previous errors

            try {
                // Fetch all applications for the current user
                const applications = await applicationService.getMyApplications();

                if (applications) {
                    const newCounts = {
                        // 'Applied' typically means any application that has been submitted
                        applied: applications.length,
                        // 'Interview' for applications where status indicates an interview stage
                        // IMPORTANT: Match these status strings to your actual Supabase 'applications' table statuses.
                        interview: applications.filter(app => app.status === 'Interview Scheduled' || app.status === 'Interviewed').length,
                        // 'Offers' for applications where status indicates an offer
                        offers: applications.filter(app => app.status === 'Offer Received').length,
                    };
                    setCounts(newCounts);
                } else {
                    setCounts({ applied: 0, interview: 0, offers: 0 }); // No applications found
                }
            } catch (err) {
                console.error("Failed to fetch mobile application statuses:", err);
                setError(err.message || "Failed to load application statuses.");
                setCounts({ applied: 0, interview: 0, offers: 0 }); // Reset on error
            } finally {
                setLoading(false);
            }
        };

        fetchApplicationStatuses();
    }, [user]); // Depend on 'user' so it refetches if user object changes

    if (loading) {
        return (
            <div className="flex justify-center items-center p-3 rounded-lg shadow-sm mb-3 min-h-[80px] bg-white">
                <Loader />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center p-3 rounded-lg shadow-sm mb-3 min-h-[80px] bg-white">
                <ErrorMessage message={error} />
            </div>
        );
    }

    return (
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm mb-3 sm:mb-4">
            <div className="grid grid-cols-3 gap-1 sm:gap-2">
                <StatusItem count={counts.applied} label="Applied" />
                <StatusItem count={counts.interview} label="Interview" />
                <StatusItem count={counts.offers} label="Offers" />
            </div>
        </div>
    );
};

export default MobileApplicationStatus;