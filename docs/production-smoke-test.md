# LucidFlow Production Smoke Test

**Deployment Date:** [To be completed]  
**Tested By:** [To be completed]  
**Environment:** Production  
**Status:** Manual verification required

Use this checklist immediately after deploying to production to verify the site is working.

---

## Pre-Test Setup

- [ ] Open production URL in **private/incognito** browser window (clears cache)
- [ ] Open browser DevTools (F12 or Cmd+Option+I) → keep Console tab open
- [ ] Use fresh test email address (e.g., qa-test-[timestamp]@example.com)
- [ ] Have phone number and company name ready (optional but recommended)

---

## Basic Loading & Visibility

### Page Load

- [ ] Page loads without errors (no 404, 500, or timeout)
- [ ] Load time is reasonable (< 5 seconds on 4G-equivalent)
- [ ] Console has no JavaScript errors (red X marks)
- [ ] Console has no security warnings
- [ ] HTTPS lock icon is visible in address bar
- [ ] URL is correct and uses HTTPS (not HTTP)

### Content Visibility

- [ ] LucidFlow logo is visible and clickable
- [ ] Hero section loads with background image
- [ ] Hero headline is readable
- [ ] Hero CTA button is visible ("Schedule a Demo Today")
- [ ] No content is hidden or clipped
- [ ] Page layout is responsive (try resizing to 375px width)

---

## Navigation & Routing

### Internal Links

- [ ] Logo click returns to home page
- [ ] All navigation anchor links work:
  - [ ] "Capabilities" → scrolls to Capabilities section
  - [ ] "How It Works" → scrolls to How-It-Works section
  - [ ] "FAQ" → scrolls to FAQ section
- [ ] Anchor navigation does not create errors
- [ ] Scrolling is smooth (no console errors during scroll)

### External Links

- [ ] Phone number links (tel:) work on mobile or trigger click handler
- [ ] Email links (mailto:) trigger email client
- [ ] Any LinkedIn/social links open in new tab (target="_blank")

---

## CTA Buttons & Form

### Button Clicks

- [ ] "Schedule a Demo Today" button is clickable (primary CTA)
- [ ] Button click opens enquiry modal (no page reload)
- [ ] Any secondary CTAs are clickable (e.g., "Request a Platform Walkthrough")
- [ ] Buttons do not trigger console errors

### Form Modal

- [ ] Form modal appears with correct styling
- [ ] Form has all required fields:
  - [ ] Full name
  - [ ] Work email
  - [ ] Company
  - [ ] Consent checkbox
- [ ] Optional fields are present:
  - [ ] Phone
  - [ ] Role
  - [ ] Message
- [ ] Modal is keyboard accessible (Tab to focus, Escape to close)
- [ ] Modal can be closed (X button, Escape key, or clicking outside)

---

## Form Submission (Critical Test)

### Submit Valid Form

1. Fill form with test data:
   ```
   Full Name: QA Test User
   Work Email: qa-test-[timestamp]@example.com  (unique for tracking)
   Company: Test Company
   Phone: +1-555-0123 (optional)
   Role: QA Lead (optional)
   Message: Testing production deployment (optional)
   Consent: ✓ Checked
   ```

2. Verify form submission:
   - [ ] Submit button is enabled
   - [ ] Click submit → button shows "Sending..." state
   - [ ] Submission completes within 5 seconds
   - [ ] No console errors during submission
   - [ ] Browser redirects to thank-you page

### Thank-You Page

- [ ] Thank-you page loads (URL contains "/thank-you" or similar)
- [ ] Page displays "Thank you." heading
- [ ] PDF download link is present (if configured)
- [ ] PDF download link is clickable

### Database Verification

- [ ] Open Supabase Dashboard → Tables → lucidflow_leads
- [ ] New lead record exists with:
  - [ ] Correct full_name
  - [ ] Correct work_email
  - [ ] Correct company
  - [ ] consent_given = true
  - [ ] Timestamp is current (within 1 minute)
