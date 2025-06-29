// src/components/saved-opportunities/MobileSavedOpportunityCard.jsx
import React from 'react';
import Button from '../ui/Button'; // Ensure path is correct
import { MapPinIcon, CalendarIcon, BookmarkIcon as SolidBookmarkIcon } from '@heroicons/react/24/solid'; // For filled bookmark
import { Link } from 'react-router-dom';

const MobileSavedOpportunityCard = ({ opportunity }) => {
  const now = new Date();
  const deadlineDate = new Date(opportunity.applicationDeadline);
  const diffTime = deadlineDate.getTime() - now.getTime();
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const isExpired = daysLeft <= 0;

  const getDeadlineText = () => {
    if (isExpired) {
      return { text: 'Expired', classes: 'text-red-700' };
    } else if (daysLeft <= 7) {
      return { text: `${daysLeft} days left`, classes: 'text-vuka-orange' }; // Orange for expiring soon
    } else {
      return { text: `Apply by: ${deadlineDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`, classes: 'text-vuka-text' };
    }
  };

  const deadlineInfo = getDeadlineText();

  return (
    <div className="bg-vuka-white p-4 rounded-lg shadow-md flex flex-col">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-vuka-strong">{opportunity.jobTitle}</h3>
        <SolidBookmarkIcon className="h-6 w-6 text-vuka-blue cursor-pointer" /> {/* Filled bookmark icon */}
      </div>

      <p className="text-vuka-medium-grey text-sm mb-2">{opportunity.company}</p>

      <div className="flex items-center text-vuka-text text-sm mb-3 space-x-3">
        <span className="flex items-center">
          <MapPinIcon className="h-4 w-4 mr-1 text-gray-500" />
          {opportunity.location}
        </span>
        <span className="w-1 h-1 bg-vuka-medium-grey rounded-full"></span>
        <span>{opportunity.duration}</span>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {opportunity.skills.map((skill, index) => (
          <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
            {skill}
          </span>
        ))}
      </div>

      <div className="flex items-center text-sm mb-4">
        <CalendarIcon className="h-4 w-4 mr-1 text-gray-500" />
        <span className={`font-semibold ${deadlineInfo.classes}`}>
          {deadlineInfo.text}
        </span>
      </div>

      <div className="flex space-x-2 mt-auto">
        <Link to={`/opportunities/${opportunity.id}/apply`} className="flex-1">
          <Button className="w-full bg-vuka-orange hover:bg-vuka-orange-dark text-white" disabled={isExpired}>
            Apply Now
          </Button>
        </Link>
        <Link to={`/opportunities/details/${opportunity.id}`} className="flex-1">
          <Button variant="outline" className="w-full border-gray-300 text-vuka-text hover:bg-gray-100">
            View Details
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default MobileSavedOpportunityCard;