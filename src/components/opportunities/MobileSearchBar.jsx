// src/components/opportunities/MobileSearchBar.jsx
import React from 'react';
import { MagnifyingGlassIcon, MapPinIcon, CurrencyDollarIcon, FunnelIcon } from '@heroicons/react/24/outline'; // Install @heroicons/react

const MobileSearchBar = ({ keyword, setKeyword, onFilterClick }) => {
  return (
    <div className="mb-4 bg-white  p-4 rounded-lg shadow-sm">
      {/* Search Input */}
      <div className="relative mb-4">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-grey-600 -400" />
        <input
          type="text"
          placeholder="Search job titles, companies, skills"
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-vuka-blue"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>

      {/* Filter Buttons */}
      <div className="flex justify-around space-x-2">
        <button className="flex-1 flex items-center justify-center p-3 border border-gray-300 rounded-lg ttext-grey-600 -900 bg-gray-50 hover:bg-grey-500      transition-colors">
          <MapPinIcon className="h-5 w-5 mr-2" /> Location
        </button>
        <button className="flex-1 flex items-center justify-center p-3 border border-gray-300 rounded-lg ttext-grey-600 -900 bg-gray-50 hover:bg-grey-500      transition-colors">
          <CurrencyDollarIcon className="h-5 w-5 mr-2" /> Paid
        </button>
        <button
          onClick={onFilterClick}
          className="flex-1 flex items-center justify-center p-3 border border-gray-300 rounded-lg ttext-grey-600 -900 bg-gray-50 hover:bg-grey-500      transition-colors"
        >
          <FunnelIcon className="h-5 w-5 mr-2" /> Filters
        </button>
      </div>
    </div>
  );
};

export default MobileSearchBar;