// src/features/savedOpportunities/pages/SavedOpportunitiesPage.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DesktopSavedOpportunitiesLayout from '../components/DesktopSavedOpportunitiesLayout'; // Adjusted path
import MobileSavedOpportunitiesLayout from '../components/MobileSavedOpportunitiesLayout'; // Adjusted path
import { fetchSavedOpportunities } from '../savedOpportunitiesSlice';
import useIsMobile from '../../../hooks/useIsMobile'; // Correct path to hooks

const SavedOpportunitiesPage = () => {
  const dispatch = useDispatch();
  const { savedOpportunities, status, error } = useSelector((state) => state.savedOpportunities);
  const { isAuthenticated, user, loading: authLoading } = useSelector((state) => state.auth); // Get auth state from Redux
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      dispatch(fetchSavedOpportunities());
    }
  }, [dispatch, authLoading, isAuthenticated]);

  if (authLoading || status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen text-blue-600 text-2xl font-heading">
        Loading Saved Opportunities...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600 text-xl font-body p-4">
        Error loading saved opportunities: {error}
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600 text-xl font-body p-4">
        Please log in to view your saved opportunities.
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      {/* Desktop View */}
      <div className="hidden md:flex flex-grow bg-white">
        <DesktopSavedOpportunitiesLayout savedOpportunities={savedOpportunities} />
      </div>

      {/* Mobile View */}
      <div className="md:hidden flex-grow flex flex-col bg-white">
        <MobileSavedOpportunitiesLayout savedOpportunities={savedOpportunities} />
      </div>
    </div>
  );
};

export default SavedOpportunitiesPage;