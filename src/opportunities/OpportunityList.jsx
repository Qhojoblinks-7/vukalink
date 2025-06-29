// OpportunityList.jsx
import React from 'react';
import OpportunityCard from '../shared/OpportunityCard';

const OpportunityList = ({ opportunities }) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {opportunities.map(opp => (
      <OpportunityCard key={opp.id} opportunity={opp} />
    ))}
  </div>
);

export default OpportunityList;
