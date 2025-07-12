// src/components/Applications/ApplicationsPagination.jsx
import React from 'react';
// No need for './ApplicationsPagination.css' anymore

const ApplicationsPagination = ({ currentPage, totalPages, totalApplications, opportunitiesPerPage, onPageChange }) => {
  const startIndex = (currentPage - 1) * opportunitiesPerPage + 1;
  const endIndex = Math.min(startIndex + opportunitiesPerPage - 1, totalApplications);

  const pages = [];
  // Generate array of page numbers to render
  if (totalPages > 0) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mt-6">
      <div className="text-sm text-gray-700 mb-4 sm:mb-0">
        Showing {totalApplications > 0 ? `${startIndex}-${endIndex}` : '0-0'} of {totalApplications} applications
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          &laquo; Previous
        </button>
        {pages.map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-4 py-2 border border-gray-300 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
              ${page === currentPage
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next &raquo;
        </button>
      </div>
    </div>
  );
};

export default ApplicationsPagination;