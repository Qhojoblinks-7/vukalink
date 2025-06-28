// src/components/dashboard/MobileWelcome.jsx
import React from 'react';

const MobileWelcome = ({ user }) => {
    const userName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'User';

    return (
        <div className="bg-vuka-white p-3 rounded shadow mb-3 sm:p-4 sm:rounded-lg sm:shadow-sm sm:mb-4">
            <h2 className="text-xl font-heading font-bold text-vuka-bold mb-1 sm:text-2xl">Hello {userName}!</h2>
            <p className="text-vuka-text text-base sm:text-md">Ready to launch your career?</p>
        </div>
    );
};

export default MobileWelcome;