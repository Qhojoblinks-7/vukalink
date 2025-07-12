// src/components/applications/MobileApplicationCard.jsx
import React from 'react';
import Button from '../ui/Button'; // Ensure path is correct
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline'; // For icons
import { Link } from 'react-router-dom';

const MobileApplicationCard = ({ application }) => {
  const getStatusClasses = (status) => {
    switch (status) {
      case 'pending': return 'bg-blue-100 text-blue-700'; // Changed from 'Applied'
      case 'reviewed': return 'bg-purple-100 text-purple-700'; // Changed from 'Reviewed'
      case 'interview': return 'bg-green-100 text-green-700'; // Changed from 'Interview'
      case 'offer': return 'bg-yellow-100 text-yellow-700'; // Changed from 'Offer'
      case 'rejected': return 'bg-red-100 text-red-700'; // Changed from 'Rejected'
      case 'accepted': return 'bg-teal-100 text-teal-700'; // Added 'accepted'
      default: return 'bg-gray-100 text-gray-600'; // Corrected class string
    }
  };

  const formatDate = (dateString) => {
    // Handle null or undefined dateString gracefully
    if (!dateString) return 'N/A';
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getTimeAgo = (dateString) => {
    // Handle null or undefined dateString gracefully
    if (!dateString) return 'N/A';
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
    const diffMonths = Math.floor(diffDays / 30); // Approximate months
    if (diffMonths === 1) return '1mo ago';
    return `${diffMonths}mo ago`;
  };


  // Destructure with default values or checks to prevent errors if data is missing
  const { opportunity, status, applied_at, updated_at, id } = application;
  const companyName = opportunity?.company?.fullName || 'Company Name N/A';
  const jobTitle = opportunity?.title || 'Job Title N/A';

  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex flex-col">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-blue-900">{jobTitle}</h3>
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClasses(status)}`}>
          {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'} {/* Capitalize status */}
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-3">{companyName}</p> {/* Corrected class */}

      <div className="flex items-center text-gray-600 text-sm mb-3 space-x-4"> {/* Corrected class */}
        <span className="flex items-center">
          <CalendarIcon className="h-4 w-4 mr-1 text-gray-600" /> {/* Corrected class */}
          Applied: {formatDate(applied_at)} {/* Changed from dateApplied */}
        </span>
        <span className="flex items-center">
          <ClockIcon className="h-4 w-4 mr-1 text-gray-600" /> {/* Corrected class */}
          Last update: {getTimeAgo(updated_at)} {/* Changed from lastStatusUpdate */}
        </span>
      </div>

      <div className="flex space-x-2 mt-auto">
        {/* Link to a hypothetical Application Details page or Opportunity Details page */}
        <Link to={`/applications/details/${id}`} className="flex-1"> {/* Using 'id' directly */}
          <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">View Details</Button>
        </Link>
        <Button variant="outline" className="flex-1 border-gray-300 text-gray-900 hover:bg-gray-50"> {/* Corrected class */}
          Withdraw
        </Button>
      </div>
    </div>
  );
};

export default MobileApplicationCard;