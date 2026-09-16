/**
 * Admin Login Page
 * 
 * Email + password login for authorized administrators
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAuthService } from '@/services/adminAuthService';

export function AdminLoginPage() {
  console.log('[AdminLoginPage] Component rendering');
  
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  // Check if already authenticated
  useEffect(() => {
    console.log('[AdminLoginPage] useEffect: checking session');
    const checkSession = async () => {
      const state = await adminAuthService.getAuthState();
      console.log('[AdminLoginPage] Auth state:', { 
        isAuthenticated: state.isAuthenticated, 
        isAuthorized: state.isAuthorized 
      });
      if (state.isAuthenticated && state.isAuthorized) {
        navigate('/admin-panel', { replace: true });
      }
      setIsCheckingSession(false);
    };

    checkSession();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    console.log('[AdminLoginPage] Submitting login form with email:', email);

    const result = await adminAuthService.signIn(email, password);

    console.log('[AdminLoginPage] Login result:', result);

    if (result.success) {
      console.log('[AdminLoginPage] Login successful, navigating to dashboard');
      navigate('/admin-panel/dashboard', { replace: true });
    } else {
      console.log('[AdminLoginPage] Login failed:', result.error);
      setError(result.error || 'An error occurred. Please try again.');
      setPassword('');
    }

    setIsLoading(false);
  };

  if (isCheckingSession) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-near-black">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 mx-auto border-4 border-crimson/20 border-t-crimson rounded-full animate-spin" />
          <p className="text-muted-grey">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-near-black flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">LucidFlow Admin</h1>
          <p className="text-muted-grey">Sign in to manage leads</p>
        </div>

        {/* Login Card */}
        <div className="bg-dark-surface border border-white/10 rounded-lg p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="field-label">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
                className="input-field"
                placeholder="admin@example.com"
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="field-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
                className="input-field"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded text-sm text-red-500">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2.5 bg-crimson text-white font-medium rounded hover:bg-crimson/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Forgot Password Link */}
          <div className="mt-6 text-center">
            <a
              href="/admin-panel/forgot-password"
              className="text-sm text-crimson hover:text-crimson/80 transition-colors"
            >
              Forgot password?
            </a>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 p-3 bg-blue-500/10 border border-blue-500/30 rounded text-xs text-blue-300">
          <p className="font-semibold mb-1">Security Notice</p>
          <p>
            This admin panel is for authorized administrators only. Unauthorized access attempts are logged.
          </p>
        </div>
      </div>
    </div>
  );
}
