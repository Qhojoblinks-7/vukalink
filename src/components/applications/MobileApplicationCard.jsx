// src/components/applications/MobileApplicationCard.jsx
import React from 'react';
import Button from '../ui/Button'; // Ensure path is correct
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline'; // For icons
import { Link } from 'react-router-dom';

const MobileApplicationCard = ({ application }) => {
  const getStatusClasses = (status) => {
    switch (status) {
      case 'Applied': return 'bg-blue-100 text-blue-700';
      case 'Reviewed': return 'bg-purple-100 text-purple-700';
      case 'Interview': return 'bg-green-100 text-green-700';
      case 'Offer': return 'bg-yellow-100 text-yellow-700';
      case 'Rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100     text-grey-600 -700';
    }
  };

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const updateDate = new Date(dateString);
    const diffTime = Math.abs(now - updateDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1d ago';
    if (diffDays < 7) return `${diffDays}d ago`;
    const diffWeeks = Math.floor(diffDays / 7);
    if (diffWeeks === 1) return '1w ago';
    if (diffWeeks < 4) return `${diffWeeks}w ago`;
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths === 1) return '1mo ago';
    return `${diffMonths}mo ago`;
  };


  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex flex-col">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-blue-900">{application.jobTitle}</h3>
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClasses(application.currentStatus)}`}>
          {application.currentStatus}
        </span>
      </div>

      <p className="text-grey-600 -600 0 text-sm mb-3">{application.company}</p>

      <div className="flex items-center text-grey-600 -900 text-sm mb-3 space-x-4">
        <span className="flex items-center">
          <CalendarIcon className="h-4 w-4 mr-1 text-grey-600 -600 0" />
          {formatDate(application.dateApplied)}
        </span>
        <span className="flex items-center">
          <ClockIcon className="h-4 w-4 mr-1 text-grey-600 -600 0" />
          Last update: {getTimeAgo(application.lastStatusUpdate)}
        </span>
      </div>

      <div className="flex space-x-2 mt-auto">
        {/* Link to a hypothetical Application Details page or Opportunity Details page */}
        <Link to={`/applications/details/${application.id}`} className="flex-1">
          <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">View Details</Button>
        </Link>
        <Button variant="outline" className="flex-1 border-gray-300 text-grey-600 -900 hover:bg-grey-500     ">
          Withdraw
        </Button>
      </div>
    </div>
  );
};

export default MobileApplicationCard;