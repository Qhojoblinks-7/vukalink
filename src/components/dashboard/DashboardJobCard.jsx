// src/components/dashboard/DashboardJobCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

const DashboardJobCard = ({ title, company, location, type, duration, paid, description, id }) => {
    return (
        <div className="bg-vuka-white p-4 sm:p-6 rounded-lg shadow-md flex flex-col h-full">
            <h3 className="text-base sm:text-lg font-semibold text-vuka-bold mb-1 sm:mb-2">{title}</h3>
            <p className="text-grey-500 text-xs sm:text-sm mb-2 sm:mb-3">{company}</p>
            <p className="text-vuka-text text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-3 flex-grow">{description}</p>

            <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4 mt-auto">
                {location && (
                    <span className="bg-blue-100 text-blue-900 text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full">
                        {location}
                    </span>
                )}
                {duration && (
                    <span className="bg-grey-100 text-grey-500 text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full">
                        {duration}
                    </span>
                )}
                {paid && (
                    <span className="bg-green-100 text-green-700 text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full">
                        Paid
                    </span>
                )}
                {type && (
                    <span className="bg-purple-100 text-purple-700 text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full">
                        {type}
                    </span>
                )}
            </div>
            <Link to={`/opportunities/details/${id}`}>
                <Button className="w-full text-xs sm:text-base py-2 sm:py-3">View & Apply</Button>
            </Link>
        </div>
    );
};

export default DashboardJobCard;