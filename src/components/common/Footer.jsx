// Footer.jsx
// Global footer component

import React from 'react';

const Footer = () => (
  <footer className="w-full bg-gray-100 text-center py-3 text-gray-500 text-xs sm:text-sm mt-auto px-2 sm:px-4">
    <div className="flex flex-col sm:flex-row items-center justify-between max-w-4xl mx-auto">
      <span className="mb-2 sm:mb-0">&copy; {new Date().getFullYear()} VukaLink. All rights reserved.</span>
      <span className="hidden sm:inline">Empowering students &amp; opportunities.</span>
    </div>
  </footer>
);

export default Footer;
