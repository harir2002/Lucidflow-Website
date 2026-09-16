# LucidFlow Security & Release Checklist

**Review Date:** [To be completed before release]  
**Reviewed By:** [To be completed]  
**Status:** Pre-release verification required

---

## Environment & Secrets

### .env File Security

- [ ] `.env` file is in `.gitignore`
- [ ] `.env.local` and `.env.*.local` are in `.gitignore`
- [ ] No `.env` file is committed to Git
- [ ] `.env.example` contains only placeholder values (no real keys)

**Test:** `git log --all -- .env` returns no results

### Credential Scanning

Search repository for exposed credentials:

- [ ] `SUPABASE_SERVICE_ROLE_KEY` not found in source code
- [ ] `service_role` not found as a real key value
- [ ] `sb_secret_` pattern not found in code
- [ ] `password=` with real password not found
- [ ] `RESEND_API_KEY` not found in code
- [ ] `SLACK_WEBHOOK` not found in code
- [ ] `TURNSTILE_SECRET_KEY` not found in code
- [ ] No AWS keys, database credentials, or API secrets in code

**Test:** Run `grep -r "SUPABASE_SERVICE_ROLE_KEY\|service_role\|sb_secret_\|RESEND_API_KEY\|SLACK_WEBHOOK\|TURNSTILE_SECRET_KEY" src/ --exclude-dir=node_modules` (or similar for your search)

### Public vs. Private Keys

- [ ] Only public keys (Supabase ANON key, GA measurement ID) are committed
- [ ] Service role key is never used in browser code
- [ ] Private keys are only in `.env` (never in code)
- [ ] All env vars used in code start with `VITE_` (Vite convention)

**Correct:**
```
src/App.tsx: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
src/services/enquiryService.ts: import.meta.env.VITE_LUCIDFLOW_ENQUIRY_ENDPOINT
```

**Incorrect (if committed):**
```
src/api.ts: process.env.SUPABASE_SERVICE_ROLE_KEY  ❌
src/config.ts: const apiKey = "sk_live_..."  ❌
```

---

## Personally Identifiable Information (PII) Security

### Form Data & Enquiry Submission

- [ ] Form data is only sent to Supabase Edge Function endpoint
- [ ] Form data is not sent to analytics (GA4) or third-party services
- [ ] Form field names are not logged to console in production
- [ ] Full name, email, phone, company are not tracked in analytics events

**Verify in enquiryService.ts:**
```typescript
trackEvent("lucidflow_form_submit", {
  success: true,  // ✅ Non-PII only
  // ❌ DON'T send: full_name, work_email, phone, etc.
});
```

### Console Logging

- [ ] No PII is logged to `console.log()` in production
- [ ] Development logs are wrapped in `if (import.meta.env.DEV)`
- [ ] Error messages do not expose user email or personal data

**Verify:** Search code for `console.log`, `console.error`, etc. and check for PII

### Direct Database Access

- [ ] No direct browser-to-database connections
- [ ] All database writes go through Supabase Edge Function
- [ ] Row-Level Security (RLS) is enforced on `lucidflow_leads` table
- [ ] Service role key is never used in browser

---

## API & Backend Security

### Edge Function Endpoint

- [ ] Endpoint is HTTPS only (never HTTP)
- [ ] Endpoint is stored in environment variable
- [ ] Endpoint is validated before submission
- [ ] JWT token validation is enabled on Edge Function

**Test:** `import.meta.env.VITE_LUCIDFLOW_ENQUIRY_ENDPOINT` must start with `https://`

### Request Security

- [ ] Requests use `Content-Type: application/json`
- [ ] Requests include CSRF token if required by backend
- [ ] Requests do not expose sensitive headers to client
- [ ] Requests are rejected if endpoint is not configured

### Response Handling

- [ ] Error responses do not expose backend stack traces
- [ ] Error responses use generic messages for users
- [ ] Successful responses do not include unnecessary data
- [ ] HTTP status codes are correctly handled (201 for created, 200 for OK)

