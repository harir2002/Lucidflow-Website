/**
 * GA4 Analytics Library
 *
 * Safe, privacy-first Google Analytics 4 implementation for LucidFlow
 *
 * SECURITY RULES:
 * - No PII is ever sent to GA4
 * - No form field values are tracked
 * - No hardcoded measurement IDs
 * - All tracking fails silently if GA4 is unavailable
 * - No duplicate page views or event tracking
 *
 * Allowed Events:
 * - lucidflow_cta_click (CTA buttons)
 * - lucidflow_form_open (form modal open)
 * - lucidflow_form_submit (form submission attempt)
 * - generate_lead (successful form submission from backend)
 * - lucidflow_form_error (form validation/network errors)
 * - lucidflow_video_open (video play button click)
 * - lucidflow_video_play (video playback started)
 * - lucidflow_video_progress (25%, 50%, 75% milestones)
 * - lucidflow_video_complete (video finished)
 * - lucidflow_video_fallback_demo (video unavailable fallback)
 * - lucidflow_pdf_download (PDF download)
 * - lucidflow_phone_click (phone number click)
 * - lucidflow_email_click (email link click)
 * - lucidflow_calendar_booking (calendar booking confirmation)
 *
 * @example
 * import { initializeGA4, trackPageView, trackEvent } from "@/lib/ga4"
 *
 * // Initialize on app start
 * initializeGA4()
 *
 * // Track page views
 * trackPageView("/lucidflow", "LucidFlow - Digital Compliance Platform")
 *
 * // Track CTA click (non-PII parameters only)
 * trackEvent("lucidflow_cta_click", {
 *   cta_label: "Schedule a Demo",
 *   cta_location: "hero"
 * })
 */

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

/**
 * Get GA4 Measurement ID from environment
 */
export function getGA4MeasurementId(): string {
  return import.meta.env.VITE_GA_MEASUREMENT_ID?.trim() ?? "";
}

/**
 * Check if GA4 is available and properly initialized
 */
function isGA4Available(): boolean {
  return typeof window !== "undefined" && typeof window.gtag === "function";
}

/**
 * Check if GA4 is already initialized (prevent duplicate injection)
 */
function isGA4Initialized(): boolean {
  return (
    typeof window !== "undefined" &&
    document.querySelector(`script[src*="googletagmanager.com/gtag"]`) !== null
  );
}

/**
 * Initialize Google Analytics 4
 *
 * - Loads GA4 script only if Measurement ID is configured
 * - Prevents duplicate initialization
 * - Sets debug mode in development
 * - Disables automatic page views (we handle manually)
 *
 * @returns true if initialization was attempted, false if skipped
 */
export function initializeGA4(): boolean {
  const measurementId = getGA4MeasurementId();

  // Skip if no measurement ID configured
  if (!measurementId) {
    return false;
  }

  // Skip if already initialized
  if (isGA4Initialized()) {
    return true;
  }

  try {
    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];

    // Define gtag function
    window.gtag = function (..._args: unknown[]) {
      window.dataLayer.push(arguments);
    };

    // Initialize with current date
    window.gtag?.("js", new Date());

    // Configure GA4
    const config: Record<string, unknown> = {
      send_page_view: false, // We handle page views manually
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    };

    // Enable debug mode in development
    if (import.meta.env.DEV) {
      config.debug_mode = true;
    }

    window.gtag?.("config", measurementId, config);

    // Inject GA4 script
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    return true;
  } catch (error) {
    // Fail silently
    return false;
  }
}

/**
 * Type-safe event parameters
 * Only non-PII, non-form-data parameters allowed
 */
export interface GA4EventParams {
  [key: string]: string | number | boolean | undefined;
}

/**
 * Track a custom event in GA4
 *
 * Requirements:
 * - No PII (name, email, phone, company, etc.)
 * - No form field values
 * - No user-generated text
 * - Only pre-defined allowed parameters
 * - Undefined values are filtered out
 *
 * @param eventName - GA4 event name
 * @param params - Event parameters (non-PII only)
 */
