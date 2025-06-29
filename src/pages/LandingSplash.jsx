import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.svg'; // Adjust path if needed

export default function LandingSplash() {
  const navigate = useNavigate();

  // Only render on mobile (hide everything on md and up)
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-vuka-background dark:bg-gray-900 mobile-only">
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
        className="w-11/12 max-w-xs px-6 py-4 rounded-xl bg-vuka-blue text-white font-bold shadow-lg text-lg tracking-wide hover:bg-vuka-strong transition block text-center"
        role="button"
      >
        Go to Dashboard
      </a>
      <style>{`
        @media (min-width: 768px) {
          .mobile-only { display: none !important; }
        }
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
