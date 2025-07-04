// src/features/opportunities/pages/OpportunitiesPage.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOpportunities, setOpportunityFilters, setCurrentPage } from '../opportunitiesSlice';
import OpportunityCard from '../components/OpportunityCard'; // You'll create this
import OpportunityFilters from '../components/OpportunityFilters'; // You'll create this
import Pagination from '../../../components/opportunities/Pagination'; // Reusing Pagination component

const OpportunitiesPage = () => {
  const dispatch = useDispatch();
  const { opportunities, status, error, filters, pagination } = useSelector((state) => state.opportunities);

  useEffect(() => {
    // Dispatch fetchOpportunities with current filters and pagination
    dispatch(fetchOpportunities({ ...filters, page: pagination.currentPage, limit: pagination.opportunitiesPerPage }));
  }, [dispatch, filters, pagination.currentPage, pagination.opportunitiesPerPage]);

  const handleFilterChange = (newFilters) => {
    dispatch(setOpportunityFilters(newFilters));
  };

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
  };

  if (status === 'loading') {
    return <div className="text-center py-10">Loading opportunities...</div>;
  }

  if (status === 'failed') {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-heading text-vuka-strong dark:text-white mb-6">Explore Opportunities</h1>

        <OpportunityFilters currentFilters={filters} onFilterChange={handleFilterChange} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {opportunities.length > 0 ? (
            opportunities.map((opportunity) => (
              <OpportunityCard key={opportunity.id} opportunity={opportunity} />
            ))
          ) : (
            <div className="md:col-span-3 text-center py-10 text-gray-500">
              No opportunities found matching your criteria.
            </div>
          )}
        </div>

        {pagination.totalPages > 1 && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default OpportunitiesPage;