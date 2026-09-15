import { z } from "zod";

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
