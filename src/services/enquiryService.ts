import { enquirySchema, type EnquiryFormInput } from "@/lib/validation";
import { trackEvent } from "@/hooks/useAnalytics";
import { getUtmParams } from "@/hooks/useUtmParams";
import type { EnquiryPayload, EnquiryApiResponse } from "@/types/enquiry";

export interface EnquiryResponse {
  ok: boolean;
  message: string;
  errors?: unknown;
}

/**
 * Submit enquiry form data to Supabase Edge Function.
 * 
 * SECURITY:
 * - Form validation happens client-side (Zod) before sending
 * - Data is POSTed to secure backend Edge Function endpoint only
 * - No direct database writes from browser
 * - No PII logged to console or analytics
 * - Edge Function handles:
 *   - Spam protection (Turnstile/reCAPTCHA)
 *   - Email notifications (Resend/SendGrid)
 *   - CRM integration (HubSpot/Zoho/etc)
 *   - Internal alerts (Slack webhook)
 *   - Lead insertion with audit trail
 * 
 * NEVER expose SMTP credentials, CRM keys, or Slack webhooks in frontend code.
 * 
 * ENVIRONMENT:
 * - Development: Uses mock mode if endpoint not configured
 * - Production: Requires valid VITE_LUCIDFLOW_ENQUIRY_ENDPOINT
 */
export async function submitEnquiry(
  data: EnquiryFormInput
): Promise<EnquiryResponse> {
  // Validate data with Zod schema
  const parsed = enquirySchema.safeParse(data);

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please review the highlighted fields and try again.",
      errors: parsed.error.flatten(),
    };
  }

  const formData = parsed.data;

  // Get enquiry endpoint from environment
  const endpoint = import.meta.env.VITE_LUCIDFLOW_ENQUIRY_ENDPOINT;

  // Get UTM parameters and session info
  const utm = getUtmParams();

  // Build enquiry payload for Edge Function
  const payload: EnquiryPayload = {
    // Form fields (safely validated)
    full_name: formData.fullName,
    work_email: formData.workEmail,
    phone: formData.phone || undefined,
    company: formData.company,
    role: formData.role || undefined,
    message: formData.message || undefined,

    // Consent tracking (REQUIRED for GDPR/privacy compliance)
    consent_given: formData.consent === true,
    consent_timestamp: new Date().toISOString(),

    // Campaign tracking (non-PII)
    utm_source: utm.utm_source ?? undefined,
    utm_medium: utm.utm_medium ?? undefined,
    utm_campaign: utm.utm_campaign ?? undefined,
    utm_term: utm.utm_term ?? undefined,
    utm_content: utm.utm_content ?? undefined,

    // Session tracking (non-PII)
    landing_page: window.location.href,
    referrer: document.referrer || "",
    source_cta_location: formData.ctaLocation || "unknown",

    // Submission timestamp
    submitted_at: new Date().toISOString(),
  };

  // Development mode: Mock submission if endpoint not configured
  if (import.meta.env.DEV && !endpoint) {
    console.info(
      "[LucidFlow enquiry - DEV MODE]\n" +
      "In production, this would POST to: VITE_LUCIDFLOW_ENQUIRY_ENDPOINT\n" +
      "Configure .env to enable live submissions.\n" +
      "See docs/supabase-frontend-setup.md"
    );

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Return mock success (does not insert into database)
    return {
      ok: true,
      message: "Enquiry received (dev mode - not persisted).",
    };
  }

  // Production mode: Check endpoint is configured
  if (!endpoint) {
    return {
      ok: false,
      message:
        "Form submission is not configured. Please try again later.",
    };
  }

  try {
    // POST to Supabase Edge Function
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // Handle server errors (4xx, 5xx)
    if (!response.ok) {
      const errorData = (await response.json().catch(() => ({}))) as EnquiryApiResponse;
      
      // Log error to server (non-PII safe)
      console.error("[LucidFlow enquiry error]", {
        status: response.status,
        message: errorData.message,
      });

      return {
        ok: false,
        message:
          errorData.message ||
          "Unable to submit enquiry. Please try again.",
        errors: errorData.errors,
      };
    }

    // Success response from Edge Function
    const result = (await response.json()) as EnquiryApiResponse;

    // Track non-PII analytics events
    // Do NOT send form data to GA4
    trackEvent("generate_lead", {
      // Non-PII only
      source: formData.ctaLocation || "unknown",
      campaign: utm.utm_campaign || "(organic)",
    });

    trackEvent("lucidflow_form_submit", {
      // Non-PII only
      success: true,
      submission_id: result.lead_id || "unknown",
    });

    return {
      ok: true,
      message: result.message || "Enquiry submitted successfully.",
    };
  } catch (error) {
    // Network or parsing error
    console.error("[LucidFlow enquiry network error]", {
      message: error instanceof Error ? error.message : String(error),
    });

    // Track non-PII failure event
    trackEvent("lucidflow_form_submit", {
      success: false,
      error_type: "network",
    });

    return {
      ok: false,
      message:
        "Network error. Please check your connection and try again.",
    };
  }
}
