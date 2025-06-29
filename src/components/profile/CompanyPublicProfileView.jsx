// src/components/profile/CompanyPublicProfileView.jsx
import React from 'react';
import ProfileSection from '../shared/ProfileSection';
import {
  BuildingOfficeIcon, MapPinIcon, GlobeAltIcon, PhoneIcon,
  EnvelopeIcon, InformationCircleIcon, UsersIcon, ShieldCheckIcon,
  LinkIcon, BriefcaseIcon
} from '@heroicons/react/24/outline'; // Icons for sections

const CompanyPublicProfileView = ({ profile }) => {
  if (!profile) {
    return <p className="text-center text-vuka-medium-grey">Profile data not available.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center mb-6">
        <img
          src={profile.profileImage || '/images/default-company-logo.png'}
          alt="Company Logo"
          className="w-28 h-28 rounded-full object-cover border-4 border-vuka-orange shadow-md"
        />
        <h2 className="text-2xl font-semibold mt-3 text-vuka-strong">{profile.companyName}</h2>
        <p className="text-md text-vuka-medium-grey">{profile.industry} | {profile.location}</p>
        {profile.isVerified && (
          <span className="inline-flex items-center mt-2 px-3 py-1 rounded-full text-sm font-medium bg-vuka-green-light text-vuka-green">
            <ShieldCheckIcon className="h-4 w-4 mr-1" /> Verified Company
          </span>
        )}
      </div>

      <ProfileSection title="About Company" icon={<InformationCircleIcon className="h-5 w-5 mr-2 text-vuka-blue" />} defaultOpen={true}>
        <p className="text-vuka-text text-sm mb-4">{profile.description || 'No description provided.'}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center">
            <UsersIcon className="h-5 w-5 mr-2 text-vuka-medium-grey" />
            <span>{profile.companySize || 'N/A'}</span>
          </div>
          <div className="flex items-center">
            <MapPinIcon className="h-5 w-5 mr-2 text-vuka-medium-grey" />
            <span>{profile.location || 'N/A'}</span>
          </div>
          <div className="flex items-center">
            <BriefcaseIcon className="h-5 w-5 mr-2 text-vuka-medium-grey" />
            <span>{profile.industry || 'N/A'}</span>
          </div>
          <div className="flex items-center">
            <EnvelopeIcon className="h-5 w-5 mr-2 text-vuka-medium-grey" />
            <span>{profile.contactEmail || 'N/A'}</span>
          </div>
          <div className="flex items-center">
            <PhoneIcon className="h-5 w-5 mr-2 text-vuka-medium-grey" />
            <span>{profile.contactPhone || 'N/A'}</span>
          </div>
          <div className="flex items-center">
            <GlobeAltIcon className="h-5 w-5 mr-2 text-vuka-medium-grey" />
            {profile.website ? (
              <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-vuka-blue hover:underline">
                {profile.website}
              </a>
            ) : 'N/A'}
          </div>
        </div>
      </ProfileSection>

      <ProfileSection title="Social Media" icon={<LinkIcon className="h-5 w-5 mr-2 text-vuka-blue" />}>
        {profile.socialLinks && (Object.values(profile.socialLinks).some(link => link)) ? (
          <div className="flex flex-wrap gap-4 text-sm">
            {profile.socialLinks.linkedin && (
              <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-vuka-blue hover:underline flex items-center">
                <img src="/icons/linkedin.svg" alt="LinkedIn" className="h-5 w-5 mr-1" /> LinkedIn
              </a>
            )}
            {profile.socialLinks.twitter && (
              <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-vuka-blue hover:underline flex items-center">
                <img src="/icons/twitter.svg" alt="Twitter" className="h-5 w-5 mr-1" /> Twitter
              </a>
            )}
            {profile.socialLinks.facebook && (
              <a href={profile.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-vuka-blue hover:underline flex items-center">
                <img src="/icons/facebook.svg" alt="Facebook" className="h-5 w-5 mr-1" /> Facebook
              </a>
            )}
          </div>
        ) : (
          <p className="text-vuka-medium-grey text-sm">No social media links provided.</p>
        )}
      </ProfileSection>
    </div>
  );
};

export default CompanyPublicProfileView;