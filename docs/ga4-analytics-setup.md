# GA4 Analytics Implementation for LucidFlow

## Overview

This document outlines the GA4 analytics implementation for LucidFlow, including configuration, event tracking, and privacy safeguards.

## Configuration

### Measurement ID

GA4 requires a Google Analytics 4 Measurement ID configured via environment variables:

```bash
VITE_GA_MEASUREMENT_ID=G-72GRWJ8XF6
```

This is set in:
- `.env` (development and production values)
- `.env.example` (template: `VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX`)

**Critical:** The Measurement ID must be set in `.env` for GA4 to initialize. If missing, tracking silently fails with no errors.

## GA4 Library

The centralized GA4 library is located at `src/lib/ga4.ts`. It provides:

- **`initializeGA4()`** — Loads Google Analytics script, initializes gtag, called once on app startup
- **`trackPageView(pathname, pageTitle?)`** — Tracks page views
- **`trackEvent(eventName, params)`** — Base event tracking (type-safe)
- **Specialized event functions** — Type-safe wrappers for common events (see below)

### PII Safety

The GA4 library enforces strict privacy rules:

- **No PII transmission** — Form fields (name, email, phone, company, role, message) are NEVER sent to GA4
- **No database IDs** — Lead IDs and internal database identifiers are excluded
- **No hardcoded IDs** — Measurement ID must come from environment only
- **Silent failure** — If GA4 is unavailable, tracking stops without errors
- **Graceful degradation** — Missing Measurement ID causes no console warnings

## Event Tracking

### Initialized Events (Implemented)

| Event | Location | Params | Notes |
|-------|----------|--------|-------|
| `lucidflow_cta_click` | Header, Hero, FinalCTA | cta_label, cta_location, preferred_engagement | Tracks all CTA button clicks |
| `lucidflow_form_open` | EnquiryModal | source_section | Fires when form modal opens |
| `lucidflow_form_submit` | EnquiryForm | buyer_stage, preferred_engagement, priority_journey, industry, source_section | Fires on form submit (attempt) |
| `generate_lead` | enquiryService.ts | submission_method | Backend success (HTTP 201) |
| `lucidflow_pdf_download` | DownloadOverview | file_name, page_location | Thank You page PDF download |

### Ready-to-Use Functions (Not Yet Integrated)

| Function | Event | Params | Use Case |
|----------|-------|--------|----------|
| `trackVideoOpen()` | lucidflow_video_open | video_name, video_location | When video player opens |
| `trackVideoPlay()` | lucidflow_video_play | video_name, video_location | When video play button clicked |
| `trackVideoProgress()` | lucidflow_video_progress | video_name, video_location, percent | Video progress milestones (25%, 50%, 75%, 100%) |
| `trackVideoComplete()` | lucidflow_video_complete | video_name, video_location | Video finished |
| `trackVideoFallback()` | lucidflow_video_fallback | video_name, video_location, reason | Fallback to demo request |
| `trackPhoneClick()` | lucidflow_phone_click | location | Phone link clicked |
| `trackEmailClick()` | lucidflow_email_click | location | Email link clicked |
| `trackCalendarBooking()` | lucidflow_calendar_booking | booking_type, source_section | Calendar booking confirmed |
| `trackFormError()` | lucidflow_form_error | error_type, source_section | Form validation/submission error |

## Key Events

### CTA Clicks

Triggered when users interact with call-to-action buttons (Schedule a Demo, See How It Works, etc.):

```typescript
trackCTAClick({
  cta_label: "Schedule a Demo Today",
  cta_location: "hero",
  preferred_engagement: "scan",
});
```

**Locations used:** `header`, `header_mobile`, `hero`, `final-cta`, `video`, `form_modal`

### Form Events

#### Form Open

Triggered when the enquiry form modal opens:

```typescript
trackFormOpen({
  source_section: "form_modal",
});
```

#### Form Submit

Triggered on form submission (after client validation):

```typescript
trackFormSubmit({
  buyer_stage: "assessment_complete",
  preferred_engagement: "scan",
  priority_journey: "quote_to_buy",
  industry: "insurance",
  source_section: "form_modal",
});
```

### Lead Generation

Tracked **only** after successful backend submission (HTTP 201 response):

```typescript
trackGenerateLead({
  submission_method: "form",
});
```

**Critical:** This is tracked in `src/services/enquiryService.ts` only after the backend returns success, preventing false lead tracking.

## DebugView

To debug events in real-time:

1. Open your browser's DevTools
2. Set a breakpoint in `src/lib/ga4.ts` in the `trackEvent()` function
3. In Google Analytics 4 console, enable DebugView for your IP
4. Visit the site and check GA4 Real-time Events

## Privacy & Compliance

### What is NOT Tracked

- User's name, email, phone, company, or role
- Form input values (validation only)
- Lead IDs or internal database identifiers
- Sensitive business data
- Cookies (unless existing cookie banner permits)

### GDPR Compliance

Since no PII is transmitted to GA4:

- No additional consent required (non-identifying analytics)
- Can be deployed without cookie banners
- User privacy is maintained
- Compliant with privacy-first approach

### LinkedIn Insight Tag

A placeholder function exists for future LinkedIn tag integration:

```typescript
linkedInInsightTagPlaceholder() // TODO: Awaiting privacy/consent review
```

**Status:** Not implemented pending SBA privacy and consent review.

## Development Mode

In development (`import.meta.env.DEV = true`), all events are logged to console:

```
[LucidFlow analytics] lucidflow_cta_click {cta_label: "Schedule a Demo Today", ...}
```

This allows testing without impacting analytics.

## Integration Checklist

- [x] GA4 library created (`src/lib/ga4.ts`)
- [x] Initialization hook created (`src/hooks/useGA4.ts`)
- [x] GA4 initialized in `App.tsx` on startup
- [x] CTA click tracking in Header, Hero, FinalCTA
- [x] Form open/submit tracking in EnquiryModal and EnquiryForm
- [x] Lead generation tracking in enquiryService after backend success
- [x] PDF download tracking in DownloadOverview
- [x] Measurement ID configured in `.env`
- [ ] Video event tracking (ready but not yet integrated)
- [ ] Phone/email click tracking (ready but not yet integrated)
- [ ] Calendar booking tracking (ready but not yet integrated)
- [ ] DebugView testing
- [ ] GA4 dashboard review (Real-time > Overview)

## Troubleshooting

### Events not appearing in GA4

1. **Check Measurement ID** — Verify `VITE_GA_MEASUREMENT_ID` is set in `.env`
2. **Check DebugView** — Enable DebugView in GA4 to see real-time events
3. **Check Network tab** — Look for calls to `https://www.google-analytics.com/...`
4. **Check console** — In dev mode, all events should log to console

### "GA4 not available" message

This is normal. It appears when:
- Measurement ID is not set (`missing VITE_GA_MEASUREMENT_ID`)
- GA4 script failed to load
- Window.gtag is not defined

Analytics continues to work without GA4; this is graceful degradation by design.

## References

- [Google Analytics 4 Setup Guide](https://support.google.com/analytics/answer/10089681)
- [gtag.js Documentation](https://developers.google.com/gtagjs)
- [GA4 Event Reference](https://support.google.com/analytics/answer/9322688)
