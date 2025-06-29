// src/pages/PublicProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import StudentPublicProfileView from '../components/profile/StudentPublicProfileView';
import CompanyPublicProfileView from '../components/profile/CompanyPublicProfileView';
import MobileHeader from '../components/dashboard/MobileHeader'; // Assuming this exists

const PublicProfilePage = () => {
  const { userId } = useParams(); // Get the user ID from the URL
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dummy data for demonstration
  const dummyUsers = {
    'student123': {
      id: 'student123',
      role: 'student',
      firstName: 'Jordan',
      lastName: 'Mensah',
      email: 'jordan.mensah@example.com',
      phone: '+233 24 123 4567',
      location: 'Accra, Ghana',
      gender: 'Male',
      bio: 'Energetic student passionate about leveraging technology to solve real-world problems. Open to opportunities in software development and product design.',
      profileImage: '/images/student_profile_placeholder.jpg',
      academicInfo: {
        university: 'University of Ghana',
        program: 'B.Sc Computer Science',
        graduationYear: 2026,
      },
      skillsInterests: {
        skills: ['Python', 'React', 'JavaScript', 'SQL', 'Data Analysis'],
        interests: ['Machine Learning', 'Web Development', 'Startups'],
      },
      resumeCV: {
        fileName: 'Jordan_Mensah_CV.pdf',
        url: '/path/to/jordan_cv.pdf',
      },
      portfolioProjectLinks: [
        { name: 'Portfolio Website', url: 'https://jordanmensah.dev' },
        { name: 'GitHub Projects', url: 'https://github.com/jordanmensah' },
      ],
      isVerified: true,
    },
    'company456': {
      id: 'company456',
      role: 'company',
      companyName: 'Acme Corp',
      industry: 'Technology',
      location: 'Accra, Ghana',
      website: 'https://www.acmecorp.com',
      contactEmail: 'info@acmecorp.com',
      contactPhone: '+233 30 123 4567',
      description: 'Acme Corp is a leading technology company specializing in innovative software solutions for businesses worldwide. We believe in fostering a collaborative environment where talent thrives.',
      companySize: '100-500 employees',
      profileImage: '/images/acme_corp_logo.jpg',
      socialLinks: {
        linkedin: 'https://linkedin.com/company/acmecorp',
        twitter: 'https://twitter.com/acmecorp',
        facebook: 'https://facebook.com/acmecorp',
      },
      isVerified: true,
    },
  };

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        // Simulate API call to fetch public profile data
        setTimeout(() => {
          const data = dummyUsers[userId];
          if (data) {
            setProfileData(data);
          } else {
            setError(new Error('Profile not found.'));
          }
          setLoading(false);
        }, 500);
      } catch (err) {
        console.error("Error fetching public profile:", err);
        setError(err);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-vuka-blue text-2xl font-heading">
        Loading Profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-vuka-danger text-xl font-body p-4">
        Error: {error.message}
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex justify-center items-center min-h-screen text-vuka-medium-grey text-xl font-body p-4">
        No profile data available.
      </div>
    );
  }

  return (
    <div className="bg-vuka-grey-light min-h-screen flex flex-col">
      {/* Mobile Header (can be passed dynamic title) */}
      <div className="md:hidden">
        <MobileHeader
          title={profileData.role === 'student' ? `${profileData.firstName} ${profileData.lastName}'s Profile` : `${profileData.companyName}'s Profile`}
          showBack={true}
          showBell={false}
          showProfile={false}
        />
      </div>

      <div className="flex-grow md:flex md:justify-center md:items-start p-4 md:p-8">
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 w-full md:max-w-4xl">
          <h1 className="text-2xl md:text-3xl font-heading text-vuka-strong mb-6 border-b pb-4">
            {profileData.role === 'student' ? 'Student Profile' : 'Company Profile'}
          </h1>
          {profileData.role === 'student' ? (
            <StudentPublicProfileView profile={profileData} />
          ) : (
            <CompanyPublicProfileView profile={profileData} />
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicProfilePage;