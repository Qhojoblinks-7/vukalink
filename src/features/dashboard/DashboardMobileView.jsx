// src/components/dashboard/DashboardMobileView.jsx
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import MobileWelcome from './MobileWelcome';
import MobileProfileCompleteness from './MobileProfileCompleteness';
import MobileApplicationStatus from './MobileApplicationStatus';
import MobileRecommendedJobs from './MobileRecommendedJobs';
import MobileActionButtons from './MobileActionButtons';
import MobileBottomNav from './MobileBottomNav';

const DashboardMobileView = ({ user }) => {
    // Mobile-first: base styles target mobile, add responsive classes for larger screens if needed
    return (
        <div className="flex flex-col mt-10 min-h-screen bg-grey-100">
            <div className="flex-1 overflow-y-auto p-4 pb-20">
                <MobileWelcome user={user} />
                <MobileProfileCompleteness />
                <MobileApplicationStatus />
                <MobileRecommendedJobs />
                <MobileActionButtons />
            </div>
            <MobileBottomNav />
        </div>
    );
};

export default DashboardMobileView;
