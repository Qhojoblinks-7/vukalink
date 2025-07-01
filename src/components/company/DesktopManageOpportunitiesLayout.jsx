// src/components/company/DesktopManageOpportunitiesLayout.jsx
import React, { useState, useEffect } from 'react';
import Button from '../ui/Button'; // Ensure path is correct
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'; // For search icon
import ManageOpportunityTable from './ManageOpportunityTable';
import Pagination from '../opportunities/Pagination'; // Reusing Pagination from opportunities
import { Link } from 'react-router-dom';
import CompanyDashboardSidebar from './CompanyDashboardSidebar'; // Assuming a sidebar for company dashboard

const opportunityStatuses = ['All Statuses', 'Active', 'Draft', 'Closed']; // As per design

const DesktopManageOpportunitiesLayout = ({ opportunities }) => {
  const [activeStatusFilter, setActiveStatusFilter] = useState('All Statuses');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('Date Posted Desc'); // Default sort
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Adjust as needed

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesStatus = activeStatusFilter === 'All Statuses' || opp.status === activeStatusFilter;
    const matchesSearch = searchTerm ?
      opp.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) : true;
    return matchesStatus && matchesSearch;
  });

  const sortedOpportunities = filteredOpportunities.sort((a, b) => {
    const dateA = new Date(a.datePosted);
    const dateB = new Date(b.datePosted);

    if (sortOrder === 'Date Posted Asc') {
      return dateA - dateB;
    } else { // 'Date Posted Desc'
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
  }, [activeStatusFilter, searchTerm, sortOrder]);

  return (
    <div className="flex w-full">
      <CompanyDashboardSidebar /> {/* Company specific sidebar */}
      <div className="flex-1 container mx-auto px-4 py-8 lg:px-8">
        <div className="bg-white   p-8 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-heading font-bold text-grey-600 -900 dark:text-grey-600 -100">Manage Opportunities</h1>
            <Link to="/company/post-opportunity">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">+ Post New Opportunity</Button>
            </Link>
          </div>

          {/* Filters and Search */}
          <div className="mb-6 border-b border-gray-200 pb-4 flex items-center space-x-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-grey-600 -400" />
              <input
                type="text"
                placeholder="Search job title..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <label htmlFor="status-filter" className="text-grey-600 -600 0 dark:text-grey-600 -600 text-sm whitespace-nowrap">Status:</label>
              <select
                id="status-filter"
                className="p-2 border border-gray-300 rounded-md bg-white   text-grey-600 -700 dark:text-grey-600 -600 focus:ring-blue-600 focus:border-blue-600"
                value={activeStatusFilter}
                onChange={(e) => setActiveStatusFilter(e.target.value)}
              >
                {opportunityStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <label htmlFor="sort-by" className="text-grey-600 -600 0 dark:text-grey-600 -600 text-sm whitespace-nowrap">Sort:</label>
              <select
                id="sort-by"
                className="p-2 border border-gray-300 rounded-md bg-white   text-grey-600 -700 dark:text-grey-600 -600 focus:ring-blue-600 focus:border-blue-600"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="Date Posted Desc">Date Posted (Newest)</option>
                <option value="Date Posted Asc">Date Posted (Oldest)</option>
                {/* Add more sorting options like 'Applicants', 'Views' */}
              </select>
            </div>
          </div>

          {/* Bulk Actions */}
          <div className="flex space-x-4 mb-6">
            <Button variant="outline" className="border-gray-300 text-grey-600 -700 dark:text-grey-600 -600 hover:bg-gray-100      ">
              Export
            </Button>
            <Button className="bg-red-500 hover:bg-red-600 text-white">
              Bulk Deactivate
            </Button>
            <Button className="bg-green-500 hover:bg-green-600 text-white">
              Bulk Publish
            </Button>
          </div>

          {/* Manage Opportunity Table */}
          <ManageOpportunityTable opportunities={paginatedOpportunities} />

          {/* Pagination */}
          {sortedOpportunities.length > 0 && (
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
              <p className="text-grey-600 -600 0 dark:text-grey-600 -600 text-sm text-center mt-4">
                Showing {paginatedOpportunities.length} of {sortedOpportunities.length} opportunities
              </p>
            </div>
          )}
          {sortedOpportunities.length === 0 && (
            <p className="text-grey-600 -600 0 dark:text-grey-600 -600 text-center py-8">No opportunities found matching your criteria.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DesktopManageOpportunitiesLayout;