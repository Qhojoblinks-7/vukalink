// src/components/dashboard/MobileApplicationStatus.jsx
import React from 'react';

const StatusItem = ({ count, label }) => (
    <div className="flex flex-col items-center p-2 sm:p-3">
        <span className="text-2xl sm:text-3xl font-bold mb-1">{count}</span>
        <span className="text-grey-600 -600 0 text-center text-xs sm:text-sm">{label}</span>
    </div>
);

const MobileApplicationStatus = ({
    applied = 3,
    interview = 1,
    offers = 0,
}) => {
    return (
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm mb-3 sm:mb-4">
            <div className="grid grid-cols-3 gap-1 sm:gap-2">
                <StatusItem count={applied} label="Applied" />
                <StatusItem count={interview} label="Interview" />
                <StatusItem count={offers} label="Offers" />
            </div>
        </div>
    );
};

export default MobileApplicationStatus;
