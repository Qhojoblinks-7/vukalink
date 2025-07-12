// src/components/Applications/ApplicationFilters.jsx
import React, { useState, useEffect } from 'react';
// No need for './ApplicationFilters.css' anymore

const ApplicationFilters = ({ currentFilters, onFilterChange }) => {
  const [status, setStatus] = useState(currentFilters.status || 'All');
  const [sortBy, setSortBy] = useState(currentFilters.sortBy || 'Date Applied');
  const [searchTerm, setSearchTerm] = useState(currentFilters.searchTerm || '');

  useEffect(() => {
    setStatus(currentFilters.status || 'All');
    setSortBy(currentFilters.sortBy || 'Date Applied');
    setSearchTerm(currentFilters.searchTerm || '');
  }, [currentFilters]);

  const handleFilterApply = (newValues) => {
    onFilterChange({ ...currentFilters, ...newValues });
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    handleFilterApply({ status: newStatus });
  };

  const handleSortByChange = (e) => {
    const newSortBy = e.target.value;
    setSortBy(newSortBy);
    handleFilterApply({ sortBy: newSortBy });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleFilterApply({ searchTerm: searchTerm });
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    handleFilterApply({ searchTerm: '' });
  };

  return (
    <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
      {/* Status Filter */}
      <div className="flex items-center space-x-2">
        <label htmlFor="status-filter" className="text-gray-700 font-medium whitespace-nowrap">Status:</label>
        <select
          id="status-filter"
          value={status}
          onChange={handleStatusChange}
          className="block w-full sm:w-auto px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="All">All</option>
          <option value="Applied">Applied</option>
          <option value="Interview">Interview</option>
          <option value="Reviewed">Reviewed</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
          <option value="Withdrawn">Withdrawn</option>
        </select>
      </div>

      {/* Sort By Filter */}
      <div className="flex items-center space-x-2">
        <label htmlFor="sort-by" className="text-gray-700 font-medium whitespace-nowrap">Sort by:</label>
        <select
          id="sort-by"
          value={sortBy}
          onChange={handleSortByChange}
          className="block w-full sm:w-auto px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="Date Applied">Date Applied</option>
          <option value="Company Name">Company Name</option>
          <option value="Job Title">Job Title</option>
          {/* Add more sorting options as needed */}
        </select>
      </div>

      {/* Search Bar */}
      <form className="relative flex items-center w-full sm:max-w-xs" onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="Search by job or company"
          value={searchTerm}
          onChange={handleSearchChange}
          className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        {searchTerm && (
          <button
            type="button"
            className="absolute right-8 text-gray-500 hover:text-gray-700 focus:outline-none"
            onClick={handleClearSearch}
          >
            &times;
          </button>
        )}
        <button
          type="submit"
          className="absolute right-0 flex items-center justify-center w-8 h-full text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <i className="fas fa-search"></i>
        </button>
      </form>
    </div>
  );
};

export default ApplicationFilters;