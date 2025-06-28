// src/components/dashboard/MobileActionButtons.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import {
    MagnifyingGlassIcon, BriefcaseIcon, BookmarkIcon, UserIcon, ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const ActionButton = ({ icon: Icon, label, to }) => (
    <Link to={to} className="w-full">
        <Button
            variant="outline"
            className="w-full flex items-center justify-center py-3 text-base border-gray-300 font-semibold hover:bg-gray-100
                sm:text-lg"
        >
            <Icon className="h-6 w-6 mr-2 sm:mr-3" />
            <span>{label}</span>
        </Button>
    </Link>
);

const MobileActionButtons = () => {
    return (
        <div className="flex flex-col space-y-3 mb-3 px-2 max-w-full sm:space-y-4 sm:mb-4 sm:px-0">
            <Link to="/opportunities" className="w-full">
                <Button
                    className="w-full bg-orange-700 hover:bg-orange-900 text-white text-base py-3 flex items-center justify-center font-semibold
                        sm:text-lg"
                >
                    <MagnifyingGlassIcon className="h-6 w-6 mr-2 sm:mr-3" /> Search Internships
                </Button>
            </Link>
            <ActionButton icon={BriefcaseIcon} label="My Applications" to="/applications" />
            <ActionButton icon={BookmarkIcon} label="Saved Opportunities" to="/saved" />
            <ActionButton icon={UserIcon} label="Edit Profile" to="/profile" />
            <ActionButton icon={ChatBubbleLeftRightIcon} label="Messages" to="/messages" />
        </div>
    );
};

export default MobileActionButtons;