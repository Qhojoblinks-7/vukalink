// src/pages/CompanyApplicantsForOpportunityPage.jsx
import React from 'react';

const CompanyApplicantsForOpportunityPage = () => {
  // Placeholder: You would fetch applicants for a specific opportunity using useParams for the opportunity ID
  // and display them in a table or card list.
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="text-2xl font-bold text-blue-900 mb-4">Applicants for Opportunity</h1>
      <div className="bg-white rounded-lg shadow p-6 w-full max-w-2xl">
        {/* Replace with actual applicants list/table */}
        <p className="text-grey-600 -600">No applicants to display yet.</p>
      </div>
    </div>
  );
};

export default CompanyApplicantsForOpportunityPage;
