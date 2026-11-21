import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Retrieve credentials from Vite environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

/**
 * Checks whether valid Supabase credentials have been configured in .env
 */
export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabasePublishableKey &&
    !supabaseUrl.includes('your-project-id') &&
    !supabasePublishableKey.includes('your-supabase-publishable-key')
  );
};

// Safe fallback credentials for initialization to prevent bundling/runtime crashes when .env is not yet configured
const safeUrl = (supabaseUrl && supabaseUrl.startsWith('http')) 
  ? supabaseUrl 
  : 'https://placeholder-project.supabase.co';

const safeKey = supabasePublishableKey || 'placeholder-publishable-key';

/**
 * Centralized Supabase Client for EMPRO
 * Configured with persistent local session handling and token auto-refresh
 */
export const supabase: SupabaseClient = createClient(safeUrl, safeKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export interface ConnectionVerificationResult {
  success: boolean;
  message: string;
  status?: number;
  details?: unknown;
}

/**
 * Verifies whether the Supabase client can communicate with the configured project
 */
export async function verifySupabaseConnection(): Promise<ConnectionVerificationResult> {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      message: 'Supabase credentials are not configured or still contain placeholder values. Please update VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in your .env file.',
    };
  }

  try {
    // Ping the Supabase REST root endpoint using the configured publishable key
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'GET',
      headers: {
        apikey: supabasePublishableKey,
        Authorization: `Bearer ${supabasePublishableKey}`,
      },
    });

    if (response.ok || response.status === 200) {
      return {
        success: true,
        status: response.status,
        message: 'Successfully established connection to Supabase project.',
      };
    }

    if (response.status === 401 || response.status === 403) {
      return {
        success: false,
        status: response.status,
        message: `Authentication failed (HTTP ${response.status}). Please verify that VITE_SUPABASE_PUBLISHABLE_KEY is correct.`,
      };
    }

    return {
      success: false,
      status: response.status,
      message: `Supabase server responded with status HTTP ${response.status}.`,
    };
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      message: `Network communication error with Supabase: ${errorMsg}`,
      details: error,
    };
  }
}

// Attach verification helper to window in browser development mode for quick console testing
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  (window as unknown as { __verifySupabase?: typeof verifySupabaseConnection }).__verifySupabase = verifySupabaseConnection;
}

export default supabase;
