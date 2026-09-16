# Supabase Frontend Setup - LucidFlow Website

This document explains how to configure and use Supabase with the LucidFlow React + Vite website.

## Table of Contents

1. [Security Overview](#security-overview)
2. [Environment Variables](#environment-variables)
3. [Getting Supabase Credentials](#getting-supabase-credentials)
4. [Frontend Client Setup](#frontend-client-setup)
5. [Edge Function Endpoint](#edge-function-endpoint)
6. [Testing Locally](#testing-locally)
7. [Deployment](#deployment)
8. [Troubleshooting](#troubleshooting)

---

## Security Overview

### Why Supabase Publishable Key is Safe in Frontend

The Supabase **publishable key** is safe to expose in browser code when Row-Level Security (RLS) is properly enabled:

1. **RLS Policies**: All table policies restrict access based on authentication, request properties, or column values
2. **Server-Side Logic**: Sensitive operations (lead insertion, email notifications, CRM sync) run on Supabase Edge Functions
3. **No Secret Keys**: Secret/service-role keys, database passwords, SMTP credentials, and CRM API keys are **never** stored in Vite environment variables

### What Never Goes in Frontend Code

❌ Service-role keys
❌ Database passwords
❌ SMTP credentials (SendGrid, Resend)
❌ CRM API keys (HubSpot, Zoho, Salesforce)
❌ Slack webhooks
❌ Turnstile secret key
❌ Any other private backend credentials

These are stored securely on the Edge Function backend only.

---

## Environment Variables

Copy `.env.example` to `.env` and fill in your values. The `.env` file is in `.gitignore` and will never be committed.

```bash
cp .env.example .env
```

### Required Variables

```bash
# Supabase Project URL
VITE_SUPABASE_URL=https://your-project.supabase.co

# Supabase Publishable Key (safe in browser with RLS)
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Edge Function Endpoint (secure backend for form submission)
VITE_LUCIDFLOW_ENQUIRY_ENDPOINT=https://your-project.supabase.co/functions/v1/lucidflow-enquiry
```

### Optional Variables

```bash
# Google Analytics 4 Measurement ID
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Cloudflare Turnstile Site Key (for CAPTCHA)
VITE_TURNSTILE_SITE_KEY=1x00000000000000000000AA

# Calendar Booking URL
VITE_CALENDAR_BOOKING_URL=https://calendly.com/your-link

# Site URL (for canonical and Open Graph)
VITE_SITE_URL=https://lucidflow.sbainfosolutions.com
```

---

## Getting Supabase Credentials

### Step 1: Sign Up or Log In to Supabase

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub or email

### Step 2: Get Publishable Key and URL

1. Go to your Supabase Dashboard
2. Click **Settings** (bottom left)
3. Click **API** tab
4. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **Anon public** key → `VITE_SUPABASE_PUBLISHABLE_KEY`

**Screenshot reference:**
```
Settings → API tab
┌────────────────────────────────────────┐
│ Project API Keys                       │
├────────────────────────────────────────┤
│ Project URL:                           │
│ https://your-project.supabase.co  ← Copy this
│                                        │
│ Anon public:                           │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6... ← Copy this
│                                        │
│ Service role (SECRET - never share):   │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6... ✗ DO NOT USE
└────────────────────────────────────────┘
```

⚠️ **CRITICAL**: Never copy the **Service role** key to `.env`. That key has admin privileges and must stay on the backend only.

---

## Frontend Client Setup

The Supabase browser client is already configured in the LucidFlow website:

### File: `src/lib/supabase.ts`

```typescript
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";

// Check if Supabase is configured
if (isSupabaseConfigured()) {
  const supabase = getSupabaseClient();
  // Use supabase client (currently unused - all form data goes to Edge Function)
}
```

**Important Notes:**

- The client is initialized only if `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` are set
- In development without these variables, a warning is logged (no error thrown)
- All form submissions go to the Edge Function endpoint, NOT directly to the database
- The client instance is exported safely and returns `null` if not configured

---

## Edge Function Endpoint

### What is the Edge Function?

The **Edge Function** is a secure serverless function running on Supabase infrastructure. It:

- ✅ Receives form submissions via HTTPS POST
- ✅ Validates request origin and payload
- ✅ Runs CAPTCHA checks (Turnstile/reCAPTCHA)
- ✅ Inserts validated leads into the database
- ✅ Sends email notifications (Resend/SendGrid)
- ✅ Syncs to CRM (HubSpot/Zoho/Salesforce)
- ✅ Sends alerts to Slack
- ✅ Never exposes credentials to the frontend

### Endpoint URL Format

```
https://your-project.supabase.co/functions/v1/lucidflow-enquiry
```

Replace `your-project` with your Supabase project ID.

### Expected Request Body

The frontend sends a JSON payload with:

```json
{
  "full_name": "John Doe",
  "work_email": "john@company.com",
  "phone": "+1 555 123 4567",
  "company": "Acme Corp",
  "role": "CEO",
  "message": "Interested in a demo.",
  "consent_given": true,
  "consent_timestamp": "2025-01-15T10:30:00Z",
  "utm_source": "google",
  "utm_campaign": "q1_2025",
  "landing_page": "https://lucidflow.sbainfo.in/lucidflow",
  "referrer": "https://google.com/search?q=dark+patterns",
  "source_cta_location": "hero",
  "submitted_at": "2025-01-15T10:30:00Z"
}
```

### Expected Response

**Success (200 OK):**

```json
{
  "success": true,
  "message": "Lead received and processing.",
  "lead_id": "lead_abc123"
}
```

**Error (400/422):**

```json
{
  "success": false,
  "message": "CAPTCHA verification failed.",
  "errors": {
    "captcha": ["Invalid token"]
  }
}
```

---

## Testing Locally

### 1. Development Mode (Without Endpoint)

If `VITE_LUCIDFLOW_ENQUIRY_ENDPOINT` is not set in `.env`:

- Form submissions print a dev-mode message to the console
- Mock success response is returned
- **Data is NOT inserted into the database**
- Useful for UI/UX testing

```bash
# Run locally
npm run dev

# Fill out the form
# Check browser console for dev-mode message
```

### 2. Testing with Live Endpoint

To test with the actual Edge Function:

1. **Ensure `.env` is configured:**
   ```bash
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
   VITE_LUCIDFLOW_ENQUIRY_ENDPOINT=https://your-project.supabase.co/functions/v1/lucidflow-enquiry
   ```

2. **Restart Vite dev server:**
   ```bash
   npm run dev
   ```

3. **Fill out the form** on `http://localhost:5173`

4. **Check the result:**
   - Success: Browser redirects to thank-you page
   - Error: Error message displayed in form

5. **Verify lead in Supabase:**
   - Go to your Supabase Dashboard
   - Click **SQL Editor** or **Table Editor**
   - Check the `leads` table for your new record

---

## Deployment

### Production Checklist

- [ ] `.env` is filled with production Supabase credentials
- [ ] `VITE_LUCIDFLOW_ENQUIRY_ENDPOINT` points to live Edge Function
- [ ] Supabase RLS policies are enabled on all tables
- [ ] Edge Function environment variables are configured (API keys, webhooks)
- [ ] Edge Function is deployed and tested
- [ ] `.env` is in `.gitignore` and never committed
- [ ] Run `npm run build` and verify no errors
- [ ] Test form submission on staging/production domain

### Deploying to Vercel, Netlify, or Other Hosting

1. **Add environment variables in hosting dashboard:**
   - Settings → Environment Variables
   - Add `VITE_SUPABASE_URL`
   - Add `VITE_SUPABASE_PUBLISHABLE_KEY`
   - Add `VITE_LUCIDFLOW_ENQUIRY_ENDPOINT`

2. **Redeploy the site:**
   - Push to main branch (or trigger deploy from dashboard)
   - Hosting provider rebuilds with new env vars

3. **Verify in production:**
   - Visit your live site
   - Submit form
   - Check Supabase dashboard for new lead

---

## Troubleshooting

### Issue: "VITE_SUPABASE_URL is missing"

**Error Message:** Console warning about missing Supabase URL

**Solution:**
1. Copy `.env.example` to `.env`
2. Fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`
3. Restart Vite: `npm run dev`

### Issue: Form submits but no lead appears in database

**Possible causes:**

1. **Edge Function not deployed** → Deploy the function via Supabase Dashboard
2. **Wrong endpoint URL** → Verify `VITE_LUCIDFLOW_ENQUIRY_ENDPOINT` matches your function path
3. **CAPTCHA failing** → If Turnstile/reCAPTCHA is enabled, verify site key is correct
4. **RLS policy blocking insert** → Check Supabase function has appropriate permissions
5. **Function environment variables missing** → Set up API keys, SMTP credentials, webhooks in function settings

**Debug steps:**
1. Open browser DevTools → Network tab
2. Submit form
3. Find the POST request to `lucidflow-enquiry`
4. Check response status and body
5. Copy error message and check Supabase function logs

### Issue: "CORS error" or "Network error"

**Possible causes:**

1. **Function endpoint URL is wrong** → Check for typos, trailing slashes
2. **Browser blocked request** → Check browser console for CORS error details
3. **Function not accepting POST** → Edge Function must have `POST` method handler

**Solution:**
1. Verify endpoint URL in `.env` is exactly correct
2. Check Supabase Edge Function is deployed
3. Test endpoint with curl or Postman (if public):
   ```bash
   curl -X POST "https://your-project.supabase.co/functions/v1/lucidflow-enquiry" \
     -H "Content-Type: application/json" \
     -d '{"full_name": "Test", "work_email": "test@example.com", ...}'
   ```

### Issue: Console warning about missing Supabase keys in development

**Expected behavior** - This is normal in local development without `.env` configured.

**To suppress:**
1. Copy `.env.example` to `.env`
2. Fill in the values
3. Restart Vite

---

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Row-Level Security (RLS)](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Auth](https://supabase.com/docs/guides/auth)

---

## Support

For issues with the LucidFlow integration:

1. Check this document first
2. Search [GitHub Issues](https://github.com/harir2002/Lucidflow-Website/issues)
3. Review Supabase documentation and Edge Function logs
