// src/pages/DashboardPage.jsx
import React from 'react';
import { useAuth } from '../../../hooks/useAuth'; // Assuming your useAuth hook is here
import DashboardSidebar from '../DashboardSidebar';
import DashboardMainContent from '../DashboardMainContent';
import DashboardMobileView from '../DashboardMobileView'; // New component for mobile specific layout
import Loader from '../../../components/ui/Loader'; // Assuming you have a Loader component
import ErrorMessage from '../../../components/ui/ErrorMessage'; // Assuming you have an ErrorMessage component

const DashboardPage = () => {
  const { user, loading, error } = useAuth(); // Assuming useAuth provides loading and error states

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ErrorMessage message={error.message || "Failed to load user data."} />
      </div>
    );
  }

  if (!user) {
    // This case should theoretically be handled by PrivateRoute in App.jsx,
    // but it's a good fallback.
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ErrorMessage message="You must be logged in to view the dashboard." />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-grey-100  ">
      {/* Desktop View: Sidebar and Main Content */}
      <div className="hidden md:flex md:w-64 lg:w-72 bg-white   shadow-lg z-10">
        <DashboardSidebar user={user} />
      </div>
      <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-white  ">
        <DashboardMainContent user={user} />
      </div>

      {/* Mobile View: Renders a completely different layout for small screens */}
      <div className="md:hidden flex-1 flex flex-col bg-white  ">
        <DashboardMobileView user={user} />
      </div>
    </div>
  );
};

export default DashboardPage;