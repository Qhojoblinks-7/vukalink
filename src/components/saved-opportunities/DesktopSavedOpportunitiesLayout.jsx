// src/components/saved-opportunities/DesktopSavedOpportunitiesLayout.jsx
import React, { useState, useEffect } from 'react';
import Button from '../ui/Button'; // Ensure path is correct
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'; // For search icon
import SavedOpportunityTable from './SavedOpportunityTable';
import Pagination from '../opportunities/Pagination'; // Reusing Pagination
import {Link} from 'react-router-dom';

const statuses = ['All', 'Active', 'Expiring Soon', 'Expired']; // Simplified statuses for saved opportunities

const DesktopSavedOpportunitiesLayout = ({ savedOpportunities }) => {
  const [activeStatusTab, setActiveStatusTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('Date Saved Desc'); // Default sort
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // As per desktop design

  const now = new Date();

  const filteredOpportunities = savedOpportunities.filter(opp => {
    const deadlineDate = new Date(opp.applicationDeadline);
    const isExpired = deadlineDate < now;
    const daysLeft = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const isExpiringSoon = daysLeft > 0 && daysLeft <= 7; // Within 7 days

    const matchesStatus = () => {
      if (activeStatusTab === 'All') return true;
      if (activeStatusTab === 'Expired') return isExpired;
      if (activeStatusTab === 'Expiring Soon') return isExpiringSoon && !isExpired;
      if (activeStatusTab === 'Active') return !isExpired && !isExpiringSoon;
      return false;
    };

    const matchesSearch = searchTerm ?
      (opp.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
       opp.company.toLowerCase().includes(searchTerm.toLowerCase())) : true;

    return matchesStatus() && matchesSearch;
  });

  const sortedOpportunities = filteredOpportunities.sort((a, b) => {
    const dateA = new Date(a.dateSaved);
    const dateB = new Date(b.dateSaved);

    if (sortOrder === 'Date Saved Asc') {
      return dateA - dateB;
    } else { // 'Date Saved Desc'
      return dateB - dateA;
    }
  });

  const totalPages = Math.ceil(sortedOpportunities.length / itemsPerPage);
  const paginatedOpportunities = sortedOpportunities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1); // Reset page when filters/sort change
  }, [activeStatusTab, searchTerm, sortOrder]);


  return (
    <div className="container mx-auto px-4 py-8 lg:px-8">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-heading font-bold text-blue-900">Saved Opportunities</h1>
          <Link to="/opportunities">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">Find Internships</Button>
          </Link>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 border-b border-gray-200 pb-4">
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-grey-600 -400" />
              <input
                type="text"
                placeholder="Search by job title or company..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <label htmlFor="status-filter" className="text-grey-600 -600 0 text-sm whitespace-nowrap">Status:</label>
              <select
                id="status-filter"
                className="p-2 border border-gray-300 rounded-md bg-white text-grey-600 -900 focus:ring-blue-600 focus:border-blue-600"
                value={activeStatusTab}
                onChange={(e) => setActiveStatusTab(e.target.value)}
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <label htmlFor="sort-by" className="text-grey-600 -600 0 text-sm whitespace-nowrap">Sort by:</label>
              <select
                id="sort-by"
                className="p-2 border border-gray-300 rounded-md bg-white text-grey-600 -900 focus:ring-blue-600 focus:border-blue-600"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="Date Saved Desc">Date Saved (Newest)</option>
                <option value="Date Saved Asc">Date Saved (Oldest)</option>
                {/* Add more sorting options like 'Application Deadline' */}
              </select>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        <div className="flex space-x-4 mb-6">
          <Button className="bg-green-500 hover:bg-green-600 text-white">
            Apply Selected
          </Button>
          <Button className="bg-red-500 hover:bg-red-600 text-white">
            Remove Selected
          </Button>
        </div>

        {/* Saved Opportunity Table */}
        <SavedOpportunityTable savedOpportunities={paginatedOpportunities} />

        {/* Pagination */}
        {sortedOpportunities.length > 0 && (
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
            <p className="text-grey-600 -600 0 text-sm text-center mt-4">
              Showing {paginatedOpportunities.length} of {sortedOpportunities.length} opportunities
            </p>
          </div>
        )}
        {sortedOpportunities.length === 0 && (
          <p className="text-grey-600 -600 0 text-center py-8">No saved opportunities found matching your criteria.</p>
        )}
      </div>
    </div>
  );
};

export default DesktopSavedOpportunitiesLayout;