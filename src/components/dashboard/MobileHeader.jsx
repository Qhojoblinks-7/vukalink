// src/components/dashboard/MobileHeader.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import NotificationBell from '../common/NotificationBell';
import SearchBox from '../common/SearchBox';
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
            <Link to="/dashboard" className="flex items-center">
                <img src={logo} alt="LinkUp Logo" className="h-8 w-auto sm:h-8" />
                <p className="text-white text-2xl font-bold ">ukaLink</p>
            </Link>
            {/* Icons on Right */}
            <div className="flex items-center space-x-3 sm:space-x-4">
                <NotificationBell />
                <div className="w-32 max-w-xs">
                  <SearchBox placeholder="Search..." />
                </div>
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