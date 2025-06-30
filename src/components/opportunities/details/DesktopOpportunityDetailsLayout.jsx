// src/components/opportunities/details/MobileOpportunityDetailsLayout.jsx
import React from 'react';
import MobileHeader from '../../dashboard/MobileHeader'; // Reusing mobile header
import MobileBottomNav from '../../dashboard/MobileBottomNav'; // Reusing mobile bottom nav
import Button from '../../ui/Button'; // Ensure path is correct
import { ShareIcon, BookmarkIcon as OutlineBookmarkIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth'; // To pass user to MobileHeader

const MobileOpportunityDetailsLayout = ({ opportunity }) => {
  const navigate = useNavigate();
  const { user } = useAuth(); // For MobileHeader

  const deadlineDate = new Date(opportunity.deadline);
  const now = new Date();
  const timeLeftMs = deadlineDate.getTime() - now.getTime();
  const daysLeft = Math.ceil(timeLeftMs / (1000 * 60 * 60 * 24));
  const isClosed = daysLeft <= 0;

  return (
    <div className=" hidden flex flex-col h-full bg-gray-100     dark:bg-gray-900">
      {/* Mobile Header for details page */}
      <div className="bg-blue-900   dark:bg-blue-800 py-4 px-4 flex justify-between items-center shadow-md">
        <button onClick={() => navigate(-1)} className="text-white hover:text-blue-400">
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
        <span className="text-white text-lg font-semibold">Opportunity Details</span>
        <div className="flex items-center space-x-4">
          <ShareIcon className="h-6 w-6 text-white cursor-pointer hover:text-blue-400" />
          <OutlineBookmarkIcon className="h-6 w-6 text-white cursor-pointer hover:text-blue-400" />
        </div>
      </div>

      {/* Main Content Scrollable Area */}
      <div className="flex-1 overflow-y-auto p-4 pb-20"> {/* pb-20 for bottom nav */}
        {/* Opportunity Card at Top */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-4">
          <div className="flex items-center mb-3">
            {opportunity.companyLogo && (
              <img src={opportunity.companyLogo} alt={`${opportunity.company} Logo`} className="h-10 w-10 rounded-full mr-3 object-cover" />
            )}
            <div>
              <h3 className="text-lg font-semibold text-grey-600 -900 dark:text-grey-600 -100">{opportunity.company}</h3>
              <p className="text-grey-600 -600 0 dark:text-grey-600 -600 text-sm">{opportunity.title}</p>
            </div>
          </div>
          <div className="flex items-center text-grey-600 -700 dark:text-grey-600 -600 text-sm mb-4 space-x-3">
            <span>{opportunity.location}</span>
            <span className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full"></span>
            <span>{opportunity.duration}</span>
          </div>
        </div>

        {/* Opportunity Sections */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-4">
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-grey-600 -900 dark:text-grey-600 -600 mb-3">Description</h2>
            <p className="text-grey-600 -700 dark:text-grey-600 -600 leading-relaxed whitespace-pre-wrap">{opportunity.aboutOpportunity}</p>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-semibold text-grey-600 -900 dark:text-grey-600 -600 mb-3">Responsibilities</h2>
            <ul className="list-disc list-inside text-grey-600 -700 dark:text-grey-600 -600 space-y-2">
              {opportunity.keyResponsibilities.map((resp, index) => (
                <li key={index}>{resp}</li>
              ))}
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-semibold text-grey-600 -900 dark:text-grey-600 -600 mb-3">Requirements</h2>
            <ul className="list-disc list-inside text-grey-600 -700 dark:text-grey-600 -600 space-y-2">
              {opportunity.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-semibold font-bold  mb-3">Application Process</h2>
            <p className="text-grey-600 -700 leading-relaxed">{opportunity.applicationProcess}</p>
          </section>

          <section>
            <div className="flex justify-between items-center mb-3 text-sm">
              <span className="text-grey-600 -900">Deadline:</span>
              <span className={`font-semibold ${isClosed ? 'text-red-600' : 'text-grey-600 -900'}`}>
                {deadlineDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <div className="text-right text-xs text-grey-600 -600 0 mb-4">
              {isClosed ? 'Closed' : `${daysLeft}d left`}
            </div>

            <div className="flex justify-between items-center mb-4 text-grey-600 -600 0 text-sm">
              <div className="flex items-center space-x-1">
                <span className="font-semibold text-grey-600 -900">{opportunity.views}</span> Views
              </div>
              <div className="flex items-center space-x-1">
                <span className="font-semibold text-grey-600 -900">{opportunity.appliedCount}</span> Applied
              </div>
            </div>
          </section>
        </div>

        {/* About Company Section (separate block for mobile) */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
          <h2 className="text-lg font-semibold text-grey-600 -900 mb-3">About {opportunity.company}</h2>
          <div className="flex items-center mb-4">
            {opportunity.companyLogo && (
              <img src={opportunity.companyLogo} alt={`${opportunity.company} Logo`} className="h-10 w-10 rounded-full mr-3 object-cover" />
            )}
            <p className="text-grey-600 -700 text-sm">{opportunity.aboutCompany}</p>
          </div>
          <div className="flex space-x-4 text-blue-600 text-sm font-medium">
            {opportunity.companyWebsite && (
              <a href={opportunity.companyWebsite} target="_blank" rel="noopener noreferrer" className="hover:underline">
                Visit Website
              </a>
            )}
            {opportunity.companyProfileLink && (
              <Link to={opportunity.companyProfileLink} className="hover:underline">
                View Company Profile
              </Link>
            )}
          </div>
        </div>

        {/* Floating Apply Now Button (Mobile Specific) */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 z-40 md:hidden">
          <Link to={`/opportunities/${opportunity.id}/apply`}>
            <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3" disabled={isClosed}>
              {isClosed ? 'Application Closed' : 'Apply Now'}
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile Bottom Navigation is rendered by App.jsx or parent, no need here */}
      <MobileBottomNav />
    </div>
  );
};

export default MobileOpportunityDetailsLayout;