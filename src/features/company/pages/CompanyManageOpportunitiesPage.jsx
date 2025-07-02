// src/pages/CompanyManageOpportunitiesPage.jsx
import React, { useState, useEffect } from 'react';
import DesktopManageOpportunitiesLayout from '../../../components/company/DesktopManageOpportunitiesLayout';
import MobileManageOpportunitiesLayout from '../../../components/company/MobileManageOpportunitiesLayout';
import { useAuth } from '../../../hooks/useAuth'; // Assuming useAuth can distinguish user types
import { opportunityService } from '../../../services'; // Import your opportunityService
import Loader from '../../../components/ui/Loader'; // Assuming you have a Loader component
import ErrorMessage from '../../../components/ui/ErrorMessage'; // Assuming you have an ErrorMessage component

const CompanyManageOpportunitiesPage = () => {
    const { user, loading: authLoading, error: authError } = useAuth(); // Assuming user object has a 'role' or 'isCompany' property
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCompanyOpportunities = async () => {
            setLoading(true);
            setError(null);

            // Ensure user is authenticated and is a company user
            if (!user || (user.role !== 'company' && !user.isCompany) || !user.id) {
                setLoading(false);
                setError(new Error("Access Denied: Only authenticated company users can view this page."));
                return;
            }

            try {
                // Call the service method to fetch opportunities for the logged-in company
                // Pass user.id as companyId
                const companyOpportunities = await opportunityService.getMyCompanyOpportunities(user.id);
                setOpportunities(companyOpportunities || []); // Ensure it's an array
            } catch (err) {
                console.error("Error fetching company opportunities:", err);
                setError(err.message || "Failed to load your opportunities.");
            } finally {
                setLoading(false);
            }
        };

        // Fetch opportunities only after auth state is resolved and user is confirmed as a company
        if (!authLoading) {
            fetchCompanyOpportunities();
        }
    }, [user, authLoading]); // Re-run when user or authLoading state changes

    if (authLoading || loading) {
        return (
            <div className="flex justify-center items-center min-h-screen text-blue-600 text-2xl font-heading">
                <Loader message="Loading Company Opportunities..." />
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

    // Optional: Render a message if no opportunities are found
    if (opportunities.length === 0) {
        return (
            <div className="bg-gray-100 min-h-screen flex flex-col md:flex-row">
                {/* Keep the sidebar and mobile header for structural consistency */}
                <div className="md:hidden">
                    {/* Assuming MobileHeader is handled outside or has a default state */}
                </div>
                {/* If you have a static sidebar for desktop, keep it here */}
                {/* <CompanyDashboardSidebar /> */}
                <div className="flex-grow p-4 md:p-8 md:ml-64 transition-all duration-300">
                    <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 w-full">
                        <h1 className="text-2xl md:text-3xl font-heading text-blue-900 mb-6 border-b pb-4">
                            Manage Your Opportunities
                        </h1>
                        <p className="text-center text-gray-500 py-10">
                            You haven't posted any opportunities yet.
                        </p>
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            {/* Desktop View */}
            <div className="hidden md:flex flex-grow">
                <DesktopManageOpportunitiesLayout opportunities={opportunities} />
            </div>

            {/* Mobile View */}
            <div className="md:hidden flex-grow flex flex-col">
                <MobileManageOpportunitiesLayout opportunities={opportunities} />
            </div>
        </div>
    );
};

export default CompanyManageOpportunitiesPage;