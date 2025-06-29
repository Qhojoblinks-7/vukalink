import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.svg'; // Adjust path if needed

export default function LandingSplash() {
  const navigate = useNavigate();

  // Use a real <Link> for navigation to avoid full reloads
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-vuka-background dark:bg-gray-900">
      <img
        src={logo}
        alt="Logo"
        className="w-32 h-32 animate-spin-vertical mb-8 md:w-40 md:h-40"
        style={{ animation: 'spin-vertical 2s linear infinite' }}
      />
      <a
        href="#"
        onClick={e => {
          e.preventDefault();
          navigate('/dashboard', { replace: true });
        }}
        className="w-11/12 max-w-xs px-6 py-4 rounded-xl bg-vuka-blue text-white font-bold shadow-lg text-lg tracking-wide hover:bg-vuka-strong transition md:hidden text-center"
        role="button"
      >
        Go to Dashboard
      </a>
      <style>{`
        @keyframes spin-vertical {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
        .animate-spin-vertical {
          animation: spin-vertical 2s linear infinite;
        }
      `}</style>
    </div>
  );
}