export function trackEvent(eventName: string, params: GA4EventParams = {}): void {
  // Skip if GA4 is not available
  if (!isGA4Available()) {
    return;
  }

  try {
    // Filter out undefined and empty string values
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([, value]) => value !== undefined && value !== "")
    );

    // Track event
    window.gtag?.("event", eventName, cleanParams);

    // Development: log event (never log parameters with potential PII)
    if (import.meta.env.DEV) {
      console.info(`[GA4] Event: ${eventName}`);
    }
  } catch (error) {
    // Fail silently
  }
}

/**
 * Track page view in GA4
 *
 * @param pathname - Current page path (e.g., "/lucidflow", "/lucidflow/thank-you")
 * @param pageTitle - Page title (e.g., "LucidFlow - Digital Compliance Platform")
 */
export function trackPageView(pathname: string, pageTitle?: string): void {
  // Skip if GA4 is not available
  if (!isGA4Available()) {
    return;
  }

  try {
    const config: Record<string, unknown> = {
      page_path: pathname,
      page_location: window.location.href,
    };

    if (pageTitle) {
      config.page_title = pageTitle;
    }

    window.gtag?.("config", getGA4MeasurementId(), config);

    // Development: log page view
    if (import.meta.env.DEV) {
      console.info(`[GA4] Page View: ${pathname}`);
    }
  } catch (error) {
    // Fail silently
  }
}

/**
 * Track CTA click
 *
 * Allowed parameters:
 * - cta_label: Button text (e.g., "Schedule a Demo", "Learn More")
 * - cta_location: Where on the page (e.g., "hero", "header", "final_cta")
 * - preferred_engagement: (optional) Business model (e.g., "saas", "managed", "enterprise")
 *
 * @example
 * trackCTAClick({
 *   cta_label: "Schedule a Demo Today",
 *   cta_location: "hero"
 * })
 */
export function trackCTAClick(params: {
  cta_label: string;
  cta_location: string;
  preferred_engagement?: string;
}): void {
  trackEvent("lucidflow_cta_click", {
    cta_label: params.cta_label,
    cta_location: params.cta_location,
    ...(params.preferred_engagement && { preferred_engagement: params.preferred_engagement }),
  });
}

/**
 * Track form modal open
 *
 * Allowed parameters:
 * - source_section: Where the form was opened from (e.g., "hero", "buyer_path", "final_cta")
 * - preselected_engagement: (optional) Pre-selected option
 *
 * @example
 * trackFormOpen({
 *   source_section: "hero"
 * })
 */
export function trackFormOpen(params: {
  source_section: string;
  preselected_engagement?: string;
}): void {
  trackEvent("lucidflow_form_open", {
    source_section: params.source_section,
    ...(params.preselected_engagement && { preselected_engagement: params.preselected_engagement }),
  });
}

/**
 * Track form submission attempt
 *
 * Allowed parameters:
 * - source_section: Where the form was opened from
 * - submission_status: "success" or "error"
 *
 * NOTE: Only call this after backend response.
 * Do NOT send form field values, email, name, phone, etc.
 *
 * @example
 * trackFormSubmit({
 *   source_section: "hero",
 *   submission_status: "success"
 * })
 */
export function trackFormSubmit(params: {
  source_section: string;
  submission_status: "success" | "error";
}): void {
  trackEvent("lucidflow_form_submit", {
    source_section: params.source_section,
    submission_status: params.submission_status,
  });
}

/**
 * Track successful lead generation (backend confirmation only)
 *
 * This should ONLY be called after the Edge Function returns HTTP 201 or success: true.
 * Never track this on client-side validation or before backend confirmation.
 *
 * Allowed parameters:
 * - form_name: Always "lucidflow_enquiry"
 * - source_section: Where the form was opened from
 *
 * @example
 * if (result.ok) {
 *   trackGenerateLead({
 *     form_name: "lucidflow_enquiry",
 *     source_section: "hero"
 *   })
 * }
 */
