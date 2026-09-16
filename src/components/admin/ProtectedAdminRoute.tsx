/**
 * Protected Admin Route Component
 * 
 * Ensures only authenticated and authorized admin users can access admin pages.
 * Shows loading state while checking session.
 */

import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { adminAuthService } from '@/services/adminAuthService';
import type { AdminAuthState } from '@/lib/admin-types';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

export function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  const [authState, setAuthState] = useState<AdminAuthState>({
    isLoading: true,
    isAuthenticated: false,
    isAuthorized: false,
    user: null,
    error: null,
  });

  useEffect(() => {
    // Get initial auth state
    const checkAuth = async () => {
      const state = await adminAuthService.getAuthState();
      setAuthState(state);
    };

    checkAuth();

    // Subscribe to auth changes
    const unsubscribe = adminAuthService.onAuthStateChange(setAuthState);

    return unsubscribe;
  }, []);

  // Show loading state while checking authentication
  if (authState.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 mx-auto border-4 border-crimson/20 border-t-crimson rounded-full animate-spin" />
          <p className="text-muted-grey">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to dashboard if authenticated and authorized
  if (authState.isAuthenticated && authState.isAuthorized) {
    return <Navigate to="/admin-panel/dashboard" replace />;
  }

  // Redirect to login if not authenticated
  if (!authState.isAuthenticated) {
    return <Navigate to="/admin-panel" replace />;
  }

  // Redirect to login if authenticated but not authorized (not in allowlist)
  if (!authState.isAuthorized) {
    return <Navigate to="/admin-panel" replace />;
  }

  // User is authenticated and authorized, render protected content
  return <>{children}</>;
}
