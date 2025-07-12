// src/pages/MyApplicationsPage.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchStudentApplications,
  setOpportunityFilters,
  setCurrentPage,
  updateApplicationStatus,
  bulkUpdateApplicationStatus
} from '../../opportunities/opportunitiesSlice';
import ApplicationFilters from '../components/ApplicationFilters';
import ApplicationsTable from '../components/ApplicationsTable';
import ApplicationsPagination from '../components/ApplicationsPagination';
import { useNavigate } from 'react-router-dom';

// Accept showToast prop
const MyApplicationsPage = ({ showToast }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUserId = useSelector(state => state.auth.user?.id);

  const [selectedApplications, setSelectedApplications] = useState([]);

  const {
    opportunities: allApplications,
    status,
    error,
    filters,
    pagination
  } = useSelector((state) => state.opportunities);

  const { currentPage, opportunitiesPerPage } = pagination;
  const { status: filterStatus, sortBy, searchTerm } = filters;

  const displayedApplications = useMemo(() => {
    let filtered = allApplications;

    if (filterStatus && filterStatus !== 'All') {
      filtered = filtered.filter(app => app.status === filterStatus);
    }

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(app =>
        app.opportunity?.title?.toLowerCase().includes(lowerCaseSearchTerm) ||
        app.opportunity?.company?.fullName?.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    filtered.sort((a, b) => {
      if (sortBy === 'Date Applied') {
        const dateA = new Date(a.applied_at);
        const dateB = new Date(b.applied_at);
        return dateB.getTime() - dateA.getTime();
      } else if (sortBy === 'Company Name') {
        const nameA = a.opportunity?.company?.fullName || '';
        const nameB = b.opportunity?.company?.fullName || '';
        return nameA.localeCompare(nameB);
      } else if (sortBy === 'Job Title') {
        const titleA = a.opportunity?.title || '';
        const titleB = b.opportunity?.title || '';
        return titleA.localeCompare(titleB);
      }
      return 0;
    });

    return filtered;
  }, [allApplications, filterStatus, searchTerm, sortBy]);

  const totalApplicationsCount = displayedApplications.length;
  const totalPages = Math.ceil(totalApplicationsCount / opportunitiesPerPage) || 1;

  const startIndex = (currentPage - 1) * opportunitiesPerPage;
  const endIndex = startIndex + opportunitiesPerPage;
  const paginatedApplications = displayedApplications.slice(startIndex, endIndex);

  useEffect(() => {
    if (currentUserId) {
      dispatch(fetchStudentApplications({ userId: currentUserId }));
    }
  }, [dispatch, currentUserId]);

  const handleFilterChange = (newFilters) => {
    dispatch(setOpportunityFilters(newFilters));
    dispatch(setCurrentPage(1));
  };

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
  };

  const handleWithdraw = async (applicationId) => {
    if (window.confirm("Are you sure you want to withdraw this application?")) {
      try {
        await dispatch(updateApplicationStatus({ applicationId, newStatus: 'Withdrawn' })).unwrap();
        showToast('Application withdrawn successfully!', 'success');
        setSelectedApplications([]);
        if (currentUserId) {
          dispatch(fetchStudentApplications({ userId: currentUserId })); // Re-fetch to update list
        }
      } catch (err) {
        showToast(`Failed to withdraw application: ${err}`, 'error');
        console.error("Withdrawal error:", err);
      }
    }
  };

  const handleBulkWithdraw = async () => {
    if (selectedApplications.length === 0) {
      showToast("Please select applications to withdraw.", 'error');
      return;
    }
    if (window.confirm(`Are you sure you want to withdraw ${selectedApplications.length} selected applications?`)) {
      try {
        await dispatch(bulkUpdateApplicationStatus({ applicationIds: selectedApplications, newStatus: 'Withdrawn' })).unwrap();
        showToast(`${selectedApplications.length} applications withdrawn successfully!`, 'success');
        setSelectedApplications([]);
        if (currentUserId) {
          dispatch(fetchStudentApplications({ userId: currentUserId })); // Re-fetch to update list
        }
      } catch (err) {
        showToast(`Failed to bulk withdraw applications: ${err}`, 'error');
        console.error("Bulk withdrawal error:", err);
      }
    }
  };

  const handleViewApplication = (appId) => {
    navigate(`/student/applications/details/${appId}`);
  };

  // --- UI/UX Refinements Start ---

  // Loading State
  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 dark:border-blue-400"></div>
        <p className="mt-4 text-xl font-semibold text-gray-700 dark:text-gray-300">Loading your applications...</p>
      </div>
    );
  }

  // Error State (already uses toast, just a fallback UI)
  if (status === 'failed') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <i className="fas fa-exclamation-circle text-red-500 text-5xl mb-4"></i>
        <p className="text-xl text-red-600 dark:text-red-400 font-semibold mb-4">Failed to load applications.</p>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-6">There was an error fetching your application history. Please try again.</p>
        <button
          onClick={() => {
            if (currentUserId) {
              dispatch(fetchStudentApplications({ userId: currentUserId }));
            }
          }}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
        >
          <i className="fas fa-sync-alt mr-2"></i> Retry Loading
        </button>
      </div>
    );
  }

  // Empty State (if no applications after loading)
  if (allApplications.length === 0 && status === 'succeeded') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <i className="fas fa-file-alt text-blue-500 text-6xl mb-6"></i>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">No Applications Yet</h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 text-center mb-8">
          It looks like you haven't applied for any opportunities. Start your journey!
        </p>
        <button
          className="px-8 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out text-lg font-semibold"
          onClick={() => navigate('/opportunities')}
        >
          <i className="fas fa-search mr-3"></i> Browse Opportunities
        </button>
      </div>
    );
  }

  // Main content (if applications exist)
  return (
    <div className="flex flex-col p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">My Applications</h1>
        <button
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
          onClick={() => navigate('/opportunities')}
        >
          Find Internships
        </button>
      </div>

      {/* Controls Section (Filters & Action Buttons) */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <ApplicationFilters
          currentFilters={filters}
          onFilterChange={handleFilterChange}
        />
        <div className="flex space-x-3">
          <button
            onClick={handleBulkWithdraw}
            disabled={selectedApplications.length === 0}
            className="flex items-center px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fas fa-trash-alt mr-2"></i> Bulk Withdraw
          </button>
          <button
            className="flex items-center px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
          >
            <i className="fas fa-file-export mr-2"></i> Export Data
          </button>
        </div>
      </div>

      {/* Applications Table - Pass paginated data and view handler */}
      <ApplicationsTable
        applications={paginatedApplications}
        onWithdraw={handleWithdraw}
        onView={handleViewApplication}
        selectedApplications={selectedApplications}
        setSelectedApplications={setSelectedApplications}
      />

      {/* Pagination */}
      <ApplicationsPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalApplications={totalApplicationsCount}
        opportunitiesPerPage={opportunitiesPerPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default MyApplicationsPage;