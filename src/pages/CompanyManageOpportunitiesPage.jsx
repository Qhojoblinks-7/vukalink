// src/pages/CompanyManageOpportunitiesPage.jsx
import React, { useState, useEffect } from 'react';
import DesktopManageOpportunitiesLayout from '../components/company/DesktopManageOpportunitiesLayout';
import MobileManageOpportunitiesLayout from '../components/company/MobileManageOpportunitiesLayout';
import { useAuth } from '../hooks/useAuth'; // Assuming useAuth can distinguish user types

const CompanyManageOpportunitiesPage = () => {
  const { user, loading: authLoading, error: authError } = useAuth(); // Assuming user object has a 'role' or 'isCompany' property
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dummy opportunities data for a company
  const dummyCompanyOpportunities = [
    {
      id: 'comp_opp_1',
      jobTitle: 'Software Engineering Intern',
      status: 'Active',
      applicants: 23,
      views: 112,
      datePosted: '2024-05-18', // Consistent with image
      applicationDeadline: '2024-08-05', // Consistent with image
      companyId: 'company_id_1', // To filter by current company
    },
    {
      id: 'comp_opp_2',
      jobTitle: 'Marketing Associate (Summer)',
      status: 'Draft',
      applicants: 0,
      views: 45,
      datePosted: '2024-05-10', // Consistent with image
      applicationDeadline: '2024-07-01', // Consistent with image
      companyId: 'company_id_1',
    },
    {
      id: 'comp_opp_3',
      jobTitle: 'UI/UX Design Intern',
      status: 'Closed',
      applicants: 12,
      views: 88,
      datePosted: '2024-04-09', // Consistent with image
      applicationDeadline: '2024-05-01', // Consistent with image, implies expired
      companyId: 'company_id_1',
    },
    {
      id: 'comp_opp_4',
      jobTitle: 'Finance Intern',
      status: 'Active',
      applicants: 5,
      views: 60,
      datePosted: '2024-06-01',
      applicationDeadline: '2024-09-30',
      companyId: 'company_id_1',
    },
    {
      id: 'comp_opp_5',
      jobTitle: 'Data Science Internship',
      status: 'Draft',
      applicants: 0,
      views: 15,
      datePosted: '2024-06-20',
      applicationDeadline: '2024-10-15',
      companyId: 'company_id_1',
    },
    {
      id: 'comp_opp_6',
      jobTitle: 'Human Resources Intern',
      status: 'Active',
      applicants: 8,
      views: 40,
      datePosted: '2024-05-25',
      applicationDeadline: '2024-08-20',
      companyId: 'company_id_1',
    },
  ];

  useEffect(() => {
    const fetchCompanyOpportunities = async () => {
      setLoading(true);
      setError(null);
      try {
        // Simulate API call to fetch opportunities for the logged-in company
        // In a real app, you'd filter by user.companyId
        setTimeout(() => {
          setOpportunities(dummyCompanyOpportunities.filter(opp => opp.companyId === user?.companyId || 'company_id_1')); // Filter by a dummy company ID for now
          setLoading(false);
        }, 500); // Simulate network delay
      } catch (err) {
        console.error("Error fetching company opportunities:", err);
        setError(err);
        setLoading(false);
      }
    };

    // Ensure user is authenticated and is a company user before fetching
    if (!authLoading && user && (user.role === 'company' || user.isCompany)) { // Adjust condition based on your auth structure
      fetchCompanyOpportunities();
    } else if (!authLoading && (!user || (user.role !== 'company' && !user.isCompany))) {
      // User is not logged in or not a company, no need to load opportunities
      setLoading(false);
      setError(new Error("Access Denied: Only company users can view this page."));
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-vuka-blue text-2xl font-heading">
        Loading Company Opportunities...
      </div>
    );
  }

  if (authError || error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600  text-xl font-body p-4">
        {authError ? `Authentication error: ${authError.message}` : `Error: ${error.message}`}
      </div>
    );
  }

  return (
    <div className="bg-gray-100   min-h-screen flex flex-col">
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