/**
 * Enquiry Payload Types
 * 
 * Simplified payload matching Edge Function requirements.
 * Only required form fields - no UTM, session, or metadata.
 */

export interface EnquiryPayload {
  // Required form fields
  full_name: string;
  work_email: string;
  company: string;

  // Optional form fields
  phone?: string;
  role?: string;
  message?: string;

  // Consent (required)
  consent_given: boolean;
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
