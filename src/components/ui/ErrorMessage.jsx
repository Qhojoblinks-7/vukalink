// src/components/ui/ErrorMessage.jsx
// Simple error message component
import React from 'react';

const ErrorMessage = ({ message }) => {
  if (!message) return null;
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-2 text-sm" role="alert">
      <span className="font-semibold">Error: </span>{message}
    </div>
  );
};

export default ErrorMessage;
