// src/pages/SavedOpportunitiesPage.jsx
import React, { useState, useEffect } from 'react';
import DesktopSavedOpportunitiesLayout from '../components/saved-opportunities/DesktopSavedOpportunitiesLayout';
import MobileSavedOpportunitiesLayout from '../components/saved-opportunities/MobileSavedOpportunitiesLayout';
import { useAuth } from '../hooks/useAuth';
// Import the service functions
import { getSavedOpportunities, removeSavedOpportunity } from '../services/savedOpportunitiesService';

const SavedOpportunitiesPage = () => {
    const { user, loading: authLoading, error: authError } = useAuth();
    const [savedOpportunities, setSavedOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Dummy saved opportunities data - This is for development/testing ONLY.
    // In a production app, you'd directly use getSavedOpportunities from the service.
    const dummySavedOpportunities = [
        {
            id: 'saved_1',
            dateSaved: '2025-05-21T10:00:00Z', // Include time for more accurate date calculations
            opportunity: { // Nested opportunity object
                id: 'opp_1', // Original opportunity ID
                title: 'UX Design Intern',
                location: 'Nairobi, Kenya',
                applicationDeadline: '2025-07-01T23:59:59Z', // ISO string for consistency
                duration: '3 months',
                type: 'Internship',
                stipend: 'Unpaid',
                skills: ['Figma', 'UI/UX', 'Teamwork'],
                company: {
                    id: 'comp_1',
                    fullName: 'InnovaTech',
                    avatarUrl: '/images/innovatech_logo.png', // Placeholder for logo
                }
            }
        },
        {
            id: 'saved_2',
            dateSaved: '2025-05-19T11:30:00Z',
            opportunity: {
                id: 'opp_2',
                title: 'Software Engineer Intern',
                location: 'Kampala, Uganda',
                applicationDeadline: '2025-07-05T23:59:59Z',
                duration: '6 months',
                type: 'Internship',
                stipend: 'Paid',
                skills: ['JavaScript', 'React'],
                company: {
                    id: 'comp_2',
                    fullName: 'BrightMind',
                    avatarUrl: '/images/brightmind_logo.png',
                }
            }
        },
        {
            id: 'saved_3',
            dateSaved: '2025-05-17T09:15:00Z',
            opportunity: {
                id: 'opp_3',
                title: 'Marketing Assistant Intern',
                location: 'Accra, Ghana',
                applicationDeadline: '2024-06-20T23:59:59Z', // Expired! (This will be correctly handled by layout logic)
                duration: '3 months',
                type: 'Internship',
                stipend: 'Unpaid',
                skills: ['Social Media', 'Content Creation'],
                company: {
                    id: 'comp_3',
                    fullName: 'FutureLeap',
                    avatarUrl: '/images/futureleap_logo.png',
                }
            }
        },
        {
            id: 'saved_4',
            dateSaved: '2025-05-10T14:00:00Z',
            opportunity: {
                id: 'opp_4',
                title: 'Data Analyst Intern',
                location: 'Lagos, Nigeria',
                applicationDeadline: '2025-08-15T23:59:59Z',
                duration: '6 months',
                type: 'Internship',
                stipend: 'Paid',
                skills: ['SQL', 'Python', 'Excel'],
                company: {
                    id: 'comp_4',
                    fullName: 'Insight Analytics',
                    avatarUrl: '/images/insight_analytics_logo.png',
                }
            }
        },
        {
            id: 'saved_5',
            dateSaved: '2025-05-01T16:45:00Z',
            opportunity: {
                id: 'opp_5',
                title: 'Financial Planning Intern',
                location: 'Abidjan, Ivory Coast',
                applicationDeadline: '2025-09-01T23:59:59Z',
                duration: '4 months',
                type: 'Internship',
                stipend: 'Paid',
                skills: ['Finance', 'Analysis'],
                company: {
                    id: 'comp_5',
                    fullName: 'Capital Growth',
                    avatarUrl: '/images/capital_growth_logo.png',
                }
            }
        },
        // Add more dummy data as needed
    ];

    useEffect(() => {
        const fetchAndSetSavedOpportunities = async () => {
            setLoading(true);
            setError(null);
            try {
                // Use actual service call here for production:
                const data = await getSavedOpportunities(user.id);
                setSavedOpportunities(data);

                // For development, you can uncomment the line below and comment out the above two lines
                // to use dummy data:
                // setTimeout(() => {
                //     setSavedOpportunities(dummySavedOpportunities);
                //     setLoading(false);
                // }, 500);

                setLoading(false); // Make sure loading is set to false after actual data fetch
            } catch (err) {
                console.error("Error fetching saved opportunities:", err);
                setError(err);
                setLoading(false);
            }
        };

        if (!authLoading && user) { // Only fetch if authenticated
            fetchAndSetSavedOpportunities();
        } else if (!authLoading && !user) {
            // User is not logged in, no need to load saved opportunities
            setLoading(false);
            setSavedOpportunities([]); // Clear any previous data if user logs out
        }
    }, [user, authLoading]); // Dependency array to re-run when user or authLoading changes

    // Handler for removing a single saved opportunity
    const handleRemoveOpportunity = async (savedOpportunityId) => {
        if (!user) {
            setError(new Error('User not authenticated.'));
            return;
        }
        try {
            await removeSavedOpportunity(savedOpportunityId, user.id);
            // After successful removal, filter local state to update UI immediately
            setSavedOpportunities(prev => prev.filter(opp => opp.id !== savedOpportunityId));
        } catch (err) {
            console.error("Failed to remove saved opportunity:", err);
            setError(err); // Display error to user
        }
    };

    if (authLoading || loading) {
        return (
            <div className="flex justify-center items-center min-h-screen text-blue-600 text-2xl font-heading">
                Loading Saved Opportunities...
            </div>
        );
    }

    if (authError) {
        return (
            <div className="flex justify-center items-center min-h-screen text-red-600 text-xl font-body p-4">
                Authentication error: {authError.message}
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen text-red-600 text-xl font-body p-4">
                Error loading saved opportunities: {error.message}
            </div>
        );
    }

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            {/* Desktop View */}
            <div className="hidden md:flex flex-grow">
                <DesktopSavedOpportunitiesLayout
                    savedOpportunities={savedOpportunities}
                    onRemoveSavedOpportunity={handleRemoveOpportunity} // Pass handler
                />
            </div>

            {/* Mobile View */}
            <div className="md:hidden flex-grow flex flex-col">
                <MobileSavedOpportunitiesLayout
                    savedOpportunities={savedOpportunities}
                    onRemoveSavedOpportunity={handleRemoveOpportunity} // Pass handler
                />
            </div>
        </div>
    );
};

export default SavedOpportunitiesPage;