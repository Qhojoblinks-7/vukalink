// src/pages/HomePage.jsx
import React from 'react';
import HeroSection from '../components/home/HeroSection';
import HowItWorks from '../components/home/HowItWorks';
import PopularOpportunities from '../components/home/PopularOpportunities';
import Testimonials from '../components/home/Testimonials';
import CallToAction from '../components/home/CallToAction';

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white  ">
      <main className="flex-grow">
        <HeroSection />
        <HowItWorks />
        <PopularOpportunities />
        <Testimonials />
        <CallToAction />
      </main>
    </div>
  );
};

export default HomePage;