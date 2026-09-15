import { enquirySchema, type EnquiryFormInput } from "@/lib/validation";

export interface EnquiryResponse {
  ok: boolean;
  message: string;
  errors?: unknown;
}

/**
 * Submit enquiry form data.
 * 
 * In production, this should POST to a secure backend API or serverless function
 * that handles:
 * - Spam protection (Cloudflare Turnstile / reCAPTCHA)
 * - Email notifications (Resend / SendGrid / AWS SES)
 * - CRM integration (HubSpot / Zoho / Salesforce / Google Sheets)
 * - Internal alerts (Slack webhook)
 * 
 * IMPORTANT: Never expose SMTP credentials, CRM API keys, or Slack webhooks
 * in the frontend code or environment variables. All sensitive operations
 * must be handled server-side.
 * 
 * TODO: Configure VITE_LUCIDFLOW_ENQUIRY_ENDPOINT to point to your backend API
 * Example: https://api.yourdomain.com/v1/lucidflow/enquiry
 */
export async function submitEnquiry(
  data: EnquiryFormInput
): Promise<EnquiryResponse> {
  // Validate data with Zod
  const parsed = enquirySchema.safeParse(data);

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please review the highlighted fields and try again.",
      errors: parsed.error.flatten(),
    };
  }

  const payload = parsed.data;

  // Get enquiry endpoint from environment
  const endpoint = import.meta.env.VITE_LUCIDFLOW_ENQUIRY_ENDPOINT;

  // Development mode: log and mock success
  if (import.meta.env.DEV && !endpoint) {
    console.info("[LucidFlow enquiry - DEV MODE]", {
      company: payload.company,
      workEmail: payload.workEmail,
      buyerStage: payload.buyerStage,
      preferredEngagement: payload.preferredEngagement,
      priorityJourney: payload.priorityJourney,
      ctaLocation: payload.ctaLocation,
      utm_source: payload.utm_source,
      utm_campaign: payload.utm_campaign,
    });

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      ok: true,
      message: "Enquiry received (dev mode).",
    };
  }

  // Production: POST to configured backend endpoint
  if (!endpoint) {
    return {
      ok: false,
      message:
        "Form submission is not configured. Please try again later.",
    };
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        ok: false,
        message:
          errorData.message ||
          "Unable to submit enquiry. Please try again.",
        errors: errorData.errors,
      };
    }

    const result = await response.json();
    return {
      ok: true,
      message: result.message || "Enquiry submitted successfully.",
    };
  } catch (error) {
    console.error("[LucidFlow enquiry error]", error);
    return {
      ok: false,
      message:
        "Network error. Please check your connection and try again.",
    };
  }
}
