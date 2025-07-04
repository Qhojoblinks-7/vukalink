// src/components/resources/ResourceSidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon, DocumentTextIcon, BookOpenIcon, UserGroupIcon, AcademicCapIcon,
  ChevronLeftIcon, ChartBarIcon,EnvelopeIcon, BriefcaseIcon // Example icons for categories
} from '@heroicons/react/24/outline';
import { Cog6ToothIcon, InformationCircleIcon } from '@heroicons/react/24/solid';

const ResourceSidebar = ({ isOpen, onClose, categories, selectedCategory, onSelectCategory }) => {
  const location = useLocation();

  // You can define a map for icons to categories if you want specific icons
  const categoryIcons = {
    'All Articles': HomeIcon,
    'Resume Tips': DocumentTextIcon,
    'Interview Prep': BookOpenIcon,
    'Networking': UserGroupIcon,
    'Career Growth': AcademicCapIcon,
    // Add more if you have them
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-vuka-dark-blue text-white shadow-lg z-50 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static md:flex md:flex-col transition-transform duration-300 ease-in-out`}
      >
        <div className="p-4 flex justify-between items-center border-b border-vuka-blue-dark">
          <Link to="/" onClick={onClose}>
            {/* Replace with your actual logo component or image */}
            <img src="/logo.png" alt="Vuka Logo" className="h-10" />
          </Link>
          <button onClick={onClose} className="md:hidden text-white focus:outline-none">
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-grow p-4 space-y-2">
          <h2 className="text-vuka-medium-grey text-sm uppercase font-semibold mb-3 px-3">Article Categories</h2>
          {categories.map((category) => {
            const Icon = categoryIcons[category.label] || DocumentTextIcon; // Default icon
            return (
              <button
                key={category.value}
                onClick={() => { onSelectCategory(category.value); onClose(); }}
                className={`flex items-center w-full text-left p-3 rounded-lg text-lg font-medium transition-colors duration-200
                  ${selectedCategory === category.value
                    ? 'bg-vuka-blue-light text-vuka-blue' // Active state
                    : 'text-white hover:bg-blue-400  hover:text-vuka-blue' // Inactive state
                  }`}
              >
                <Icon className="h-6 w-6 mr-3" />
                {category.label}
              </button>
            );
          })}
           <h2 className="text-vuka-medium-grey text-sm uppercase font-semibold mt-6 mb-3 px-3">More Links</h2>
           <Link
                to="/dashboard"
                onClick={onClose}
                className={`flex items-center w-full text-left p-3 rounded-lg text-lg font-medium transition-colors duration-200
                  ${location.pathname === '/dashboard' ? 'bg-vuka-blue-light text-vuka-blue' : 'text-white hover:bg-blue-400  hover:text-vuka-blue'}`}
            >
                <HomeIcon className="h-6 w-6 mr-3" />
                My Dashboard
            </Link>
            <Link
                to="/opportunities"
                onClick={onClose}
                className={`flex items-center w-full text-left p-3 rounded-lg text-lg font-medium transition-colors duration-200
                  ${location.pathname === '/opportunities' ? 'bg-vuka-blue-light text-vuka-blue' : 'text-white hover:bg-blue-400  hover:text-vuka-blue'}`}
            >
                <BriefcaseIcon className="h-6 w-6 mr-3" />
                Find Opportunities
            </Link>
            <Link
                to="/messages"
                onClick={onClose}
                className={`flex items-center w-full text-left p-3 rounded-lg text-lg font-medium transition-colors duration-200
                  ${location.pathname === '/messages' ? 'bg-vuka-blue-light text-vuka-blue' : 'text-white hover:bg-blue-400  hover:text-vuka-blue'}`}
            >
                <EnvelopeIcon className="h-6 w-6 mr-3" />
                Messages
            </Link>
            <Link
                to="/profile/edit"
                onClick={onClose}
                className={`flex items-center w-full text-left p-3 rounded-lg text-lg font-medium transition-colors duration-200
                  ${location.pathname === '/profile/edit' ? 'bg-vuka-blue-light text-vuka-blue' : 'text-white hover:bg-blue-400  hover:text-vuka-blue'}`}
            >
                <Cog6ToothIcon className="h-6 w-6 mr-3" /> {/* Assuming Cog8Icon is fixed/available */}
                My Profile
            </Link>
        </nav>

        {/* Optional: Footer section in sidebar */}
        <div className="p-4 border-t border-vuka-blue-dark">
            <Link to="/about" className="flex items-center text-sm text-gray-300 hover:text-white mb-2" onClick={onClose}>
                <InformationCircleIcon className="h-5 w-5 mr-2" /> About Vuka
            </Link>
            <Link to="/contact" className="flex items-center text-sm text-gray-300 hover:text-white" onClick={onClose}>
                <EnvelopeIcon className="h-5 w-5 mr-2" /> Contact Us
            </Link>
        </div>
      </div>
    </>
  );
};

export default ResourceSidebar;