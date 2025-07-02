// src/services/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Retrieve Supabase credentials from environment variables
// Vite automatically exposes VITE_ prefixed variables as import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// --- CRITICAL DEBUGGING LOGS ---
console.log("SupabaseClient: VITE_SUPABASE_URL =", supabaseUrl);
console.log("SupabaseClient: VITE_SUPABASE_ANON_KEY =", supabaseAnonKey ? 'Loaded (length: ' + supabaseAnonKey.length + ')' : 'Undefined/Empty');
// --------------------------------

// Check if environment variables are loaded
if (!supabaseUrl || !supabaseAnonKey) {
    console.error("SupabaseClient: ERROR: Supabase URL or Anon Key is missing. Please check your .env file.");
    // We will continue to create the client with undefined values for now to see the subsequent errors.
}

// Create and export the Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log("SupabaseClient: Supabase client instance created.");
console.log("SupabaseClient: Supabase client object:", supabase); // Check if the client object itself is valid