// src/features/savedOpportunities/components/DesktopSavedOpportunitiesLayout.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { BookmarkIcon, MapPinIcon, CalendarIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

const DesktopSavedOpportunitiesLayout = ({ savedOpportunities }) => {
  if (!savedOpportunities || savedOpportunities.length === 0) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <BookmarkIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No saved opportunities</h3>
          <p className="mt-1 text-sm text-gray-500">
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Saved Opportunities</h1>
        <p className="mt-2 text-gray-600">
          {savedOpportunities.length} saved {savedOpportunities.length === 1 ? 'opportunity' : 'opportunities'}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {savedOpportunities.map((saved) => {
          const opportunity = saved.internships || saved.opportunity;
          if (!opportunity) return null;

          return (
            <div
              key={saved.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {opportunity.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {opportunity.description}
                    </p>
                  </div>
                  <BookmarkIcon className="h-5 w-5 text-blue-600 ml-2 flex-shrink-0" />
                </div>

                <div className="space-y-2 mb-4">
                  {opportunity.location && (
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPinIcon className="h-4 w-4 mr-2" />
                      {opportunity.location}
                    </div>
                  )}
                  
                  {opportunity.duration_weeks && (
                    <div className="flex items-center text-sm text-gray-500">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {opportunity.duration_weeks} weeks
                    </div>
                  )}
                  
                  {opportunity.is_paid !== null && (
                    <div className="flex items-center text-sm text-gray-500">
                      <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                      {opportunity.is_paid ? 'Paid' : 'Unpaid'}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-xs text-gray-500">
                    Saved {new Date(saved.saved_at).toLocaleDateString()}
                  </span>
                  <Link
                    to={`/opportunities/details/${opportunity.id}`}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100"
                  >
                    View Details
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

export default DesktopSavedOpportunitiesLayout;