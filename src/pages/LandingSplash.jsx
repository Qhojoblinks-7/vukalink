import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.svg'; // Adjust path if needed

export default function LandingSplash() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-vuka-background dark:bg-gray-900">
      <img
        src={logo}
        alt="Logo"
        className="w-32 h-32 animate-spin-vertical mb-8 md:w-40 md:h-40"
        style={{ animation: 'spin-vertical 2s linear infinite' }}
      />
      <button
        onClick={() => navigate('/dashboard')}
        className="w-11/12 max-w-xs px-6 py-4 rounded-xl bg-vuka-blue text-white font-bold shadow-lg text-lg tracking-wide hover:bg-vuka-strong transition md:hidden"
      >
        Go to Dashboard
      </button>
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