export function trackGenerateLead(params: {
  form_name: string;
  source_section?: string;
}): void {
  trackEvent("generate_lead", {
    form_name: params.form_name,
    ...(params.source_section && { source_section: params.source_section }),
  });
}

/**
 * Track form validation or network error
 *
 * Allowed parameters:
 * - source_section: Where the form was opened from
 * - error_type: "validation" | "network" | "server"
 *
 * @example
 * trackFormError({
 *   source_section: "hero",
 *   error_type: "validation"
 * })
 */
export function trackFormError(params: {
  source_section: string;
  error_type: "validation" | "network" | "server";
}): void {
  trackEvent("lucidflow_form_error", {
    source_section: params.source_section,
    error_type: params.error_type,
  });
}

/**
 * Track video play button click
 *
 * @example
 * trackVideoOpen({
 *   video_name: "LucidFlow Product Overview",
 *   video_location: "website_video_section"
 * })
 */
export function trackVideoOpen(params: { video_name: string; video_location: string }): void {
  trackEvent("lucidflow_video_open", {
    video_name: params.video_name,
    video_location: params.video_location,
  });
}

/**
 * Track video playback started
 */
export function trackVideoPlay(params: { video_name: string; video_location: string }): void {
  trackEvent("lucidflow_video_play", {
    video_name: params.video_name,
    video_location: params.video_location,
  });
}

/**
 * Track video progress milestones (25%, 50%, 75% - once per viewing session)
 */
export function trackVideoProgress(params: {
  video_name: string;
  video_location: string;
  percent: 25 | 50 | 75;
}): void {
  trackEvent("lucidflow_video_progress", {
    video_name: params.video_name,
    video_location: params.video_location,
    percent: params.percent,
  });
}

/**
 * Track video completion
 */
export function trackVideoComplete(params: { video_name: string; video_location: string }): void {
  trackEvent("lucidflow_video_complete", {
    video_name: params.video_name,
    video_location: params.video_location,
  });
}

/**
 * Track video fallback demo (when video file is unavailable)
 */
export function trackVideoFallback(params: {
  video_name: string;
  video_location: string;
  reason: string;
}): void {
  trackEvent("lucidflow_video_fallback_demo", {
    video_name: params.video_name,
    video_location: params.video_location,
    reason: params.reason,
  });
}

/**
 * Track PDF download
 */
export function trackPdfDownload(params: { file_name: string; page_location: string }): void {
  trackEvent("lucidflow_pdf_download", {
    file_name: params.file_name,
    page_location: params.page_location,
  });
}

/**
 * Track phone number click
 */
export function trackPhoneClick(location: string): void {
  trackEvent("lucidflow_phone_click", { location });
}

/**
 * Track email link click
 */
export function trackEmailClick(location: string): void {
  trackEvent("lucidflow_email_click", { location });
}

/**
 * Track calendar booking confirmation
 *
 * NOTE: Only call this AFTER a real booking is confirmed.
 * Do NOT call on click alone.
 */
export function trackCalendarBooking(params: {
  booking_type: string;
  source_section: string;
}): void {
  trackEvent("lucidflow_calendar_booking", {
    booking_type: params.booking_type,
    source_section: params.source_section,
  });
}

/**
 * LinkedIn Insight Tag placeholder
 *
 * TODO: Only install the LinkedIn Insight Tag after SBA's privacy and
 * consent processes permit it. Do not add the tag by default.
 *
 * This requires:
 * 1. Privacy policy review
 * 2. Cookie consent banner implementation
 * 3. LinkedIn Insight Tag configuration
 * 4. GDPR/CCPA compliance verification
 */
export function linkedInInsightTagPlaceholder(): null {
  // Intentionally not implemented - awaiting privacy review
  return null;
}
