// src/hooks/useAuth.js (or src/context/AuthContext.js / AuthContext.jsx)
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient'; // Ensure this path is correct for your supabaseClient
import { getSession } from '../services/auth'; // Ensure this path is correct for your auth service

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [organizationId, setOrganizationId] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    async function getAuthAndProfile() {
      setLoading(true);
      const { session: currentSession, error: sessionError } = await getSession();
      if (sessionError) {
        console.error("Error getting initial session:", sessionError.message);
        setLoading(false);
        return;
      }
      setSession(currentSession);
      const currentUser = currentSession?.user || null;
      setUser(currentUser);
      if (currentUser) {
        // Fetch profile and organization/role via join
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select(`*, user_organizations (organization_id, role)`)
          .eq('id', currentUser.id)
          .single();
        if (profileError) {
          console.error("Error fetching user profile:", profileError.message);
          setOrganizationId(null);
          setUserRole(null);
        } else {
          // user_organizations is an array (may be empty)
          const org = Array.isArray(profile.user_organizations) ? profile.user_organizations[0] : null;
          setOrganizationId(org?.organization_id ?? null);
          setUserRole(org?.role ?? null);
        }
      } else {
        setOrganizationId(null);
        setUserRole(null);
      }
      setLoading(false);
    }

    // Call once on component mount to get initial session and profile
    getAuthAndProfile();

    // Listen for auth state changes to re-trigger profile fetch if user changes (e.g., login/logout)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, currentSession) => {
      // Re-run the function to update user, session, and profile details
      getAuthAndProfile();
    });

    // Clean up the listener on unmount
    return () => {
      authListener?.unsubscribe();
    };
  }, []); // Empty dependency array means this effect runs once on mount

  // The value provided to consumers of this context
  const value = {
    user,
    session,
    loading,
    organizationId, // This is what you'll use for multi-tenancy checks!
    userRole,       // This is the user's role from the profiles table
    // You might also want to expose signInWithGoogle or other auth methods here
    signInWithGoogle: async () => {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard` // Or your desired post-auth redirect
        }
      });
      setLoading(false);
      if (error) throw error;
      return data;
    },
    // Add other auth functions like signOut if you want them accessible via useAuth
    signOut: async () => {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      setLoading(false);
      if (error) console.error("Error signing out:", error.message);
      // getAuthAndProfile will be triggered by onAuthStateChange after signOut
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Only render children when the auth state has been loaded */}
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Custom hook to easily consume the AuthContext
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}