/**
 * Supabase Browser Client
 * 
 * SECURITY NOTE: This uses VITE_SUPABASE_PUBLISHABLE_KEY only, which is safe
 * in browser code when Row-Level Security (RLS) is properly configured.
 * 
 * Never place secret keys, service-role keys, or database passwords in
 * frontend environment variables.
 * 
 * The publishable key is acceptable because:
 * 1. RLS policies restrict unauthorized access
 * 2. Sensitive operations (lead insert, email notifications) are handled
 *    server-side via Edge Functions
 * 3. This client is used only for browser-safe operations
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

let supabase: ReturnType<typeof createClient> | null = null;

// Initialize Supabase client if environment variables are present
if (supabaseUrl && supabasePublishableKey) {
  supabase = createClient(supabaseUrl, supabasePublishableKey);
} else if (import.meta.env.DEV) {
  // Development warning only - do not throw error
  console.warn(
    "[LucidFlow Supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY. " +
    "Update .env to enable Supabase integration. See docs/supabase-frontend-setup.md"
  );
}

/**
 * Export the Supabase client
 * Returns null if environment variables are not configured
 * Callers must check for null before using
 */
export const getSupabaseClient = () => supabase;

/**
 * Check if Supabase is properly configured
 */
export const isSupabaseConfigured = () => !!supabase;
