// src/services/userService.js
import { supabase } from './supabaseClient';
import { signUp } from './auth';

export async function completeUserOnboarding(email, password, role, companyName, firstName, lastName) {
  try {
    // --- Step 1: User Signup ---
    const { user: authUser, error: signUpError, needsConfirmation } = await signUp(email, password);

    if (signUpError) {
      console.error('Signup Error:', signUpError.message);
      throw new Error(signUpError.message);
    }

    if (needsConfirmation) {
      // If email confirmation is needed, we stop here.
      // The profile creation will be handled by the database trigger AFTER confirmation.
      return { success: true, message: "Please check your email for verification.", needsConfirmation: true };
    }

    if (!authUser) {
      throw new Error('User data not returned after signup.');
    }

    const userId = authUser.id;
    let organizationId = null;
    let profileRole = role; // Default profile role based on form selection

    // --- Step 2: Create the Organization (if role is 'company') ---
    if (role === 'company' && companyName) {
      const { data: newOrg, error: orgCreationError } = await supabase
        .from('organizations')
        .insert({ name: companyName, created_by: userId })
        .select('id')
        .single();

      if (orgCreationError) {
        console.error('Organization Creation Error:', orgCreationError.message);
        throw new Error(orgCreationError.message);
      }
      if (!newOrg) {
        throw new Error('Failed to create organization or retrieve its ID.');
      }
      organizationId = newOrg.id;

      // Link the user to the organization in `public.user_organizations`
      const { error: userOrgLinkError } = await supabase
        .from('user_organizations')
        .insert({ user_id: userId, organization_id: organizationId, role: 'owner' });

      if (userOrgLinkError) {
        console.error('Linking user to organization Error:', userOrgLinkError.message);
        throw new Error(userOrgLinkError.message);
      }

      // If it's a company, the profile role will be 'company_owner'
      profileRole = 'company_owner';
    }

    // --- Step 3: Update the user's profile in `public.profiles` ---
    // This will now be an UPDATE, as the trigger will have already created the initial profile.
    // We upsert here to handle cases where the profile might already exist (e.g., social login, or if trigger fails).
    // The RLS policy for 'UPDATE' should allow users to update their own profiles (auth.uid() = id)
    const { error: profileUpdateError } = await supabase
      .from('profiles')
      .update({
        first_name: firstName,
        last_name: lastName,
        // email: email, // Email should already be set by trigger or auth.users
        role: profileRole, // Use the determined profile role
        organization_id: organizationId, // Will be null for students, set for company owners
      })
      .eq('id', userId); // Crucially, update where id matches the user's ID

    if (profileUpdateError) {
      console.error('Profile Update Error (after trigger):', profileUpdateError.message);
      throw new Error(profileUpdateError.message);
    }

    console.log('User onboarded and profile updated successfully (after trigger creation).');
    return { success: true, message: "Onboarding complete!" };

  } catch (error) {
    console.error('Onboarding Process Failed:', error.message);
    throw error;
  }
}
// src/services/userService.js
import api from './api';

const getUserProfile = async (userId) => {
  const response = await api.get(`/users/${userId}/profile`);
  return response.data;
};

const updateProfile = async (userId, profileData) => {
  const response = await api.put(`/users/${userId}/profile`, profileData);
  return response.data;
};

// Add functions for messages, applications, etc., if they are user-centric
const getUserApplications = async (userId) => {
  const response = await api.get(`/users/${userId}/applications`);
  return response.data;
};

const userService = {
  getUserProfile,
  updateProfile,
  getUserApplications,
};

export default userService;