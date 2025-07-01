// src/components/dashboard/DashboardMainContent.jsx
import React from 'react';
import DashboardWelcome from './DashboardWelcome';
import ProfileCompletenessCard from './ProfileCompletenessCard';
import ApplicationStatusOverviewCard from './ApplicationStatusOverviewCard';
import DashboardActionButtons from './DashboardActionButtons';
import DashboardTopPicks from './DashboardTopPicks';

const DashboardMainContent = ({ user }) => {
    return (
        <div className="flex-1 p-4 bg-grey-100   md:p-8 hidden sm:block">
            <DashboardWelcome user={user} />

            {/* Profile Completeness and Application Status */}
            <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-2">
                <ProfileCompletenessCard />
                <ApplicationStatusOverviewCard />
            </div>

            {/* Dashboard Actions */}
            <DashboardActionButtons />

            {/* Top Picks Section */}
            <DashboardTopPicks />
        </div>
    );
};

export default DashboardMainContent;
