/**
 * Admin Layout Component
 * 
 * Provides header, navigation, and logout for admin panel pages
 */

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import { adminAuthService } from '@/services/adminAuthService';
import type { AdminUser } from '@/lib/admin-types';

interface AdminLayoutProps {
  user: AdminUser | null;
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { href: '/admin-panel/dashboard', label: 'Dashboard' },
  { href: '/admin-panel/leads', label: 'Leads' },
];

export function AdminLayout({ user, children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const result = await adminAuthService.signOut();

    if (result.success) {
      navigate('/admin-panel', { replace: true });
    } else {
      setIsLoggingOut(false);
      alert('Failed to sign out. Please try again.');
    }
  };

  const isActive = (href: string) => {
    if (href === '/admin-panel') {
      return location.pathname === '/admin-panel';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-near-black">
      {/* Header */}
      <header className="border-b border-white/10 bg-black sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-semibold text-white">
                LucidFlow Admin
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-white border-b-2 border-crimson pb-2'
                      : 'text-muted-grey hover:text-white'
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              {/* User email and logout */}
              <div className="hidden sm:flex items-center gap-4">
                <span className="text-sm text-muted-grey">{user?.email}</span>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-crimson/10 border border-crimson/30 rounded hover:bg-crimson/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>

              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 text-white hover:bg-white/5 rounded"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
              >
                {menuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {menuOpen && (
            <nav className="md:hidden mt-4 space-y-2 border-t border-white/10 pt-4">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`block px-3 py-2 rounded text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-crimson/20 text-white'
                      : 'text-muted-grey hover:bg-white/5 hover:text-white'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <div className="border-t border-white/10 pt-4 mt-4">
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-crimson/10 border border-crimson/30 rounded hover:bg-crimson/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
