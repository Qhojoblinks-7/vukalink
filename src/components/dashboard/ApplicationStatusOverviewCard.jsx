// src/components/dashboard/ApplicationStatusOverviewCard.jsx
import React from 'react';
import { BriefcaseIcon, CloudArrowUpIcon, DocumentMagnifyingGlassIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

const StatusItem = ({ icon: Icon, count, label, colorClass }) => (
    <div className="flex flex-col items-center p-3">
        <Icon className={`h-8 w-8 mb-1 ${colorClass}`} />
        <span className="text-2xl font-bold text-vuka-bold mb-0.5">{count}</span>
        <span className="text-grey-500 text-center text-sm">{label}</span>
    </div>
);

const ApplicationStatusOverviewCard = ({
    totalApplications = 12,
    underReview = 4,
    interviewInvites = 2,
    offersReceived = 1,
}) => {
    return (
        <div className="bg-vuka-white p-4 rounded-lg shadow-md flex flex-col justify-between">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-vuka-bold">Application Status Overview</h3>
                <ArrowTopRightOnSquareIcon className="h-5 w-5 text-grey-500 cursor-pointer hover:text-blue-900" />
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                <StatusItem icon={BriefcaseIcon} count={totalApplications} label="Total Applications" colorClass="text-vuka-bold" />
                <StatusItem icon={CloudArrowUpIcon} count={underReview} label="Under Review" colorClass="text-blue-400" />
                <StatusItem icon={DocumentMagnifyingGlassIcon} count={interviewInvites} label="Interview Invites" colorClass="text-green-500" />
                <StatusItem icon={CheckCircleIcon} count={offersReceived} label="Offers Received" colorClass="text-orange-500" />
            </div>
        </div>
    );
};

export default ApplicationStatusOverviewCard;
