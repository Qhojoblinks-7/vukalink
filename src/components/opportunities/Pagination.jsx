// src/components/opportunities/Pagination.jsx
import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'; // Install @heroicons/react

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [...Array(totalPages).keys()].map(i => i + 1);

  return (
    <nav className="flex justify-center items-center space-x-2 mt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-md bg-gray-100     ttext-grey-600 -900 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeftIcon className="h-5 w-5" />
      </button>

      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 rounded-md font-semibold
            ${currentPage === page
              ? 'bg-blue-600   text-white'
              : 'bg-white ttext-grey-600 -900 hover:bg-grey-500     '
            }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-md bg-gray-100     ttext-grey-600 -900 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRightIcon className="h-5 w-5" />
      </button>
    </nav>
  );
};

export default Pagination;