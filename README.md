# LucidFlow Website

Official product website for **LucidFlow by SBA Info Solutions** — a continuous dark-pattern monitoring and digital-journey assurance platform for insurance and banking teams.

## Tech Stack

- **React 18** - Modern React with concurrent features
- **Vite 6** - Lightning-fast development and optimized builds
- **React Router 6** - Client-side routing
- **TypeScript** - Type safety
- **Tailwind CSS 3** - Utility-first styling with custom configuration
- **React Hook Form + Zod** - Form validation
- **Lucide React** - Icon library
- **Framer Motion** - Subtle animations (respects prefers-reduced-motion)
- **React Helmet Async** - Document head management

## Routes

- `/` → Redirects to `/lucidflow`
- `/lucidflow` → Official landing page
- `/lucidflow/thank-you` → Enquiry confirmation page

## Local Development

```bash
# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

| Variable | Purpose | Required |
| --- | --- | --- |
| `VITE_GA_MEASUREMENT_ID` | Google Analytics 4 tracking ID | No |
| `VITE_LUCIDFLOW_ENQUIRY_ENDPOINT` | Backend API endpoint for form submissions | No (dev mode uses mock) |
| `VITE_CALENDAR_BOOKING_URL` | Calendly/Bookings URL (future feature) | No |
| `VITE_SITE_URL` | Canonical site URL for SEO | No (defaults to sbainfo.in) |

### Development Mode

When `VITE_LUCIDFLOW_ENQUIRY_ENDPOINT` is not set in development, the form will:
- Log submissions to browser console
- Simulate network delay
- Return mock success response
- Redirect to thank-you page

### Production Mode

Configure `VITE_LUCIDFLOW_ENQUIRY_ENDPOINT` to point to your secure backend API:

```env
VITE_LUCIDFLOW_ENQUIRY_ENDPOINT=https://api.yourdomain.com/v1/lucidflow/enquiry
```

**IMPORTANT**: Never expose sensitive credentials (SMTP keys, CRM API keys, Slack webhooks) in frontend environment variables. All sensitive operations must be handled server-side.

## Public Assets

### Logo

Place the official logo at:
```
public/lucidflow-logo.png
```

Current format: PNG  
If missing: Text fallback displays "LUCIDFLOW / BY SBA INFO SOLUTIONS"

### Hero Image

Place the hero visual at:
```
public/images/lucidflow-13-dark-patterns-hero.png
```

**Specifications**:
- Current format: PNG (WebP recommended for production)
- Dimensions: ~1400×1160px or similar 6:5 ratio
- Content: Abstract visualization of 13 dark-pattern risk categories
- Style: Dark, technical, premium enterprise aesthetic
- No embedded text labels

If missing: CSS placeholder with abstract journey visualization renders automatically.

### PDF Download

Place the overview PDF at:
```
public/documents/journey-assurance-scan-overview.pdf
```

This PDF is linked on the thank-you page.

### Open Graph Image

Place the social share image at:
```
public/lucidflow-og-image.jpg
```

Dimensions: 1200×630px recommended

## Form Submission Backend

The enquiry form is handled by `src/services/enquiryService.ts`.

### Backend Requirements

Your backend endpoint should:

1. **Accept POST requests** with JSON payload matching the Zod schema in `src/lib/validation.ts`

2. **Validate data** server-side (never trust client validation alone)

3. **Implement spam protection**:
   - Cloudflare Turnstile
   - reCAPTCHA v3
   - Rate limiting

4. **Send notifications**:
   - Email to sales team (Resend / SendGrid / AWS SES)
   - CRM integration (HubSpot / Zoho / Salesforce / Google Sheets)
   - Slack webhook for internal alerts

5. **Return JSON response**:
   ```json
   {
     "ok": true,
     "message": "Enquiry received"
   }
   ```

### Example Backend Implementation

See `app/api/lucidflow-enquiry/route.ts` in the Next.js version for reference structure.

Recommended stack options:
- **Serverless Functions**: Vercel Functions, AWS Lambda, Cloudflare Workers
- **Backend API**: Node.js/Express, Python/FastAPI, Go/Gin
- **No-code**: Zapier, Make (Integromat), n8n

## Analytics

Google Analytics 4 tracking is configured in `src/hooks/useAnalytics.ts`.

### Events Tracked

- `lucidflow_cta_click` - CTA button clicks
- `lucidflow_form_open` - Enquiry modal opens
- `lucidflow_form_submit` - Form submissions
- `lucidflow_pdf_download` - PDF downloads
- `lucidflow_video_placeholder_click` - Video placeholder interactions
- `lucidflow_phone_click` - Phone number clicks
- `lucidflow_email_click` - Email address clicks
- `lucidflow_calendar_booking` - Calendar bookings (future)

### LinkedIn Insight Tag

**TODO**: Only add after SBA privacy and consent processes permit it.
See comment in `src/hooks/useAnalytics.ts`.

## SEO

Document title and meta description are configured in `src/data/lucidflowContent.ts`.

Open Graph and Twitter Card meta tags are in `index.html`.

Structured data (JSON-LD) is included in `src/pages/LucidFlowPage.tsx`.

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy

# Deploy to production
netlify deploy --prod
```

