// src/pages/MyApplicationsPage.jsx
import React, { useState, useEffect } from 'react';
import DesktopApplicationsLayout from '../components/applications/DesktopApplicationsLayout';
import MobileApplicationsLayout from '../components/applications/MobileApplicationsLayout';
import { useAuth } from '../hooks/useAuth';

const MyApplicationsPage = () => {
  const { user, loading: authLoading, error: authError } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dummy application data
  const dummyApplications = [
    {
      id: 'app_1',
      jobTitle: 'Marketing Intern',
      company: 'Orange Media',
      companyLogo: '/images/orange_media_logo.png', // Placeholder
      dateApplied: '2024-05-24', // YYYY-MM-DD
      currentStatus: 'Applied',
      lastStatusUpdate: '2024-05-25',
    },
    {
      id: 'app_2',
      jobTitle: 'Software Engineering Intern',
      company: 'BlueTech Solutions',
      companyLogo: '/images/bluetech_logo.png', // Placeholder
      dateApplied: '2024-05-21',
      currentStatus: 'Interview',
      lastStatusUpdate: '2024-05-22',
    },
    {
      id: 'app_3',
      jobTitle: 'Graphic Design Intern',
      company: 'Creative Pulse',
      companyLogo: '/images/creative_pulse_logo.png', // Placeholder
      dateApplied: '2024-05-19',
      currentStatus: 'Reviewed',
      lastStatusUpdate: '2024-05-20',
    },
    {
      id: 'app_4',
      jobTitle: 'Business Analyst Intern',
      company: 'Insight Partners',
      companyLogo: '/images/insight_partners_logo.png', // Placeholder
      dateApplied: '2024-05-16',
      currentStatus: 'Offer',
      lastStatusUpdate: '2024-05-16',
    },
    {
      id: 'app_5',
      jobTitle: 'Finance Intern',
      company: 'FinEdge Group',
      companyLogo: '/images/finedge_logo.png', // Placeholder
      dateApplied: '2024-05-10',
      currentStatus: 'Rejected',
      lastStatusUpdate: '2024-05-15',
    },
    {
      id: 'app_6',
      jobTitle: 'HR Intern',
      company: 'PeopleLink Co.',
      companyLogo: '/images/peoplelink_logo.png', // Placeholder
      dateApplied: '2024-05-05',
      currentStatus: 'Applied',
      lastStatusUpdate: '2024-05-06',
    },
    {
      id: 'app_7',
      jobTitle: 'Data Science Intern',
      company: 'AI Solutions Inc.',
      companyLogo: '/images/ai_solutions_logo.png', // Placeholder
      dateApplied: '2024-05-01',
      currentStatus: 'Reviewed',
      lastStatusUpdate: '2024-05-03',
    },
    {
      id: 'app_8',
      jobTitle: 'UX/UI Intern',
      company: 'DesignFlow Studio',
      companyLogo: '/images/designflow_logo.png', // Placeholder
      dateApplied: '2024-04-28',
      currentStatus: 'Interview',
      lastStatusUpdate: '2024-04-30',
    },
    {
      id: 'app_9',
      jobTitle: 'Legal Intern',
      company: 'Justice League Chambers',
      companyLogo: '/images/justice_league_logo.png', // Placeholder
      dateApplied: '2024-04-25',
      currentStatus: 'Applied',
      lastStatusUpdate: '2024-04-26',
    },
    {
      id: 'app_10',
      jobTitle: 'Research Intern',
      company: 'Knowledge Hub',
      companyLogo: '/images/knowledge_hub_logo.png', // Placeholder
      dateApplied: '2024-04-20',
      currentStatus: 'Reviewed',
      lastStatusUpdate: '2024-04-21',
    },
    {
      id: 'app_11',
      jobTitle: 'IT Support Intern',
      company: 'TechServe Ghana',
      companyLogo: '/images/techserve_logo.png', // Placeholder
      dateApplied: '2024-04-15',
      currentStatus: 'Rejected',
      lastStatusUpdate: '2024-04-17',
    },
    {
      id: 'app_12',
      jobTitle: 'Content Creator Intern',
      company: 'StoryCraft Agency',
      companyLogo: '/images/storycraft_logo.png', // Placeholder
      dateApplied: '2024-04-10',
      currentStatus: 'Offer',
      lastStatusUpdate: '2024-04-12',
    },
  ];


  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      setError(null);
      try {
        // Simulate API call
        setTimeout(() => {
          setApplications(dummyApplications);
          setLoading(false);
        }, 500); // Simulate network delay
      } catch (err) {
        console.error("Error fetching applications:", err);
        setError(err);
        setLoading(false);
      }
    };

    if (!authLoading && user) { // Only fetch if authenticated
      fetchApplications();
    } else if (!authLoading && !user) {
      // User is not logged in, no need to load applications
      setLoading(false);
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-vuka-blue text-2xl font-heading">
        Loading My Applications...
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
        Error loading applications: {error.message}
      </div>
    );
  }

  return (
    <div className="bg-vuka-grey-light min-h-screen flex flex-col">
      {/* Desktop View */}
      <div className="hidden md:flex flex-grow">
        <DesktopApplicationsLayout applications={applications} />
      </div>

      {/* Mobile View */}
      <div className="md:hidden flex-grow flex flex-col">
        <MobileApplicationsLayout applications={applications} />
      </div>
    </div>
  );
};

export default MyApplicationsPage;