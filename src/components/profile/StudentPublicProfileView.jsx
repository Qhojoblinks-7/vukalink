// src/components/profile/StudentPublicProfileView.jsx
import React from 'react';
import ProfileSection from '../shared/ProfileSection';
import {
  UserCircleIcon, BookOpenIcon, AcademicCapIcon, BriefcaseIcon,
  LinkIcon, ShieldCheckIcon, EnvelopeIcon, PhoneIcon, MapPinIcon
} from '@heroicons/react/24/outline'; // Icons for sections

const StudentPublicProfileView = ({ profile }) => {
  if (!profile) {
    return <p className="text-center text-vuka-medium-grey">Profile data not available.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center mb-6">
        <img
          src={profile.profileImage || '/images/default-avatar.png'}
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover border-4 border-vuka-orange shadow-md"
        />
        <h2 className="text-2xl font-semibold mt-3 text-vuka-strong">{`${profile.firstName} ${profile.lastName}`}</h2>
        <p className="text-md text-vuka-medium-grey">{profile.academicInfo?.program} at {profile.academicInfo?.university}</p>
        {profile.isVerified && (
          <span className="inline-flex items-center mt-2 px-3 py-1 rounded-full text-sm font-medium bg-vuka-green-light text-vuka-green">
            <ShieldCheckIcon className="h-4 w-4 mr-1" /> Verified Profile
          </span>
        )}
      </div>

      <ProfileSection title="About" icon={<UserCircleIcon className="h-5 w-5 mr-2 text-vuka-blue" />} defaultOpen={true}>
        <p className="text-vuka-text text-sm mb-4">{profile.bio || 'No bio provided.'}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center">
            <EnvelopeIcon className="h-5 w-5 mr-2 text-vuka-medium-grey" />
            <span>{profile.email}</span>
          </div>
          <div className="flex items-center">
            <PhoneIcon className="h-5 w-5 mr-2 text-vuka-medium-grey" />
            <span>{profile.phone || 'N/A'}</span>
          </div>
          <div className="flex items-center">
            <MapPinIcon className="h-5 w-5 mr-2 text-vuka-medium-grey" />
            <span>{profile.location || 'N/A'}</span>
          </div>
          <div className="flex items-center">
            <UserCircleIcon className="h-5 w-5 mr-2 text-vuka-medium-grey" />
            <span>{profile.gender || 'N/A'}</span>
          </div>
        </div>
      </ProfileSection>

      <ProfileSection title="Academic Information" icon={<AcademicCapIcon className="h-5 w-5 mr-2 text-vuka-blue" />}>
        <p className="text-vuka-text text-sm">
          <strong>University:</strong> {profile.academicInfo?.university || 'N/A'}
        </p>
        <p className="text-vuka-text text-sm">
          <strong>Program:</strong> {profile.academicInfo?.program || 'N/A'}
        </p>
        <p className="text-vuka-text text-sm">
          <strong>Graduation Year:</strong> {profile.academicInfo?.graduationYear || 'N/A'}
        </p>
      </ProfileSection>

      <ProfileSection title="Skills" icon={<BriefcaseIcon className="h-5 w-5 mr-2 text-vuka-blue" />}>
        {profile.skillsInterests?.skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {profile.skillsInterests.skills.map((skill, index) => (
              <span key={index} className="px-3 py-1 bg-vuka-blue-light text-vuka-blue text-sm rounded-full">
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-vuka-medium-grey text-sm">No skills listed.</p>
        )}
      </ProfileSection>

      <ProfileSection title="Resume / CV" icon={<BookOpenIcon className="h-5 w-5 mr-2 text-vuka-blue" />}>
        {profile.resumeCV?.fileName ? (
          <a
            href={profile.resumeCV.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-vuka-blue hover:underline text-sm"
          >
            <BookOpenIcon className="h-5 w-5 mr-2" /> Download {profile.resumeCV.fileName}
          </a>
        ) : (
          <p className="text-vuka-medium-grey text-sm">No resume/CV available.</p>
        )}
      </ProfileSection>

      <ProfileSection title="Portfolio & Project Links" icon={<LinkIcon className="h-5 w-5 mr-2 text-vuka-blue" />}>
        {profile.portfolioProjectLinks?.length > 0 ? (
          <ul className="list-disc pl-5 space-y-1 text-sm">
            {profile.portfolioProjectLinks.map((link, index) => (
              <li key={index}>
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-vuka-blue hover:underline">
                  {link.name || link.url}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-vuka-medium-grey text-sm">No portfolio or project links available.</p>
        )}
      </ProfileSection>

      {/* For a public profile, avoid showing sensitive "Account Settings" or "Delete Account" */}
    </div>
  );
};

export default StudentPublicProfileView;