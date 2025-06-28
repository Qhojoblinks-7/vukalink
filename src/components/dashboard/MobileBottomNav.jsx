import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    HomeIcon, MagnifyingGlassIcon, BriefcaseIcon, UserIcon, ChatBubbleLeftRightIcon
} from '@heroicons/react/24/solid';

const NavItem = ({ icon: Icon, label, path, isActive }) => (
    <Link to={path} className="flex flex-col items-center flex-1 py-1 px-0 text-xs min-w-0">
        <Icon className={`h-6 w-6 sm:h-7 sm:w-7 ${isActive ? 'text-blue-900' : 'text-gray-500'}`} />
        <span className={`truncate ${isActive ? 'text-blue-900 font-semibold' : 'text-gray-500'}`}>{label}</span>
    </Link>
);

const MobileBottomNav = () => {
    const location = useLocation();

    const navItems = [
        { name: 'Home', icon: HomeIcon, path: '/dashboard' },
        { name: 'Search', icon: MagnifyingGlassIcon, path: '/opportunities' },
        { name: 'Applications', icon: BriefcaseIcon, path: '/applications' },
        { name: 'Profile', icon: UserIcon, path: '/profile' },
        { name: 'Messages', icon: ChatBubbleLeftRightIcon, path: '/messages' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg px-2 py-1 md:hidden z-50">
            <div className="flex justify-between items-center h-full">
                {navItems.map((item) => (
                    <NavItem
                        key={item.name}
                        icon={item.icon}
                        label={item.name}
                        path={item.path}
                        isActive={location.pathname === item.path}
                    />
                ))}
            </div>
        </nav>
    );
};

export default MobileBottomNav;
