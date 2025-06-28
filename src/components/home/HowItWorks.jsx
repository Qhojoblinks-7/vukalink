// src/components/home/HowItWorks.jsx
import React from 'react';
import { LightBulbIcon, RocketLaunchIcon, GlobeAltIcon, ChartBarIcon } from '@heroicons/react/24/outline'; // Install: npm install @heroicons/react

const HowItWorksCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-md text-center flex flex-col items-center">
    <div className="p-4 bg-blue-50 rounded-full mb-4">
      <Icon className="h-8 w-8 text-blue" />
    </div>
    <h3 className="text-xl font-semibold text-bold mb-2">{title}</h3>
    <p className="text-grey-500">{description}</p>
  </div>
);

const HowItWorks = () => {
  return (
    <section className="py-20 px-6 md:px-10 text-grey-100">
      <h2 className="text-4xl font-heading font-bold text-bold text-center mb-12">How LinkUp Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        <HowItWorksCard
          icon={LightBulbIcon}
          title="Find Your Fit"
          description="Easily search and filter internships based on your skills, interests, and location."
        />
        <HowItWorksCard
          icon={RocketLaunchIcon}
          title="Kick-start Your Career"
          description="Gain valuable real-world experience and build your professional network."
        />
        <HowItWorksCard
          icon={GlobeAltIcon}
          title="Discover Talent"
          description="Connect with driven and ambitious university graduates eager to make an impact."
        />
        <HowItWorksCard
          icon={ChartBarIcon}
          title="Streamline Recruitment"
          description="Post opportunities and manage applications from a centralized, intuitive dashboard."
        />
      </div>
    </section>
  );
};

export default HowItWorks;