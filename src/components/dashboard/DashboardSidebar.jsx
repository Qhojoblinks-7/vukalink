// src/components/dashboard/DashboardSidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
    HomeIcon, MagnifyingGlassIcon, BriefcaseIcon, BookmarkIcon,
    UserIcon, ChatBubbleLeftRightIcon, BookOpenIcon, Cog6ToothIcon, ArrowLeftEndOnRectangleIcon
} from '@heroicons/react/24/outline';
import md5 from 'md5';

const DashboardSidebar = ({ user }) => {
    const { logout } = useAuth();
    const location = useLocation();

    const getGravatarUrl = (email) => {
        const hash = md5(email.trim().toLowerCase());
        return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=120`;
    };

    const navItems = [
        { name: 'My Dashboard', icon: HomeIcon, path: '/dashboard' },
        { name: 'Find Internships', icon: MagnifyingGlassIcon, path: '/opportunities' },
        { name: 'My Applications', icon: BriefcaseIcon, path: '/applications' },
        { name: 'Saved Opportunities', icon: BookmarkIcon, path: '/saved' },
        { name: 'My Profile', icon: UserIcon, path: '/profile' },
        { name: 'Messages', icon: ChatBubbleLeftRightIcon, path: '/messages' },
        { name: 'Resources', icon: BookOpenIcon, path: '/resources' },
        { name: 'Account Settings', icon: Cog6ToothIcon, path: '/settings' },
    ];

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <div className="w-full max-w-xs md:max-w-full flex flex-col p-3 md:p-6 border-r border-gray-200 h-full bg-white fixed md:static z-40 bottom-0 left-0 right-0 md:top-0 md:h-auto md:bg-transparent">
            {/* User Info (hidden on mobile, shown on md+) */}
            <div className="hidden md:flex items-center mb-8 pb-6 border-b border-gray-200">
                <img
                    src={user.user_metadata?.avatar_url || getGravatarUrl(user.email)}
                    alt="User Avatar"
                    className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover mr-4 border-2 border-blue-300"
                />
                <div>
                    <h2 className="text-lg md:text-xl font-heading font-bold text-vuka-bold">{user.user_metadata?.full_name || user.email.split('@')[0]}</h2>
                    <p className="text-grey-500 text-xs md:text-sm">B.Sc Computer Science</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-grow">
                <ul className="flex md:flex-col justify-between md:space-y-2 space-x-1 md:space-x-0">
                    {navItems.map((item) => (
                        <li key={item.name} className="flex-1">
                            <Link
                                to={item.path}
                                className={`flex flex-col md:flex-row items-center justify-center md:justify-start p-2 md:p-3 rounded-lg transition-colors duration-200
                                    ${location.pathname === item.path
                                        ? 'bg-blue-900 text-white font-semibold'
                                        : 'text-vuka-text hover:bg-grey-100 hover:text-blue-900'
                                    }`}
                            >
                                <item.icon className="h-6 w-6 mb-0.5 md:mb-0 md:mr-3" />
                                <span className="text-xs md:text-base">{item.name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Logout Button */}
            <div className="hidden md:block mt-auto pt-6 border-t border-gray-200">
                <button
                    onClick={handleLogout}
                    className="flex items-center w-full p-3 rounded-lg text-vuka-danger hover:bg-red-100 transition-colors duration-200"
                >
                    <ArrowLeftEndOnRectangleIcon className="h-6 w-6 mr-3" />
                    <span>Logout</span>
                </button>
            </div>
            {/* Mobile Logout Button */}
            <div className="md:hidden flex justify-center mt-2 border-t border-gray-200 pt-2">
                <button
                    onClick={handleLogout}
                    className="flex flex-col items-center text-vuka-danger hover:bg-red-100 rounded-lg p-2 transition-colors duration-200"
                >
                    <ArrowLeftEndOnRectangleIcon className="h-6 w-6" />
                    <span className="text-xs">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default DashboardSidebar;