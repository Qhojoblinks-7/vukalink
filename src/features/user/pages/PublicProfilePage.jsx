// src/features/user/pages/PublicProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { userService } from '../../../services'; // Adjust path based on your 'services' folder location
import StudentPublicProfileView from '../../../components/profile/StudentPublicProfileView';
import CompanyPublicProfileView from '../../../components/profile/CompanyPublicProfileView';
import MobileHeader from '../../dashboard/MobileHeader'; // Adjust path
import Loader from '../../../components/ui/Loader'; // Adjust path if needed
import ErrorMessage from '../../../components/ui/ErrorMessage'; // Adjust path if needed

const PublicProfilePage = () => {
  const { userId } = useParams(); // Get the user ID from the URL
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await userService.getPublicProfile(userId);
        if (data) {
          setProfileData(data);
        } else {
          setError(new Error('Profile not found.'));
        }
      } catch (err) {
        console.error("Error fetching public profile:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) { // Ensure userId is available before fetching
      fetchProfile();
    } else {
      setError(new Error("User ID is missing from the URL."));
      setLoading(false);
    }
  }, [userId]); // Re-fetch if userId changes

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-blue-600 text-2xl font-heading">
        <Loader message="Loading Profile..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600 text-xl font-body p-4">
        <ErrorMessage message={error.message} />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600 text-xl font-body p-4">
        No profile data available.
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
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
          <h1 className="text-2xl md:text-3xl font-heading text-blue-900 mb-6 border-b pb-4">
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