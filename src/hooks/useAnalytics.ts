export type AnalyticsParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function canTrack() {
  return typeof window !== "undefined" && typeof window.gtag === "function";
}

export function getGaMeasurementId() {
  return import.meta.env.VITE_GA_MEASUREMENT_ID?.trim() ?? "";
}

export function trackEvent(eventName: string, params: AnalyticsParams = {}) {
  const payload = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== ""),
  );

  if (import.meta.env.DEV) {
    console.info("[LucidFlow analytics]", eventName, payload);
  }

  if (!canTrack()) return;

  window.gtag?.("event", eventName, payload);
}

export function trackCtaClick(params: {
  ctaLabel: string;
  ctaLocation: string;
  preferredEngagement?: string;
  buyerStage?: string;
}) {
  trackEvent("lucidflow_cta_click", {
    cta_label: params.ctaLabel,
    cta_location: params.ctaLocation,
    preferred_engagement: params.preferredEngagement,
    buyer_stage: params.buyerStage,
  });
}

export function trackFormOpen(params: {
  sourceSection: string;
  preselectedEngagement?: string;
  buyerStage?: string;
}) {
  trackEvent("lucidflow_form_open", {
    source_section: params.sourceSection,
    preselected_engagement: params.preselectedEngagement,
    buyer_stage: params.buyerStage,
  });
}

export function trackFormSubmit(params: {
  buyerStage?: string;
  preferredEngagement?: string;
  priorityJourney?: string;
  industry?: string;
  sourceSection?: string;
}) {
  trackEvent("lucidflow_form_submit", {
    buyer_stage: params.buyerStage,
    preferred_engagement: params.preferredEngagement,
    priority_journey: params.priorityJourney,
    industry: params.industry,
    source_section: params.sourceSection,
  });
}

export function trackVideoPlaceholderClick(params: {
  videoName: string;
  videoLocation: string;
  videoStatus: string;
}) {
  trackEvent("lucidflow_video_placeholder_click", {
    video_name: params.videoName,
    video_location: params.videoLocation,
    video_status: params.videoStatus,
  });
}

export function trackVideoOpen(params: {
  videoName: string;
  videoLocation: string;
}) {
  trackEvent("lucidflow_video_open", {
    video_name: params.videoName,
    video_location: params.videoLocation,
  });
}

export function trackVideoPlay(params: {
  videoName: string;
  videoLocation: string;
}) {
  trackEvent("lucidflow_video_play", {
    video_name: params.videoName,
    video_location: params.videoLocation,
  });
}

export function trackVideoProgress(params: {
  videoName: string;
  videoLocation: string;
  percent: number;
}) {
  trackEvent("lucidflow_video_progress", {
    video_name: params.videoName,
    video_location: params.videoLocation,
    percent: params.percent,
  });
}

export function trackVideoComplete(params: {
  videoName: string;
  videoLocation: string;
}) {
  trackEvent("lucidflow_video_complete", {
    video_name: params.videoName,
    video_location: params.videoLocation,
  });
}

export function trackVideoFallbackDemo(params: {
  videoName: string;
  videoLocation: string;
  reason: string;
}) {
  trackEvent("lucidflow_video_fallback_demo", {
    video_name: params.videoName,
    video_location: params.videoLocation,
    reason: params.reason,
  });
}

export function trackPdfDownload(params: { fileName: string; pageLocation: string }) {
  trackEvent("lucidflow_pdf_download", {
    file_name: params.fileName,
    page_location: params.pageLocation,
  });
}

export function trackPhoneClick(location: string) {
  trackEvent("lucidflow_phone_click", { location });
}

export function trackEmailClick(location: string) {
  trackEvent("lucidflow_email_click", { location });
}

/**
 * TODO: Call this when a Calendly, Microsoft Bookings, Google Calendar,
 * or CRM booking widget is configured and a booking is confirmed.
 */
export function trackCalendarBooking(params: {
  bookingType: string;
  sourceSection: string;
}) {
  trackEvent("lucidflow_calendar_booking", {
    booking_type: params.bookingType,
    source_section: params.sourceSection,
  });
}

/**
 * TODO: Only install the LinkedIn Insight Tag after SBA's privacy and
 * consent processes permit it. Do not add the tag by default.
 */
export function linkedInInsightTagPlaceholder() {
  return null;
}
