// src/components/applications/DesktopApplicationsLayout.jsx
import React, { useState, useEffect } from 'react';
import Button from '../ui/Button'; // Ensure path is correct
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'; // For search icon
import ApplicationTable from './ApplicationTable';
import Pagination from '../opportunities/Pagination'; // Reusing Pagination from opportunities
import { Link } from 'react-router-dom';

const statuses = ['All', 'Applied', 'Reviewed', 'Interview', 'Offer', 'Rejected']; // All possible statuses

const DesktopApplicationsLayout = ({ applications }) => {
  const [activeStatusTab, setActiveStatusTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('Date Applied Desc'); // Default sort
  const [dateAppliedFilter, setDateAppliedFilter] = useState(''); // For date picker
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // As per desktop design

  const filteredApplications = applications.filter(app => {
    const matchesStatus = activeStatusTab === 'All' || app.currentStatus === activeStatusTab;
    const matchesSearch = searchTerm ?
      (app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
       app.company.toLowerCase().includes(searchTerm.toLowerCase())) : true;
    const matchesDate = dateAppliedFilter ?
      app.dateApplied === dateAppliedFilter : true; // Simple date matching for now

    return matchesStatus && matchesSearch && matchesDate;
  });

  const sortedApplications = filteredApplications.sort((a, b) => {
    const dateA = new Date(a.dateApplied);
    const dateB = new Date(b.dateApplied);

    if (sortOrder === 'Date Applied Asc') {
      return dateA - dateB;
    } else { // 'Date Applied Desc'
      return dateB - dateA;
    }
  });

  const totalPages = Math.ceil(sortedApplications.length / itemsPerPage);
  const paginatedApplications = sortedApplications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1); // Reset page when filters/sort change
  }, [activeStatusTab, searchTerm, sortOrder, dateAppliedFilter]);


  return (
    <div className="container mx-auto px-4 py-8 lg:px-8">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-heading font-bold text-blue-900">My Applications</h1>
          <Link to="/opportunities"> {/* Link to Find Internships page */}
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">+ Find Internships</Button>
          </Link>
        </div>

        {/* Status Tabs and Filters */}
        <div className="mb-6 border-b border-gray-200 pb-4">
          <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
            {statuses.map(status => (
              <button
                key={status}
                onClick={() => setActiveStatusTab(status)}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap
                  ${activeStatusTab === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100     text-grey-600 -900 hover:bg-gray-200'
                  }`}
              >
                {status}
              </button>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-grey-600 -400" />
              <input
                type="text"
                placeholder="Search by job or company"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <label htmlFor="sort-by" className="text-grey-600 -600 0 text-sm whitespace-nowrap">Sort by:</label>
              <select
                id="sort-by"
                className="p-2 border border-gray-300 rounded-md bg-white text-grey-600 -900 focus:ring-blue-600 focus:border-blue-600"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="Date Applied Desc">Date Applied (Newest)</option>
                <option value="Date Applied Asc">Date Applied (Oldest)</option>
                {/* Add more sorting options like 'Status' */}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <label htmlFor="date-applied" className="text-grey-600 -600 0 text-sm whitespace-nowrap">Date Applied:</label>
              <input
                type="date"
                id="date-applied"
                className="p-2 border border-gray-300 rounded-md bg-white text-grey-600 -900 focus:ring-blue-600 focus:border-blue-600"
                value={dateAppliedFilter}
                onChange={(e) => setDateAppliedFilter(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        <div className="flex space-x-4 mb-6">
          <Button variant="outline" className="border-gray-300 text-grey-600 -900 hover:bg-gray-100    ">
            Bulk Withdraw
          </Button>
          <Button variant="outline" className="border-gray-300 text-grey-600 -900 hover:bg-gray-100    ">
            Export Data
          </Button>
        </div>

        {/* Application Table */}
        <ApplicationTable applications={paginatedApplications} />

        {/* Pagination */}
        {sortedApplications.length > 0 && (
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
            <p className="text-grey-600 -600 0 text-sm text-center mt-4">
              Showing {paginatedApplications.length} of {sortedApplications.length} applications
            </p>
          </div>
        )}
        {sortedApplications.length === 0 && (
          <p className="text-grey-600 -600 0 text-center py-8">No applications found matching your criteria.</p>
        )}
      </div>
    </div>
  );
};

export default DesktopApplicationsLayout;