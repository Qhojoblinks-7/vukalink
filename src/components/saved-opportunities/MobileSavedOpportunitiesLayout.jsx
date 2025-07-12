// src/components/saved-opportunities/MobileSavedOpportunitiesLayout.jsx
import React, { useState, useEffect } from 'react';
import MobileHeader from '../../features/dashboard/MobileHeader'; // Reusing mobile header
import MobileBottomNav from '../../features/dashboard/MobileBottomNav'; // Reusing mobile bottom nav
import MobileSavedOpportunityCard from './MobileSavedOpportunityCard';
import { ArrowLeftIcon } from '@heroicons/react/24/outline'; // For back icon in header
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'; // <-- ADDED FOR SEARCH ICON
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';

const statuses = ['All', 'New', 'Expiring Soon', 'Expired'];

const MobileSavedOpportunitiesLayout = ({ savedOpportunities }) => {
    const navigate = useNavigate();
    const [activeStatusTab, setActiveStatusTab] = useState('All');
    const [sortOrder, setSortOrder] = useState('Date Saved Desc');
    const [displayCount, setDisplayCount] = useState(3);
    const [searchTerm, setSearchTerm] = useState(''); // <-- ADDED searchTerm STATE

    const now = new Date();

    const filteredOpportunities = savedOpportunities.filter(opp => {
        const applicationDeadline = opp.opportunity?.applicationDeadline;
        const jobTitle = opp.opportunity?.title || '';
        const companyName = opp.opportunity?.company?.fullName || '';

        const deadlineDate = applicationDeadline ? new Date(applicationDeadline) : null;
        const isExpired = deadlineDate ? deadlineDate < now : false;
        const daysLeft = deadlineDate ? Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : Infinity;
        const isExpiringSoon = daysLeft > 0 && daysLeft <= 7;

        const matchesStatus = () => {
            if (activeStatusTab === 'All') return true;
            if (activeStatusTab === 'Expired') return isExpired;
            if (activeStatusTab === 'Expiring Soon') return isExpiringSoon && !isExpired;
            if (activeStatusTab === 'New') {
                const savedDate = opp.dateSaved ? new Date(opp.dateSaved) : new Date(0);
                const diffDaysSaved = Math.ceil((now.getTime() - savedDate.getTime()) / (1000 * 60 * 60 * 24));
                return diffDaysSaved <= 7;
            }
            return false;
        };

        const matchesSearch = jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                companyName.toLowerCase().includes(searchTerm.toLowerCase());


        return matchesStatus() && matchesSearch;
    });

    const sortedOpportunities = filteredOpportunities.sort((a, b) => {
        const dateA = a.dateSaved ? new Date(a.dateSaved) : new Date(0);
        const dateB = b.dateSaved ? new Date(b.dateSaved) : new Date(0);

        if (sortOrder === 'Date Saved Asc') {
            return dateA.getTime() - dateB.getTime();
        } else { // 'Date Saved Desc'
            return dateB.getTime() - dateA.getTime();
        }
    });

    const displayedOpportunities = sortedOpportunities.slice(0, displayCount);

    const handleLoadMore = () => {
        setDisplayCount(prevCount => prevCount + 3);
    };

    useEffect(() => {
        setDisplayCount(3);
    }, [activeStatusTab, searchTerm, sortOrder]);


    return (
        <div className="flex flex-col h-full bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100"> {/* Added dark mode classes for consistency */}
            {/* Custom Mobile Header for Saved Opportunities */}
            <div className="bg-blue-900 py-4 px-4 flex justify-between items-center shadow-md">
                <button onClick={() => navigate(-1)} className="text-white hover:text-blue-400">
                    <ArrowLeftIcon className="h-6 w-6" />
                </button>
                <span className="text-white text-lg font-semibold">Saved Opportunities</span>
                <div className="flex items-center space-x-4">
                    {/* Notifications icon, re-using from MobileHeader if applicable */}
                    {/* <BellIcon className="h-6 w-6 text-white cursor-pointer hover:text-blue-600" /> */}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 pb-20">
                {/* Mobile Status Tabs and Sort By */}
                <div className="flex justify-between items-center mb-4">
                    <div className="flex space-x-2 overflow-x-auto pb-2 flex-grow">
                        {statuses.map(status => (
                            <button
                                key={status}
                                onClick={() => setActiveStatusTab(status)}
                                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap
                                    ${activeStatusTab === status
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600' // Added dark mode classes
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                    <select
                        className="p-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-blue-600 focus:border-blue-600 text-sm ml-2
                        dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100" // Added dark mode classes
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                    >
                        <option value="Date Saved Desc">Sort By</option>
                        <option value="Date Saved Desc">Newest</option>
                        <option value="Date Saved Asc">Oldest</option>
                    </select>
                </div>

                {/* Search input for mobile (now active) */}
                <div className="relative mb-4">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-300" /> {/* Added dark mode for icon */}
                    <input
                        type="text"
                        placeholder="Search by title or company"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-600
                        dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100" // Added dark mode for input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>


                {/* Mobile Saved Opportunity Cards */}
                <div className="grid grid-cols-1 gap-4">
                    {displayedOpportunities.length > 0 ? (
                        displayedOpportunities.map((opportunity) => (
                            <MobileSavedOpportunityCard key={opportunity.id} opportunity={opportunity} />
                        ))
                    ) : (
                        <p className="text-gray-600 dark:text-gray-400 text-center py-8">No saved opportunities found matching your criteria.</p>
                    )}
                </div>

                {filteredOpportunities.length > displayCount && (
                    <Button
                        onClick={handleLoadMore}
                        className="w-full bg-blue-900 hover:bg-blue-700 text-white mt-6 dark:bg-blue-700 dark:hover:bg-blue-600" // Added dark mode classes
                    >
                        Load More
                    </Button>
                )}
            </div>
            <MobileBottomNav />
        </div>
    );
};

export default MobileSavedOpportunitiesLayout;