// src/services/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Retrieve Supabase credentials from environment variables
// Vite automatically exposes VITE_ prefixed variables as import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if environment variables are loaded
if (!supabaseUrl || !supabaseAnonKey) {
    console.error("🔴 SUPABASE CONFIGURATION ERROR:");
    console.error("Missing environment variables. Please set:");
    console.error("- VITE_SUPABASE_URL=your_supabase_project_url");
    console.error("- VITE_SUPABASE_ANON_KEY=your_supabase_anon_key");
    console.error("Current values:");
    console.error("- VITE_SUPABASE_URL:", supabaseUrl || "❌ MISSING");
    console.error("- VITE_SUPABASE_ANON_KEY:", supabaseAnonKey ? "✅ SET" : "❌ MISSING");
}

// Create a mock client for demo purposes when environment variables are missing
const createMockSupabaseClient = () => {
    return {
        auth: {
            getUser: () => Promise.resolve({ data: { user: null }, error: null }),
            signUp: () => Promise.resolve({ data: null, error: { message: "Demo mode: Supabase not configured" } }),
            signInWithPassword: () => Promise.resolve({ data: null, error: { message: "Demo mode: Supabase not configured" } }),
            signOut: () => Promise.resolve({ error: null }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
        },
        from: () => ({
            select: () => ({ data: [], error: null }),
            insert: () => ({ data: null, error: { message: "Demo mode: Supabase not configured" } }),
            update: () => ({ data: null, error: { message: "Demo mode: Supabase not configured" } }),
            delete: () => ({ data: null, error: { message: "Demo mode: Supabase not configured" } })
        }),
        storage: {
            from: () => ({
                upload: () => Promise.resolve({ data: null, error: { message: "Demo mode: Supabase not configured" } }),
                getPublicUrl: () => ({ data: { publicUrl: "/demo-image.jpg" } })
            })
        }
    };
};

// Create and export the Supabase client instance
export const supabase = (supabaseUrl && supabaseAnonKey) 
    ? createClient(supabaseUrl, supabaseAnonKey)
    : createMockSupabaseClient();

// Log the configuration status
if (supabaseUrl && supabaseAnonKey) {
    console.log("✅ Supabase client configured successfully");
} else {
    console.warn("⚠️  Running in DEMO MODE - Supabase not configured");
    console.warn("🔧 To enable full functionality, add environment variables to your deployment");
}