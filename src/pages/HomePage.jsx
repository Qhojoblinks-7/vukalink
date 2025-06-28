// src/pages/HomePage.jsx
import React from 'react';
import Header from '../components/layout/Header'; // Universal Header
import HeroSection from '../components/home/HeroSection';
import HowItWorks from '../components/home/HowItWorks';
import PopularOpportunities from '../components/home/PopularOpportunities';
import Testimonials from '../components/home/Testimonials';
import CallToAction from '../components/home/CallToAction';
import Footer from '../components/layout/Footer'; // Footer

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
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