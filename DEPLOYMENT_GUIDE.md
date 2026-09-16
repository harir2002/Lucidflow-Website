# LucidFlow Website - Deployment Guide

This guide explains how to build and deploy the LucidFlow website using Docker.

## Prerequisites

Your colleague will need:
- Docker installed
- Docker Compose (optional, for local testing)
- The GitHub repository link
- The `.env` file with Supabase credentials

## Quick Start for Deployment Team

### 1. Clone the Repository

```bash
git clone https://github.com/harir2002/Lucidflow-Website.git
cd Lucidflow-Website
```

### 2. Set Up Environment Variables

Create a `.env` file in the project root with these variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://pcykqrmlvjowbaalkvsa.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_XhB8UBpSa3GMZk57WbsdpA_GpdbP0CH

# Enquiry Form Submission Endpoint (Supabase Edge Function)
VITE_LUCIDFLOW_ENQUIRY_ENDPOINT=https://pcykqrmlvjowbaalkvsa.supabase.co/functions/v1/lucidflow-enquiry

# Google Analytics 4 (if configured)
VITE_GA_MEASUREMENT_ID=G-72GRWJ8XF6
VITE_GA4_PROPERTY_ID=554618108

# Admin Email (for reference only)
VITE_ADMIN_EMAIL=hari.r@sbainfo.in
```

**⚠️ IMPORTANT:** Do NOT commit the `.env` file to Git. Keep it secure and pass it separately to your deployment team.

### 3. Build Docker Image

```bash
docker build -t lucidflow-website:latest .
```

### 4. Run Container Locally (for testing)

```bash
docker run -p 3000:3000 --env-file .env lucidflow-website:latest
```

Then visit: `http://localhost:3000`

### 5. Push to Registry (e.g., DockerHub, ECR, etc.)

```bash
# Tag the image
docker tag lucidflow-website:latest your-registry/lucidflow-website:latest

# Push to registry
docker push your-registry/lucidflow-website:latest
```

## What's Included in the Build

✅ **Public Website**
- Homepage with hero section
- AI-Based Automation Dark Pattern Finder section
- Capabilities, engagement models, FAQ, and CTA sections
- Form submission with Supabase backend integration
- Google Analytics 4 tracking
- Thank you page after form submission

✅ **Admin Panel** (Protected)
- Login at `/admin-panel` with Supabase Auth
- Dashboard with lead metrics
- Leads list with search, filter, and pagination
- Lead detail page with edit capabilities
- CSV export functionality

✅ **Database Setup**
- Supabase integration ready
- RLS policies enforced for admin access
- Admin allowlist for role-based access control
- Leads table with proper schema

## Environment Variables Explained

| Variable | Purpose | Required |
|----------|---------|----------|
| `VITE_SUPABASE_URL` | Supabase project URL | Yes |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase public key (safe for browser) | Yes |
| `VITE_LUCIDFLOW_ENQUIRY_ENDPOINT` | Edge Function URL for form submissions | Yes |
| `VITE_GA_MEASUREMENT_ID` | GA4 tracking ID | No |
| `VITE_GA4_PROPERTY_ID` | GA4 property ID | No |
| `VITE_ADMIN_EMAIL` | Admin email for reference | No |

## Dockerfile Example

If a `Dockerfile` doesn't exist, create one:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "preview"]
```

## Important Notes for Your Colleague

### Security
- ✅ Never commit `.env` to version control
- ✅ Use environment secrets in your deployment platform (GitHub Actions, GitLab CI, etc.)
- ✅ The `VITE_SUPABASE_PUBLISHABLE_KEY` is safe to expose (it's meant for browsers)
- ✅ Admin credentials are stored in Supabase (no credentials in code)

### Admin Panel Access
- **URL:** `http://your-domain.com/admin-panel`
- **Email:** `hari.r@sbainfo.in`
- **Password:** (ask the admin user to set/reset via Supabase)
- **Access Control:** Managed via Supabase RLS policies and admin_allowlist table

### Database Setup
Before deploying, ensure:
1. Supabase project is set up
2. Database tables exist (`lucidflow_leads`, `admin_allowlist`)
3. RLS policies are applied
4. Admin user is added to the allowlist

**SQL Migration:** See `supabase/migrations/20250116_create_leads_and_admin_allowlist.sql`

### Testing After Deployment
1. Visit homepage: `http://your-domain.com/lucidflow`
2. Test form submission
3. Check admin panel: `http://your-domain.com/admin-panel`
4. Verify leads appear in the admin dashboard

## Troubleshooting

**Form submissions not working?**
- Check `VITE_LUCIDFLOW_ENQUIRY_ENDPOINT` is correct
- Verify Supabase Edge Function is deployed

**Admin panel login fails?**
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`
- Check RLS policies on `lucidflow_leads` and `admin_allowlist` tables
- Ensure admin user is in the allowlist

**Analytics not tracking?**
- Verify `VITE_GA_MEASUREMENT_ID` is set (optional)
- Check GA4 property in Google Analytics console

## Support

For issues or questions:
- Check the repo's README.md
- Review docs folder for detailed setup guides
- Contact the development team

---

**Deployment Team:** You now have everything needed to containerize and host this application! 🚀
