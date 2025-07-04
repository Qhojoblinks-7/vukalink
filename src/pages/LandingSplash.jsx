import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon, PaperAirplaneIcon, ChartBarIcon, RocketLaunchIcon, ArrowRightIcon } from '@heroicons/react/24/outline'; // Importing icons

// Import your splash background images
// Make sure these paths are correct relative to where this component is located
import splash1Bg from '../assets/splas1.png'; // Assuming splash1.png is your abstract network nodes BG
import splash2Bg from '../assets/splash2.png'; // Assuming splash2.png is your blurred photo BG
import splash3Bg from '../assets/splash3.png'; // Assuming splash3.png is your 3rd splash BG

export default function LandingSplash() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0); // 0-indexed: 0 for page 1, 1 for page 2, 2 for page 3
  const totalPages = 3; // We have 3 splash pages

  // Handle navigation to sign-up
  const handleGetStarted = (e) => {
    e.preventDefault();
    navigate('/register-company', { replace: true }); // Navigate to signup on the final page
  };

  // Handle navigation to login
  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/register-company', { replace: true }); // Navigate to login on any page
  };

  // Handle next page
  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Define content for each splash page
  const pageContent = useMemo(() => [
    // Page 1: Based on image_bb5d3f.png
    {
      background: splash1Bg,
      headline: "Your Career Journey Starts Here",
      subHeadline: (
        <>
          Streamline your internship and industrial attachment search with <br className="hidden md:block"/> one powerful platform
        </>
      ),
      showIcons: true,
      primaryButtonText: "Next", // Changes to "Next" for non-final pages
      primaryButtonAction: handleNextPage,
    },
    // Page 2: Based on image_bb4e77.jpg
    {
      background: splash2Bg,
      headline: "Your Career Journey Starts Here",
      subHeadline: (
        <>
          Streamline your internship and industrial attachment search with <br className="hidden md:block"/> VukaLink
        </>
      ),
      showIcons: true,
      primaryButtonText: "Next", // Changes to "Next" for non-final pages
      primaryButtonAction: handleNextPage,
    },
    // Page 3: New page using splash3 and a placeholder text
    {
      background: splash3Bg,
      headline: "Unlock Your Full Potential",
      subHeadline: (
        <>
          Connect with top opportunities and launch your professional journey with confidence.
        </>
      ),
      showIcons: true, // You can decide if icons are present on the 3rd page
      primaryButtonText: "Get Started", // Final page CTA
      primaryButtonAction: handleGetStarted,
    },
  ], [handleNextPage, handleGetStarted]);

  const currentContent = pageContent[currentPage];

  // Only render on mobile (hide everything on md and up for desktop view)
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between py-12 px-6 bg-blue-950 text-white mobile-only relative overflow-hidden"
      style={{
        backgroundImage: `url(${currentContent.background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Semi-transparent overlay to ensure text readability */}
      <div className="absolute top-0 left-0 w-full h-full bg-blue-950 opacity-50 z-0"></div>

      {/* Main Content Area */}
      <div className="flex flex-col items-center text-center z-10 mt-16 flex-grow">
        {/* Logo - "VukaLink" text logo */}
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">VukaLink</h1>

        {/* Main Headline */}
        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 leading-tight">
          {currentContent.headline}
        </h2>

        {/* Sub-headline */}
        <p className="text-base md:text-lg font-body mb-8 px-4 text-gray-200">
          {currentContent.subHeadline}
        </p>

        {/* Feature Icons (Conditionally rendered) */}
        {currentContent.showIcons && (
          <div className="flex justify-around w-full max-w-xs mb-12">
            <div className="flex flex-col items-center mx-2">
              <MagnifyingGlassIcon className="h-10 w-10 text-blue-400 mb-2" />
              <span className="text-sm font-body">Find</span>
            </div>
            <div className="flex flex-col items-center mx-2">
              <PaperAirplaneIcon className="h-10 w-10 text-blue-400 mb-2" />
              <span className="text-sm font-body">Apply</span>
            </div>
            <div className="flex flex-col items-center mx-2">
              <ChartBarIcon className="h-10 w-10 text-blue-400 mb-2" />
              <span className="text-sm font-body">Grow</span>
            </div>
          </div>
        )}

        {/* Primary CTA Button */}
        <a
          href="#"
          onClick={currentContent.primaryButtonAction}
          className="w-11/12 max-w-xs px-6 py-4 rounded-xl bg-orange-500 text-white font-heading font-bold shadow-lg text-lg tracking-wide hover:bg-orange-600 transition flex items-center justify-center mb-4"
          role="button"
        >
          {currentContent.primaryButtonText}
          {currentPage < totalPages - 1 && <ArrowRightIcon className="h-5 w-5 ml-2" />} {/* Arrow only for "Next" button */}
        </a>

        {/* Secondary CTA: I already have an account */}
        <a
          href="#"
          onClick={handleLogin}
          className="w-11/12 max-w-xs px-6 py-4 rounded-xl bg-transparent border-2 border-gray-300 text-white font-heading font-bold text-lg tracking-wide hover:bg-gray-700 transition flex items-center justify-center mb-8"
          role="button"
        >
          I already have an account
        </a>

        {/* Social Proof */}
        <div className="flex items-center space-x-2 mb-8">
          <div className="flex -space-x-3">
            <img className="inline-block h-8 w-8 rounded-full ring-2 ring-blue-950" src="https://images.unsplash.com/photo-1491528323818-fdd1faba65f8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Avatar 1"/>
            <img className="inline-block h-8 w-8 rounded-full ring-2 ring-blue-950" src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Avatar 2"/>
            <img className="inline-block h-8 w-8 rounded-full ring-2 ring-blue-950" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80" alt="Avatar 3"/>
          </div>
          <span className="font-body text-gray-200">Join 2,500+ students</span>
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="flex space-x-2 mb-4 z-10">
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full transition-colors duration-300 ${
              currentPage === index ? 'bg-orange-500' : 'bg-gray-600'
            }`}
            onClick={() => setCurrentPage(index)}
            aria-label={`Go to splash page ${index + 1}`}
          ></button>
        ))}
      </div>

      {/* Custom Styles for mobile-only and fonts (ensure these are loaded in your project's CSS/Tailwind config) */}
      <style>{`
        @media (min-width: 768px) {
          .mobile-only {
            display: none !important;
          }
        }
        /* Define custom font families here if not in tailwind.config.js */
        .font-heading { font-family: 'Montserrat', 'Poppins', sans-serif; }
        .font-body { font-family: 'Roboto', 'Lato', sans-serif; }
      `}</style>
    </div>
  );
}