### Static Hosting (AWS S3, Cloudflare Pages, etc.)

```bash
# Build
npm run build

# Upload dist/ folder to your hosting provider
```

### Environment Variables

Set all `VITE_*` variables in your hosting platform:
- Vercel: Project Settings → Environment Variables
- Netlify: Site Settings → Environment Variables
- Others: Follow platform documentation

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Accessibility

- WCAG 2.1 AA compliant
- Keyboard navigation support
- Focus states on all interactive elements
- Respects `prefers-reduced-motion`
- Semantic HTML
- ARIA labels where appropriate

## Performance

- Lighthouse score: 90+ (aim for 95+)
- First Contentful Paint: <1.5s
- Largest Contentful Paint: <2.5s
- Cumulative Layout Shift: <0.1
- Time to Interactive: <3.5s

## Project Structure

```
├── public/
│   ├── images/
│   │   └── lucidflow-13-dark-patterns-hero.png
│   ├── documents/
│   │   └── journey-assurance-scan-overview.pdf
│   ├── lucidflow-logo.png
│   └── lucidflow-og-image.jpg
├── src/
│   ├── components/
│   │   └── lucidflow/          # All LucidFlow UI components
│   ├── data/
│   │   └── lucidflowContent.ts # Content, constants, options
│   ├── hooks/
│   │   ├── useAnalytics.ts     # GA4 tracking
│   │   └── useUtmParams.ts     # UTM parameter capture
│   ├── lib/
│   │   └── validation.ts       # Zod schemas
│   ├── pages/
│   │   ├── LucidFlowPage.tsx   # Landing page
│   │   └── ThankYouPage.tsx    # Thank you page
│   ├── services/
│   │   └── enquiryService.ts   # Form submission
│   ├── App.tsx                 # Router setup
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles
├── index.html                  # HTML entry + SEO meta
├── vite.config.ts              # Vite configuration
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies
```

## Migration from Next.js 14

This project was migrated from Next.js 14 to Vite 8 + React 19:

### Key Changes

- ✅ Removed `"use client"` directives
- ✅ Replaced `next/image` with standard `<img>` tags
- ✅ Replaced `next/link` with standard anchor tags or removed
- ✅ Replaced `useRouter` from Next.js with `useNavigate` from React Router
- ✅ Replaced Next.js API routes with client-side service + backend endpoint
- ✅ Replaced Next.js metadata exports with `react-helmet-async`
- ✅ Updated all imports from `@/lib/constants` to `@/data/lucidflowContent`
- ✅ Updated environment variables from `NEXT_PUBLIC_*` to `VITE_*`

### Functional Parity

All features from the Next.js version are preserved:
- ✅ Responsive design
- ✅ Form validation
- ✅ UTM parameter capture
- ✅ Analytics tracking
- ✅ Modal behavior
- ✅ Accessibility
- ✅ SEO metadata
- ✅ Smooth scrolling
- ✅ Mobile navigation

## Approved Content

All visible website content is defined in `src/data/lucidflowContent.ts`.

**DO NOT**:
- Add unapproved marketing claims
- Add "compliant", "certified", "legal", or "regulator approved" language
- Add text labels inside product mockups or visuals
- Modify approved copy without stakeholder review

## Support

For questions or issues, contact:
- Email: sales@sbainfo.in
- Phone: +91 95001 37169

## License

Proprietary - SBA Info Solutions
