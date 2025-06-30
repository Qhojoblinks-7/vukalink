// src/components/dashboard/DashboardActionButtons.jsx
import React from 'react';
import Button from '../ui/Button';
import { Link } from 'react-router-dom';

const DashboardActionButtons = () => {
    return (
        <div className="flex flex-col space-y-4 mb-8 sm:flex-row sm:space-y-0 sm:space-x-4">
            <Link to="/profile/upload-resume" className="w-full sm:flex-1">
                <Button className="w-full bg-orange-500 hover:bg-orange-500 -dark text-white">
                    Post Resume
                </Button>
            </Link>
            <Link to="/resources/interview-prep" className="w-full sm:flex-1">
                <Button variant="outline" className="w-full border-gray-300 text-grey-600 -900 hover:bg-gray-100    ">
                    Prepare for Interview
                </Button>
            </Link>
            <Link to="/mentors" className="w-full sm:flex-1">
                <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                    Connect with Mentors
                </Button>
            </Link>
        </div>
    );
};

export default DashboardActionButtons;