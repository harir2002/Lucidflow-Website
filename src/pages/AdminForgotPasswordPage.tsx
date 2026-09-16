/**
 * Admin Forgot Password Page
 * 
 * Request password reset via email
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { adminAuthService } from '@/services/adminAuthService';

export function AdminForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await adminAuthService.requestPasswordReset(email);

    if (result.success) {
      setSubmitted(true);
    } else {
      setError(result.error || 'An error occurred. Please try again.');
    }

    setIsLoading(false);
  };

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
          <h1 className="text-2xl font-bold text-white mb-2">Reset Password</h1>
          <p className="text-muted-grey">Enter your email to receive a password reset link</p>
        </div>

        {/* Content */}
        <div className="bg-dark-surface border border-white/10 rounded-lg p-6 sm:p-8">
          {submitted ? (
            // Success Message
            <div className="space-y-4">
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded text-center">
                <p className="text-sm text-green-300">
                  Password reset link sent to <span className="font-semibold">{email}</span>
                </p>
              </div>

              <p className="text-sm text-muted-grey text-center">
                Check your email for a link to reset your password. The link expires in 24 hours.
              </p>

              <p className="text-sm text-muted-grey text-center">
                Didn't receive the email? Check your spam folder or contact your system administrator.
              </p>

              <button
                onClick={() => navigate('/admin-panel')}
                className="w-full px-4 py-2.5 bg-crimson text-white font-medium rounded hover:bg-crimson/90 transition-colors"
              >
                Back to sign in
              </button>
            </div>
          ) : (
            // Form
            <form onSubmit={handleSubmit} className="space-y-6">
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
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
