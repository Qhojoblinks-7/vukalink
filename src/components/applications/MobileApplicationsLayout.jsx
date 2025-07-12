// src/components/applications/MobileApplicationsLayout.jsx
import React, { useState, useEffect } from 'react';
import MobileHeader from '../../dashboard/MobileHeader'; // Adjusted path if MobileHeader is in src/components/dashboard
import MobileBottomNav from '../../dashboard/MobileBottomNav'; // Adjusted path if MobileBottomNav is in src/components/dashboard
import MobileApplicationCard from './MobileApplicationCard';
import Button from '../ui/Button'; // For the New button and potential filter buttons
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'; // For search icon
import { Link } from 'react-router-dom'; // Import Link

const MobileApplicationsLayout = ({ applications }) => {
    // Define the statuses array for the status tabs based on what's available + 'All'
    // This should reflect the Supabase status values consistently
    const allPossibleStatuses = ['All', 'pending', 'reviewed', 'interview', 'offer', 'rejected', 'accepted']; // Added 'accepted'

    const [activeStatusTab, setActiveStatusTab] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [dateAppliedFilter, setDateAppliedFilter] = useState('');
    const [displayCount, setDisplayCount] = useState(3); // Show 3 items initially for mobile

    // Filter applications based on current state
    const filteredApplications = applications.filter(app => {
        // Access nested properties for filtering, adding safety checks
        const jobTitle = app.opportunity?.title || '';
        const companyName = app.opportunity?.company?.fullName || '';
        const applicationStatus = app.status ? app.status.toLowerCase() : ''; // Use app.status

        const matchesStatus = activeStatusTab === 'All' || applicationStatus === activeStatusTab.toLowerCase();
        
        const matchesSearch = searchTerm ?
            (jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            companyName.toLowerCase().includes(searchTerm.toLowerCase())) : true;
        
        // Convert applied_at to YYYY-MM-DD for comparison with date input
        const appAppliedDateFormatted = app.applied_at ? new Date(app.applied_at).toISOString().split('T')[0] : '';
        const matchesDate = dateAppliedFilter ?
            appAppliedDateFormatted === dateAppliedFilter : true; 

        return matchesStatus && matchesSearch && matchesDate;
    });

    const displayedApplications = filteredApplications.slice(0, displayCount);

    const handleLoadMore = () => {
        setDisplayCount(prevCount => prevCount + 3); // Load 3 more items on mobile
    };

    // Recalculate status counts whenever applications prop changes
    const statusCounts = applications.reduce((acc, app) => {
        // Use app.status directly
        const statusKey = app.status ? app.status.toLowerCase() : 'unknown'; // Handle potentially missing status
        acc[statusKey] = (acc[statusKey] || 0) + 1;
        return acc;
    }, {});
    statusCounts['All'] = applications.length; // Ensure 'All' always has the total count

    // Reset display count when filters change
    useEffect(() => {
        setDisplayCount(3);
    }, [activeStatusTab, searchTerm, dateAppliedFilter]);


    return (
        <div className="flex flex-col h-full bg-gray-100 dark:bg-gray-900">
            <MobileHeader title="My Applications" showBack={false} showBell={true} showProfile={true} />

            <div className="flex-1 overflow-y-auto p-4 pb-20"> {/* pb-20 for bottom nav */}
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl font-heading font-bold text-vuka-dark-blue dark:text-gray-100">My Applications</h1>
                    <Link to="/opportunities"> {/* Link to Find Internships page */}
                        <Button className="bg-vuka-orange hover:bg-orange-600 text-white px-4 py-2 text-sm">
                            + New
                        </Button>
                    </Link>
                </div>

                {/* Mobile Status Tabs */}
                <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
                    {allPossibleStatuses.map(status => (
                        <button
                            key={status}
                            onClick={() => setActiveStatusTab(status)}
                            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap
                                ${activeStatusTab.toLowerCase() === status.toLowerCase()
                                    ? 'bg-vuka-blue text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}{' '}
                            {/* Check if statusCounts[status] exists before displaying */}
                            {statusCounts[status] !== undefined ? `(${statusCounts[status]})` : ''}
                        </button>
                    ))}
                </div>

                {/* Mobile Search and Date Filters */}
                <div className="flex space-x-2 mb-4">
                    <div className="relative flex-1">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search by title or company"
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-vuka-blue focus:border-vuka-blue bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <input
                        type="date"
                        className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-vuka-blue focus:border-vuka-blue"
                        value={dateAppliedFilter}
                        onChange={(e) => setDateAppliedFilter(e.target.value)}
                    />
                </div>

                {/* Mobile Application Cards */}
                <div className="grid grid-cols-1 gap-4">
                    {displayedApplications.length > 0 ? (
                        displayedApplications.map((application) => (
                            <MobileApplicationCard key={application.id} application={application} />
                        ))
                    ) : (
                        <p className="text-gray-600 dark:text-gray-400 text-center py-8">No applications found matching your criteria.</p>
                    )}
                </div>

                {filteredApplications.length > displayCount && (
                    <Button
                        onClick={handleLoadMore}
                        className="w-full bg-vuka-blue hover:bg-blue-800 text-white mt-6"
                    >
                        Load More
                    </Button>
                )}
            </div>
            <MobileBottomNav /> {/* Reusing the mobile bottom navigation */}
        </div>
    );
};

export default MobileApplicationsLayout;