- [ ] No duplicate records created

### Analytics Verification

- [ ] Open Google Analytics DebugView (or real-time events)
- [ ] Verify `lucidflow_form_submit` event with `success: true`
- [ ] Verify `generate_lead` event with `submission_status: success`
- [ ] ⚠️ **Verify NO PII appears in event data** (no email, name, or company fields)
- [ ] Delete test lead from database after verification (for cleanliness)

---

## Video Component

### Video Poster & Play Button

- [ ] Video section is visible on main page
- [ ] Video poster image loads
- [ ] Play button is visible and labeled
- [ ] Play button is keyboard accessible (Tab to focus, Enter to activate)

### Video Modal

- [ ] Click play button → video modal opens
- [ ] Modal displays video player
- [ ] Video can play (click play control or press Space)
- [ ] Video displays without autoplay sound
- [ ] Close button (X) closes modal
- [ ] Escape key closes modal
- [ ] Focus returns to play button after close

### Video Fallback (if video unavailable)

- [ ] If video file is missing, fallback behavior triggers (e.g., opens form)
- [ ] Fallback does not cause errors

---

## Mobile Menu (if applicable)

- [ ] Mobile menu toggle button is visible on narrow screens (< 768px)
- [ ] Menu toggle is keyboard accessible
- [ ] Menu opens and shows navigation links
- [ ] Menu closes (click X, Escape, or click link)
- [ ] Menu links navigate correctly

---

## FAQ Section

- [ ] FAQ section is visible
- [ ] All FAQ items are listed (at least 6 items)
- [ ] FAQ items are keyboard accessible (Tab to accordion, Space/Enter to toggle)
- [ ] Accordion items expand and show answers
- [ ] Only one accordion item is open at a time (if designed that way)
- [ ] Content is readable (not cut off)

---

## Footer & Links

- [ ] Footer is visible at bottom of page
- [ ] Footer contains contact information
- [ ] Phone number in footer is clickable (tel:)
- [ ] Email in footer is clickable (mailto:)
- [ ] Any legal links (Privacy, Terms) are present and clickable
- [ ] Footer links do not trigger errors

---

## PDF Download

- [ ] PDF download link is present on site (if configured)
- [ ] Link has descriptive text (e.g., "Download Journey Assurance Scan Overview")
- [ ] Clicking link triggers download
- [ ] Downloaded file is a valid PDF (can open with PDF reader)
- [ ] File name is correct

**Analytics:** Verify `lucidflow_pdf_download` event is tracked in GA

---

## SEO & Meta

- [ ] Page title is set correctly (visible in browser tab)
- [ ] Page has meta description
- [ ] Open Graph tags are present (title, description, image)
- [ ] Favicon is visible in browser tab

**Test:** View page source (Ctrl+U or Cmd+U) and check:
```html
<title>LucidFlow | ...</title>
<meta name="description" content="...">
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:image" content="...">
```

---

## Performance & Errors

### Console Check

- [ ] No JavaScript errors (red X marks in Console tab)
- [ ] No TypeScript compilation errors
- [ ] No 404 errors for resources (images, fonts, scripts)
- [ ] No CORS errors
- [ ] No CSP (Content-Security-Policy) violations
- [ ] No deprecation warnings (acceptable: non-critical third-party warnings)

### Network Tab

- [ ] Main bundle loads (~75kB JS, ~37kB CSS)
- [ ] No failed requests (all green checks)
- [ ] All requests use HTTPS (not mixed HTTP/HTTPS)
- [ ] Response times are reasonable (< 2 seconds each)

### Browser Support

- [ ] Chrome (latest): All tests pass
- [ ] Edge (Chromium-based): All tests pass
- [ ] Safari (if available): All tests pass
- [ ] Firefox (if available): All tests pass

---

## Mobile Testing

