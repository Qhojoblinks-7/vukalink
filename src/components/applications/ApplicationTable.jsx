// src/components/applications/ApplicationTable.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button'; // Ensure path is correct

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

  const getStatusClasses = (status) => {
    switch (status) {
      case 'Applied': return 'bg-blue-100 text-blue-700';
      case 'Reviewed': return 'bg-purple-100 text-purple-700';
      case 'Interview': return 'bg-green-100 text-green-700';
      case 'Offer': return 'bg-vuka-orange-light text-vuka-orange'; // Adjust color based on design
      case 'Rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={selectedApplications.length === applications.length && applications.length > 0}
                className="rounded text-vuka-blue focus:ring-vuka-blue"
              />
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Job Title
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Company Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date Applied
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Current Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Status Update
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {applications.length > 0 ? (
            applications.map((app) => (
              <tr key={app.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedApplications.includes(app.id)}
                    onChange={(e) => handleSelectOne(e, app.id)}
                    className="rounded text-vuka-blue focus:ring-vuka-blue"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-vuka-strong">{app.jobTitle}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {app.companyLogo && (
                      <img className="h-8 w-8 rounded-full mr-3 object-cover" src={app.companyLogo} alt={`${app.company} Logo`} />
                    )}
                    <div className="text-sm text-vuka-medium-grey">{app.company}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-vuka-medium-grey">{new Date(app.dateApplied).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(app.currentStatus)}`}>
                    {app.currentStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-vuka-medium-grey">{new Date(app.lastStatusUpdate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    {/* Assuming a details page for applications exists, similar to opportunity details */}
                    <Link to={`/applications/details/${app.id}`}>
                      <Button variant="ghost" className="px-3 py-1 text-vuka-blue-dark hover:bg-gray-100">
                        View
                      </Button>
                    </Link>
                    <Button variant="ghost" className="px-3 py-1 text-vuka-danger hover:bg-red-50">
                      Withdraw
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="px-6 py-12 text-center text-vuka-medium-grey">
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