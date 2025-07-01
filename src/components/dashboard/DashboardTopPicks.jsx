// src/components/dashboard/DashboardTopPicks.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import DashboardJobCard from './DashboardJobCard';

const DashboardTopPicks = () => {
    const topPicks = [
        {
            id: 'job1',
            title: 'Product Management Intern',
            company: 'Google LLC',
            location: 'Remote',
            duration: '3 Months',
            type: 'Full-time',
            paid: true,
            description: 'Work on improving user flows for Google Search, collaborate with engineers & designers, and drive product vision.',
        },
        {
            id: 'job2',
            title: 'Software Engineering Intern',
            company: 'Linkedin Corp',
            location: 'On-site',
            duration: '6 Months',
            type: 'Paid',
            paid: true,
            description: 'Build scalable backend services, contribute to LinkedIn Learning platform, and participate in agile development cycles.',
        },
        {
            id: 'job3',
            title: 'Data Analytics Intern',
            company: 'Microsoft',
            location: 'Hybrid',
            duration: '4 Months',
            type: 'Internship',
            paid: false,
            description: 'Analyze real-time data, visualize results for Office360, and present actionable insights to the product team.',
        },
    ];

    return (
        <section className="mb-8 px-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center mb-6">
                <h2 className="text-xl sm:text-2xl font-heading font-bold text-blue-900">Top Picks for You</h2>
                <Link to="/opportunities" className="text-blue-400 font-semibold hover:underline text-base sm:text-lg">
                    Find More Internships &rarr;
                </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
                {topPicks.map((job) => (
                    <DashboardJobCard key={job.id} {...job} />
                ))}
            </div>
        </section>
    );
};

export default DashboardTopPicks;
