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
} from '@heroicons/react/24/solid'; // Using solid icons for bottom nav for clarity

const MobileBottomNav = ({ isCompany = false }) => { // Add isCompany prop, default to false

  // Navigation items for students
  const studentNavItems = [
    { name: 'Home', icon: HomeIcon, path: '/dashboard' },
    { name: 'Search', icon: MagnifyingGlassIcon, path: '/opportunities' },
    { name: 'Applications', icon: BriefcaseIcon, path: '/applications' }, // Reusing Briefcase for Applications
    { name: 'Profile', icon: UserCircleIcon, path: '/profile' },
    { name: 'Messages', icon: ChatBubbleBottomCenterTextIcon, path: '/messages' },
  ];

  // Navigation items for companies
  const companyNavItems = [
    { name: 'Home', icon: Square2StackIcon, path: '/company/dashboard' }, // Company Dashboard
    { name: 'Post', icon: PlusCircleIcon, path: '/company/post-opportunity' }, // Post New
    { name: 'Manage', icon: BriefcaseIcon, path: '/company/manage-opportunities' }, // Manage Opportunities
    { name: 'Applicants', icon: UserGroupIcon, path: '/company/applicants' },
    { name: 'Messages', icon: ChatBubbleBottomCenterTextIcon, path: '/company/messages' },
  ];

  const currentNavItems = isCompany ? companyNavItems : studentNavItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg md:hidden z-50">
      <div className="flex justify-around items-center h-16">
        {currentNavItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center text-xs font-medium px-2 py-1
              ${isActive ? 'text-vuka-orange' : 'text-gray-500 hover:text-vuka-orange-dark'}`
            }
          >
            <item.icon className={`h-6 w-6 mb-1 ${({ isActive }) => isActive ? 'text-vuka-orange' : ''}`} />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default MobileBottomNav;