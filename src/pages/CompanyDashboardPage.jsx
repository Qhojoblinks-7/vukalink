// src/pages/CompanyDashboardPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Assuming you have an auth context
import MobileHeader from '../components/dashboard/MobileHeader'; // For mobile view header
import CompanyDashboardSidebar from '../components/company/CompanyDashboardSidebar'; // The sidebar component
import {
  BriefcaseIcon, PlusCircleIcon, UserGroupIcon, ChartBarIcon, BellIcon,
  MegaphoneIcon, BuildingOfficeIcon // Icons for dashboard cards
} from '@heroicons/react/24/outline';

const CompanyDashboardPage = () => {
  const { user, loading } = useAuth(); // Get user info from auth context
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for mobile sidebar

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-vuka-blue text-2xl font-heading">
        Loading Company Dashboard...
      </div>
    );
  }

  // Ensure user is a company, though PrivateRoute should handle this
  if (!user || user.role !== 'company') {
    return (
      <div className="flex justify-center items-center min-h-screen text-vuka-danger text-xl font-body p-4">
        Access Denied: This page is for companies only.
      </div>
    );
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="bg-vuka-grey-light min-h-screen flex flex-col md:flex-row">
      {/* Mobile Header (conditionally rendered for mobile view) */}
      <div className="md:hidden">
        <MobileHeader
          title={`Welcome, ${user.companyName || 'Company'}!`}
          showBack={false}
          showBell={true}
          showProfile={true}
          onMenuClick={toggleSidebar} // Pass toggleSidebar to MobileHeader for menu icon
        />
      </div>

      {/* Company Dashboard Sidebar (desktop and mobile overlay) */}
      <CompanyDashboardSidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />

      <div className="flex-grow p-4 md:p-8 md:ml-64 transition-all duration-300"> {/* md:ml-64 to make space for sidebar */}
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 w-full">
          <h1 className="text-2xl md:text-3xl font-heading text-vuka-strong mb-6 border-b pb-4">
            Company Dashboard
          </h1>

          <p className="text-vuka-text mb-8 text-lg">
            Hello, <span className="font-semibold text-vuka-blue">{user.companyName || 'valued partner'}</span>! Here's a quick overview of your Vuka account.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Dashboard Card 1: Posted Opportunities */}
            <Link to="/company/manage-opportunities" className="block">
              <div className="bg-vuka-blue text-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center text-center transform transition-transform duration-200 hover:scale-105 hover:bg-vuka-blue-dark">
                <BriefcaseIcon className="h-16 w-16 mb-4" />
                <h2 className="text-xl font-semibold mb-2 font-heading">Manage Opportunities</h2>
                <p className="text-sm">View, edit, and manage your current listings.</p>
                {/* You might fetch a count here: <p className="text-2xl font-bold mt-2">{user.activeOpportunitiesCount || 0}</p> */}
              </div>
            </Link>

            {/* Dashboard Card 2: Post New Opportunity */}
            <Link to="/company/post-opportunity" className="block">
              <div className="bg-vuka-orange text-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center text-center transform transition-transform duration-200 hover:scale-105 hover:bg-vuka-orange-dark">
                <PlusCircleIcon className="h-16 w-16 mb-4" />
                <h2 className="text-xl font-semibold mb-2 font-heading">Post New Opportunity</h2>
                <p className="text-sm">Start a new recruitment drive.</p>
              </div>
            </Link>

            {/* Dashboard Card 3: View Applicants */}
            {/* This card might link to a page showing "All Applicants" or "Applicants Needing Review" */}
            <Link to="/company/manage-opportunities" className="block"> {/* For simplicity, linking to manage ops */}
              <div className="bg-vuka-green text-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center text-center transform transition-transform duration-200 hover:scale-105 hover:bg-vuka-green-dark">
                <UserGroupIcon className="h-16 w-16 mb-4" />
                <h2 className="text-xl font-semibold mb-2 font-heading">View All Applicants</h2>
                <p className="text-sm">Review applications for all your opportunities.</p>
                {/* You might fetch a count here: <p className="text-2xl font-bold mt-2">{user.newApplicantsCount || 0}</p> */}
              </div>
            </Link>

            {/* Dashboard Card 4: Company Profile */}
            <Link to="/profile/edit" className="block">
              <div className="bg-vuka-white text-vuka-text rounded-lg shadow-md p-6 flex flex-col items-center justify-center text-center border border-vuka-grey-light transform transition-transform duration-200 hover:scale-105 hover:shadow-lg">
                <BuildingOfficeIcon className="h-16 w-16 mb-4 text-vuka-strong" />
                <h2 className="text-xl font-semibold mb-2 font-heading">Edit Company Profile</h2>
                <p className="text-sm text-vuka-medium-grey">Update your company's public information.</p>
              </div>
            </Link>

            {/* Dashboard Card 5: Analytics & Reports (Placeholder) */}
            <div className="bg-vuka-white text-vuka-text rounded-lg shadow-md p-6 flex flex-col items-center justify-center text-center border border-vuka-grey-light">
              <ChartBarIcon className="h-16 w-16 mb-4 text-vuka-strong" />
              <h2 className="text-xl font-semibold mb-2 font-heading">Analytics & Reports</h2>
              <p className="text-sm text-vuka-medium-grey">Gain insights into your recruiting efforts. (Coming Soon!)</p>
            </div>

            {/* Dashboard Card 6: Messages */}
            <Link to="/messages" className="block">
              <div className="bg-vuka-white text-vuka-text rounded-lg shadow-md p-6 flex flex-col items-center justify-center text-center border border-vuka-grey-light transform transition-transform duration-200 hover:scale-105 hover:shadow-lg">
                <BellIcon className="h-16 w-16 mb-4 text-vuka-strong" />
                <h2 className="text-xl font-semibold mb-2 font-heading">Messages</h2>
                <p className="text-sm text-vuka-medium-grey">Communicate with students and applicants.</p>
              </div>
            </Link>

          </div> {/* End of grid */}
        </div> {/* End of main content card */}
      </div> {/* End of main content area */}
    </div>
  );
};

export default CompanyDashboardPage;