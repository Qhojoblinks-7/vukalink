// src/pages/SavedOpportunitiesPage.jsx
import React, { useState, useEffect } from 'react';
import DesktopSavedOpportunitiesLayout from '../components/saved-opportunities/DesktopSavedOpportunitiesLayout';
import MobileSavedOpportunitiesLayout from '../components/saved-opportunities/MobileSavedOpportunitiesLayout';
import { useAuth } from '../hooks/useAuth';

const SavedOpportunitiesPage = () => {
  const { user, loading: authLoading, error: authError } = useAuth();
  const [savedOpportunities, setSavedOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dummy saved opportunities data
  const dummySavedOpportunities = [
    {
      id: 'saved_1',
      jobTitle: 'UX Design Intern',
      company: 'InnovaTech',
      companyLogo: '/images/innovatech_logo.png', // Placeholder
      location: 'Nairobi, Kenya',
      applicationDeadline: '2025-07-01T23:59:59', // Expires soon
      dateSaved: '2025-05-21',
      duration: '3 months',
      skills: ['Figma', 'UI/UX', 'Teamwork'],
      type: 'Internship',
      stipend: 'Unpaid',
    },
    {
      id: 'saved_2',
      jobTitle: 'Software Engineer Intern',
      company: 'BrightMind',
      companyLogo: '/images/brightmind_logo.png', // Placeholder
      location: 'Kampala, Uganda',
      applicationDeadline: '2025-07-05T23:59:59', // Expires soon
      dateSaved: '2025-05-19',
      duration: '6 months',
      skills: ['JavaScript', 'React'],
      type: 'Internship',
      stipend: 'Paid',
    },
    {
      id: 'saved_3',
      jobTitle: 'Marketing Assistant Intern',
      company: 'FutureLeap',
      companyLogo: '/images/futureleap_logo.png', // Placeholder
      location: 'Accra, Ghana',
      applicationDeadline: '2024-06-20T23:59:59', // Expired!
      dateSaved: '2025-05-17',
      duration: '3 months',
      skills: ['Social Media', 'Content Creation'],
      type: 'Internship',
      stipend: 'Unpaid',
    },
    {
      id: 'saved_4',
      jobTitle: 'Data Analyst Intern',
      company: 'Insight Analytics',
      companyLogo: '/images/insight_analytics_logo.png', // Placeholder
      location: 'Lagos, Nigeria',
      applicationDeadline: '2025-08-15T23:59:59',
      dateSaved: '2025-05-10',
      duration: '6 months',
      skills: ['SQL', 'Python', 'Excel'],
      type: 'Internship',
      stipend: 'Paid',
    },
    {
      id: 'saved_5',
      jobTitle: 'Financial Planning Intern',
      company: 'Capital Growth',
      companyLogo: '/images/capital_growth_logo.png', // Placeholder
      location: 'Abidjan, Ivory Coast',
      applicationDeadline: '2025-09-01T23:59:59',
      dateSaved: '2025-05-01',
      duration: '4 months',
      skills: ['Finance', 'Analysis'],
      type: 'Internship',
      stipend: 'Paid',
    },
    // Add more dummy data as needed
  ];

  useEffect(() => {
    const fetchSavedOpportunities = async () => {
      setLoading(true);
      setError(null);
      try {
        // Simulate API call
        setTimeout(() => {
          setSavedOpportunities(dummySavedOpportunities);
          setLoading(false);
        }, 500); // Simulate network delay
      } catch (err) {
        console.error("Error fetching saved opportunities:", err);
        setError(err);
        setLoading(false);
      }
    };

    if (!authLoading && user) { // Only fetch if authenticated
      fetchSavedOpportunities();
    } else if (!authLoading && !user) {
      // User is not logged in, no need to load saved opportunities
      setLoading(false);
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-vuka-blue text-2xl font-heading">
        Loading Saved Opportunities...
      </div>
    );
  }

  if (authError) {
    return (
      <div className="flex justify-center items-center min-h-screen text-vuka-danger text-xl font-body p-4">
        Authentication error: {authError.message}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-vuka-danger text-xl font-body p-4">
        Error loading saved opportunities: {error.message}
      </div>
    );
  }

  return (
    <div className="bg-vuka-grey-light min-h-screen flex flex-col">
      {/* Desktop View */}
      <div className="hidden md:flex flex-grow">
        <DesktopSavedOpportunitiesLayout savedOpportunities={savedOpportunities} />
      </div>

      {/* Mobile View */}
      <div className="md:hidden flex-grow flex flex-col">
        <MobileSavedOpportunitiesLayout savedOpportunities={savedOpportunities} />
      </div>
    </div>
  );
};

export default SavedOpportunitiesPage;