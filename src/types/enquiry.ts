/**
 * Enquiry Payload Types
 * 
 * Comprehensive typed payload for form submissions to Supabase Edge Function.
 * Includes form data, session tracking, and consent information.
 */

export interface EnquiryPayload {
  // Form fields (validated by enquirySchema)
  full_name: string;
  work_email: string;
  phone?: string;
  company: string;
  role?: string;
  message?: string;

  // Consent (required)
  consent_given: boolean;
  consent_timestamp: string; // ISO 8601 datetime

  // UTM parameters (for campaign tracking)
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;

  // Session tracking
  landing_page: string; // The page URL where form was submitted
  referrer: string; // Document referrer
  source_cta_location: string; // Where the CTA button was clicked (e.g., "hero", "final-cta")

  // Submission timestamp
  submitted_at: string; // ISO 8601 datetime
}

/**
 * Expected response from Edge Function endpoint
 */
export interface EnquiryApiResponse {
  success: boolean;
  message: string;
  lead_id?: string; // Returned on successful insert
  errors?: Record<string, string[]>;
}
