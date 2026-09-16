/**
 * Admin Reset Password Page
 * 
 * Complete password reset using token from email link
 */

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { adminAuthService } from '@/services/adminAuthService';

export function AdminResetPasswordPage() {
  const navigate = useNavigate();
  const [_searchParams] = useSearchParams();
  // _searchParams is used by Supabase to detect reset token in URL
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasValidToken, setHasValidToken] = useState(false);

  // Check if we have a valid token in the URL
  useEffect(() => {
    // Supabase sets the token in the session automatically when the reset link is clicked
    // We just need to verify there's an active session
    const checkToken = async () => {
      const session = await adminAuthService.getSession();
      setHasValidToken(!!session);
    };

    checkToken();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords
    if (!password || !confirmPassword) {
      setError('Please enter your password.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    const result = await adminAuthService.updatePassword(password);

    if (result.success) {
      setIsSuccess(true);
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/admin-panel', { replace: true });
      }, 2000);
    } else {
      setError(result.error || 'Failed to update password. Please try again.');
    }

    setIsLoading(false);
  };

  if (!hasValidToken) {
    return (
      <div className="min-h-screen bg-near-black flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Reset Password</h1>
            <p className="text-muted-grey">No valid reset token found</p>
          </div>

          <div className="bg-dark-surface border border-white/10 rounded-lg p-6 sm:p-8">
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded text-center mb-6">
              <p className="text-sm text-yellow-300">
                This reset link has expired or is invalid. Please request a new one.
              </p>
            </div>

            <button
              onClick={() => navigate('/admin-panel/forgot-password')}
              className="w-full px-4 py-2.5 bg-crimson text-white font-medium rounded hover:bg-crimson/90 transition-colors"
            >
              Request New Reset Link
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-near-black flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => navigate('/admin-panel')}
          className="flex items-center gap-2 text-muted-grey hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Create New Password</h1>
          <p className="text-muted-grey">Enter a strong, unique password</p>
        </div>

        {/* Content */}
        <div className="bg-dark-surface border border-white/10 rounded-lg p-6 sm:p-8">
          {isSuccess ? (
            // Success Message
            <div className="space-y-4 text-center">
              <div className="flex justify-center">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>

              <div>
                <p className="text-lg font-semibold text-white mb-2">Password Updated</p>
                <p className="text-sm text-muted-grey">
                  Your password has been successfully reset. Redirecting to sign in...
                </p>
              </div>
            </div>
          ) : (
            // Form
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="password" className="field-label">
                  New password
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
                  autoComplete="new-password"
                />
                <p className="text-xs text-muted-grey mt-1">
                  At least 8 characters
                </p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="field-label">
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  className="input-field"
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded text-sm text-red-500">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-2.5 bg-crimson text-white font-medium rounded hover:bg-crimson/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
