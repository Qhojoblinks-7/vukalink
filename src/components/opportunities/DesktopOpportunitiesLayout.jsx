// src/components/opportunities/DesktopOpportunitiesLayout.jsx
import React, { useState } from 'react';
import OpportunityFilters from './OpportunityFilters';
import OpportunityList from './OpportunityList';

const DesktopOpportunitiesLayout = ({ opportunities, onBookmarkToggle }) => {
  // In a real app, filters would be managed here and passed down to OpportunityList
  const [currentFilters, setCurrentFilters] = useState({
    keyword: '',
    location: [],
    industry: [],
    skills: [],
    academicProgram: '',
    duration: '',
    stipend: '',
    attachmentType: ''
  });
  const [sortOrder, setSortOrder] = useState('Newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Example: 6 items per page for desktop

  const filteredOpportunities = opportunities.filter(opp => {
    // Basic filtering logic (can be expanded)
    const matchesKeyword = currentFilters.keyword ?
      (opp.title.toLowerCase().includes(currentFilters.keyword.toLowerCase()) ||
       opp.company.toLowerCase().includes(currentFilters.keyword.toLowerCase()) ||
       opp.description.toLowerCase().includes(currentFilters.keyword.toLowerCase())) : true;

    const matchesLocation = currentFilters.location.length > 0 ?
      currentFilters.location.some(loc => opp.location.toLowerCase().includes(loc.toLowerCase())) : true;

    const matchesSkill = currentFilters.skills.length > 0 ?
      currentFilters.skills.every(skill => opp.skills.map(s => s.toLowerCase()).includes(skill.toLowerCase())) : true;

    // Add other filter logic here (industry, duration, stipend, attachmentType, academicProgram)

    return matchesKeyword && matchesLocation && matchesSkill;
  });

  const totalPages = Math.ceil(filteredOpportunities.length / itemsPerPage);
  const paginatedOpportunities = filteredOpportunities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex flex-1 p-4 lg:p-8 space-x-6">
      {/* Left Sidebar - Filters */}
      <div className="w-80 lg:w-96 bg-vuka-white rounded-lg shadow-md p-6 flex-shrink-0">
        <OpportunityFilters
          filters={currentFilters}
          setFilters={setCurrentFilters}
          onApply={() => setCurrentPage(1)} // Reset page on apply filters
          onClear={() => {
            setCurrentFilters({
              keyword: '', location: [], industry: [], skills: [],
              academicProgram: '', duration: '', stipend: '', attachmentType: ''
            });
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Right Content - Opportunity List */}
      <div className="flex-1 overflow-auto">
        <OpportunityList
          opportunities={paginatedOpportunities}
          totalOpportunities={filteredOpportunities.length}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          onBookmarkToggle={onBookmarkToggle}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default DesktopOpportunitiesLayout;