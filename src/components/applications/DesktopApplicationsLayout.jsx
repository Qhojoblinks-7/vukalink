

// src/components/applications/DesktopApplicationsLayout.jsx
import React, { useState, useEffect } from 'react';
import Button from '../ui/Button'; // Ensure path is correct
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'; // For search icon
import ApplicationTable from './ApplicationTable';
import Pagination from '../opportunities/Pagination'; // Reusing Pagination from opportunities
import { Link } from 'react-router-dom';

const statuses = ['All', 'pending', 'reviewed', 'interview', 'offer', 'rejected', 'accepted']; // Added 'accepted', use actual status values from Supabase

const DesktopApplicationsLayout = ({ applications }) => {
    const [activeStatusTab, setActiveStatusTab] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('applied_at_desc'); // Use more descriptive internal names
    const [dateAppliedFilter, setDateAppliedFilter] = useState(''); // For date picker
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // As per desktop design

    const filteredApplications = applications.filter(app => {
        // Access nested properties for filtering
        const jobTitle = app.opportunity?.title || ''; // Handle potential undefined
        const companyName = app.opportunity?.company?.fullName || ''; // Handle potential undefined
        const applicationStatus = app.status ? app.status.toLowerCase() : ''; // Ensure status is lowercase

        const matchesStatus = activeStatusTab === 'All' || applicationStatus === activeStatusTab.toLowerCase();

        const matchesSearch = searchTerm ?
            (jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            companyName.toLowerCase().includes(searchTerm.toLowerCase())) : true;
        
        // Ensure dateAppliedFilter format (YYYY-MM-DD) matches app.applied_at format
        // Convert applied_at to YYYY-MM-DD for comparison
        const appAppliedDateFormatted = app.applied_at ? new Date(app.applied_at).toISOString().split('T')[0] : '';
        const matchesDate = dateAppliedFilter ?
            appAppliedDateFormatted === dateAppliedFilter : true; 

        return matchesStatus && matchesSearch && matchesDate;
    });

    const sortedApplications = filteredApplications.sort((a, b) => {
        // Use 'applied_at' and parse dates safely
        const dateA = a.applied_at ? new Date(a.applied_at) : new Date(0); // Use epoch for safety if null
        const dateB = b.applied_at ? new Date(b.applied_at) : new Date(0);

        if (sortOrder === 'applied_at_asc') {
            return dateA.getTime() - dateB.getTime();
        } else { // 'applied_at_desc'
            return dateB.getTime() - dateA.getTime();
        }
    });

    const totalPages = Math.ceil(sortedApplications.length / itemsPerPage);
    const paginatedApplications = sortedApplications.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    useEffect(() => {
        setCurrentPage(1); // Reset page when filters/sort change
    }, [activeStatusTab, searchTerm, sortOrder, dateAppliedFilter]);


    return (
        <div className="container mx-auto px-4 py-8 lg:px-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-heading font-bold text-vuka-dark-blue dark:text-gray-100">My Applications</h1>
                    <Link to="/opportunities"> {/* Link to Find Internships page */}
                        <Button className="bg-vuka-orange hover:bg-orange-600 text-white">
                            + Find Internships
                        </Button>
                    </Link>
                </div>

                {/* Status Tabs and Filters */}
                <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
                    <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
                        {statuses.map(status => (
                            <button
                                key={status}
                                onClick={() => setActiveStatusTab(status)}
                                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap
                                    ${activeStatusTab.toLowerCase() === status.toLowerCase()
                                        ? 'bg-vuka-blue text-white'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)} {/* Capitalize for display */}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center space-x-4 flex-wrap gap-y-4"> {/* Added flex-wrap for better responsiveness */}
                        <div className="flex-1 relative min-w-[200px]"> {/* Added min-width */}
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search by job or company"
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-vuka-blue focus:border-vuka-blue bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <label htmlFor="sort-by" className="text-gray-600 dark:text-gray-400 text-sm whitespace-nowrap">Sort by:</label>
                            <select
                                id="sort-by"
                                className="p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-vuka-blue focus:border-vuka-blue"
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                            >
                                <option value="applied_at_desc">Date Applied (Newest)</option>
                                <option value="applied_at_asc">Date Applied (Oldest)</option>
                                {/* Add more sorting options like 'Status' */}
                            </select>
                        </div>
                        <div className="flex items-center space-x-2">
                            <label htmlFor="date-applied" className="text-gray-600 dark:text-gray-400 text-sm whitespace-nowrap">Date Applied:</label>
                            <input
                                type="date"
                                id="date-applied"
                                className="p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-vuka-blue focus:border-vuka-blue"
                                value={dateAppliedFilter}
                                onChange={(e) => setDateAppliedFilter(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Bulk Actions */}
                <div className="flex space-x-4 mb-6">
                    {/* Assuming you have these variants in your Button component */}
                    <Button variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"> {/* Corrected hover class */}
                        Bulk Withdraw
                    </Button>
                    <Button variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"> {/* Corrected hover class */}
                        Export Data
                    </Button>
                </div>

                {/* Application Table */}
                <ApplicationTable applications={paginatedApplications} />

                {/* Pagination */}
                {sortedApplications.length > 0 && (
                    <div className="mt-8">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                        <p className="text-gray-600 dark:text-gray-400 text-sm text-center mt-4">
                            Showing {paginatedApplications.length} of {sortedApplications.length} applications
                        </p>
                    </div>
                )}
                {sortedApplications.length === 0 && (
                    <p className="text-gray-600 dark:text-gray-400 text-center py-8">No applications found matching your criteria.</p>
                )}
            </div>
        </div>
    );
};

export default DesktopApplicationsLayout;