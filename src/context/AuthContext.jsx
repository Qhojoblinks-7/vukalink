// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient'; // Import our initialized Supabase client

// 1. Create the Auth Context
const AuthContext = createContext(null);

// 2. Create a custom hook to use the Auth Context
export function useAuth() {
  return useContext(AuthContext);
}

// 3. Create the Auth Provider Component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Function to get initial session and set up real-time session listener
    const getInitialSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Error getting initial session:", error);
      } else {
        setSession(session);
        setUser(session?.user || null);
      }
      setLoading(false); // Set loading to false once initial session is fetched
    };

    getInitialSession();

    // Listen for auth state changes (e.g., login, logout, token refresh)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user || null);
        setLoading(false); // Update loading state on any auth change
        console.log('Auth event:', event, 'Session:', currentSession); // For debugging
      }
    );

    // Cleanup the subscription when the component unmounts
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []); // Run once on component mount

  // Provide the auth state and any auth functions (will be added via auth.js later)
  const value = {
    user,
    session,
    loading,
    // We'll add signup, signIn, signOut functions here later through the services/auth.js
  };

  if (loading) {
    // You might want a full-page loading spinner here
    return (
      <div className="flex justify-center items-center min-h-screen text-vuka-blue text-2xl font-heading">
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