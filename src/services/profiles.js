// src/services/profile.js
import { supabase } from './supabaseClient'; // Import your Supabase client

/**
 * Fetches a user's profile based on their UUID from the 'students' table.
 * @param {string} userId - The UUID of the user.
 * @returns {Object} An object containing the profile data or an error.
 */
export const getProfile = async (userId) => {
  try {
    const { data, error, status } = await supabase
      .from('students')
      .select(`
        full_name,
        email,
        university,
        major,
        graduation_year,
        skills,
        interests,
        bio,
        resume_url,
        academic_status,
        avatar_url,
        created_at
      `) // <-- FIXED: Removed the comment from inside the select string
      .eq('id', userId)
      .single();

    if (error && status !== 406) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching student profile:', error.message);
    return { data: null, error };
  }
};

/**
 * Creates a new profile for a user in the 'students' table.
 * @param {string} userId - The UUID of the user.
 * @param {Object} profileData - Data for the new profile.
 * @returns {Object} An object containing the new profile data or an error.
 */
export const createProfile = async (userId, profileData) => {
  try {
    const { data, error } = await supabase
      .from('students')
      .insert({ id: userId, ...profileData })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error creating student profile:', error.message);
    return { data: null, error };
  }
};

/**
 * Updates an existing profile for a user in the 'students' table.
 * @param {string} userId - The UUID of the user whose profile is being updated.
 * @param {Object} updates - The profile data to update.
 * @returns {Object} An object containing the updated profile data or an error.
 */
export const updateProfile = async (userId, updates) => {
  try {
    const { data, error } = await supabase
      .from('students')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error updating student profile:', error.message);
    return { data: null, error };
  }
};

/**
 * Uploads an avatar image to Supabase Storage.
 * @param {string} userId - The UUID of the user.
 * @param {File} file - The image file to upload.
 * @returns {Object} An object containing the public URL of the uploaded image or an error.
 */
export const uploadAvatar = async (userId, file) => {
  try {
    const fileExt = file.name.split('.').pop();
    const filePath = `${userId}/avatar.${fileExt}`; // e.g., 'f7cf7cfd-dd0c-4db7-a10e-90078f795a2a/avatar.png'

    const { error: uploadError } = await supabase.storage
      .from('avatars') // Ensure you have an 'avatars' bucket in Supabase Storage
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true, // Set to true to allow overwriting existing avatar
      });

    if (uploadError) {
      throw uploadError;
    }

    // Get public URL
    const { data: publicURLData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    if (!publicURLData || !publicURLData.publicUrl) {
      throw new Error("Could not get public URL for uploaded avatar.");
    }

    return { data: publicURLData.publicUrl, error: null };
  } catch (error) {
    console.error('Error uploading avatar:', error.message);
    return { data: null, error };
  }
};