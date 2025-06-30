// src/components/dashboard/MobileBottomNav.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  MagnifyingGlassIcon,
  BriefcaseIcon, // Used for Applications for student, Manage for company
  BookmarkIcon,
  UserCircleIcon,
  ChatBubbleBottomCenterTextIcon,
  Square2StackIcon, // Dashboard for company
  PlusCircleIcon, // Post for company
  UserGroupIcon, // Applicants for company
  BellIcon,
} from '@heroicons/react/24/solid'; // Using solid icons for bottom nav for clarity

const MobileBottomNav = ({ isCompany = false }) => { // Add isCompany prop, default to false


  // Navigation items for students (Profile removed, Notification added)
  const studentNavItems = [
    { name: 'Home', icon: HomeIcon, path: '/dashboard' },
    { name: 'Search', icon: MagnifyingGlassIcon, path: '/opportunities' },
    { name: 'Applications', icon: BriefcaseIcon, path: '/applications' },
    { name: 'Messages', icon: ChatBubbleBottomCenterTextIcon, path: '/messages' },
    { name: 'Notifications', icon: BellIcon, path: '/notifications', headerOnly: true },
  ];

  // Navigation items for companies (Profile removed, Notification added)
  const companyNavItems = [
    { name: 'Home', icon: Square2StackIcon, path: '/company/dashboard' },
    { name: 'Post', icon: PlusCircleIcon, path: '/company/post-opportunity' },
    { name: 'Manage', icon: BriefcaseIcon, path: '/company/manage-opportunities' },
    { name: 'Applicants', icon: UserGroupIcon, path: '/company/applicants' },
    { name: 'Messages', icon: ChatBubbleBottomCenterTextIcon, path: '/company/messages' },
    { name: 'Notifications', icon: BellIcon, path: '/company/notifications', headerOnly: true },
  ];

  const currentNavItems = isCompany ? companyNavItems : studentNavItems;

  // Get current path for hiding nav icon if on that page
  const currentPath = window.location.pathname;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg md:hidden z-50">
      <div className="flex justify-around items-center h-16">
        {currentNavItems.filter(item => item.name !== 'Profile').map((item) => {
          // Hide nav icon if on that page, but show a special button if headerOnly
          if (currentPath === item.path && !item.headerOnly) return null;
          if (item.headerOnly && currentPath === item.path) {
            // Show a "Back" button or similar for header-only pages
            return (
              <button key="back" onClick={() => window.history.back()} className="flex flex-col items-center justify-center text-xs font-medium px-2 py-1 text-orange-500">
                <svg className="h-6 w-6 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                <span>Back</span>
              </button>
            );
          }
          if (item.headerOnly) return null;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center text-xs font-medium px-2 py-1
                ${isActive ? 'text-orange-500' : 'text-grey-600 -600 0 hover:text-orange-600'}`
              }
            >
              <item.icon className="h-6 w-6 mb-1" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;