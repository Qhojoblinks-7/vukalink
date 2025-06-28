// src/components/dashboard/MobileRecommendedJobs.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import DashboardJobCard from './DashboardJobCard';
import Button from '../ui/Button';

const MobileRecommendedJobs = () => {
    const recommendedJobs = [
        {
            id: 'jobA',
            title: 'Marketing Intern',
            company: 'Acme Corp',
            location: 'Remote',
            type: 'Marketing',
            description: 'Assist in digital marketing campaigns and content creation for our growing brand.',
            duration: '3 Months',
            paid: true,
        },
        {
            id: 'jobB',
            title: 'Software Engineering Intern',
            company: 'TechNova',
            location: 'San Francisco',
            type: 'Tech',
            description: 'Join our dev team to build and test scalable software solutions.',
            duration: '6 Months',
            paid: true,
        },
        {
            id: 'jobC',
            title: 'UI/UX Design Intern',
            company: 'CreativeFlow',
            location: 'Accra',
            type: 'Design',
            description: 'Help design user-friendly interfaces for our new mobile applications.',
            duration: '4 Months',
            paid: false,
        },
    ];

    return (
        <section className="mb-4 px-2">
            <h2 className="text-lg font-heading font-bold text-vuka-bold mb-3">Recommended for You</h2>
            <div className="flex overflow-x-auto snap-x snap-mandatory pb-3 space-x-3 -mx-2 px-2">
                {recommendedJobs.map((job) => (
                    <div
                        key={job.id}
                        className="min-w-[90vw] max-w-xs snap-center sm:min-w-[60vw] md:min-w-[50%]"
                    >
                        <DashboardJobCard {...job} />
                    </div>
                ))}
            </div>
            <Link to="/opportunities">
                <Button variant="outline" className="w-full text-center py-2 text-base mt-3">
                    View All Recommendations
                </Button>
            </Link>
        </section>
    );
};

export default MobileRecommendedJobs;