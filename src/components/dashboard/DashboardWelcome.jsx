// src/components/dashboard/DashboardWelcome.jsx
import React from 'react';

const DashboardWelcome = ({ user }) => {
    const userName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'User';

    return (
        <div className="mb-6 px-4">
            <h1 className="text-2xl font-heading font-bold text-blue-900 mb-2 md:text-3xl">
                Welcome back, {userName}!
            </h1>
            <p className="text-grey-600 -900 text-base md:text-lg">
                Here’s your dashboard – track your progress, manage your applications, and find new opportunities.
            </p>
        </div>
    );
};

export default DashboardWelcome;