**Verify in enquiryService.ts:**
```typescript
return {
  ok: false,
  message: "We could not submit your enquiry right now. Please try again.",
  // ❌ DON'T return: backend error, stack trace, raw SQL
};
```

---

## Third-Party Services & Scripts

### Google Analytics (GA4)

- [ ] GA only tracks non-PII events
- [ ] GA does not receive form field values
- [ ] GA does not receive user email or company name
- [ ] GA events are tested in DebugView before deployment
- [ ] GA implementation does not use user ID without consent

**Events OK to track:**
- `generate_lead` with `{ submission_status: "success" }`
- `lucidflow_form_submit` with `{ success: true/false }`
- `lucidflow_cta_click` with `{ cta_label: "...", cta_location: "..." }`

**Events NOT OK:**
- Full name, email, phone, company, message

### Turnstile / reCAPTCHA

- [ ] Turnstile secret key is NOT in browser code
- [ ] Turnstile verification happens on Edge Function only
- [ ] Client only sends Turnstile token to backend
- [ ] Public Turnstile key is in `.env.example` as placeholder

**Status:** Turnstile should be added before public launch (currently noted in comments)

### Resend (Email)

- [ ] Resend API key is NOT in browser code
- [ ] Email sending is triggered by Edge Function only
- [ ] Email template does not expose sensitive data
- [ ] Email list includes only necessary fields

### LinkedIn Insight Tag

- [ ] LinkedIn tag is NOT installed (placeholder function only)
- [ ] Tag should be added only after privacy/compliance review
- [ ] Tag should only track non-PII engagement

---

## Headers & Security Policies

### Recommended Headers (verify with hosting provider)

- [ ] `Content-Security-Policy` configured to restrict external scripts
- [ ] `X-Content-Type-Options: nosniff` prevents MIME-sniffing
- [ ] `X-Frame-Options: DENY` or `SAMEORIGIN` prevents clickjacking
- [ ] `Strict-Transport-Security` enforces HTTPS
- [ ] `Referrer-Policy: no-referrer` protects privacy
- [ ] `Permissions-Policy` restricts feature access

### CORS Configuration

- [ ] CORS is not set to `*` (allow all origins)
- [ ] CORS is restricted to expected domains only
- [ ] Credentials are not sent in CORS requests unless necessary

---

## SQL & Database Security

### Row-Level Security (RLS)

- [ ] RLS is enabled on `lucidflow_leads` table
- [ ] Only authenticated service role can insert leads
- [ ] Leads are not readable by anonymous users
- [ ] RLS policies are audited and documented

**Verify in Supabase:** Settings → Authentication → Row Level Security enabled

### Data Validation

- [ ] Form inputs are validated on client (Zod schema)
- [ ] Form inputs are validated again on Edge Function (server-side)
- [ ] Database columns have NOT NULL constraints where appropriate
- [ ] Email addresses are validated and normalized

### Prepared Statements

- [ ] SQL queries use parameterized statements
- [ ] No string concatenation in SQL
- [ ] No SQL injection vectors

**Example:**
```typescript
// ✅ Correct
const result = await client
  .from('lucidflow_leads')
  .insert({ full_name: name, work_email: email })

// ❌ Wrong (if using raw SQL)
const result = db.query(`INSERT INTO leads VALUES ('${name}', '${email}')`)
```

---

## Data Retention & Privacy

### Data Lifecycle

- [ ] Data retention policy is documented
- [ ] Leads are retained for [specify period] days/months
- [ ] Old leads are archived or deleted according to policy
- [ ] Deletion process is logged for compliance

### Privacy Policy

- [ ] Privacy policy is published and accessible
- [ ] Privacy policy explains data collection (form fields)
- [ ] Privacy policy explains data usage (contact, no spam)
- [ ] Privacy policy explains user rights (access, deletion)
- [ ] Privacy policy mentions GDPR compliance if applicable

