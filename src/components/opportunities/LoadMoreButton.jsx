// src/components/opportunities/LoadMoreButton.jsx
import React from 'react';
import Button from '../ui/Button'; // Ensure path is correct

const LoadMoreButton = ({ onClick, className }) => {
  return (
    <Button
      onClick={onClick}
      className={`w-full bg-blue-900   hover:bg-blue-800 text-white ${className}`}
    >
      Load More
    </Button>
  );
};

export default LoadMoreButton;