import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NotificationBell from '../../components/common/NotificationBell';
import SearchBox from '../../components/common/SearchBox';
import logo from '../../assets/logo.svg';
import md5 from 'md5'; // Ensure md5 is installed: npm install md5 or yarn add md5
import { useAuth } from '../../hooks/useAuth';
import { useDarkMode } from '../../context/DarkModeContext';

const MobileHeader = ({ user }) => {
    const getGravatarUrl = (email) => {
        const hash = md5(email.trim().toLowerCase());
        return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=60`;
    };
    const { logout } = useAuth();
    const navigate = useNavigate();
    const { darkMode, setDarkMode } = useDarkMode(); // Destructure setDarkMode from context
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Handle dark mode toggle: updates state in context
    const handleToggleDarkMode = () => {
        console.log('[MobileHeader] Toggling dark mode. Current (before update):', darkMode);
        setDarkMode(prevMode => !prevMode); // Use functional update for robustness
    };

    // Effect to log the state *after* it has updated and component re-rendered
    // This log confirms the state received from context, not the DOM class directly.
    useEffect(() => {
        console.log('[MobileHeader] After render. darkMode from context:', darkMode);
    }, [darkMode]); // Runs every time 'darkMode' state changes

    return (
        <div className="bg-blue-900   py-3 px-3 fixed w-lvw flex justify-between items-center shadow-md">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center">
                <img src={logo} alt="VukaLink Logo" className="h-8 w-auto sm:h-8" />
                {/* Ensure this text has a distinct light mode and dark mode color */}
                <p className="text-white dark:text-blue-300 text-2xl font-bold ">ukaLink</p>
            </Link>
            {/* Icons on Right */}
            <div className="flex items-center space-x-3 sm:space-x-4">
                <NotificationBell />
                <div className="w-32 max-w-xs">
                    <SearchBox placeholder="Search..." />
                </div>
                {/* User Avatar with Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        className="w-10 h-10 rounded-full object-cover border-2 border-blue-300 sm:w-8 sm:h-8 focus:outline-none"
                        onClick={() => setDropdownOpen((open) => !open)}
                        aria-haspopup="true"
                        aria-expanded={dropdownOpen}
                    >
                        <img
                            src={user?.user_metadata?.avatar_url || getGravatarUrl(user?.email || 'default@example.com')}
                            alt="User Avatar"
                            className="w-10 h-10 rounded-full object-cover border-2 border-blue-300 sm:w-8 sm:h-8"
                        />
                    </button>
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-44 bg-white   border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
                            <Link
                                to="/profile/edit"
                                className="block px-4 py-2 text-gray-600  hover:bg-gray-100  "
                                onClick={() => setDropdownOpen(false)}
                            >
                                Profile
                            </Link>
                            <Link
                                to={user?.role === 'student' ? '/messages' : '/company/messages'}
                                className="block px-4 py-2 text-gray-600  hover:bg-gray-100  "
                                onClick={() => setDropdownOpen(false)}
                            >
                                Messages
                            </Link>
                            <Link
                                to="/resources"
                                className="block px-4 py-2 text-gray-600  hover:bg-gray-100  "
                                onClick={() => setDropdownOpen(false)}
                            >
                                Resources
                            </Link>
                            <button
                                onClick={handleToggleDarkMode}
                                className="block w-full text-left px-4 py-2 text-blue-600 dark:text-blue-300 hover:bg-gray-100  "
                            >
                                {darkMode ? 'Light Mode' : 'Dark Mode'}
                            </button>
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100  "
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MobileHeader;