// src/components/common/SearchBox.jsx
import React, { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { supabase } from '../../services/supabaseClient';

const SearchBox = ({ placeholder = 'Search internships, companies, skills...', onResults }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    setLoading(true);
    // Example: search internships by title, company, or skills
    const { data, error } = await supabase
      .from('opportunities')
      .select('id, title, company, location, skills')
      .ilike('title', `%${value}%`);
    setLoading(false);
    if (error) {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    setResults(data);
    setShowDropdown(true);
    if (onResults) onResults(data);
  };

  return (
    <div className="relative w-full max-w-xs">
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      <input
        type="text"
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-vuka-blue focus:border-vuka-blue"
        placeholder={placeholder}
        value={query}
        onChange={handleSearch}
        onFocus={() => setShowDropdown(results.length > 0)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
      />
      {showDropdown && (
        <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-72 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-gray-500">Searching...</div>
          ) : results.length === 0 ? (
            <div className="p-4 text-gray-500">No results found</div>
          ) : (
            <ul>
              {results.map((item) => (
                <li key={item.id} className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0">
                  <div className="font-semibold">{item.title}</div>
                  <div className="text-xs text-gray-500">{item.company} &middot; {item.location}</div>
                  <div className="text-xs text-gray-400">{item.skills?.join(', ')}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBox;
