// src/components/company/MobileManageOpportunityCard.jsx
import React from 'react';
import Button from '../ui/Button'
import { UsersIcon, EyeIcon, CalendarIcon, ClockIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const MobileManageOpportunityCard = ({ opportunity }) => {
  const getStatusClasses = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-700';
      case 'Draft': return 'bg-yellow-100 text-yellow-700';
      case 'Closed': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100     text-grey-600 -700';
    }
  };

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getDeadlineText = (deadline) => {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return 'Closed';
    // The design shows "Deadline: Sep 15" for a draft, suggesting a simple date display is preferred
    // for non-expiring soon/expired states, or for drafts.
    return `Deadline: ${new Date(deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  };

  return (
    <div className="bg-white   p-4 rounded-lg shadow-md flex flex-col">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-grey-600 -900 dark:text-grey-600  ">{opportunity.jobTitle}</h3>
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClasses(opportunity.status)}`}>
          {opportunity.status}
        </span>
      </div>

      <div className="flex items-center text-grey-600 -700 dark:text-grey-600   text-sm mb-2 space-x-4">
        <span className="flex items-center">
          <UsersIcon className="h-4 w-4 mr-1 text-grey-600 -600 0" />
          <Link to={`/company/opportunities/${opportunity.id}/applicants`} className="text-blue-600 hover:underline">
            {opportunity.applicants} Applicants
          </Link>
        </span>
        <span className="flex items-center">
          <EyeIcon className="h-4 w-4 mr-1 text-grey-600 -600 0" />
          {opportunity.views} Views
        </span>
      </div>

      <p className="text-grey-600 -600 0 dark:text-grey-600   text-sm mb-2 flex items-center">
        <CalendarIcon className="h-4 w-4 mr-1 text-grey-600 -600 0" />
        Posted: {formatDate(opportunity.datePosted)}
      </p>
      <p className="text-grey-600 -600 0 dark:text-grey-600   text-sm mb-4 flex items-center">
        <ClockIcon className="h-4 w-4 mr-1 text-grey-600 -600 0" />
        {getDeadlineText(opportunity.applicationDeadline)}
      </p>

      <div className="flex space-x-2 mt-auto">
        <Link to={`/company/opportunities/${opportunity.id}/applicants`} className="flex-1">
          <Button className="w-full bg-blue-100 hover:bg-blue-600 text-blue-700 hover:text-white">View Applicants</Button>
        </Link>
        <Link to={`/company/opportunities/${opportunity.id}/edit`} className="flex-1">
          <Button variant="outline" className="w-full border-gray-300 text-grey-600 -700 dark:text-grey-600   hover:bg-grey-500       ">Edit</Button>
        </Link>
        {opportunity.status === 'Active' && (
          <Button variant="ghost" className="flex-1 text-red-500 hover:bg-red-50 text-sm">Deactivate</Button>
        )}
        {(opportunity.status === 'Draft' || opportunity.status === 'Closed') && (
          <Button variant="ghost" className="flex-1 text-green-500 hover:bg-green-50 text-sm">Activate</Button>
        )}
        <button className="text-grey-600 -600 0 dark:text-grey-600   hover:text-grey-600 -900 dark:hover:text-grey-600 -600 flex-shrink-0">
          <EllipsisVerticalIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default MobileManageOpportunityCard;