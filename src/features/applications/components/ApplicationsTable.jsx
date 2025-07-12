// src/components/Applications/ApplicationsTable.jsx
import React from 'react';
import { format } from 'date-fns';

// Receive onView prop
const ApplicationsTable = ({ applications, onWithdraw, onView, selectedApplications, setSelectedApplications }) => {

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = applications.map(app => app.id);
      setSelectedApplications(allIds);
    } else {
      setSelectedApplications([]);
    }
  };

  const handleSelectApplication = (e, appId) => {
    if (e.target.checked) {
      setSelectedApplications([...selectedApplications, appId]);
    } else {
      setSelectedApplications(selectedApplications.filter(id => id !== appId));
    }
  };

  const isSelected = (appId) => selectedApplications.includes(appId);

  const getStatusClasses = (status) => {
    switch (status.toLowerCase()) {
      case 'applied': return 'bg-blue-100 text-blue-800';
      case 'interview': return 'bg-purple-100 text-purple-800';
      case 'reviewed': return 'bg-gray-100 text-gray-800';
      case 'offer': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'withdrawn': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md mb-6">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={selectedApplications.length === applications.length && applications.length > 0}
                disabled={applications.length === 0}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company Name</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Applied</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Status</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Status Update</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {applications.length === 0 ? (
            <tr>
              <td colSpan="7" className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                No applications found.
              </td>
            </tr>
          ) : (
            applications.map((app) => (
              <tr key={app.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={isSelected(app.id)}
                    onChange={(e) => handleSelectApplication(e, app.id)}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {app.opportunity?.title || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 flex items-center">
                  {app.opportunity?.company?.avatarUrl && (
                    <img
                      src={app.opportunity.company.avatarUrl}
                      alt={app.opportunity.company.fullName}
                      className="w-8 h-8 rounded-full mr-2 object-cover"
                    />
                  )}
                  {app.opportunity?.company?.fullName || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {app.applied_at ? format(new Date(app.applied_at), 'dd MMM indors') : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(app.status)}`}>
                    {app.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {app.updated_at ? format(new Date(app.updated_at), 'dd MMM indors') : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onView(app.id)} // Use the onView prop
                    className="text-blue-600 hover:text-blue-900 mr-4 focus:outline-none"
                  >
                    <i className="fas fa-eye mr-1"></i>View
                  </button>
                  {(app.status !== 'Withdrawn' && app.status !== 'Rejected' && app.status !== 'Offer') && (
                    <button
                      onClick={() => onWithdraw(app.id)}
                      className="text-red-600 hover:text-red-900 focus:outline-none"
                    >
                      <i className="fas fa-undo mr-1"></i>Withdraw
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicationsTable;