// src/components/opportunities/DesktopOpportunitiesLayout.jsx

import React, { useState, useEffect } from 'react';
import OpportunityFilters from '../../components/opportunities/OpportunityFilters';
import OpportunityList from '../../components/opportunities/OpportunityList';
import { fetchOpportunities } from '../../services/opportunities';


const DesktopOpportunitiesLayout = ({ onBookmarkToggle }) => {
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
  const itemsPerPage = 6;
  const [opportunities, setOpportunities] = useState([]);
  const [totalOpportunities, setTotalOpportunities] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, count } = await fetchOpportunities(currentFilters, currentPage, itemsPerPage, sortOrder);
        setOpportunities(data);
        setTotalOpportunities(count);
      } catch (err) {
        setError('Failed to load opportunities.');
      }
      setLoading(false);
    };
    fetchData();
  }, [currentFilters, currentPage, sortOrder]);

  const totalPages = Math.ceil(totalOpportunities / itemsPerPage);

  return (
    <div className="flex flex-1 p-4 lg:p-8 space-x-6">
      {/* Left Sidebar - Filters */}
      <div className="w-80 lg:w-96 bg-white rounded-lg shadow-md p-6 flex-shrink-0">
        <OpportunityFilters
          filters={currentFilters}
          setFilters={setCurrentFilters}
          onApply={() => setCurrentPage(1)}
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
        {loading ? (
          <div className="flex justify-center items-center h-64">Loading...</div>
        ) : error ? (
          <div className="flex justify-center items-center h-64 text-red-500">{error}</div>
        ) : (
          <OpportunityList
            opportunities={opportunities}
            totalOpportunities={totalOpportunities}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            onBookmarkToggle={onBookmarkToggle}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
};

export default DesktopOpportunitiesLayout;