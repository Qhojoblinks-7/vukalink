// src/components/home/PopularOpportunities.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

const OpportunityCard = ({ title, company, location, type, tags }) => (
  <div className="bg-white   p-6 rounded-lg shadow-md">
    <h3 className="text-xl font-semibold text-bold mb-2">{title}</h3>
    <p className="text-grey-600 mb-3">{company} · {location}</p>
    <div className="flex flex-wrap gap-2 mb-4">
      <span className="bg-blue-50 text-blue-900 text-xs font-semibold px-2.5 py-0.5 rounded-full">{type}</span>
      {tags.map((tag, index) => (
        <span key={index} className="bg-gray-200 text-grey-600 -700 text-xs font-medium px-2.5 py-0.5 rounded-full">{tag}</span>
      ))}
    </div>
    <Link to="/opportunities/details/123"> {/* Link to actual opportunity details */}
      <Button variant="outline" className="w-full">View Details</Button>
    </Link>
  </div>
);

const PopularOpportunities = () => {
  const opportunities = [
    {
      title: 'Software Engineering Intern',
      company: 'BrightEdge Labs',
      location: 'Accra',
      type: 'Internship',
      tags: ['Tech', 'Coding'],
    },
    {
      title: 'Marketing Assistant Intern',
      company: 'Reach Media',
      location: 'Remote',
      type: 'Marketing',
      tags: ['Digital', 'Social'],
    },
    {
      title: 'Finance Analyst Intern',
      company: 'FutureBond',
      location: 'Kumasi',
      type: 'Finance',
      tags: ['Fintech', 'Analysis'],
    },
  ];

  return (
    <section className="py-20 px-6 md:px-10 bg-white  ">
      <h2 className="text-4xl font-heading font-bold text-boldtext-center mb-12">Explore Popular Opportunities</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
        {opportunities.map((opp, index) => (
          <OpportunityCard key={index} {...opp} />
        ))}
      </div>
      <div className="text-center">
        <Link to="/opportunities">
          <Button>Browse All Opportunities</Button>
        </Link>
      </div>
    </section>
  );
};

export default PopularOpportunities;