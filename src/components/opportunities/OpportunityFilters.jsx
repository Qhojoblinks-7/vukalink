// src/components/opportunities/OpportunityFilters.jsx
import React, { useState, useEffect } from 'react';
import Button from '../ui/Button'; // Ensure path is correct
import { XMarkIcon } from '@heroicons/react/24/outline'; // For skill tag removal

const locations = ['Accra', 'Kumasi', 'Tamale', 'Takoradi', 'Remote'];
const industries = ['Tech', 'Marketing', 'Health', 'Finance', 'Education', 'Engineering'];
const durations = ['1 Month', '2-3 Months', '4-6 Months', '6+ Months'];

const OpportunityFilters = ({ filters, setFilters, onApply, onClear }) => {
  const [localFilters, setLocalFilters] = useState(filters); // Use local state for immediate changes

  useEffect(() => {
    setLocalFilters(filters); // Sync with external filters when they change
  }, [filters]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setLocalFilters(prev => ({
        ...prev,
        [name]: checked
          ? [...prev[name], value]
          : prev[name].filter(item => item !== value)
      }));
    } else if (type === 'radio') {
      setLocalFilters(prev => ({ ...prev, [name]: value }));
    } else {
      setLocalFilters(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSkillAdd = (e) => {
    if (e.key === 'Enter' && e.target.value.trim() !== '') {
      const newSkill = e.target.value.trim();
      if (!localFilters.skills.includes(newSkill)) {
        setLocalFilters(prev => ({
          ...prev,
          skills: [...prev.skills, newSkill]
        }));
      }
      e.target.value = ''; // Clear input
    }
  };

  const handleSkillRemove = (skillToRemove) => {
    setLocalFilters(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-heading font-bold text-grey-600 -900 dark:text-grey-600 -600 mb-6">Find Internships</h2>

      {/* Keyword Search */}
      <div className="mb-6">
        <label htmlFor="keyword" className="block text-grey-600 -900 dark:text-grey-600 -600 text-sm font-medium mb-2">Keyword, company, role...</label>
        <input
          type="text"
          id="keyword"
          name="keyword"
          placeholder="e.g., Software Engineer, Google"
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-600 focus:border-blue-600"
          value={localFilters.keyword}
          onChange={handleChange}
        />
      </div>

      {/* Location Filter */}
      <div className="mb-6">
        <h3 className="text-grey-600 -900 dark:text-grey-600 -600 text-sm font-medium mb-3">Location</h3>
        <div className="grid grid-cols-2 gap-2">
          {locations.map(loc => (
            <label key={loc} className="flex items-center text-grey-600 -700 dark:text-grey-600 -300">
              <input
                type="checkbox"
                name="location"
                value={loc}
                checked={localFilters.location.includes(loc)}
                onChange={handleChange}
                className="mr-2 text-blue-600 rounded focus:ring-blue-600"
              />
              {loc}
            </label>
          ))}
        </div>
      </div>

      {/* Industry Filter */}
      <div className="mb-6">
        <h3 className="text-grey-600 -900 dark:text-grey-600 -600 text-sm font-medium mb-3">Industry</h3>
        <div className="grid grid-cols-2 gap-2">
          {industries.map(ind => (
            <label key={ind} className="flex items-center text-grey-600 -700 dark:text-grey-600 -300">
              <input
                type="checkbox"
                name="industry"
                value={ind}
                checked={localFilters.industry.includes(ind)}
                onChange={handleChange}
                className="mr-2 text-blue-600 rounded focus:ring-blue-600"
              />
              {ind}
            </label>
          ))}
        </div>
      </div>

      {/* Skills Filter */}
      <div className="mb-6">
        <h3 className="text-grey-600 -900 dark:text-grey-600 -600 text-sm font-medium mb-3">Skills</h3>
        <input
          type="text"
          placeholder="Add skill"
          onKeyDown={handleSkillAdd}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-600 focus:border-blue-600 mb-2"
        />
        <div className="flex flex-wrap gap-2">
          {localFilters.skills.map((skill) => (
            <span key={skill} className="flex items-center bg-blue-100 text-blue-600 text-sm font-medium px-3 py-1 rounded-full">
              {skill}
              <XMarkIcon
                className="ml-2 h-4 w-4 cursor-pointer text-blue-600 hover:text-blue-800"
                onClick={() => handleSkillRemove(skill)}
              />
            </span>
          ))}
        </div>
      </div>

      {/* Academic Program Filter (Radio) */}
      <div className="mb-6">
        <h3 className="text-grey-600 -900 dark:text-grey-600 -600 text-sm font-medium mb-3">Academic Program</h3>
        <label className="flex items-center text-grey-600 -700 dark:text-grey-600 -300">
          <input
            type="radio"
            name="academicProgram"
            value="Any"
            checked={localFilters.academicProgram === 'Any'}
            onChange={handleChange}
            className="mr-2 text-blue-600 focus:ring-blue-600"
          />
          Any
        </label>
        {/* Add more academic programs if needed */}
      </div>

      {/* Duration Filter (Radio) */}
      <div className="mb-6">
        <h3 className="text-grey-600 -900 text-sm font-medium mb-3">Duration</h3>
        <div className="grid grid-cols-2 gap-2">
          {durations.map(dur => (
            <label key={dur} className="flex items-center text-grey-600 -700 dark:text-grey-600 -300">
              <input
                type="radio"
                name="duration"
                value={dur}
                checked={localFilters.duration === dur}
                onChange={handleChange}
                className="mr-2 text-blue-600 focus:ring-blue-600"
              />
              {dur}
            </label>
          ))}
        </div>
      </div>

      {/* Stipend Filter (Radio) */}
      <div className="mb-6">
        <h3 className="text-grey-600 -900 text-sm font-medium mb-3">Stipend</h3>
        <div className="flex space-x-4">
          <label className="flex items-center text-grey-600 -700 dark:text-grey-600 -300">
            <input
              type="radio"
              name="stipend"
              value="paid"
              checked={localFilters.stipend === 'paid'}
              onChange={handleChange}
              className="mr-2 text-blue-600 focus:ring-blue-600"
            />
            Paid
          </label>
          <label className="flex items-center text-grey-600 -700 dark:text-grey-600 -300">
            <input
              type="radio"
              name="stipend"
              value="unpaid"
              checked={localFilters.stipend === 'unpaid'}
              onChange={handleChange}
              className="mr-2 text-blue-600 focus:ring-blue-600"
            />
            Unpaid
          </label>
        </div>
      </div>

      {/* Attachment Type Filter (Radio) */}
      <div className="mb-6">
        <h3 className="text-grey-600 -900 text-sm font-medium mb-3">Attachment Type</h3>
        <div className="flex space-x-4">
          <label className="flex items-center text-grey-600 -700 dark:text-grey-600 -300">
            <input
              type="radio"
              name="attachmentType"
              value="Part-time"
              checked={localFilters.attachmentType === 'Part-time'}
              onChange={handleChange}
              className="mr-2 text-blue-600 focus:ring-blue-600"
            />
            Part-time
          </label>
          <label className="flex items-center text-grey-600 -700 dark:text-grey-600 -300">
            <input
              type="radio"
              name="attachmentType"
              value="Full-time"
              checked={localFilters.attachmentType === 'Full-time'}
              onChange={handleChange}
              className="mr-2 text-blue-600 focus:ring-blue-600"
            />
            Full-time
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-auto pt-6 border-t border-gray-200 flex space-x-4">
        <Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white" onClick={() => onApply(localFilters)}>
          Apply Filters
        </Button>
        <Button variant="ghost" className="flex-1 border border-gray-300 text-grey-600 -900 hover:bg-gray-100    " onClick={onClear}>
          Clear All
        </Button>
      </div>
    </div>
  );
};

export default OpportunityFilters;