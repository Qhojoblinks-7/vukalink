// src/components/dashboard/DashboardTopPicks.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardJobCard from './DashboardJobCard';
import { opportunityService } from '../../services'; // Import your opportunityService
import { useAuth } from '../../hooks/useAuth'; // To get user preferences for personalized picks (optional)
import Loader from '../../components/ui/Loader'; // Assuming you have a Loader component
import ErrorMessage from '../../components/ui/ErrorMessage'; // Assuming you have an ErrorMessage component

const DashboardTopPicks = () => {
    const { user } = useAuth(); // You might use 'user' to fetch personalized top picks
    const [topPicks, setTopPicks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTopPicks = async () => {
            setLoading(true);
            setError(null); // Clear previous errors

            try {
                // IMPORTANT: Customize this service call and its parameters
                // based on how you define "Top Picks" in your application logic.
                // Examples:
                // 1. Fetching the 3 most recently added opportunities:
                const opportunities = await opportunityService.getOpportunities({
                    limit: 3,
                    sortBy: 'created_at', // Assuming you have a 'created_at' timestamp
                    sortOrder: 'desc'
                });

                // 2. Fetching opportunities marked as 'featured' in your DB:
                // const opportunities = await opportunityService.getOpportunities({ is_featured: true, limit: 3 });

                // 3. Personalized picks based on user skills/preferences (requires more complex service method):
                // if (user?.profile?.skills) {
                //   const opportunities = await opportunityService.searchOpportunities({
                //     skills: user.profile.skills,
                //     limit: 3
                //   });
                // } else {
                //   // Fallback if no user skills
                //   const opportunities = await opportunityService.getOpportunities({ limit: 3 });
                // }

                setTopPicks(opportunities || []); // Ensure it's always an array
            } catch (err) {
                console.error("Failed to fetch top picks:", err);
                setError(err.message || "Failed to load top picks.");
                setTopPicks([]); // Reset on error
            } finally {
                setLoading(false);
            }
        };

        fetchTopPicks();
        // Add dependencies if your top picks logic depends on user data, e.g., [user]
    }, []); // Empty dependency array means this runs once on mount. Add [user] if logic depends on user object.

    if (loading) {
        return (
            <section className="mb-8 px-4">
                <div className="flex justify-center items-center p-4 min-h-[200px]">
                    <Loader />
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="mb-8 px-4">
                <div className="flex justify-center items-center p-4 min-h-[200px]">
                    <ErrorMessage message={error} />
                </div>
            </section>
        );
    }

    if (topPicks.length === 0) {
        return (
            <section className="mb-8 px-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center mb-6">
                    <h2 className="text-xl sm:text-2xl font-heading font-bold text-blue-900">Top Picks for You</h2>
                    <Link to="/opportunities" className="text-blue-400 font-semibold hover:underline text-base sm:text-lg">
                        Find More Internships &rarr;
                    </Link>
                </div>
                <p className="text-center text-gray-500">No top picks available at the moment. Explore more opportunities!</p>
            </section>
        );
    }

    return (
        <section className="mb-8 px-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center mb-6">
                <h2 className="text-xl sm:text-2xl font-heading font-bold text-blue-900">Top Picks for You</h2>
                <Link to="/opportunities" className="text-blue-400 font-semibold hover:underline text-base sm:text-lg">
                    Find More Internships &rarr;
                </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
                {topPicks.map((job) => (
                    <DashboardJobCard key={job.id} {...job} />
                ))}
            </div>
        </section>
    );
};

export default DashboardTopPicks;