- [ ] Resize browser to 375px width (mobile emulation)
- [ ] All content is visible (no horizontal scrolling)
- [ ] Touch targets are adequate (≥ 44px height)
- [ ] Form is usable on mobile
- [ ] Virtual keyboard does not hide submit button
- [ ] Video modal works on mobile
- [ ] Menu works on mobile

---

## Accessibility Quick Check

- [ ] Tab through page: all interactive elements are reachable
- [ ] Focus outline is visible (usually blue border)
- [ ] Escape key closes modals
- [ ] Form can be submitted with keyboard (Tab + Enter)
- [ ] Color is not the only indicator (error messages have text/icon, not just color)

---

## Domain & HTTPS

- [ ] Production domain resolves correctly
- [ ] HTTPS is enforced (HTTP redirects to HTTPS)
- [ ] SSL/TLS certificate is valid
  - [ ] Click lock icon → certificate info shows:
    - [ ] Issued to correct domain
    - [ ] Issuer is trusted (e.g., Let's Encrypt, Digicert)
    - [ ] Not expired
- [ ] No security warnings or mixed-content warnings

---

## Analytics Setup

### Google Analytics (GA4)

- [ ] GA is loaded (verify in Network tab or DevTools → Applications)
- [ ] GA measurement ID is correct (starts with G-)
- [ ] GA events are firing:
  - [ ] Page view event
  - [ ] CTA click events (when clicking buttons)
  - [ ] Form events (when opening/submitting form)
- [ ] DebugView shows events in real-time (must be within 48 hours of deployment)

### PII Check ⚠️

- [ ] GA events do NOT include user email, name, phone, or company
- [ ] GA events do NOT include form field values
- [ ] GA events only include non-PII context (button label, section name, etc.)

---

## Third-Party Services

### Supabase

- [ ] Supabase connection is established (check Network tab)
- [ ] Leads table is accessible (verified via form submission)
- [ ] Leads table has correct schema

### Turnstile / reCAPTCHA (if deployed)

- [ ] Turnstile widget is visible on form
- [ ] Turnstile validation prevents spam
- [ ] Form submission fails without valid Turnstile token

### Email Service (if deployed)

- [ ] Check email inbox (use test email from form)
- [ ] Confirmation email is received (if configured)
- [ ] Email contains correct data
- [ ] Email does not expose sensitive backend info

---

## Common Issues Checklist

- [ ] No blank page or "Cannot GET /" error
- [ ] No mixed HTTP/HTTPS content warnings
- [ ] No CORS errors preventing API calls
- [ ] No missing environment variables
- [ ] No data from previous deployments leaking
- [ ] Form does not submit twice on double-click
- [ ] Thank-you page does not show form if already submitted
- [ ] Analytics do not double-track events

---

## Smoke Test Results

**Date:** ________________  
**Time:** ________________  
**Tester:** ________________

### Summary

- [ ] All critical paths work end-to-end
- [ ] No console errors or warnings
- [ ] Form submission works and redirects
- [ ] Database records are created
- [ ] Analytics are tracking (non-PII)
- [ ] HTTPS is enforced

### Issues Found

```
1. [Description]
   Severity: [ ] Critical [ ] High [ ] Medium [ ] Low
   Status: [ ] Blocker [ ] Fix Immediately [ ] Can Wait

2. [Description]
   Severity: [ ] Critical [ ] High [ ] Medium [ ] Low
   Status: [ ] Blocker [ ] Fix Immediately [ ] Can Wait
```

### Sign-Off

**Status:** [ ] PASS (ready for users) [ ] FAIL (requires fixes)

**Approved For Production:** [ ] Yes [ ] No

**Signed By:** ________________  
**Date:** ________________

---

## Next Steps (If Issues Found)

1. Document issue details (steps to reproduce, screenshots, console logs)
2. Roll back if critical blocker
3. Fix on dev/staging
4. Re-test on staging before re-deploying
5. Re-run smoke test on production
6. Update this checklist with findings
