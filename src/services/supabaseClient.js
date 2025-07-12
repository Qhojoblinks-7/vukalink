// src/services/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Retrieve Supabase credentials from environment variables
// Vite automatically exposes VITE_ prefixed variables as import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if environment variables are loaded
if (!supabaseUrl || !supabaseAnonKey) {
    console.error("SupabaseClient: ERROR: Supabase URL or Anon Key is missing. Please check your .env file.");
    throw new Error('Supabase configuration is missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
}

// Create and export the Supabase client instance with optimized configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    },
    realtime: {
        params: {
            eventsPerSecond: 10
        }
    }
});

// Test the connection
supabase.auth.getSession().then(({ data, error }) => {
    if (error) {
        console.error('Supabase connection test failed:', error);
    } else {
        console.log('Supabase client initialized successfully');
    }
});