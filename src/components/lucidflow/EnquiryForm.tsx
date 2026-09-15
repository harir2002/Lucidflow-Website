import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BUYER_STAGE_OPTIONS,
  ENGAGEMENT_OPTIONS,
  INDUSTRY_OPTIONS,
  PRIORITY_JOURNEY_OPTIONS,
} from "@/data/lucidflowContent";
import { enquirySchema, type EnquiryFormInput } from "@/lib/validation";
import { getUtmParams } from "@/hooks/useUtmParams";
import { trackFormSubmit } from "@/hooks/useAnalytics";
import { submitEnquiry } from "@/services/enquiryService";
import { Button } from "./Button";

export type EnquiryPrefill = {
  buyerStage?: string;
  preferredEngagement?: string;
  sourceSection?: string;
};

type EnquiryFormProps = {
  prefill: EnquiryPrefill | null;
  onBusyChange?: (busy: boolean) => void;
};

export function EnquiryForm({ prefill, onBusyChange }: EnquiryFormProps) {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<EnquiryFormInput>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      fullName: "",
      workEmail: "",
      phone: "",
      company: "",
      role: "",
      industry: "",
      buyerStage: prefill?.buyerStage,
      priorityJourney: undefined,
      preferredEngagement: prefill?.preferredEngagement,
      message: "",
      consent: undefined,
    },
  });

  useEffect(() => {
    const utm = getUtmParams();
    const meta = {
      landingPageUrl: window.location.href,
      referrer: document.referrer,
      ctaLocation: prefill?.sourceSection ?? "",
      submittedAt: new Date().toISOString(),
    };

    reset({
      fullName: "",
      workEmail: "",
      phone: "",
      company: "",
      role: "",
      industry: "",
      buyerStage: prefill?.buyerStage,
      priorityJourney: undefined,
      preferredEngagement: prefill?.preferredEngagement,
      message: "",
      consent: undefined,
      utm_source: utm.utm_source ?? "",
      utm_medium: utm.utm_medium ?? "",
      utm_campaign: utm.utm_campaign ?? "",
      utm_term: utm.utm_term ?? "",
      utm_content: utm.utm_content ?? "",
      landingPageUrl: meta.landingPageUrl,
      referrer: meta.referrer,
      ctaLocation: meta.ctaLocation,
      submittedAt: meta.submittedAt,
    });
  }, [prefill, reset]);

  useEffect(() => {
    onBusyChange?.(isSubmitting);
  }, [isSubmitting, onBusyChange]);

  const onSubmit = async (values: EnquiryFormInput) => {
    try {
      const result = await submitEnquiry(values);

      if (!result.ok) {
        throw new Error(result.message);
      }

      trackFormSubmit({
        buyerStage: values.buyerStage,
        preferredEngagement: values.preferredEngagement,
        priorityJourney: values.priorityJourney,
        industry: values.industry,
        sourceSection: prefill?.sourceSection,
      });

      navigate("/lucidflow/thank-you");
    } catch (error) {
      setError("root", {
        message:
          error instanceof Error
            ? error.message
            : "Unable to submit the enquiry. Please try again or email sales@sbainfo.in.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" error={errors.fullName?.message} htmlFor="fullName">
          <input id="fullName" className="input-field" autoComplete="name" {...register("fullName")} />
        </Field>
        <Field label="Work email" error={errors.workEmail?.message} htmlFor="workEmail">
          <input
            id="workEmail"
            type="email"
            className="input-field"
            autoComplete="email"
            {...register("workEmail")}
          />
        </Field>
        <Field label="Phone" error={errors.phone?.message} htmlFor="phone">
          <input id="phone" type="tel" className="input-field" autoComplete="tel" {...register("phone")} />
        </Field>
        <Field label="Company" error={errors.company?.message} htmlFor="company">
          <input
            id="company"
            className="input-field"
            autoComplete="organization"
            {...register("company")}
          />
        </Field>
        <Field label="Role" error={errors.role?.message} htmlFor="role">
          <input id="role" className="input-field" autoComplete="organization-title" {...register("role")} />
        </Field>
        <Field label="Industry" error={errors.industry?.message} htmlFor="industry">
          <select id="industry" className="input-field" {...register("industry")}>
            <option value="" />
            {INDUSTRY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Buyer stage" error={errors.buyerStage?.message} htmlFor="buyerStage">
          <select id="buyerStage" className="input-field" {...register("buyerStage")}>
            <option value="" />
            {BUYER_STAGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>
        <Field
          label="Priority journey"
          error={errors.priorityJourney?.message}
          htmlFor="priorityJourney"
        >
          <select id="priorityJourney" className="input-field" {...register("priorityJourney")}>
            <option value="" />
            {PRIORITY_JOURNEY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field
        label="Preferred engagement"
        error={errors.preferredEngagement?.message}
        htmlFor="preferredEngagement"
      >
        <select id="preferredEngagement" className="input-field" {...register("preferredEngagement")}>
          <option value="" />
          {ENGAGEMENT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Message" error={errors.message?.message} htmlFor="message">
        <textarea
          id="message"
          rows={4}
          className="input-field min-h-[96px] resize-y"
          {...register("message")}
        />
      </Field>

      <div>
        <label htmlFor="consent" className="flex items-start gap-3 text-sm text-soft-grey">
          <input
            id="consent"
            type="checkbox"
            className="mt-1 h-4 w-4 accent-crimson"
            {...register("consent")}
          />
          <span>I agree that SBA Info Solutions may contact me regarding LucidFlow.</span>
        </label>
        {errors.consent ? (
          <p className="field-error" role="alert">
            {errors.consent.message}
          </p>
        ) : null}
      </div>

      <div className="hidden" aria-hidden>
        <input type="hidden" {...register("utm_source")} />
        <input type="hidden" {...register("utm_medium")} />
        <input type="hidden" {...register("utm_campaign")} />
        <input type="hidden" {...register("utm_term")} />
        <input type="hidden" {...register("utm_content")} />
        <input type="hidden" {...register("landingPageUrl")} />
        <input type="hidden" {...register("referrer")} />
        <input type="hidden" {...register("ctaLocation")} />
        <input type="hidden" {...register("submittedAt")} />
      </div>

      {errors.root ? (
        <p className="field-error" role="alert">
          {errors.root.message}
        </p>
      ) : null}

      <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
        {isSubmitting ? "Sending…" : "Request a Journey Assurance Scan"}
      </Button>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="field-label">
        {label}
      </label>
      {children}
      {error ? (
        <p className="field-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
