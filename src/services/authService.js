// src/services/authService.js
// --- CRITICAL: Ensure this import path is correct based on your file structure.
// --- If supabaseClient.js is in the *same* 'services' folder (e.g., both in src/services/),
// --- then use './supabaseClient'
import { supabase } from './supabaseClient.js'; // Correct relative path
const login = async (credentials) => {
    console.log("AuthService: Attempting login for email:", credentials.email);
    // Ensure supabase object is defined before calling its methods
    if (!supabase) {
        console.error("AuthService: Supabase client is not initialized.");
        throw new Error("Supabase client is not initialized.");
    }
    const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
    });

    if (error) {
        console.error("AuthService: Login Error:", error.message);
        throw new Error(error.message);
    }

    console.log("AuthService: Login successful. Raw Data from signInWithPassword:", data);
    if (!data.user || !data.session) {
        console.warn("AuthService: Login data missing user or session after successful signInWithPassword. This might indicate email confirmation is pending, or an issue with the Supabase setup.");
    }
    return data; // data contains { user, session }
};

const registerStudent = async (userData) => {
    console.log("AuthService: Attempting student registration for email:", userData.email);
    if (!supabase) {
        console.error("AuthService: Supabase client is not initialized.");
        throw new Error("Supabase client is not initialized.");
    }
    const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
            data: {
                full_name: userData.fullName,
                role: 'student',
            },
        },
    });

    if (error) {
        console.error("AuthService: Register Student Error:", error.message);
        throw new Error(error.message);
    }

    console.log("AuthService: Student registration initiated. Raw Data from signUp:", data);
    if (!data.user && !data.session) {
        console.warn("AuthService: SignUp data missing user or session. Email confirmation likely required.");
    }

    // --- IMPORTANT: Re-evaluate this profile update block.
    // --- If your database trigger `handle_new_user` reliably creates/updates the profile
    // --- with all necessary data (role, full_name, student_data), this block can be removed
    // --- to avoid potential race conditions or redundancy.
    if (data.user && data.user.id) {
        console.log("AuthService: Attempting to update student profile post-signup for user:", data.user.id);
        const { error: profileUpdateError } = await supabase
            .from('profiles')
            .update({
                role: 'student',
                student_data: {}, // Populate with relevant student_data if collected during registration
                full_name: userData.fullName
            })
            .eq('id', data.user.id);

        if (profileUpdateError) {
            console.error("AuthService: Error updating student profile data after signup:", profileUpdateError.message);
        } else {
            console.log("AuthService: Student profile updated successfully post-signup.");
        }
    } else {
        console.warn("AuthService: No user data available after student signup, skipping direct profile update. Email confirmation might be pending.");
    }

    return data;
};

const registerCompany = async (companyData) => {
    console.log("AuthService: Attempting company registration for email:", companyData.email);
    if (!supabase) {
        console.error("AuthService: Supabase client is not initialized.");
        throw new Error("Supabase client is not initialized.");
    }
    const { data, error } = await supabase.auth.signUp({
        email: companyData.email,
        password: companyData.password,
        options: {
            data: {
                company_name: companyData.companyName,
                role: 'company_admin',
            },
        },
    });

    if (error) {
        console.error("AuthService: Register Company Error:", error.message);
        throw new Error(error.message);
    }

    console.log("AuthService: Company registration initiated. Raw Data from signUp:", data);
    if (!data.user && !data.session) {
        console.warn("AuthService: SignUp data missing user or session. Email confirmation likely required.");
    }

    // --- IMPORTANT: Re-evaluate this profile update block (similar to student registration).
    if (data.user && data.user.id) {
        console.log("AuthService: Attempting to update company profile post-signup for user:", data.user.id);
        const { error: profileUpdateError } = await supabase
            .from('profiles')
            .update({
                role: 'company_admin',
                company_data: {
                    company_name: companyData.companyName,
                    industry: companyData.industry || '',
                    website: companyData.website || '',
                    description: companyData.description || ''
                },
                full_name: companyData.companyName
            })
            .eq('id', data.user.id);

        if (profileUpdateError) {
            console.error("AuthService: Error updating company profile data after signup:", profileUpdateError.message);
        } else {
            console.log("AuthService: Company profile updated successfully post-signup.");
        }
    } else {
        console.warn("AuthService: No user data available after company signup, skipping direct profile update. Email confirmation might be pending.");
    }

    return data;
};

const logout = async () => {
    console.log("AuthService: Attempting logout.");
    if (!supabase) {
        console.error("AuthService: Supabase client is not initialized.");
        throw new Error("Supabase client is not initialized.");
    }
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error("AuthService: Logout Error:", error.message);
        throw new Error(error.message);
    }
    console.log("AuthService: Logout successful.");
};

const getCurrentUser = async () => {
    console.log("AuthService: Attempting to get current session.");
    if (!supabase) {
        console.error("AuthService: Supabase client is not initialized.");
        throw new Error("Supabase client is not initialized.");
    }
    // Preferred method: Check for active session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
        console.error("AuthService: getSession error:", sessionError.message);
        throw new Error(sessionError.message); // This error will propagate to your Redux thunk
    }

    if (session && session.user) {
        console.log("AuthService: Found active session. User from session:", session.user);
        return session.user; // Return the user object from the valid session
    }

    // Fallback: If no active session, try to get user directly (less common but can be a fallback for some scenarios)
    console.log("AuthService: No active session found. Attempting to get user directly (fallback).");
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) {
        console.error("AuthService: getUser error (fallback):", userError.message);
        throw new Error(userError.message); // This error will propagate to your Redux thunk
    }

    if (user) {
        console.log("AuthService: Found user via getUser fallback. User:", user);
        return user;
    }

    console.log("AuthService: No active session or user found.");
    return null; // No user or session found at all
};

const getProfile = async (userId) => {
    console.log("AuthService: Fetching profile for userId:", userId);
    if (!supabase) {
        console.error("AuthService: Supabase client is not initialized.");
        throw new new Error("Supabase client is not initialized.");
    }
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) {
        console.error(`AuthService: Get Profile Error for userId ${userId}:`, error.message);
        // Supabase returns a specific error code ('PGRST116') if no rows are found
        if (error.code === 'PGRST116') {
             console.warn(`AuthService: No profile found for userId ${userId}. This might be expected for new users before trigger processes.`);
             return null; // Return null if profile not found, let thunk handle it
        }
        throw new Error(error.message); // Throw other errors
    }
    console.log(`AuthService: Profile found for userId ${userId}:`, data);
    return data;
};

export const authService = {
    login,
    registerStudent,
    registerCompany,
    logout,
    getCurrentUser,
    getProfile,
};