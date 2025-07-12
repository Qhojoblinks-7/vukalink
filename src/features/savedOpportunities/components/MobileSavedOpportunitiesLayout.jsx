// src/features/savedOpportunities/components/MobileSavedOpportunitiesLayout.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { BookmarkIcon, MapPinIcon, CalendarIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

const MobileSavedOpportunitiesLayout = ({ savedOpportunities }) => {
  if (!savedOpportunities || savedOpportunities.length === 0) {
    return (
      <div className="flex-grow flex items-center justify-center px-4">
        <div className="text-center">
          <BookmarkIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No saved opportunities</h3>
          <p className="mt-1 text-sm text-gray-500 text-center">
            Start by saving opportunities that interest you.
          </p>
          <div className="mt-6">
            <Link
              to="/opportunities"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Browse Opportunities
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Saved Opportunities</h1>
        <p className="mt-1 text-gray-600">
          {savedOpportunities.length} saved {savedOpportunities.length === 1 ? 'opportunity' : 'opportunities'}
        </p>
      </div>

      <div className="space-y-4">
        {savedOpportunities.map((saved) => {
          const opportunity = saved.internships || saved.opportunity;
          if (!opportunity) return null;

          return (
            <div
              key={saved.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 flex-1 pr-2">
                    {opportunity.title}
                  </h3>
                  <BookmarkIcon className="h-5 w-5 text-blue-600 flex-shrink-0" />
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {opportunity.description}
                </p>

                <div className="space-y-1 mb-4">
                  {opportunity.location && (
                    <div className="flex items-center text-xs text-gray-500">
                      <MapPinIcon className="h-3 w-3 mr-1.5" />
                      {opportunity.location}
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-4">
                    {opportunity.duration_weeks && (
                      <div className="flex items-center text-xs text-gray-500">
                        <CalendarIcon className="h-3 w-3 mr-1" />
                        {opportunity.duration_weeks}w
                      </div>
                    )}
                    
                    {opportunity.is_paid !== null && (
                      <div className="flex items-center text-xs text-gray-500">
                        <CurrencyDollarIcon className="h-3 w-3 mr-1" />
                        {opportunity.is_paid ? 'Paid' : 'Unpaid'}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <span className="text-xs text-gray-500">
                    Saved {new Date(saved.saved_at).toLocaleDateString()}
                  </span>
                  <Link
                    to={`/opportunities/details/${opportunity.id}`}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MobileSavedOpportunitiesLayout;