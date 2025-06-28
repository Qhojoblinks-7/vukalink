// src/services/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Retrieve Supabase credentials from environment variables
// Vite automatically exposes VITE_ prefixed variables as import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if environment variables are loaded
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URL or Anon Key is missing. Please check your .env file.");
  // You might want to throw an error or handle this more gracefully in a production app
}

// Create and export the Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log("Supabase client initialized."); // For debugging