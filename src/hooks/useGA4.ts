import { useEffect } from 'react';
import { initializeGA4, trackPageView } from '../lib/ga4';

/**
 * Initialize GA4 on app startup (call once in App component)
 * Handles GA4 script loading, gtag initialization, and dev-mode logging
 */
export function useGA4Init() {
  useEffect(() => {
    initializeGA4();
  }, []);
}

/**
 * Track page views on route changes
 * Call this whenever the pathname changes (e.g., in useEffect listening to location)
 */
export function usePageTracking(pathname: string, pageTitle?: string) {
  useEffect(() => {
    trackPageView(pathname, pageTitle);
  }, [pathname, pageTitle]);
}
