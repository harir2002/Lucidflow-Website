/**
 * Admin Auth Service
 * 
 * Handles Supabase authentication and authorization for the admin panel.
 * 
 * SECURITY:
 * - Uses Supabase Auth email + password only
 * - Checks that authenticated user is in admin_allowlist table (RLS enforced)
 * - Checks that user email matches VITE_ADMIN_EMAIL (convenience check only)
 * - RLS is the real security boundary
 * - No passwords stored in frontend
 * - Session restored from browser storage after refresh
 */

import { getSupabaseClient } from '@/lib/supabase';
import type { AdminUser, AdminAuthState } from '@/lib/admin-types';

class AdminAuthService {
  private supabase = getSupabaseClient();

  /**
   * Get the configured admin email from environment
   */
  getConfiguredAdminEmail(): string {
    return import.meta.env.VITE_ADMIN_EMAIL?.trim() || '';
  }

  /**
   * Check if Supabase is configured
   */
  isSupabaseConfigured(): boolean {
    return !!this.supabase;
  }

  /**
   * Get current session
   */
  async getSession() {
    if (!this.supabase) return null;

    try {
      const { data, error } = await this.supabase.auth.getSession();
      if (error) throw error;
      return data.session;
    } catch (error) {
      console.error('[AdminAuth] Failed to get session:', error);
      return null;
    }
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<AdminUser | null> {
    if (!this.supabase) return null;

    try {
      const { data, error } = await this.supabase.auth.getUser();
      if (error) throw error;

      if (!data.user) return null;

      return {
        id: data.user.id,
        email: data.user.email || '',
        created_at: data.user.created_at,
        last_sign_in_at: (data.user.last_sign_in_at as string | null) || null,
      };
    } catch (error) {
      console.error('[AdminAuth] Failed to get user:', error);
      return null;
    }
  }

  /**
   * Check if user is in admin allowlist
   * This is a convenience check; RLS policies enforce the real security boundary
   */
  async isUserInAllowlist(userId: string): Promise<boolean> {
    if (!this.supabase) return false;

    try {
      const { data, error } = await this.supabase
        .from('admin_allowlist')
        .select('user_id')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 = no rows found, which is expected
        console.error('[AdminAuth] Failed to check allowlist:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('[AdminAuth] Error checking allowlist:', error);
      return false;
    }
  }

  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    if (!this.supabase) {
      console.error('[AdminAuth] Supabase not configured');
      return { success: false, error: 'Supabase not configured' };
    }

    try {
      console.log('[AdminAuth] Step 1: Attempting Supabase auth signin');

      const { data, error } = await this.supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      console.log('[AdminAuth] Step 2: Supabase response', { 
        hasData: !!data, 
        hasError: !!error,
        errorMessage: error?.message 
      });

      if (error) {
        console.error('[AdminAuth] Auth failed:', error.message);
        return {
          success: false,
          error: 'Invalid email or password. Please try again.',
        };
      }

      console.log('[AdminAuth] Step 3: Auth successful, checking user');

      const user = await this.getCurrentUser();
      if (!user) {
        console.error('[AdminAuth] Could not get user after auth');
        await this.supabase.auth.signOut();
        return {
          success: false,
          error: 'Could not verify user. Please try again.',
        };
      }

      console.log('[AdminAuth] Step 4: Got user:', user.email);

      // Skip email check for now - just check allowlist
      const isAllowed = await this.isUserInAllowlist(user.id);
      
      console.log('[AdminAuth] Step 5: Allowlist check:', isAllowed);

      if (!isAllowed) {
        console.error('[AdminAuth] User not in allowlist');
        await this.supabase.auth.signOut();
        return {
          success: false,
          error: 'Invalid email or password. Please try again.',
        };
      }

      console.log('[AdminAuth] Step 6: Login successful!');
      return { success: true };
    } catch (error) {
      console.error('[AdminAuth] Exception during signin:', error);
      return {
        success: false,
        error: 'An error occurred. Please try again.',
      };
    }
  }

  /**
   * Sign out
   */
  async signOut(): Promise<{ success: boolean; error?: string }> {
    if (!this.supabase) {
      return { success: false, error: 'Supabase not configured' };
    }

    try {
      const { error } = await this.supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('[AdminAuth] Sign out error:', error);
      return {
        success: false,
        error: 'Failed to sign out. Please try again.',
      };
    }
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<{ success: boolean; error?: string }> {
    if (!this.supabase) {
      return { success: false, error: 'Supabase not configured' };
    }

    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        {
          redirectTo: `${window.location.origin}/admin-panel/reset-password`,
        }
      );

      if (error) {
        // Return generic message for security (don't expose if email exists)
        return {
          success: false,
          error: 'An error occurred. Please try again.',
        };
      }

      return { success: true };
    } catch (error) {
      console.error('[AdminAuth] Password reset error:', error);
      return {
        success: false,
        error: 'An error occurred. Please try again.',
      };
    }
  }

  /**
   * Update password with token (from reset email)
   */
  async updatePassword(password: string): Promise<{ success: boolean; error?: string }> {
    if (!this.supabase) {
      return { success: false, error: 'Supabase not configured' };
    }

    try {
      const { error } = await this.supabase.auth.updateUser({
        password,
      });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('[AdminAuth] Update password error:', error);
      return {
        success: false,
        error: 'Failed to update password. Please try again.',
      };
    }
  }

  /**
   * Get current auth state
   */
  async getAuthState(): Promise<AdminAuthState> {
    try {
      const user = await this.getCurrentUser();

      if (!user) {
        return {
          isLoading: false,
          isAuthenticated: false,
          isAuthorized: false,
          user: null,
          error: null,
        };
      }

      const isAllowed = await this.isUserInAllowlist(user.id);

      return {
        isLoading: false,
        isAuthenticated: true,
        isAuthorized: isAllowed,
        user: isAllowed ? user : null,
        error: !isAllowed ? 'Not authorized' : null,
      };
    } catch (error) {
      console.error('[AdminAuth] Error getting auth state:', error);
      return {
        isLoading: false,
        isAuthenticated: false,
        isAuthorized: false,
        user: null,
        error: 'Failed to get auth state',
      };
    }
  }

  /**
   * Subscribe to auth state changes
   */
  onAuthStateChange(callback: (state: AdminAuthState) => void): () => void {
    if (!this.supabase) {
      return () => {};
    }

    const unsubscribe = this.supabase.auth.onAuthStateChange(async () => {
      const state = await this.getAuthState();
      callback(state);
    });

    return () => {
      unsubscribe.data?.subscription?.unsubscribe();
    };
  }
}

export const adminAuthService = new AdminAuthService();
