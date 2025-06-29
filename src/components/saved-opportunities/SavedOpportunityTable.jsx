// src/components/saved-opportunities/SavedOpportunityTable.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button'; // Ensure path is correct

const SavedOpportunityTable = ({ savedOpportunities }) => {
  const [selectedOpportunities, setSelectedOpportunities] = useState([]);
  const now = new Date();

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedOpportunities(savedOpportunities.map(opp => opp.id));
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

  const getDeadlineStatus = (deadline) => {
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - now.getTime();
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (daysLeft <= 0) {
      return { text: 'Expired', classes: 'bg-red-100 text-red-700' };
    } else if (daysLeft <= 7) {
      return { text: `${daysLeft} days left`, classes: 'bg-yellow-100 text-yellow-700' };
    } else {
      return { text: `${daysLeft} days left`, classes: 'text-gray-700' }; // Default color
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
                checked={selectedOpportunities.length === savedOpportunities.length && savedOpportunities.length > 0}
                className="rounded text-vuka-blue focus:ring-vuka-blue"
              />
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Job Title
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Company
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Location
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Application Deadline
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date Saved
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {savedOpportunities.length > 0 ? (
            savedOpportunities.map((opp) => {
              const deadlineStatus = getDeadlineStatus(opp.applicationDeadline);
              const isExpired = deadlineStatus.text === 'Expired';
              return (
                <tr key={opp.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedOpportunities.includes(opp.id)}
                      onChange={(e) => handleSelectOne(e, opp.id)}
                      className="rounded text-vuka-blue focus:ring-vuka-blue"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-vuka-strong">{opp.jobTitle}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {opp.companyLogo && (
                        <img className="h-8 w-8 rounded-full mr-3 object-cover" src={opp.companyLogo} alt={`${opp.company} Logo`} />
                      )}
                      <div className="text-sm text-vuka-medium-grey">{opp.company}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-vuka-medium-grey">{opp.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${deadlineStatus.classes}`}>
                      {deadlineStatus.text}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-vuka-medium-grey">{new Date(opp.dateSaved).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link to={`/opportunities/${opp.id}/apply`}>
                        <Button className="px-3 py-1 bg-vuka-orange hover:bg-vuka-orange-dark text-white" disabled={isExpired}>
                          Apply Now
                        </Button>
                      </Link>
                      <Link to={`/opportunities/details/${opp.id}`}>
                        <Button variant="ghost" className="px-3 py-1 text-vuka-blue-dark hover:bg-gray-100">
                          View Details
                        </Button>
                      </Link>
                      <Button variant="ghost" className="px-3 py-1 text-vuka-danger hover:bg-red-50">
                        Remove
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="7" className="px-6 py-12 text-center text-vuka-medium-grey">
                No saved opportunities found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SavedOpportunityTable;