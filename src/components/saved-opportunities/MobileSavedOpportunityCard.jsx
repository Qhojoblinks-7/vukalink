// src/components/saved-opportunities/MobileSavedOpportunityCard.jsx
import React from 'react';
import Button from '../ui/Button'; // Assuming you have a reusable Button component
import { Link } from 'react-router-dom';
import { BookmarkIcon, TrashIcon } from '@heroicons/react/24/outline'; // For Remove icon

// Helper to determine deadline badge color and text (can be shared with desktop)
const getDeadlineStatus = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
        return { text: 'Expired', color: 'bg-red-100 text-red-800' };
    } else if (diffDays <= 7) {
        return { text: `${diffDays} day${diffDays !== 1 ? 's' : ''} left`, color: 'bg-orange-100 text-orange-800' };
    } else {
        return { text: 'Active', color: 'bg-green-100 text-green-800' };
    }
};

const MobileSavedOpportunityCard = ({ opportunity, onRemoveSavedOpportunity }) => {
    const deadlineStatus = getDeadlineStatus(opportunity.opportunity?.applicationDeadline);

    // Format dateSaved to a readable format
    const formattedDateSaved = opportunity.dateSaved
        ? new Date(opportunity.dateSaved).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
        : 'N/A';

    return (
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <div className="flex items-center mb-3">
                <img
                    className="h-12 w-12 rounded-full object-cover mr-3"
                    src={opportunity.opportunity?.company?.avatarUrl || '/images/default-company-avatar.png'}
                    alt={opportunity.opportunity?.company?.fullName || 'Company'}
                />
                <div>
                    <h3 className="text-lg font-heading font-semibold text-vuka-dark-blue">{opportunity.opportunity?.title}</h3>
                    <p className="text-sm text-gray-600">{opportunity.opportunity?.company?.fullName}</p>
                </div>
                <div className="ml-auto">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${deadlineStatus.color}`}>
                        {deadlineStatus.text}
                    </span>
                </div>
            </div>

            <div className="text-sm text-gray-700 mb-2">
                <p><strong>Location:</strong> {opportunity.opportunity?.location}</p>
                <p><strong>Date Saved:</strong> {formattedDateSaved}</p>
                {/* You can add more details here if available in the opportunity object */}
                {/* <p><strong>Duration:</strong> {opportunity.opportunity?.duration}</p> */}
                {/* <p><strong>Stipend:</strong> {opportunity.opportunity?.stipend}</p> */}
            </div>

            <div className="flex justify-between items-center mt-4 space-x-2">
                {deadlineStatus.text !== 'Expired' ? (
                    <Link to={`/apply/${opportunity.opportunity?.id}`} className="flex-1">
                        <Button className="w-full bg-vuka-orange hover:bg-orange-600 text-white text-sm py-2">
                            Apply Now
                        </Button>
                    </Link>
                ) : (
                     <Button disabled className="w-full bg-gray-300 text-gray-600 text-sm py-2 cursor-not-allowed">
                        Apply Now (Expired)
                    </Button>
                )}

                <Link to={`/opportunities/${opportunity.opportunity?.id}`} className="flex-1">
                    <Button className="w-full border border-vuka-blue text-vuka-blue hover:bg-vuka-blue hover:text-white text-sm py-2">
                        View Details
                    </Button>
                </Link>

                <button
                    onClick={() => onRemoveSavedOpportunity(opportunity.id)} // Pass the saved_opportunity ID for removal
                    className="p-2 rounded-full text-red-500 hover:bg-red-100 transition duration-150 ease-in-out"
                    aria-label="Remove saved opportunity"
                >
                    <TrashIcon className="h-6 w-6" />
                </button>
            </div>
        </div>
    );
};

export default MobileSavedOpportunityCard;