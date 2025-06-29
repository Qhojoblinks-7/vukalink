// src/components/opportunities/MobileOpportunitiesLayout.jsx
import React, { useState } from 'react';
import MobileHeader from '../dashboard/MobileHeader'; // Reusing from dashboard
import MobileBottomNav from '../dashboard/MobileBottomNav'; // Reusing from dashboard
import MobileSearchBar from './MobileSearchBar';
import OpportunityCard from '../shared/OpportunityCard'; // Reusing the shared card
import LoadMoreButton from './LoadMoreButton';
import OpportunityFilters from './OpportunityFilters'; // We'll use this inside a modal for mobile filters

const MobileOpportunitiesLayout = ({ opportunities, onBookmarkToggle }) => {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [currentKeyword, setCurrentKeyword] = useState('');
  const [currentFilters, setCurrentFilters] = useState({
    location: [], industry: [], skills: [],
    academicProgram: '', duration: '', stipend: '', attachmentType: ''
  });
  const [displayCount, setDisplayCount] = useState(4); // How many to show initially

  const filteredAndSearchedOpportunities = opportunities.filter(opp => {
    const matchesKeyword = currentKeyword ?
      (opp.title.toLowerCase().includes(currentKeyword.toLowerCase()) ||
       opp.company.toLowerCase().includes(currentKeyword.toLowerCase()) ||
       opp.description.toLowerCase().includes(currentKeyword.toLowerCase())) : true;

    const matchesLocation = currentFilters.location.length > 0 ?
      currentFilters.location.some(loc => opp.location.toLowerCase().includes(loc.toLowerCase())) : true;

    const matchesSkill = currentFilters.skills.length > 0 ?
      currentFilters.skills.every(skill => opp.skills.map(s => s.toLowerCase()).includes(skill.toLowerCase())) : true;

    const matchesPaid = currentFilters.stipend === 'paid' ? opp.paid :
                       (currentFilters.stipend === 'unpaid' ? !opp.paid : true);

    // Add other filter logic here (industry, duration, attachmentType, academicProgram)

    return matchesKeyword && matchesLocation && matchesSkill && matchesPaid;
  });

  const displayedOpportunities = filteredAndSearchedOpportunities.slice(0, displayCount);

  const handleLoadMore = () => {
    setDisplayCount(prevCount => prevCount + 4); // Load 4 more items
  };

  const handleApplyFilters = (newFilters) => {
    setCurrentFilters(newFilters);
    setDisplayCount(4); // Reset display count on new filters
    setShowFilterModal(false);
  };

  const handleClearFilters = () => {
    setCurrentFilters({
      location: [], industry: [], skills: [],
      academicProgram: '', duration: '', stipend: '', attachmentType: ''
    });
    setDisplayCount(4);
    setShowFilterModal(false);
  };

  return (
    <div className="flex flex-col h-full bg-vuka-grey-light">
      <MobileHeader /> {/* Reusing the mobile header from dashboard */}
      <div className="flex-1 overflow-y-auto p-4 pb-20"> {/* pb-20 for bottom nav */}
        <MobileSearchBar
          keyword={currentKeyword}
          setKeyword={setCurrentKeyword}
          onFilterClick={() => setShowFilterModal(true)}
          // Pass down a 'paid' filter state if needed for the mobile paid button
        />

        {showFilterModal && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-vuka-white w-full max-w-md rounded-lg shadow-lg p-6 max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-heading font-bold mb-4">Filters</h2>
              <OpportunityFilters
                filters={currentFilters}
                setFilters={setCurrentFilters}
                onApply={() => handleApplyFilters(currentFilters)}
                onClear={handleClearFilters}
              />
              <div className="mt-4 flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowFilterModal(false)}>Close</Button>
                <Button onClick={() => handleApplyFilters(currentFilters)}>Apply Filters</Button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          {displayedOpportunities.length > 0 ? (
            displayedOpportunities.map((opportunity) => (
              <OpportunityCard
                key={opportunity.id}
                {...opportunity}
                showApplyButton={false} // No "Apply" button on mobile list view
                onBookmarkToggle={onBookmarkToggle}
              />
            ))
          ) : (
            <p className="text-vuka-medium-grey text-center py-8">No opportunities found matching your criteria.</p>
          )}
        </div>

        {filteredAndSearchedOpportunities.length > displayCount && (
          <LoadMoreButton onClick={handleLoadMore} className="mt-6 mx-auto" />
        )}
      </div>
      <MobileBottomNav /> {/* Reusing the mobile bottom navigation */}
    </div>
  );
};

export default MobileOpportunitiesLayout;