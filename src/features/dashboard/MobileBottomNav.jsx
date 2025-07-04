// src/components/dashboard/MobileBottomNav.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  MagnifyingGlassIcon,
  BriefcaseIcon, // Used for Applications for student, Manage for company
  BookmarkIcon, // For Saved for student
  UserCircleIcon, // Profile
  ChatBubbleBottomCenterTextIcon, // Messages
  Square2StackIcon, // Dashboard for company
  PlusCircleIcon, // Post for company
  UserGroupIcon, // Applicants for company
  BellIcon, // Notifications
} from '@heroicons/react/24/solid'; // Using solid icons for bottom nav for clarity

const MobileBottomNav = ({ isCompany = false }) => { // Add isCompany prop, default to false

  // Navigation items for students (Profile added back, consistent with Header links)
  const studentNavItems = [
    { name: 'Home', icon: HomeIcon, path: '/dashboard' },
    { name: 'Search', icon: MagnifyingGlassIcon, path: '/opportunities' }, // Corrected path
    { name: 'Applications', icon: BriefcaseIcon, path: '/applications' },
    { name: 'Saved', icon: BookmarkIcon, path: '/saved' }, // Added Saved for students
    { name: 'Messages', icon: ChatBubbleBottomCenterTextIcon, path: '/student/messages' },
    { name: 'Profile', icon: UserCircleIcon, path: '/profile/edit' }, // Added Profile for students
    { name: 'Notifications', icon: BellIcon, path: '/notifications' }, // Regular link
  ];

  // Navigation items for companies
  const companyNavItems = [
    { name: 'Home', icon: Square2StackIcon, path: '/company/dashboard' },
    { name: 'Post', icon: PlusCircleIcon, path: '/company/post-opportunity' },
    { name: 'Manage', icon: BriefcaseIcon, path: '/company/manage-opportunities' },
    { name: 'Applicants', icon: UserGroupIcon, path: '/company/applicants' },
    { name: 'Messages', icon: ChatBubbleBottomCenterTextIcon, path: '/company/messages' },
    { name: 'Profile', icon: UserCircleIcon, path: '/company/profile' }, // Added Profile for companies
    { name: 'Notifications', icon: BellIcon, path: '/company/notifications' }, // Regular link
  ];

  const currentNavItems = isCompany ? companyNavItems : studentNavItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg md:hidden z-50">
      <div className="flex justify-around items-center h-16">
        {currentNavItems.map((item) => ( // Iterate over all items
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center text-xs font-medium px-2 py-1 transition-colors
              ${isActive ? 'text-orange-500 dark:text-orange-400' : 'text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400'}`
            }
          >
            <item.icon className="h-6 w-6 mb-1" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default MobileBottomNav;