### Consent & Compliance

- [ ] Consent checkbox is mandatory for form submission
- [ ] Consent text is clear and specific
- [ ] Consent is recorded in database (capture timestamp)
- [ ] Users can withdraw consent (process documented)

---

## Deployment & Production

### Build & Artifacts

- [ ] Build output is optimized (`npm run build` completes without errors)
- [ ] Source maps are NOT included in production build (sensitive code exposure)
- [ ] .env files are NOT committed
- [ ] node_modules is NOT committed
- [ ] Old build artifacts are cleaned up

**Test:** `npm run build` → check dist/ folder contains no .env files

### Domain & HTTPS

- [ ] Production domain uses HTTPS only
- [ ] HTTP requests redirect to HTTPS
- [ ] SSL/TLS certificate is valid and not self-signed
- [ ] Certificate is renewed before expiration

### Production Environment

- [ ] .env.production contains only production values
- [ ] API endpoint points to production Supabase project
- [ ] GA measurement ID is production GA property (not dev/test)
- [ ] Turnstile public key is production key (not test/sandbox)

### Monitoring & Logging

- [ ] Error tracking is configured (Sentry, LogRocket, or similar)
- [ ] Logs do not contain PII
- [ ] Critical errors trigger alerts for team
- [ ] Access logs are retained for 30-90 days

---

## Pre-Launch Checklist

### Security

- [ ] No credentials committed to Git
- [ ] No PII sent to analytics
- [ ] All external requests go through secure channels (HTTPS)
- [ ] RLS is enabled on database
- [ ] Error messages are generic for users

### Performance

- [ ] Build succeeds: `npm run build`
- [ ] TypeScript checks pass: `npm run typecheck`
- [ ] Linting passes: `npm run lint`
- [ ] Bundle size is reasonable (< 300kB gzip for React + vendor)

### Functionality

- [ ] Form submission works end-to-end
- [ ] Thank-you page redirect works
- [ ] Video plays without autoplay
- [ ] Navigation anchors work
- [ ] CTA buttons work

### Compliance

- [ ] Accessibility passes WCAG AA (automated + manual)
- [ ] Privacy policy is published and linked
- [ ] Terms of service are published if required
- [ ] Cookie policy is published if using cookies

---

## Post-Launch Monitoring

### First 24 Hours

- [ ] Monitor error logs for critical issues
- [ ] Check GA for accurate event tracking (DebugView)
- [ ] Test form submission with real data
- [ ] Verify email notifications are received
- [ ] Monitor database for large/unexpected submissions

### Ongoing

- [ ] Weekly: Review error logs
- [ ] Monthly: Audit access logs for suspicious activity
- [ ] Quarterly: Review privacy & compliance
- [ ] Annually: Penetration testing and security audit

---

## Important Notes

### Turnstile/reCAPTCHA for Production

⚠️ **Before public launch:**

The form currently does NOT have spam protection. Add Turnstile before going public:

1. Sign up at [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/)
2. Create a site and get Site Key + Secret Key
3. Add Site Key to browser code (public, safe)
4. Add Secret Key to Edge Function (private, secure)
5. Verify token on backend before inserting into database
6. Test form with and without valid token

---

## Checklist Summary

**Security Review Completed:** [ ] Yes [ ] No

**All Items Passed:** [ ] Yes [ ] No (requires fixes)

**Blockers:** [ ] None [ ] Critical [ ] High [ ] Medium

**Ready for Production:** [ ] Yes [ ] No (requires fixes)

---

## Sign-Off

**Reviewed By:** ________________  
**Date:** ________________  
**Status:** ________________  
**Approved By:** ________________

---

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Secure Coding Practices](https://cheatsheetseries.owasp.org/)
- [Supabase Security](https://supabase.com/docs/guides/platform/security-overview)
- [Google Analytics Privacy](https://support.google.com/analytics/answer/6004245)
- [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/)
- [GDPR Compliance](https://gdpr-info.eu/)
