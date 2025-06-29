// src/context/AuthContext.jsx
import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContextOnly';
import { supabase } from '../services/supabaseClient'; // Import our initialized Supabase client

// 1. Create the Auth Context (now a named export)
// Move AuthContext to its own file to fix Fast Refresh error

// 3. Create the Auth Provider Component
export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to extract role from user object (Supabase stores in user.user_metadata.role)
  const extractUserWithRole = (userObj) => {
    if (!userObj) return null;
    let role = userObj.user_metadata?.role;
    // fallback: if using app_metadata or other custom claims
    if (!role && userObj.app_metadata?.role) role = userObj.app_metadata.role;
    return { ...userObj, role };
  };

  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error getting initial session:", error);
      } else {
        setSession(session);
        setUser(extractUserWithRole(session?.user) || null);
      }
      setLoading(false);
    };
    getInitialSession();
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(extractUserWithRole(currentSession?.user) || null);
        setLoading(false);
        console.log('Auth event:', event, 'Session:', currentSession);
      }
    );
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    session,
    loading,
  };

  if (loading) {
    // You might want a full-page loading spinner here
    return (
      <div className="flex justify-center items-center min-h-screen text-blue-900 text-2xl font-heading">
        Loading VukaLink...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// REMOVED: export default AuthContext; // <-- No longer default exporting AuthContext