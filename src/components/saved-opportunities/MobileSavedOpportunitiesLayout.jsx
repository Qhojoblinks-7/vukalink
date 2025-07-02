// src/components/saved-opportunities/MobileSavedOpportunitiesLayout.jsx
import React, { useState } from 'react';
import MobileHeader from '../../features/dashboard/MobileHeader'; // Reusing mobile header
import MobileBottomNav from '../../features/dashboard/MobileBottomNav'; // Reusing mobile bottom nav
import MobileSavedOpportunityCard from './MobileSavedOpportunityCard';
import { ArrowLeftIcon } from '@heroicons/react/24/outline'; // For back icon in header
import Button from '../ui/Button'; // Ensure path is correct
import { useNavigate } from 'react-router-dom';

const statuses = ['All', 'New', 'Expiring Soon', 'Expired']; // As per mobile design

const MobileSavedOpportunitiesLayout = ({ savedOpportunities }) => {
  const navigate = useNavigate();
  const [activeStatusTab, setActiveStatusTab] = useState('All');
  const [sortOrder, setSortOrder] = useState('Date Saved Desc'); // Default sort for mobile
  const [displayCount, setDisplayCount] = useState(3); // Show 3 items initially for mobile

  const now = new Date();

  const filteredOpportunities = savedOpportunities.filter(opp => {
    const deadlineDate = new Date(opp.applicationDeadline);
    const isExpired = deadlineDate < now;
    const daysLeft = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const isExpiringSoon = daysLeft > 0 && daysLeft <= 7;

    const matchesStatus = () => {
      if (activeStatusTab === 'All') return true;
      if (activeStatusTab === 'Expired') return isExpired;
      if (activeStatusTab === 'Expiring Soon') return isExpiringSoon && !isExpired;
      if (activeStatusTab === 'New') {
        // Define 'New' based on a recent save date, e.g., within the last 7 days
        const savedDate = new Date(opp.dateSaved);
        const diffDaysSaved = Math.ceil((now.getTime() - savedDate.getTime()) / (1000 * 60 * 60 * 24));
        return diffDaysSaved <= 7;
      }
      return false;
    };

    return matchesStatus();
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

  const displayedOpportunities = sortedOpportunities.slice(0, displayCount);

  const handleLoadMore = () => {
    setDisplayCount(prevCount => prevCount + 3); // Load 3 more items on mobile
  };

  return (
    <div className="flex flex-col h-full bg-gray-100    ">
      {/* Custom Mobile Header for Saved Opportunities */}
      <div className="bg-blue-900   py-4 px-4 flex justify-between items-center shadow-md">
        <button onClick={() => navigate(-1)} className="text-white hover:text-blue-400">
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
        <span className="text-white text-lg font-semibold">Saved Opportunities</span>
        <div className="flex items-center space-x-4">
          {/* Notifications icon, re-using from MobileHeader if applicable */}
          {/* <BellIcon className="h-6 w-6 text-white cursor-pointer hover:text-blue-600" /> */}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-20"> {/* pb-20 for bottom nav */}
        {/* Mobile Status Tabs and Sort By */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2 overflow-x-auto pb-2 flex-grow">
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
          <select
            className="p-2 border border-gray-300 rounded-md bg-white text-grey-600 -900 focus:ring-blue-600 focus:border-blue-600 text-sm ml-2"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="Date Saved Desc">Sort By</option> {/* Placeholder text */}
            <option value="Date Saved Desc">Newest</option>
            <option value="Date Saved Asc">Oldest</option>
            {/* Add more relevant sort options */}
          </select>
        </div>


        {/* Mobile Saved Opportunity Cards */}
        <div className="grid grid-cols-1 gap-4">
          {displayedOpportunities.length > 0 ? (
            displayedOpportunities.map((opportunity) => (
              <MobileSavedOpportunityCard key={opportunity.id} opportunity={opportunity} />
            ))
          ) : (
            <p className="text-grey-600 -600 0 text-center py-8">No saved opportunities found matching your criteria.</p>
          )}
        </div>

        {filteredOpportunities.length > displayCount && (
          <Button
            onClick={handleLoadMore}
            className="w-full bg-blue-900   hover:bg-blue-700 text-white mt-6"
          >
            Load More
          </Button>
        )}
      </div>
      <MobileBottomNav /> {/* Reusing the mobile bottom navigation */}
    </div>
  );
};

export default MobileSavedOpportunitiesLayout;