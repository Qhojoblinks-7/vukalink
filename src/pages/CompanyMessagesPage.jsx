// src/pages/CompanyMessagesPage.jsx
import React from 'react';
import { useAuth } from '../hooks/useAuth';

const CompanyMessagesPage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen text-vuka-blue text-2xl font-heading">Loading Messages...</div>;
  }

  if (!user || user.role !== 'company') {
    return <div className="flex justify-center items-center min-h-screen text-vuka-danger text-xl font-body p-4">Access Denied: This page is for company users only.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-vuka-background">
      <h1 className="text-3xl font-heading text-vuka-strong mb-4">Company Messages</h1>
      <p className="text-lg text-vuka-text">This is the messaging platform for company users. (Feature coming soon!)</p>
    </div>
  );
};

export default CompanyMessagesPage;
