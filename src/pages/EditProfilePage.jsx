// src/pages/EditProfilePage.jsx
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import StudentEditProfileForm from '../components/profile/StudentEditProfileForm';
import CompanyEditProfileForm from '../components/profile/CompanyEditProfileForm';
import MobileBottomNav from '../components/dashboard/MobileBottomNav'; // Assuming this exists
import MobileHeader from '../components/dashboard/MobileHeader'; // Assuming this exists

const EditProfilePage = () => {
  const { user, loading, error } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-vuka-blue text-2xl font-heading">
        Loading Profile...
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen text-vuka-danger text-xl font-body p-4">
        {error ? `Error: ${error.message}` : "Please log in to edit your profile."}
      </div>
    );
  }

  const handleSaveProfile = async (profileData) => {
    // In a real application, you would send this data to your backend API
    // and update the user context after successful save.
    console.log("Saving profile data:", profileData);
    alert("Profile saved successfully! (Simulated)");
    // Here you would typically call an API, e.g.:
    // await updateUserProfile(user.id, profileData);
    // refetchUser(); // To update the user context
  };

  return (
    <div className="bg-vuka-grey-light min-h-screen flex flex-col">
      {/* Mobile Header */}
      <div className="md:hidden">
        <MobileHeader title="My Profile" showBack={false} showBell={true} showProfile={false} /> {/* Assuming MobileHeaderProps */}
      </div>

      <div className="flex-grow md:flex md:justify-center md:items-start p-4 md:p-8">
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 w-full md:max-w-4xl">
          <h1 className="text-2xl md:text-3xl font-heading text-vuka-strong mb-6 border-b pb-4">
            My Profile
          </h1>
          {user.role === 'student' ? (
            <StudentEditProfileForm user={user} onSave={handleSaveProfile} />
          ) : user.role === 'company' ? (
            <CompanyEditProfileForm user={user} onSave={handleSaveProfile} />
          ) : (
            <p className="text-vuka-danger">Unknown user role.</p>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden">
        <MobileBottomNav isCompany={user.role === 'company'} />
      </div>
    </div>
  );
};

export default EditProfilePage;