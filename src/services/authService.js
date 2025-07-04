// src/services/authService.js
// --- IMPORTANT: Correct relative import path to supabaseClient.js ---
import { supabase } from './supabaseClient'; // Adjusted path: go up one level, then into supabaseClient.js

const login = async (credentials) => {
    console.log("AuthService: Attempting login for email:", credentials.email);
    if (!supabase) {
        console.error("AuthService: Supabase client is not initialized, cannot perform login.");
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

    console.log("AuthService: Login successful. Data:", data);
    if (!data.user || !data.session) {
        console.warn("AuthService: Login successful but no user/session data. Email confirmation may be pending.");
    }
    return data;
};

const registerStudent = async (userData) => {
    console.log("AuthService: Attempting student registration for email:", userData.email);
    if (!supabase) {
        console.error("AuthService: Supabase client is not initialized, cannot perform registration.");
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

    console.log("AuthService: Student registration initiated. Data:", data);
    // You might want to update profile here or rely on database triggers.
    // If you explicitly set role/full_name in metadata via options.data,
    // your trigger should pick it up. Manual update below is a fallback.
    if (data.user && data.user.id) {
        const { error: profileUpdateError } = await supabase
            .from('profiles')
            .update({ role: 'student', full_name: userData.fullName }) // Ensure these match your profiles table
            .eq('id', data.user.id);
        if (profileUpdateError) {
            console.error("AuthService: Error updating student profile data after signup (manual update):", profileUpdateError.message);
        } else {
            console.log("AuthService: Student profile manually updated successfully.");
        }
    } else {
        console.warn("AuthService: No user data available after student signup to manually update profile. Email confirmation might be pending.");
    }

    return data;
};

const registerCompany = async (companyData) => {
    console.log("AuthService: Attempting company registration for email:", companyData.email);
    if (!supabase) {
        console.error("AuthService: Supabase client is not initialized, cannot perform registration.");
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

    console.log("AuthService: Company registration initiated. Data:", data);
    if (data.user && data.user.id) {
        const { error: profileUpdateError } = await supabase
            .from('profiles')
            .update({
                role: 'company_admin',
                full_name: companyData.companyName, // Use company name as full_name for company profile
                company_data: {
                    company_name: companyData.companyName,
                    industry: companyData.industry || '',
                    website: companyData.website || '',
                    description: companyData.description || ''
                }
            })
            .eq('id', data.user.id);
        if (profileUpdateError) {
            console.error("AuthService: Error updating company profile data after signup (manual update):", profileUpdateError.message);
        } else {
            console.log("AuthService: Company profile manually updated successfully.");
        }
    } else {
        console.warn("AuthService: No user data available after company signup to manually update profile. Email confirmation might be pending.");
    }

    return data;
};

const logout = async () => {
    console.log("AuthService: Attempting logout.");
    if (!supabase) {
        console.error("AuthService: Supabase client is not initialized, cannot perform logout.");
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
    console.log("AuthService: Attempting to get current session (via getSession).");
    if (!supabase) {
        console.error("AuthService: Supabase client is not initialized, cannot get current user.");
        throw new Error("Supabase client is not initialized.");
    }

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
        console.error("AuthService: getSession error:", sessionError.message);
        throw new Error(sessionError.message); // Propagate actual error
    }

    if (session && session.user) {
        console.log("AuthService: Found active session. User from session:", session.user);
        return session.user;
    }

    console.log("AuthService: No active session found. Returning null user.");
    return null; // Explicitly return null if no session/user
};

const getProfile = async (userId) => {
    console.log("AuthService: Fetching profile for userId:", userId);
    if (!supabase) {
        console.error("AuthService: Supabase client is not initialized, cannot get profile.");
        throw new Error("Supabase client is not initialized.");
    }
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) {
        console.error(`AuthService: Get Profile Error for userId ${userId}:`, error.message);
        if (error.code === 'PGRST116') { // Supabase code for "No rows found"
             console.warn(`AuthService: No profile found for userId ${userId}. This is expected for new users before trigger processes.`);
             return null;
        }
        throw new Error(error.message);
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