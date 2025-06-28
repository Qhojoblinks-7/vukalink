// src/components/ui/Loader.jsx
// Loader with vertical spin animation using logo.svg
import React from 'react';
import logo from '../../assets/logo.svg'; // Change to your actual logo path if different

const Loader = () => (
  <div className="flex flex-col items-center justify-center">
    <img
      src={logo}
      alt="Loading..."
      className="animate-vspin w-16 h-16 mb-2"
      style={{ display: 'block' }}
    />
    <span className="text-vuka-blue font-heading text-lg">Loading...</span>
  </div>
);

export default Loader;

// Tailwind custom animation (add to tailwind.config.js):
// theme: {
//   extend: {
//     keyframes: {
//       vspin: {
//         '0%': { transform: 'rotateX(0deg)' },
//         '100%': { transform: 'rotateX(360deg)' },
//       },
//     },
//     animation: {
//       vspin: 'vspin 1s linear infinite',
//     },
//   },
// },
