import { z } from "zod";
import {
  BUYER_STAGE_OPTIONS,
  ENGAGEMENT_OPTIONS,
  INDUSTRY_OPTIONS,
  PRIORITY_JOURNEY_OPTIONS,
} from "@/data/lucidflowContent";

const buyerStageValues = BUYER_STAGE_OPTIONS.map((option) => option.value) as [
  string,
  ...string[],
];
const engagementValues = ENGAGEMENT_OPTIONS.map((option) => option.value) as [
  string,
  ...string[],
];
const journeyValues = PRIORITY_JOURNEY_OPTIONS.map((option) => option.value) as [
  string,
  ...string[],
];
const industryValues = INDUSTRY_OPTIONS.map((option) => option.value) as [
  string,
  ...string[],
];

export const enquirySchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Enter your full name.")
    .max(120, "Name is too long."),
  workEmail: z
    .string()
    .trim()
    .email("Enter a valid work email address.")
    .max(160, "Email is too long."),
  phone: z
    .string()
    .trim()
    .max(40, "Phone number is too long.")
    .optional()
    .or(z.literal("")),
  company: z
    .string()
    .trim()
    .min(2, "Enter your company name.")
    .max(160, "Company name is too long."),
  role: z.string().trim().max(120, "Role is too long.").optional().or(z.literal("")),
  industry: z.enum(industryValues).optional().or(z.literal("")),
  buyerStage: z.enum(buyerStageValues, {
    required_error: "Select your current stage.",
    invalid_type_error: "Select your current stage.",
  }),
  priorityJourney: z.enum(journeyValues, {
    required_error: "Select a priority journey.",
    invalid_type_error: "Select a priority journey.",
  }),
  preferredEngagement: z.enum(engagementValues, {
    required_error: "Select a preferred engagement.",
    invalid_type_error: "Select a preferred engagement.",
  }),
  message: z
    .string()
    .trim()
    .max(2000, "Message is too long.")
    .optional()
    .or(z.literal("")),
  consent: z.literal(true, {
    errorMap: () => ({
      message: "Consent is required so SBA Info Solutions can contact you.",
    }),
  }),
  utm_source: z.string().optional().or(z.literal("")),
  utm_medium: z.string().optional().or(z.literal("")),
  utm_campaign: z.string().optional().or(z.literal("")),
  utm_term: z.string().optional().or(z.literal("")),
  utm_content: z.string().optional().or(z.literal("")),
  landingPageUrl: z.string().optional().or(z.literal("")),
  referrer: z.string().optional().or(z.literal("")),
  ctaLocation: z.string().optional().or(z.literal("")),
  submittedAt: z.string().optional().or(z.literal("")),
});

export type EnquiryFormValues = z.infer<typeof enquirySchema>;
export type EnquiryFormInput = z.input<typeof enquirySchema>;
