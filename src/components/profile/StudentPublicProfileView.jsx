// src/components/profile/StudentPublicProfileView.jsx
import React from 'react';
import ProfileSection from '../shared/ProfileSection';
import {
  UserCircleIcon, BookOpenIcon, AcademicCapIcon, BriefcaseIcon,
  LinkIcon, ShieldCheckIcon, EnvelopeIcon, PhoneIcon, MapPinIcon
} from '@heroicons/react/24/outline'; // Icons for sections

const StudentPublicProfileView = ({ profile }) => {
  if (!profile) {
    return <p className="text-center text-grey-600 -600 0">Profile data not available.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center mb-6">
        <img
          src={profile.profileImage || '/images/default-avatar.png'}
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover border-4 border-orange-400 shadow-md"
        />
        <h2 className="text-2xl font-semibold mt-3 text-grey-600 -900">{`${profile.firstName} ${profile.lastName}`}</h2>
        <p className="text-md text-grey-600 -600 0">{profile.academicInfo?.program} at {profile.academicInfo?.university}</p>
        {profile.isVerified && (
          <span className="inline-flex items-center mt-2 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
            <ShieldCheckIcon className="h-4 w-4 mr-1" /> Verified Profile
          </span>
        )}
      </div>

      <ProfileSection title="About" icon={<UserCircleIcon className="h-5 w-5 mr-2 text-blue-600" />} defaultOpen={true}>
        <p className="text-grey-600 -700 text-sm mb-4">{profile.bio || 'No bio provided.'}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center">
            <EnvelopeIcon className="h-5 w-5 mr-2 text-grey-600 -600 0" />
            <span>{profile.email}</span>
          </div>
          <div className="flex items-center">
            <PhoneIcon className="h-5 w-5 mr-2 text-grey-600 -600 0" />
            <span>{profile.phone || 'N/A'}</span>
          </div>
          <div className="flex items-center">
            <MapPinIcon className="h-5 w-5 mr-2 text-grey-600 -600 0" />
            <span>{profile.location || 'N/A'}</span>
          </div>
          <div className="flex items-center">
            <UserCircleIcon className="h-5 w-5 mr-2 text-grey-600 -600 0" />
            <span>{profile.gender || 'N/A'}</span>
          </div>
        </div>
      </ProfileSection>

      <ProfileSection title="Academic Information" icon={<AcademicCapIcon className="h-5 w-5 mr-2 text-blue-600" />}>
        <p className="text-grey-600 -700 text-sm">
          <strong>University:</strong> {profile.academicInfo?.university || 'N/A'}
        </p>
        <p className="text-grey-600 -700 text-sm">
          <strong>Program:</strong> {profile.academicInfo?.program || 'N/A'}
        </p>
        <p className="text-grey-600 -700 text-sm">
          <strong>Graduation Year:</strong> {profile.academicInfo?.graduationYear || 'N/A'}
        </p>
      </ProfileSection>

      <ProfileSection title="Skills" icon={<BriefcaseIcon className="h-5 w-5 mr-2 text-blue-600" />}>
        {profile.skillsInterests?.skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {profile.skillsInterests.skills.map((skill, index) => (
              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-600 text-sm rounded-full">
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-grey-600 -600 0 text-sm">No skills listed.</p>
        )}
      </ProfileSection>

      <ProfileSection title="Resume / CV" icon={<BookOpenIcon className="h-5 w-5 mr-2 text-blue-600" />}>
        {profile.resumeCV?.fileName ? (
          <a
            href={profile.resumeCV.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-blue-600 hover:underline text-sm"
          >
            <BookOpenIcon className="h-5 w-5 mr-2" /> Download {profile.resumeCV.fileName}
          </a>
        ) : (
          <p className="text-grey-600 -600 0 text-sm">No resume/CV available.</p>
        )}
      </ProfileSection>

      <ProfileSection title="Portfolio & Project Links" icon={<LinkIcon className="h-5 w-5 mr-2 text-blue-600" />}>
        {profile.portfolioProjectLinks?.length > 0 ? (
          <ul className="list-disc pl-5 space-y-1 text-sm">
            {profile.portfolioProjectLinks.map((link, index) => (
              <li key={index}>
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {link.name || link.url}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-grey-600 -600 0 text-sm">No portfolio or project links available.</p>
        )}
      </ProfileSection>

      {/* For a public profile, avoid showing sensitive "Account Settings" or "Delete Account" */}
    </div>
  );
};

export default StudentPublicProfileView;