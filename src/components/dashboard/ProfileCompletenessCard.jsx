// src/components/dashboard/ProfileCompletenessCard.jsx
import React from 'react';
import { ChartBarIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

const ProfileCompletenessCard = ({ completenessPercentage = 75 }) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const progress = circumference * (1 - completenessPercentage / 100);

    return (
        <div className="flex-col bg-white  p-4 rounded-lg shadow-md  justify-between sm:p-6">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
                <h3 className="text-lg font-semibold text-bold sm:text-xl">Profile Completeness</h3>
                <ArrowTopRightOnSquareIcon className="h-5 w-5 text-grey-500 cursor-pointer hover:text-blue-900" />
            </div>

            <div className="flex flex-col items-center space-y-4 mb-4 sm:flex-row sm:items-center  sm:space-x-6 sm:space-y-0 sm:mb-6">
                {/* Progress Circle */}
                <div className="relative w-20 h-20 ml-6 mb-10 sm:w-24 sm:h-24">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 96 96">
                        <circle
                            stroke="#E5E7EB"
                            strokeWidth="10"
                            fill ="transparent"
                            r={radius}
                            cx="48"
                            cy="48"
                        />
                        <circle
                            stroke="#C2410C"
                            strokeWidth="10"
                            strokeDasharray={circumference}
                            strokeDashoffset={progress}
                            strokeLinecap="round"
                            fill="transparent"
                            r={radius}
                            cx="48"
                            cy="48"
                            className="transition-all duration-500 ease-out"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-blue-900 font-bold text-xl sm:text-2xl">
                        {completenessPercentage}%
                    </div>
                </div>

                <div className="w-full flex flex-col items-center sm:items-start">
                    <p className="text-vuka-bold font-medium mb-2 text-center sm:text-left text-sm sm:text-base">
                        Great job! Complete your profile for better matches.
                    </p>
                    <div className="flex-1 flex-col  gap-2 w-full sm:flex-row sm:space-x-2 sm:gap-0">
                        <Link to="/profile/add-resume" className="w-full sm:w-auto">
                            <Button
                                variant="ghost"
                                className="w-full  sm:w-auto text-blue-100 border border-blue-900 hover:bg-blue-900 hover:text-blue-100 text-sm"
                            >
                                Add Resume
                            </Button>
                        </Link>
                        <Link to="/profile/skills" className="w-full sm:w-auto">
                            <Button
                                variant="ghost"
                                className="w-full sm:w-auto text-blue-100 border  border-blue-900 hover:bg-blue-900 hover:text-blue-100 text-sm"
                            >
                                Update Skills
                            </Button>
                        </Link>
                        <Link to="/profile/certifications" className="w-full flex sm:w-auto ">
                            <Button
                                variant="ghost"
                                className="w-full sm:w-50 text-blue-900 border  border-blue-900 hover:bg-blue-100 hover:text-blue-100 text-sm"
                            >
                                Add Certifications
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileCompletenessCard;