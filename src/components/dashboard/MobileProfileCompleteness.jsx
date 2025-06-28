// src/components/dashboard/MobileProfileCompleteness.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

const MobileProfileCompleteness = ({ completenessPercentage = 70 }) => {
    return (
        <div className="bg-vuka-white p-3 rounded-lg shadow-sm mb-3 max-w-full">
            <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between mb-3 gap-1">
                <p className="text-grey-500 text-xs xs:text-sm">Profile Completeness</p>
                <span className="text-blue-900 font-bold text-sm xs:text-base">{completenessPercentage}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div
                    className="bg-blue-900 h-2 rounded-full"
                    style={{ width: `${completenessPercentage}%` }}
                ></div>
            </div>
            <Link to="/profile">
                <Button className="w-full text-center py-2 text-sm xs:text-md">Complete Your Profile</Button>
            </Link>
        </div>
    );
};

export default MobileProfileCompleteness;
