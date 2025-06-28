// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth'; // Assuming you have an AuthContext to get the current user
import { getProfile, createProfile, updateProfile, uploadAvatar } from '../services/profiles';
import ProfileCard from '../components/profile/ProfileCard';
import Loader from '../components/ui/Loader'; // Assuming you have a Loader component
import ErrorMessage from '../components/ui/ErrorMessage'; // Assuming you have an ErrorMessage component

const ProfilePage = () => {
  const { user } = useAuth(); // Get the current authenticated user from your AuthContext
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false); // New state for showing saving status

  // Function to fetch the user's profile
  const fetchProfile = async () => {
    if (!user) {
      setLoading(false);
      setError('No user logged in.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await getProfile(user.id);

      if (fetchError) {
        // If profile doesn't exist (e.g., first login), try creating it.
        // The SQL database hook `create_student_profile_on_signup` *should* handle this,
        // but this provides a fallback in case the hook isn't set up or fails.
        if (fetchError.code === 'PGRST116') { // Error code for "no rows found" (406 No Content for Supabase PostgREST)
            console.log('Profile not found, attempting to create one.');
            const { data: newProfileData, error: createError } = await createProfile(user.id, {
                full_name: user.user_metadata?.full_name || user.email, // Use full_name from auth or email
                email: user.email,
                // Other fields will be default or empty, user can fill them
            });
            if (createError) {
                console.error('Error creating profile:', createError.message);
                setError('Failed to create profile: ' + createError.message);
            } else {
                setProfile(newProfileData);
            }
        } else {
            console.error('Error fetching profile:', fetchError.message);
            setError('Failed to fetch profile: ' + fetchError.message);
        }
      } else {
        setProfile(data);
      }
    } catch (err) {
      console.error('Unexpected error fetching profile:', err.message);
      setError('An unexpected error occurred: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch profile when component mounts or user changes
  useEffect(() => {
    fetchProfile();
  }, [user]); // Re-fetch if user object changes (e.g., after login/logout)

  // Handle saving profile changes
  const handleSaveProfile = async (updatedFields) => {
    if (!user || !profile) return;

    setIsSaving(true);
    setError(null);
    try {
      const { data, error: updateError } = await updateProfile(user.id, updatedFields);
      if (updateError) {
        throw updateError;
      }
      setProfile(data); // Update local state with the newly saved data
      alert('Profile updated successfully!'); // User feedback
    } catch (err) {
      console.error('Error saving profile:', err.message);
      setError('Failed to save profile: ' + err.message);
      alert('Failed to save profile: ' + err.message); // User feedback
    } finally {
      setIsSaving(false);
    }
  };

  // Handle avatar upload
  const handleUploadAvatar = async (file) => {
    if (!user) {
        const err = new Error('No user logged in to upload avatar.');
        setError(err.message);
        return { data: null, error: err };
    }
    setIsSaving(true); // Indicate saving as upload is part of the save process
    setError(null);
    try {
        const { data: newAvatarUrl, error: uploadError } = await uploadAvatar(user.id, file);
        if (uploadError) {
            throw uploadError;
        }
        // After successful upload, update the profile with the new avatar URL
        // The handleSaveProfile will be triggered by ProfileCard now, so we just return the URL
        return { data: newAvatarUrl, error: null };
    } catch (err) {
        console.error('Error uploading avatar:', err.message);
        setError('Failed to upload avatar: ' + err.message);
        return { data: null, error: err };
    } finally {
        setIsSaving(false); // Reset saving state after upload attempt
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (!profile && !loading && !error) {
    // This case should ideally not be hit if the createProfile fallback works,
    // but useful for debugging if no profile is created.
    return (
      <div className="flex justify-center items-center h-screen">
        <ErrorMessage message="Profile data not available. Please try logging out and back in." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vuka-grey-light flex flex-col items-center justify-center py-10">
      <h1 className="text-4xl font-heading font-bold text-vuka-strong mb-8">Your Profile</h1>
      <ProfileCard
        user={user}
        profile={profile}
        onSave={handleSaveProfile}
        onUploadAvatar={handleUploadAvatar} // Pass the avatar upload function
        loading={isSaving} // Pass saving state to disable inputs
      />
    </div>
  );
};

export default ProfilePage;