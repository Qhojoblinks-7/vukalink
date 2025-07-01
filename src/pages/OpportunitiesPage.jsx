// src/pages/OpportunitiesPage.jsx
import React, { useState } from 'react';
import DesktopOpportunitiesLayout from '../components/opportunities/DesktopOpportunitiesLayout';
import MobileOpportunitiesLayout from '../components/opportunities/MobileOpportunitiesLayout';
import { useAuth } from '../hooks/useAuth'; // Assuming useAuth is here

const OpportunitiesPage = () => {
  const { user, loading, error } = useAuth(); // Access auth context

  // Dummy opportunities data for demonstration
  const [opportunities, setOpportunities] = useState([
    {
      id: 'se_intern_1',
      title: 'Software Engineering Intern',
      company: 'BlueTech Ghana',
      location: 'Accra',
      duration: '3 Months',
      paid: true,
      description: 'Assist in backend development & collaborate on new feature design as part of an agile team.',
      skills: ['Python', 'Django', 'REST APIs', 'Teamwork'],
      isBookmarked: false,
      type: 'Full-time'
    },
    {
      id: 'marketing_att_1',
      title: 'Marketing Associate Intern',
      company: 'BrightFutures Ltd.',
      location: 'Kumasi',
      duration: '2 Months',
      paid: false,
      description: 'Support online campaigns and assist with content planning and performance analysis.',
      skills: ['Social Media', 'Content Creation', 'Analytics'],
      isBookmarked: false,
      type: 'Part-time'
    },
    {
      id: 'finance_analyst_1',
      title: 'Finance Analyst Intern',
      company: 'AlphaBank Ghana',
      location: 'Remote',
      duration: '6 Months',
      paid: true,
      description: 'Analyze financial data and prepare reports in a dynamic remote team setting.',
      skills: ['Excel', 'Data Analysis', 'Finance'],
      isBookmarked: false,
      type: 'Full-time'
    },
    {
      id: 'product_mgmt_1',
      title: 'Product Management Intern',
      company: 'Google LLC',
      location: 'Remote',
      duration: '3 Months',
      paid: true,
      description: 'Work on improving user flows for Google Search, collaborate with engineers & designers, and drive product vision.',
      skills: ['Product Management', 'Market Research'],
      isBookmarked: false,
      type: 'Full-time'
    },
    {
      id: 'swe_linkedin_1',
      title: 'Software Engineering Intern',
      company: 'Linkedin Corp',
      location: 'On-site',
      duration: '6 Months',
      paid: true,
      description: 'Build scalable backend services, contribute to LinkedIn Learning platform, and participate in agile development cycles.',
      skills: ['Java', 'Microservices', 'Agile'],
      isBookmarked: false,
      type: 'Full-time'
    },
    {
      id: 'data_anal_ms_1',
      title: 'Data Analytics Intern',
      company: 'Microsoft',
      location: 'Hybrid',
      duration: '4 Months',
      paid: false,
      description: 'Analyze real-time data, visualize results for Office360, and present actionable insights to the product team.',
      skills: ['SQL', 'Power BI', 'Statistics'],
      isBookmarked: false,
      type: 'Internship'
    }
  ]);

  const handleBookmarkToggle = (id) => {
    setOpportunities(prevOpportunities =>
      prevOpportunities.map(opp =>
        opp.id === id ? { ...opp, isBookmarked: !opp.isBookmarked } : opp
      )
    );
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading opportunities...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen flex flex-col">
      {/* Desktop View */}
      <div className="hidden md:flex flex-grow bg-white dark:bg-gray-900">
        <DesktopOpportunitiesLayout opportunities={opportunities} onBookmarkToggle={handleBookmarkToggle} />
      </div>

      {/* Mobile View */}
      <div className="md:hidden flex-grow flex flex-col bg-white dark:bg-gray-900">
        <MobileOpportunitiesLayout opportunities={opportunities} onBookmarkToggle={handleBookmarkToggle} />
      </div>
    </div>
  );
};

export default OpportunitiesPage;