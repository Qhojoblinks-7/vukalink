// src/components/applications/MobileApplicationsLayout.jsx
import React, { useState } from 'react';
import MobileHeader from '../dashboard/MobileHeader'; // Reusing mobile header
import MobileBottomNav from '../dashboard/MobileBottomNav'; // Reusing mobile bottom nav
import MobileApplicationCard from './MobileApplicationCard';
import Button from '../ui/Button'; // For the New button and potential filter buttons
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'; // For search icon

const MobileApplicationsLayout = ({ applications }) => {
  const [activeStatusTab, setActiveStatusTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateAppliedFilter, setDateAppliedFilter] = useState('');
  const [displayCount, setDisplayCount] = useState(3); // Show 3 items initially for mobile

  const filteredApplications = applications.filter(app => {
    const matchesStatus = activeStatusTab === 'All' || app.currentStatus === activeStatusTab;
    const matchesSearch = searchTerm ?
      (app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
       app.company.toLowerCase().includes(searchTerm.toLowerCase())) : true;
    const matchesDate = dateAppliedFilter ?
      app.dateApplied === dateAppliedFilter : true; // Simple date matching for now

    return matchesStatus && matchesSearch && matchesDate;
  });

  const displayedApplications = filteredApplications.slice(0, displayCount);

  const handleLoadMore = () => {
    setDisplayCount(prevCount => prevCount + 3); // Load 3 more items on mobile
  };

  const statusCounts = applications.reduce((acc, app) => {
    acc[app.currentStatus] = (acc[app.currentStatus] || 0) + 1;
    acc['All'] = (acc['All'] || 0) + 1; // Count for 'All' tab
    return acc;
  }, {});

  // Define the statuses array for the status tabs
  const statuses = ['All', ...Array.from(new Set(applications.map(app => app.currentStatus)))];


  return (
    <div className="flex flex-col h-full bg-gray-100    ">
      <MobileHeader /> {/* Reusing the mobile header */}

      <div className="flex-1 overflow-y-auto p-4 pb-20"> {/* pb-20 for bottom nav */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-heading font-bold text-blue-900">My Applications</h1>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 text-sm">
            + New
          </Button>
        </div>

        {/* Mobile Status Tabs */}
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
                {status} {statusCounts[status] ? `(${statusCounts[status]})` : ''}
              </button>
            ))}
        </div>

        {/* Mobile Search and Date Filters */}
        <div className="flex space-x-2 mb-4">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-grey-600 -400" />
            <input
              type="text"
              placeholder="Search by title or company"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-900 focus:border-blue-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <input
            type="date"
            className="p-2 border border-gray-300 rounded-lg bg-white text-grey-600 -900 focus:ring-blue-600 focus:border-blue-600"
            value={dateAppliedFilter}
            onChange={(e) => setDateAppliedFilter(e.target.value)}
          />
        </div>

        {/* Mobile Application Cards */}
        <div className="grid grid-cols-1 gap-4">
          {displayedApplications.length > 0 ? (
            displayedApplications.map((application) => (
              <MobileApplicationCard key={application.id} application={application} />
            ))
          ) : (
            <p className="text-grey-600 -600 0 text-center py-8">No applications found matching your criteria.</p>
          )}
        </div>

        {filteredApplications.length > displayCount && (
          <Button
            onClick={handleLoadMore}
            className="w-full bg-blue-900   hover:bg-blue-800 text-white mt-6"
          >
            Load More
          </Button>
        )}
      </div>
      <MobileBottomNav /> {/* Reusing the mobile bottom navigation */}
    </div>
  );
};

export default MobileApplicationsLayout;