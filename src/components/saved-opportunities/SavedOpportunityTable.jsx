// src/components/saved-opportunities/SavedOpportunityTable.jsx
import React, { useState } from 'react';
import Button from '../ui/Button'; // Assuming you have a reusable Button component
import { Link } from 'react-router-dom';
import { TrashIcon } from '@heroicons/react/24/outline'; // For the remove action

// Helper to determine deadline badge color and text
const getDeadlineStatus = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
        return { text: 'Expired', color: 'bg-red-100 text-red-800' };
    } else if (diffDays <= 7) {
        return { text: `Expiring in ${diffDays} day${diffDays !== 1 ? 's' : ''}`, color: 'bg-orange-100 text-orange-800' };
    } else {
        return { text: 'Active', color: 'bg-green-100 text-green-800' };
    }
};

// Internal component for a single table row
const SavedOpportunityTableRow = ({ opportunity, onSelect, isSelected, onRemove }) => {
    const deadlineStatus = getDeadlineStatus(opportunity.opportunity?.applicationDeadline);

    // Format dateSaved to a readable format
    const formattedDateSaved = opportunity.dateSaved
        ? new Date(opportunity.dateSaved).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
        : 'N/A';

    return (
        <tr className="border-b border-gray-200 hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
                <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-vuka-blue rounded focus:ring-vuka-blue"
                    checked={isSelected}
                    onChange={() => onSelect(opportunity.id)}
                />
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full object-cover" src={opportunity.opportunity?.company?.avatarUrl || '/images/default-company-avatar.png'} alt={opportunity.opportunity?.company?.fullName || 'Company'} />
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{opportunity.opportunity?.title}</div>
                        <div className="text-sm text-gray-500">{opportunity.opportunity?.company?.fullName}</div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {opportunity.opportunity?.location}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${deadlineStatus.color}`}>
                    {deadlineStatus.text}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formattedDateSaved}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center space-x-2">
                    {deadlineStatus.text !== 'Expired' && (
                        <Link to={`/apply/${opportunity.opportunity?.id}`}> {/* Link to an application page */}
                            <Button className="bg-vuka-orange hover:bg-orange-600 text-white px-3 py-1 text-xs">
                                Apply Now
                            </Button>
                        </Link>
                    )}
                    <Link to={`/opportunities/${opportunity.opportunity?.id}`}> {/* Link to opportunity details */}
                        <Button className="border border-vuka-blue text-vuka-blue hover:bg-vuka-blue hover:text-white px-3 py-1 text-xs">
                            View Details
                        </Button>
                    </Link>
                    <button
                        onClick={() => onRemove(opportunity.id)} // Pass the saved_opportunity ID for removal
                        className="p-1 rounded-full text-red-500 hover:bg-red-100 transition duration-150 ease-in-out"
                        aria-label="Remove saved opportunity"
                    >
                        <TrashIcon className="h-5 w-5" />
                    </button>
                </div>
            </td>
        </tr>
    );
};

const SavedOpportunityTable = ({ savedOpportunities, onRemoveSavedOpportunity }) => {
    const [selectedOpportunities, setSelectedOpportunities] = useState({});

    // Handle select all checkbox
    const handleSelectAll = (event) => {
        const newSelected = {};
        if (event.target.checked) {
            savedOpportunities.forEach(opp => {
                newSelected[opp.id] = true;
            });
        }
        setSelectedOpportunities(newSelected);
    };

    // Handle individual checkbox selection
    const handleSelect = (id) => {
        setSelectedOpportunities(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    // Check if all displayed opportunities are selected
    const allSelected = savedOpportunities.length > 0 && savedOpportunities.every(opp => selectedOpportunities[opp.id]);
    const someSelected = savedOpportunities.some(opp => selectedOpportunities[opp.id]);

    // Dummy functions for bulk actions (implement these in the parent layout or context)
    const handleApplySelected = () => {
        const idsToApply = Object.keys(selectedOpportunities).filter(id => selectedOpportunities[id]);
        alert(`Applying for: ${idsToApply.join(', ')}`);
        // Here you would call an API to apply for multiple opportunities
        // This might involve fetching the original opportunity IDs from the savedOpp IDs
    };

    const handleRemoveSelected = () => {
        const idsToRemove = Object.keys(selectedOpportunities).filter(id => selectedOpportunities[id]);
        if (window.confirm(`Are you sure you want to remove ${idsToRemove.length} saved opportunities?`)) {
            // Here you would call an API to remove multiple saved opportunities
            // e.g., Promise.all(idsToRemove.map(id => onRemoveSavedOpportunity(id)))
            alert(`Removing: ${idsToRemove.join(', ')}`);
            setSelectedOpportunities({}); // Clear selection after action
        }
    };

    return (
        <div className="overflow-x-auto">
            {savedOpportunities.length > 0 ? (
                <>
                    {/* Bulk action buttons (if any are selected) */}
                    {(someSelected || allSelected) && (
                        <div className="flex space-x-4 mb-4">
                            <Button
                                onClick={handleApplySelected}
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 text-sm"
                            >
                                Apply Selected
                            </Button>
                            <Button
                                onClick={handleRemoveSelected}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 text-sm"
                            >
                                Remove Selected
                            </Button>
                        </div>
                    )}

                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <input
                                        type="checkbox"
                                        className="form-checkbox h-4 w-4 text-vuka-blue rounded focus:ring-vuka-blue"
                                        checked={allSelected}
                                        onChange={handleSelectAll}
                                    />
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Job Title & Company
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Location
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Deadline
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date Saved
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {savedOpportunities.map(opportunity => (
                                <SavedOpportunityTableRow
                                    key={opportunity.id}
                                    opportunity={opportunity}
                                    isSelected={!!selectedOpportunities[opportunity.id]}
                                    onSelect={handleSelect}
                                    onRemove={onRemoveSavedOpportunity} // Propagate remove action
                                />
                            ))}
                        </tbody>
                    </table>
                </>
            ) : (
                <p className="text-gray-600 text-center py-8">No saved opportunities found.</p>
            )}
        </div>
    );
};

export default SavedOpportunityTable;