// src/components/dashboard/MobileHeader.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { BellIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import logo from '../../assets/logo.svg';
import md5 from 'md5';

const MobileHeader = ({ user }) => {
    const getGravatarUrl = (email) => {
        const hash = md5(email.trim().toLowerCase());
        return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=60`;
    };

    return (
        <div className="bg-blue-900 py-3 px-3 fixed w-lvw flex justify-between items-center shadow-md">
            {/* Logo */}
            <Link to="/dashboard">
                <img src={logo} alt="LinkUp Logo" className="h-8 w-auto sm:h-8" />
            </Link>

            {/* Icons on Right */}
            <div className="flex items-center space-x-3 sm:space-x-4">
                <BellIcon className="h-7 w-7 text-white cursor-pointer hover:text-blue-500 sm:h-6 sm:w-6" />
                <MagnifyingGlassIcon className="h-7 w-7 text-white cursor-pointer hover:text-blue-500 sm:h-6 sm:w-6" />
                {/* User Avatar */}
                <Link to="/profile">
                    <img
                        src={user?.user_metadata?.avatar_url || getGravatarUrl(user?.email || 'default@example.com')}
                        alt="User Avatar"
                        className="w-10 h-10 rounded-full object-cover border-2 border-blue-300 sm:w-8 sm:h-8"
                    />
                </Link>
            </div>
        </div>
    );
};

export default MobileHeader;