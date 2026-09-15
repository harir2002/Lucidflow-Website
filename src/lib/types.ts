/**
 * Shared type definitions for LucidFlow components
 */

export type BuyerStage = "still_assessing" | "assessment_complete" | "unsure";

export type PreferredEngagement = "scan" | "demo" | "annual_saas" | "annual_enterprise" | "advisory";

export interface EnquiryPrefill {
  buyerStage?: string;
  preferredEngagement?: string;
  sourceSection?: string;
  ctaLabel?: string;
  heading?: string;
}

export interface BuyerPath {
  key: BuyerStage;
  label: string;
  description: string;
  engagement: PreferredEngagement;
  ctaLabel: string;
}
