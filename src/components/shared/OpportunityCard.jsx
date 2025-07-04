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
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col h-full relative border border-gray-200 hover:border-blue-600 transition-all duration-200">
      {showBookmark && (
        <div className="absolute top-4 right-4 z-10">
          {isBookmarked ? (
            <SolidBookmarkIcon
              className="h-6 w-6 text-blue-600 cursor-pointer"
              onClick={handleBookmarkClick}
            />
          ) : (
            <OutlineBookmarkIcon
              className="h-6 w-6 text-grey-600 -600 hover:text-blue-600 cursor-pointer"
              onClick={handleBookmarkClick}
            />
          )}
        </div>
      )}

      <h3 className="text-lg font-semibold text-grey-600 -900 mb-2 pr-10">{title}</h3> {/* Added pr-10 to make space for bookmark */}
      <p className="text-grey-600 -600 0 text-sm mb-3">{company}</p>

      <div className="flex items-center text-grey-600 -700 text-sm mb-3 space-x-2">
        {location && (
          <span className="flex items-center">
            <span className="mr-1 inline-block w-2 h-2 rounded-full bg-blue-100"></span> {location}
          </span>
        )}
        {duration && (
          <span className="flex items-center">
            <span className="mr-1 inline-block w-2 h-2 rounded-full bg-blue-100"></span> {duration}
          </span>
        )}
      </div>

      <p className="text-grey-600 -700 text-sm mb-4 line-clamp-3 flex-grow">{description}</p>

      <div className="flex flex-wrap gap-2 mb-4 mt-auto">
        {skills.map((skill, index) => (
          <span key={index} className="bg-gray-100     text-grey-600 -600 0 text-xs font-medium px-2.5 py-0.5 rounded-full">
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
            <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">Apply</Button>
          </Link>
        )}
        <Link to={`/opportunities/details/${id}`} className="flex-1">
          <Button variant="outline" className="w-full border-gray-300 text-grey-600 -700 hover:bg-grey-500     ">
            View Details
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default OpportunityCard;