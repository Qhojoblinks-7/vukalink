// src/components/company/ManageOpportunityTable.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button'; // Ensure path is correct
import { EllipsisVerticalIcon, UsersIcon, EyeIcon } from '@heroicons/react/24/outline'; // Icons for actions

const ManageOpportunityTable = ({ opportunities }) => {
  const [selectedOpportunities, setSelectedOpportunities] = useState([]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedOpportunities(opportunities.map(opp => opp.id));
    } else {
      setSelectedOpportunities([]);
    }
  };

  const handleSelectOne = (e, oppId) => {
    if (e.target.checked) {
      setSelectedOpportunities(prev => [...prev, oppId]);
    } else {
      setSelectedOpportunities(prev => prev.filter(id => id !== oppId));
    }
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-700';
      case 'Draft': return 'bg-yellow-100 text-yellow-700';
      case 'Closed': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100     text-grey-600 -700';
    }
  };

  const formatDeadline = (dateString) => {
    const deadline = new Date(dateString);
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return { text: 'Expired', classes: 'text-red-600' };
    if (diffDays <= 7) return { text: `${diffDays} days left`, classes: 'text-orange-500' };
    return { text: deadline.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }), classes: 'text-grey-600 -600 0 dark:text-grey-600 -400' };
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-grey-600 -600 0 uppercase tracking-wider">
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={selectedOpportunities.length === opportunities.length && opportunities.length > 0}
                className="rounded text-vuka-blue focus:ring-blue-600"
              />
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-grey-600 -600 0 uppercase tracking-wider">
              Job Title
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-grey-600 -600 0 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-grey-600 -600 0 uppercase tracking-wider">
              Applicants
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-grey-600 -600 0 uppercase tracking-wider">
              Views
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-grey-600 -600 0 uppercase tracking-wider">
              Date Posted
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-grey-600 -600 0 uppercase tracking-wider">
              App. Deadline
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-grey-600 -600 0 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {opportunities.length > 0 ? (
            opportunities.map((opp) => {
              const deadlineInfo = formatDeadline(opp.applicationDeadline);
              return (
                <tr key={opp.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedOpportunities.includes(opp.id)}
                      onChange={(e) => handleSelectOne(e, opp.id)}
                      className="rounded text-blue-600 focus:ring-blue-600"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-grey-600 -900 dark:text-grey-600 -100">{opp.jobTitle}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(opp.status)}`}>
                      {opp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-grey-600 -600 0 dark:text-grey-600 -400">
                    <Link to={`/company/opportunities/${opp.id}/applicants`} className="text-blue-600 hover:underline">
                      {opp.applicants}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-grey-600 -600 0 dark:text-grey-600 -400">
                    {opp.views}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-grey-600 -600 0 dark:text-grey-600 -400">
                    {new Date(opp.datePosted).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`font-medium ${deadlineInfo.classes}`}>
                      {deadlineInfo.text}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <Link to={`/company/opportunities/${opp.id}/applicants`}>
                        <Button className="px-3 py-1 bg-blue-100 hover:bg-blue-600 text-blue-700 hover:text-white flex items-center text-sm">
                          <UsersIcon className="h-4 w-4 mr-1" />Applicants
                        </Button>
                      </Link>
                      <Link to={`/company/opportunities/${opp.id}/edit`}>
                        <Button variant="outline" className="px-3 py-1 border-gray-300 text-grey-600 -700 dark:text-grey-600 -600 hover:bg-gray-100       flex items-center text-sm">
                          Edit
                        </Button>
                      </Link>
                      {opp.status === 'Active' && (
                        <Button variant="ghost" className="px-3 py-1 text-red-500 hover:bg-red-50 flex items-center text-sm">
                          Deactivate
                        </Button>
                      )}
                      {opp.status === 'Draft' || opp.status === 'Closed' && (
                        <Button variant="ghost" className="px-3 py-1 text-green-500 hover:bg-green-50 flex items-center text-sm">
                          Activate
                        </Button>
                      )}
                      <button className="text-grey-600 -600 0 dark:text-grey-600 -600 hover:text-grey-600 -900 dark:hover:text-grey-600 -100">
                        <EllipsisVerticalIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="8" className="px-6 py-12 text-center text-grey-600 -600 0 dark:text-grey-600 -400">
                No opportunities found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageOpportunityTable;