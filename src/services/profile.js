// src/services/profile.js
// Functions to fetch/manage user profiles using Supabase
import { supabase } from './supabaseClient';

// Fetch a user profile by user ID
export async function fetchProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
}

// Update a user profile
export async function updateProfile(userId, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
}
