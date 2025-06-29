// src/components/shared/OpportunityCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button'; // Ensure path is correct
import { BookmarkIcon as OutlineBookmarkIcon } from '@heroicons/react/24/outline'; // For outline bookmark
import { BookmarkIcon as SolidBookmarkIcon } from '@heroicons/react/24/solid'; // For solid/filled bookmark

const OpportunityCard = ({
  id,
  title,
  company,
  location,
  duration,
  type, // e.g., 'Full-time', 'Part-time', 'Internship'
  paid, // boolean
  description,
  skills = [], // Array of strings like ['Python', 'React']
  showApplyButton = true, // Control visibility of Apply button (e.g., false for mobile list)
  showBookmark = true, // Control visibility of bookmark icon
  isBookmarked = false, // State for bookmark
  onBookmarkToggle, // Function to handle bookmark click
}) => {
  const handleBookmarkClick = (e) => {
    e.preventDefault(); // Prevent navigating if inside a link
    e.stopPropagation(); // Stop propagation to parent card click
    if (onBookmarkToggle) {
      onBookmarkToggle(id);
    }
  };

  return (
    <div className="bg-vuka-white p-6 rounded-lg shadow-md flex flex-col h-full relative border border-gray-200 hover:border-vuka-blue transition-all duration-200">
      {showBookmark && (
        <div className="absolute top-4 right-4 z-10">
          {isBookmarked ? (
            <SolidBookmarkIcon
              className="h-6 w-6 text-vuka-blue cursor-pointer"
              onClick={handleBookmarkClick}
            />
          ) : (
            <OutlineBookmarkIcon
              className="h-6 w-6 text-gray-400 hover:text-vuka-blue cursor-pointer"
              onClick={handleBookmarkClick}
            />
          )}
        </div>
      )}

      <h3 className="text-lg font-semibold text-vuka-strong mb-2 pr-10">{title}</h3> {/* Added pr-10 to make space for bookmark */}
      <p className="text-vuka-medium-grey text-sm mb-3">{company}</p>

      <div className="flex items-center text-vuka-text text-sm mb-3 space-x-2">
        {location && (
          <span className="flex items-center">
            <span className="mr-1 inline-block w-2 h-2 rounded-full bg-vuka-blue-light"></span> {location}
          </span>
        )}
        {duration && (
          <span className="flex items-center">
            <span className="mr-1 inline-block w-2 h-2 rounded-full bg-vuka-blue-light"></span> {duration}
          </span>
        )}
      </div>

      <p className="text-vuka-text text-sm mb-4 line-clamp-3 flex-grow">{description}</p>

      <div className="flex flex-wrap gap-2 mb-4 mt-auto">
        {skills.map((skill, index) => (
          <span key={index} className="bg-vuka-grey-light text-vuka-medium-grey text-xs font-medium px-2.5 py-0.5 rounded-full">
            {skill}
          </span>
        ))}
        {type && (
          <span className="bg-purple-100 text-purple-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {type}
          </span>
        )}
        {paid ? (
          <span className="bg-green-100 text-green-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
            Paid
          </span>
        ) : (
          <span className="bg-red-100 text-red-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
            Unpaid
          </span>
        )}
      </div>

      <div className="flex space-x-2 mt-auto">
        {showApplyButton && (
          <Link to={`/opportunities/${id}/apply`} className="flex-1">
            <Button className="w-full bg-vuka-orange hover:bg-vuka-orange-dark text-white">Apply</Button>
          </Link>
        )}
        <Link to={`/opportunities/details/${id}`} className="flex-1">
          <Button variant="outline" className="w-full border-gray-300 text-vuka-text hover:bg-gray-100">
            View Details
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default OpportunityCard;