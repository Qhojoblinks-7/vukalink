// src/components/shared/ProfileSection.jsx
import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

const ProfileSection = ({ title, icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 rounded-lg bg-white shadow-sm">
      <div
        className="flex justify-between items-center p-4 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="flex items-center text-lg font-semibold text-vuka-strong">
          {icon} {title}
        </h3>
        {isOpen ? (
          <ChevronUpIcon className="h-6 w-6 text-vuka-medium-grey" />
        ) : (
          <ChevronDownIcon className="h-6 w-6 text-vuka-medium-grey" />
        )}
      </div>
      {isOpen && (
        <div className="p-4 border-t border-gray-200">
          {children}
        </div>
      )}
    </div>
  );
};

export default ProfileSection;