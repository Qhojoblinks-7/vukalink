// src/components/company/MobileManageOpportunitiesLayout.jsx
import React, { useState } from 'react';
// Assuming a generic MobileHeader can be used, or create a company-specific one
import MobileHeader from '../../features/dashboard/MobileHeader'; // Adjust if a company-specific header is needed
import MobileBottomNav from '../../features/dashboard/MobileBottomNav'; // Reusing mobile bottom nav, will need company-specific icons/routes
import MobileManageOpportunityCard from './MobileManageOpportunityCard';
import Button from '../ui/Button';
import { PlusIcon } from '@heroicons/react/24/outline'; // For new opportunity button
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, BellIcon } from '@heroicons/react/24/outline'; // For back and notification icons

const opportunityStatuses = ['All', 'Active', 'Draft', 'Closed', 'Sort By: Date']; // Simplified for mobile tabs

const MobileManageOpportunitiesLayout = ({ opportunities }) => {
  const navigate = useNavigate();
  const [activeStatusTab, setActiveStatusTab] = useState('All');
  const [sortOrder, setSortOrder] = useState('Date Posted Desc');
  const [displayCount, setDisplayCount] = useState(3);

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesStatus = activeStatusTab === 'All' || opp.status === activeStatusTab;
    // For 'Sort By: Date', it's a display/sort option, not a filter itself.
    return matchesStatus;
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

  const displayedOpportunities = sortedOpportunities.slice(0, displayCount);

  const handleLoadMore = () => {
    setDisplayCount(prevCount => prevCount + 3);
  };

  return (
    <div className="flex flex-col h-full bg-gray-100    ">
      {/* Custom Mobile Header for My Opportunities (Company Side) */}
      <div className="bg-blue-900   py-4 px-4 flex justify-between items-center shadow-md">
        <button onClick={() => navigate(-1)} className="text-white hover:text-blue-600">
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
        <span className="text-white text-lg font-semibold">My Opportunities</span>
        <div className="flex items-center space-x-4">
          <BellIcon className="h-6 w-6 text-white cursor-pointer hover:text-blue-600" />
          <Link to="/company/post-opportunity"> {/* Link to post new opportunity */}
            <PlusIcon className="h-6 w-6 text-vuka-orange cursor-pointer hover:text-vuka-orange-dark" />
          </Link>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-20"> {/* pb-20 for bottom nav */}
        {/* Mobile Status Tabs and Sort By */}
        <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
            {opportunityStatuses.map(status => (
              <button
                key={status}
                onClick={() => {
                  if (status.includes('Sort By')) {
                    // Handle sort by action, e.g., toggle sort order or open a modal
                    setSortOrder(prev => prev === 'Date Posted Desc' ? 'Date Posted Asc' : 'Date Posted Desc');
                  } else {
                    setActiveStatusTab(status);
                  }
                }}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap
                  ${activeStatusTab === status
                    ? 'bg-blue-600   text-white'
                    : 'bg-gray-100     ttext-grey-600 -900 hover:bg-gray-200'
                  }`}
              >
                {status}
              </button>
            ))}
        </div>

        {/* Mobile Opportunity Cards */}
        <div className="grid grid-cols-1 gap-4">
          {displayedOpportunities.length > 0 ? (
            displayedOpportunities.map((opportunity) => (
              <MobileManageOpportunityCard key={opportunity.id} opportunity={opportunity} />
            ))
          ) : (
            <p className="text-grey-600 -600 0 text-center py-8">No opportunities found matching your criteria.</p>
          )}
        </div>

        {filteredOpportunities.length > displayCount && (
          <Button
            onClick={handleLoadMore}
            className="w-full bg-blue-900   hover:bg-blue-900  -light text-white mt-6"
          >
            Load More
          </Button>
        )}
      </div>
      {/* Assuming a company-specific MobileBottomNav */}
      <MobileBottomNav /> {/* Reusing the mobile bottom navigation for now */}
    </div>
  );
};

export default MobileManageOpportunitiesLayout;