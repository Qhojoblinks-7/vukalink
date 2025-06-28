// Footer.jsx
// Global footer component

import React from 'react';

const Footer = () => (
  <footer className="w-full bg-gray-100 text-center py-4 text-gray-500 text-sm mt-auto">
    &copy; {new Date().getFullYear()} VukaLink. All rights reserved.
  </footer>
);

export default Footer;
