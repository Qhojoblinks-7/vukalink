// src/components/opportunities/MobileOpportunitiesLayout.jsx
import React, { useState, useEffect } from 'react';
import MobileHeader from '../../dashboard/MobileHeader'; // Reusing from dashboard
import MobileBottomNav from '../../dashboard/MobileBottomNav'; // Reusing from dashboard
import MobileSearchBar from '../../../components/opportunities/MobileSearchBar';
import OpportunityCard from '../../../components/shared/OpportunityCard'; // Reusing the shared card
import LoadMoreButton from '../../../components/opportunities/LoadMoreButton';
import OpportunityFilters from '../../../components/opportunities/OpportunityFilters'; // We'll use this inside a modal for mobile filters

import { fetchOpportunities } from '../../../services/opportunities';

const MobileOpportunitiesLayout = ({ onBookmarkToggle }) => {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [currentKeyword, setCurrentKeyword] = useState('');
  const [currentFilters, setCurrentFilters] = useState({
    location: [], industry: [], skills: [],
    academicProgram: '', duration: '', stipend: '', attachmentType: ''
  });
  const [displayCount, setDisplayCount] = useState(4);
  const [opportunities, setOpportunities] = useState([]);
  const [totalOpportunities, setTotalOpportunities] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const filters = { ...currentFilters, keyword: currentKeyword };
        const { data, count } = await fetchOpportunities(filters, 1, displayCount, 'Newest');
        setOpportunities(data);
        setTotalOpportunities(count);
      } catch (e) {
        setError('Failed to load opportunities.');
      }
      setLoading(false);
    };
    fetchData();
  }, [currentFilters, currentKeyword, displayCount]);

  const handleLoadMore = () => {
    setDisplayCount(prevCount => prevCount + 4);
  };

  const handleApplyFilters = (newFilters) => {
    setCurrentFilters(newFilters);
    setDisplayCount(4);
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
    <div className="flex flex-col h-full bg-gray-50">
      <MobileHeader />
      <div className="flex-1 overflow-y-auto p-4 pb-20">
        <MobileSearchBar
          keyword={currentKeyword}
          setKeyword={setCurrentKeyword}
          onFilterClick={() => setShowFilterModal(true)}
        />
        {showFilterModal && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 max-h-[90vh] overflow-y-auto">
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
        {loading ? (
          <div className="flex justify-center items-center h-32">Loading...</div>
        ) : error ? (
          <div className="flex justify-center items-center h-32 text-red-500">{error}</div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4">
              {opportunities.length > 0 ? (
                opportunities.map((opportunity) => (
                  <OpportunityCard
                    key={opportunity.id}
                    {...opportunity}
                    showApplyButton={false}
                    onBookmarkToggle={onBookmarkToggle}
                  />
                ))
              ) : (
                <p className="text-grey-600 -600 0 text-center py-8">No opportunities found matching your criteria.</p>
              )}
            </div>
            {opportunities.length < totalOpportunities && totalOpportunities > 0 && (
              <LoadMoreButton onClick={handleLoadMore} className="mt-6 mx-auto" />
            )}
          </>
        )}
      </div>
      <MobileBottomNav />
    </div>
  );
};

export default MobileOpportunitiesLayout;