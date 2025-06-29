// src/components/opportunities/OpportunityList.jsx
import React from 'react';
import OpportunityCard from '../shared/OpportunityCard'; // Using the shared card
import Pagination from './Pagination'; // Pagination component

const OpportunityList = ({
  opportunities,
  totalOpportunities,
  sortOrder,
  setSortOrder,
  onBookmarkToggle,
  currentPage,
  totalPages,
  onPageChange
}) => {
  return (
    <div className="bg-vuka-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-vuka-strong">Showing {totalOpportunities} opportunities</h2>
        <div className="flex items-center space-x-2">
          <label htmlFor="sort-by" className="text-vuka-medium-grey text-sm">Sort by:</label>
          <select
            id="sort-by"
            className="p-2 border border-gray-300 rounded-md bg-white text-vuka-text focus:ring-vuka-blue focus:border-vuka-blue"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="Newest">Newest</option>
            <option value="Oldest">Oldest</option>
            <option value="A-Z">A-Z</option>
            {/* Add more sorting options */}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {opportunities.length > 0 ? (
          opportunities.map((opportunity) => (
            <OpportunityCard
              key={opportunity.id}
              {...opportunity}
              showApplyButton={true} // Desktop view shows apply button
              onBookmarkToggle={onBookmarkToggle}
            />
          ))
        ) : (
          <p className="text-vuka-medium-grey text-center py-8 col-span-full">No opportunities found matching your criteria.</p>
        )}
      </div>

      {totalOpportunities > 0 && ( // Only show pagination if there are opportunities
         <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
         />
      )}
    </div>
  );
};

export default OpportunityList;