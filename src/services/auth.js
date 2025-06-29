// src/services/auth.js
import { supabase } from './supabaseClient';

/**
 * Handles user sign-up.
 * @param {string} email
 * @param {string} password
 * @returns {object} { user, session, error }
 */
export async function signUp(email, password, role = 'student') {
  // Store role in user_metadata
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { role },
    },
  });

  if (error) {
    console.error("Sign up error:", error.message);
    return { user: null, session: null, error };
  }

  if (data.user && !data.session) {
    console.log("Sign up successful, please check your email for a verification link.");
    return { user: data.user, session: null, error: null, needsConfirmation: true };
  }

  return { user: data.user, session: data.session, error: null };
}

/**
 * Handles user sign-in.
 * @param {string} email
 * @param {string} password
 * @returns {object} { user, session, error }
 */
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Sign in error:", error.message);
    return { user: null, session: null, error };
  }
  return { user: data.user, session: data.session, error: null };
}

/**
 * Handles user sign-out.
 * @returns {object} { error }
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Sign out error:", error.message);
  }
  return { error };
}

/**
 * Gets the current user session.
 * This is primarily used by the AuthContext for initial load and listening to changes.
 */
export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  return { session, error };
}

/**
 * Gets the current authenticated user.
 */
export async function getUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
}