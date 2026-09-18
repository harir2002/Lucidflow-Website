export const SITE_NAME = "LucidFlow";
export const COMPANY_NAME = "SBA Info Solutions";
export const PRODUCT_NAME = "LucidFlow™ by SBA Info Solutions";

export const CONTACT = {
  email: "sales@sbainfo.in",
  phoneDisplay: "+91 95001 37169",
  phoneTel: "+919500137169",
} as const;

export const SEO = {
  title:
    "LucidFlow | Continuous Dark Pattern Monitoring for Insurance & Banking | SBA Info Solutions.",
  description:
    "LucidFlow helps insurance and banking teams identify potential dark-pattern risks, capture evidence, create corrective actions and revalidate digital journeys continuously.",
} as const;

export const NAV_LINKS = [
  { href: "#why-lucidflow", label: "Why LucidFlow" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#models", label: "Models" },
  { href: "#faq", label: "FAQ" },
] as const;

export const BUYER_STAGE_OPTIONS = [
  { value: "still_assessing", label: "Still assessing" },
  { value: "assessment_complete", label: "Assessment complete" },
  { value: "unsure", label: "Unsure" },
] as const;

export const PRIORITY_JOURNEY_OPTIONS = [
  { value: "quote_to_buy", label: "Quote to buy" },
  { value: "product_selection", label: "Product selection" },
  { value: "add_ons", label: "Add-ons" },
  { value: "consent", label: "Consent" },
  { value: "payment", label: "Payment" },
  { value: "renewal", label: "Renewal" },
  { value: "claims", label: "Claims" },
  { value: "cancellation", label: "Cancellation" },
  { value: "account_opening", label: "Account opening" },
  { value: "loan_credit", label: "Loan / credit journey" },
  { value: "campaign_partner", label: "Campaign or partner journey" },
  { value: "other", label: "Other" },
] as const;

export const ENGAGEMENT_OPTIONS = [
  { value: "scan", label: "Scan" },
  { value: "demo", label: "Demo" },
  { value: "annual_saas", label: "Annual SaaS" },
  { value: "annual_enterprise", label: "Customer hosted" },
  { value: "advisory", label: "Advisory" },
] as const;

export const INDUSTRY_OPTIONS = [
  { value: "insurance", label: "Insurance" },
  { value: "banking", label: "Banking" },
  { value: "both", label: "Insurance and banking" },
  { value: "other", label: "Other" },
] as const;

export const PDF_FILE_NAME = "journey-assurance-scan-overview.pdf";
export const PDF_PUBLIC_PATH = `/documents/${PDF_FILE_NAME}`;

export const MODAL_HEADINGS = {
  default: "Schedule a Demo Today",
  scan: "Schedule a Demo Today",
  walkthrough: "Request a Platform Walkthrough",
} as const;

/**
 * TODO: Replace with a Calendly, Microsoft Bookings, Google Calendar,
 * or CRM booking URL after SBA privacy and consent processes permit it.
 * Track bookings with lucidflow_calendar_booking.
 */
export const BOOKING_URL = import.meta.env.VITE_CALENDAR_BOOKING_URL ?? "";

export function getSiteUrl() {
  return (import.meta.env.VITE_SITE_URL ?? "https://www.sbainfo.in").replace(
    /\/$/,
    "",
  );
}
