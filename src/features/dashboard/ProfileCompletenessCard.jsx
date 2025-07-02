// src/components/dashboard/MobileProfileCompleteness.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth'; // Assuming your useAuth hook is here
import { profileService } from '../../services'; // Import your profileService
import Loader from '../../components/ui/Loader'; // Assuming you have a Loader component
import ErrorMessage from '../../components/ui/ErrorMessage'; // Assuming you have an ErrorMessage component

const MobileProfileCompleteness = () => {
    const { user } = useAuth(); // Get the authenticated user object
    const [completenessPercentage, setCompletenessPercentage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfileCompleteness = async () => {
            if (!user?.id) {
                setLoading(false);
                setCompletenessPercentage(0);
                // setError("User not authenticated for profile completeness."); // Optional: show error
                return;
            }

            setLoading(true);
            setError(null); // Clear previous errors

            try {
                // Fetch the detailed user profile from your profileService
                const profile = await profileService.getProfileById(user.id);

                if (profile) {
                    let completedFields = 0;
                    let totalFields = 0;

                    // Define the fields that contribute to profile completeness.
                    // IMPORTANT: Adjust these fields to match your actual Supabase 'profiles' table schema.
                    const profileFieldsToCheck = {
                        'full_name': profile.full_name,
                        'phone_number': profile.phone_number,
                        'bio': profile.bio,
                        'resume_url': profile.resume_url,
                        'skills': profile.skills && profile.skills.length > 0,
                        'education': profile.education && profile.education.length > 0,
                        'experience': profile.experience && profile.experience.length > 0,
                        'linkedin_url': profile.linkedin_url,
                        'github_url': profile.github_url,
                        // Add other crucial fields here
                    };

                    for (const key in profileFieldsToCheck) {
                        totalFields++;
                        if (profileFieldsToCheck[key]) {
                            completedFields++;
                        }
                    }

                    const calculatedPercentage = totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
                    setCompletenessPercentage(calculatedPercentage);
                } else {
                    setCompletenessPercentage(0); // No profile found
                    setError("Profile data not found.");
                }
            } catch (err) {
                console.error("Failed to fetch mobile profile completeness:", err);
                setError(err.message || "Failed to load profile completeness.");
                setCompletenessPercentage(0); // Reset on error
            } finally {
                setLoading(false);
            }
        };

        fetchProfileCompleteness();
    }, [user]); // Depend on 'user' so it refetches if user object changes

    if (loading) {
        return (
            <div className="flex justify-center items-center p-3 rounded-lg shadow-sm mb-3 min-h-[100px] bg-white">
                <Loader />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center p-3 rounded-lg shadow-sm mb-3 min-h-[100px] bg-white">
                <ErrorMessage message={error} />
            </div>
        );
    }

    return (
        <div className="bg-white p-3 rounded-lg shadow-sm mb-3 max-w-full">
            <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between mb-3 gap-1">
                <p className="text-grey-600 text-xs xs:text-sm">Profile Completeness</p>
                <span className="text-blue-900 font-bold text-sm xs:text-base">{completenessPercentage}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div
                    className="bg-blue-900 h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${completenessPercentage}%` }}
                ></div>
            </div>
            <Link to="/profile">
                <Button className="w-full text-center py-2 text-sm xs:text-md">Complete Your Profile</Button>
            </Link>
        </div>
    );
};

export default MobileProfileCompleteness;