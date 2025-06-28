// OpportunitiesPage.jsx

import React from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const OpportunitiesPage = () => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-1 p-8">
      <h2 className="text-2xl font-bold mb-4">Opportunities</h2>
      {/* Opportunities content goes here */}
    </main>
    <Footer />
  </div>
);

export default OpportunitiesPage;
