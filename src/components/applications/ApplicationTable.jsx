// src/components/applications/ApplicationTable.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// Ensure Button path is correct, assuming src/components/ui/Button.jsx
import Button from '../ui/Button';
import { BuildingOfficeIcon, BriefcaseIcon, MapPinIcon } from '@heroicons/react/24/outline'; // Icons

const ApplicationTable = ({ applications }) => {
    const [selectedApplications, setSelectedApplications] = useState([]);

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedApplications(applications.map(app => app.id));
        } else {
            setSelectedApplications([]);
        }
    };

    const handleSelectOne = (e, appId) => {
        if (e.target.checked) {
            setSelectedApplications(prev => [...prev, appId]);
        } else {
            setSelectedApplications(prev => prev.filter(id => id !== appId));
        }
    };

    // Helper to get status badge styling
    const getStatusBadge = (status) => {
        let classes = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ';
        switch (status.toLowerCase()) { // Ensure case-insensitivity
            case 'pending':
                classes += 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100';
                break;
            case 'reviewed':
                classes += 'bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100';
                break;
            case 'interview':
                classes += 'bg-purple-100 text-purple-800 dark:bg-purple-700 dark:text-purple-100';
                break;
            case 'rejected':
                classes += 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100';
                break;
            case 'offer':
                classes += 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100';
                break;
            case 'hired':
                classes += 'bg-vuka-green text-white dark:bg-green-600 dark:text-white'; // Assuming vuka-green is defined
                break;
            default:
                classes += 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
        }
        return (
            <span className={classes}>
                {status.charAt(0).toUpperCase() + status.slice(1)} {/* Capitalize for display */}
            </span>
        );
    };

    if (applications.length === 0) {
        return (
            <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                No applications to display based on current filters.
            </div>
        );
    }

    return (
        <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 rounded-lg">
            <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-600">
                <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                            <input
                                type="checkbox"
                                onChange={handleSelectAll}
                                checked={selectedApplications.length === applications.length && applications.length > 0}
                                className="rounded text-vuka-blue focus:ring-vuka-blue dark:bg-gray-600 dark:border-gray-500"
                            />
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                            Opportunity
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                            Company
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                            Date Applied
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                            Current Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                            Last Status Update
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {applications.map((app) => (
                        <tr key={app.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <input
                                    type="checkbox"
                                    checked={selectedApplications.includes(app.id)}
                                    onChange={(e) => handleSelectOne(e, app.id)}
                                    className="rounded text-vuka-blue focus:ring-vuka-blue dark:bg-gray-600 dark:border-gray-500"
                                />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <Link to={`/opportunities/${app.opportunityId}`} className="text-sm font-medium text-vuka-blue dark:text-blue-400 hover:underline">
                                    {app.jobTitle}
                                </Link>
                                <div className="text-gray-500 dark:text-gray-400 text-xs mt-1 flex items-center gap-1">
                                    <BriefcaseIcon className="h-3 w-3 inline-block" /> {app.type || 'N/A'}
                                    <MapPinIcon className="h-3 w-3 ml-2 inline-block" /> {app.locationType} {app.location && `(${app.location})`}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    {app.companyLogo && (
                                        <img className="h-8 w-8 rounded-full mr-3 object-cover" src={app.companyLogo} alt={`${app.company} Logo`} />
                                    )}
                                    <Link to={`/profiles/company/${app.companyId}`} className="text-sm text-gray-700 dark:text-gray-200 hover:underline">
                                        {app.company}
                                    </Link>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {/* Ensure date format consistency, using toLocaleDateString as per MyApplicationsPage */}
                                <div className="text-sm text-gray-600 dark:text-gray-300">
                                    {app.dateApplied}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {getStatusBadge(app.currentStatus)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {/* Ensure date format consistency */}
                                <div className="text-sm text-gray-600 dark:text-gray-300">
                                    {app.lastStatusUpdate}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                    <Link to={`/applications/details/${app.id}`}>
                                        <Button variant="ghost" className="px-3 py-1 text-vuka-blue hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-blue-400">
                                            View
                                        </Button>
                                    </Link>
                                    {/* You'll need to implement the actual withdraw logic */}
                                    <Button variant="ghost" className="px-3 py-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50 dark:text-red-400">
                                        Withdraw
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {applications.length === 0 && (
                        <tr>
                            <td colSpan="7" className="px-6 py-12 text-center text-gray-600 dark:text-gray-400">
                                No applications found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ApplicationTable;