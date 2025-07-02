// src/services/profileService.js
import { supabase } from '../services/supabaseClient';

export const profileService = {
  /**
   * Fetches the full profile data for the current authenticated user.
   * This is useful after login to get the 'role' and specific student/company data.
   */
  async getCurrentUserProfile() {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) throw new Error("Not authenticated to get current user profile.");
    if (!user) return null; // No user logged in

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      throw new Error(`Error fetching current user profile: ${error.message}`);
    }
    return data;
  },

  /**
   * Fetches a specific user's profile by ID.
   * Useful for viewing company profiles or student profiles.
   */
  async getProfileById(profileId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*') // Adjust this select to fetch only public data if RLS doesn't fully handle it.
      .eq('id', profileId)
      .single();

    if (error) {
      throw new Error(`Error fetching profile with ID ${profileId}: ${error.message}`);
    }
    return data;
  },

  /**
   * Updates the current authenticated user's profile.
   * RLS ensures only the user can update their own profile.
   */
  async updateCurrentUserProfile(profileUpdates) {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) throw new Error("Not authenticated to update profile.");
    if (!user) throw new Error("No user logged in.");

    // Filter updates to ensure 'id', 'role', 'created_at' are not directly updated by client
    const safeUpdates = { ...profileUpdates };
    delete safeUpdates.id;
    delete safeUpdates.role; // Role changes should be admin-controlled or very specific flows
    delete safeUpdates.created_at;

    const { data, error } = await supabase
      .from('profiles')
      .update(safeUpdates)
      .eq('id', user.id)
      .select(); // Return the updated record

    if (error) {
      throw new Error(`Error updating current user profile: ${error.message}`);
    }
    return data[0]; // Returns the updated profile
  },

  /**
   * Fetches all public company profiles.
   * Useful for students Browse companies.
   */
  async getAllCompanies() {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, company_data') // Select only public fields
      .eq('role', 'company');

    if (error) {
      throw new Error(`Error fetching all companies: ${error.message}`);
    }
    return data;
  },

  /**
   * Fetches all public student profiles (e.g., for companies to browse talent).
   * RLS should be set up to control what company can see from student profiles.
   */
  async getAllStudents() {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, student_data') // Select public fields
      .eq('role', 'student');

    if (error) {
      throw new Error(`Error fetching all students: ${error.message}`);
    }
    return data;
  },
};