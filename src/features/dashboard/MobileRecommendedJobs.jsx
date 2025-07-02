// src/components/dashboard/MobileRecommendedJobs.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardJobCard from './DashboardJobCard';
import Button from '../../components/ui/Button';
import { opportunityService } from '../../services'; // Import your opportunityService
import { useAuth } from '../../hooks/useAuth'; // To get user preferences for personalization
import Loader from '../../components/ui/Loader'; // Assuming you have a Loader component
import ErrorMessage from '../../components/ui/ErrorMessage'; // Assuming you have an ErrorMessage component

const MobileRecommendedJobs = () => {
    const { user } = useAuth(); // Access user object for potential personalization
    const [recommendedJobs, setRecommendedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecommendedJobs = async () => {
            setLoading(true);
            setError(null); // Clear previous errors

            try {
                // IMPORTANT: Customize this service call and its parameters
                // based on how you define "Recommended" jobs.
                // Examples:
                // 1. Fetching the 3 most recently added opportunities (simple approach):
                const opportunities = await opportunityService.getOpportunities({
                    limit: 3, // Fetch a small number for mobile display
                    sortBy: 'created_at',
                    sortOrder: 'desc'
                });

                // 2. Personalized recommendations based on user's profile skills/preferences:
                // if (user?.profile?.skills && user.profile.skills.length > 0) {
                //     const opportunities = await opportunityService.searchOpportunities({
                //         skills: user.profile.skills, // Assuming searchOpportunities can filter by skills
                //         limit: 3
                //     });
                //     setRecommendedJobs(opportunities || []);
                // } else {
                //     // Fallback if no user skills or profile
                //     const opportunities = await opportunityService.getOpportunities({ limit: 3, sortBy: 'created_at', sortOrder: 'desc' });
                //     setRecommendedJobs(opportunities || []);
                // }

                setRecommendedJobs(opportunities || []); // Ensure it's always an array
            } catch (err) {
                console.error("Failed to fetch mobile recommended jobs:", err);
                setError(err.message || "Failed to load recommended jobs.");
                setRecommendedJobs([]); // Reset on error
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendedJobs();
        // Add `user` to dependency array if your recommendation logic depends on user data:
        // }, [user]);
    }, []); // Empty dependency array runs once on mount for a general list

    if (loading) {
        return (
            <section className="mb-4 px-2">
                <div className="flex justify-center items-center p-4 min-h-[150px]">
                    <Loader />
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="mb-4 px-2">
                <div className="flex justify-center items-center p-4 min-h-[150px]">
                    <ErrorMessage message={error} />
                </div>
            </section>
        );
    }

    if (recommendedJobs.length === 0) {
        return (
            <section className="mb-4 px-2">
                <h2 className="text-lg font-heading font-bold text-blue-900 mb-3">Recommended for You</h2>
                <p className="text-center text-gray-500">No recommendations available at the moment. Explore all opportunities!</p>
                <Link to="/opportunities">
                    <Button variant="outline" className="w-full text-center py-2 text-base mt-3">
                        View All Opportunities
                    </Button>
                </Link>
            </section>
        );
    }

    return (
        <section className="mb-4 px-2">
            <h2 className="text-lg font-heading font-bold text-blue-900 mb-3">Recommended for You</h2>
            <div className="flex overflow-x-auto snap-x snap-mandatory pb-3 space-x-3 -mx-2 px-2">
                {recommendedJobs.map((job) => (
                    <div
                        key={job.id}
                        className="min-w-[90vw] max-w-xs snap-center sm:min-w-[60vw] md:min-w-[50%]"
                    >
                        <DashboardJobCard {...job} />
                    </div>
                ))}
            </div>
            <Link to="/opportunities">
                <Button variant="outline" className="w-full text-center py-2 text-base mt-3">
                    View All Recommendations
                </Button>
            </Link>
        </section>
    );
};

export default MobileRecommendedJobs;