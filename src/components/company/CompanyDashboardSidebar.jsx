// src/components/company/CompanyDashboardSidebar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; // Import useAuth hook
import {
  Square2StackIcon, // Company Dashboard
  PlusCircleIcon, // Post New Opportunity
  BriefcaseIcon, // Manage Opportunities
  UserGroupIcon, // Applicants
  ChatBubbleBottomCenterTextIcon, // Messages
  UserCircleIcon, // Company Profile
  Cog6ToothIcon, // Account Settings
} from '@heroicons/react/24/outline';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/solid'; // For Logout

const CompanyDashboardSidebar = () => {
  const { logout } = useAuth(); // Get logout function from useAuth
  const navigate = useNavigate(); // Get navigate function

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const navItems = [
    { name: 'Company Dashboard', icon: Square2StackIcon, path: '/company/dashboard' },
    { name: 'Post New Opportunity', icon: PlusCircleIcon, path: '/company/post-opportunity' },
    { name: 'Manage Opportunities', icon: BriefcaseIcon, path: '/company/manage-opportunities' },
    { name: 'Applicants', icon: UserGroupIcon, path: '/company/applicants' },
    { name: 'Messages', icon: ChatBubbleBottomCenterTextIcon, path: '/company/messages' },
    { name: 'Company Profile', icon: UserCircleIcon, path: '/company/profile' },
    { name: 'Account Settings', icon: Cog6ToothIcon, path: '/company/account-settings' },
  ];

  return (
    <div className="w-64 bg-white dark:bg-gray-800 shadow-md p-6 flex flex-col h-full sticky top-0 left-0">
      <nav className="flex-1">
        <ul>
          {navItems.map((item) => (
            <li key={item.name} className="mb-2">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg transition-colors
                   ${isActive
                      ? 'bg-blue-600 text-white font-semibold hover:bg-blue-700'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                   }`
                }
              >
                {/* Dynamically apply icon color based on isActive state */}
                <item.icon className={`h-5 w-5 mr-3 ${({ isActive }) => isActive ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`} />
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center p-3 rounded-lg text-red-600 hover:bg-red-50 w-full dark:text-red-400 dark:hover:bg-gray-700"
        >
          <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default CompanyDashboardSidebar;