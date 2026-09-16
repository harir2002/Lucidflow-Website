import { enquirySchema, type EnquiryFormInput } from "@/lib/validation";
import { trackEvent } from "@/hooks/useAnalytics";
import { trackGenerateLead } from "@/lib/ga4";

export interface EnquiryResponse {
  ok: boolean;
  message: string;
  errors?: unknown;
}

/**
 * Submit enquiry form data to Supabase Edge Function.
 * 
 * SECURITY:
 * - Form validated client-side with Zod before sending
 * - Data POSTed only to secure backend Edge Function endpoint
 * - No direct database writes from browser
 * - No PII logged to console or analytics
 * - Payload contains only required form fields
 * 
 * Edge Function handles:
 * - Spam protection (Turnstile/reCAPTCHA if configured)
 * - Lead insertion into database
 * - Email notifications
 * - CRM integration
 * - Internal alerts
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

  // Development mode: warn if endpoint not configured
  if (import.meta.env.DEV && !endpoint) {
    console.warn(
      "[LucidFlow] Form submission not configured in development. " +
      "Set VITE_LUCIDFLOW_ENQUIRY_ENDPOINT in .env to enable live submissions."
    );

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      ok: true,
      message: "Enquiry received (development mode - not persisted).",
    };
  }

  // Production: Check endpoint is configured
  if (!endpoint) {
    return {
      ok: false,
      message: "We could not submit your enquiry right now. Please try again.",
    };
  }

  try {
    // Build payload exactly as Edge Function expects
    const payload = {
      full_name: formData.fullName.trim(),
      work_email: formData.workEmail.trim().toLowerCase(),
      phone: formData.phone?.trim() || "",
      company: formData.company.trim(),
      role: formData.role?.trim() || "",
      message: formData.message?.trim() || "",
      consent_given: formData.consent === true,
    };

    // POST to Supabase Edge Function
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // Handle success (201 Created or 200 OK)
    if (response.ok || response.status === 201) {
      let responseData: any;
      
      try {
        responseData = await response.json();
      } catch {
        // If response has no body, treat as success
        responseData = { success: true };
      }

      // Check for success indicator in response
      if (responseData.success || response.status === 201) {
        // Track non-PII analytics events only
        trackEvent("generate_lead", {
          // Non-PII only
          submission_status: "success",
        });

        // Track GA4 lead generation (no PII)
        trackGenerateLead({
          form_name: "lucidflow_enquiry",
        });

        trackEvent("lucidflow_form_submit", {
          // Non-PII only
          success: true,
        });

        return {
          ok: true,
          message: responseData.message || "Thank you for your enquiry.",
        };
      }
    }

    // Handle server errors
    const errorData = await response.json().catch(() => ({}));

    return {
      ok: false,
      message: "We could not submit your enquiry right now. Please try again.",
      errors: errorData.errors,
    };
  } catch (error) {
    // Network or parsing error - don't expose details
    console.error("[LucidFlow form error] Network request failed", {
      endpoint,
      timestamp: new Date().toISOString(),
    });

    // Track failure event (non-PII only)
    trackEvent("lucidflow_form_submit", {
      success: false,
    });

    return {
      ok: false,
      message: "We could not submit your enquiry right now. Please try again.",
    };
  }
}
