# Admin Panel Setup Guide

This guide provides step-by-step instructions to set up the secure admin-only lead management panel for LucidFlow.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Database Setup](#database-setup)
3. [Supabase Auth Configuration](#supabase-auth-configuration)
4. [Local Development Setup](#local-development-setup)
5. [Production Deployment](#production-deployment)
6. [Usage Guide](#usage-guide)
7. [Security Checklist](#security-checklist)
8. [Troubleshooting](#troubleshooting)

---

## Architecture Overview

### Components

- **Admin Panel Routes**: Protected routes at `/admin-panel/*`
- **Authentication**: Supabase Auth (email + password)
- **Authorization**: Role-based access via `admin_allowlist` table
- **Database**: Supabase with RLS policies
- **Lead Data**: Stored in `lucidflow_leads` table from form submissions

### Security Boundaries

1. **Authentication**: Supabase Auth session
2. **Authorization**: `admin_allowlist` allowlist check (database + UI)
3. **Data Protection**: Row-Level Security (RLS) policies on all tables
4. **No PII to Frontend**: No form field data exposed to admin UI logs/analytics

### Admin User Flow

```
1. Admin visits /admin-panel
2. If authenticated + authorized → redirect to /admin-panel/dashboard
3. If not authenticated → show login form
4. Admin enters email + password
5. Backend verifies credentials via Supabase Auth
6. Backend checks admin_allowlist table (RLS enforced)
7. If authorized → session created → redirect to dashboard
8. If not authorized → sign out + reject access
```

---

## Database Setup

### Step 1: Run the Migration

The migration file creates the required tables and RLS policies:

**File**: `supabase/migrations/20250116_create_leads_and_admin_allowlist.sql`

**To apply the migration:**

1. **Option A: Supabase Dashboard (Recommended for getting started)**
   - Go to your Supabase project dashboard
   - Click **SQL Editor** (left sidebar)
   - Click **New Query**
   - Copy the entire contents of `supabase/migrations/20250116_create_leads_and_admin_allowlist.sql`
   - Paste into the SQL editor
   - Click **Run**
   - Verify success: no errors, tables created

2. **Option B: Supabase CLI (For production)**
   ```bash
   npm install -g supabase
   supabase link --project-ref YOUR_PROJECT_ID
   supabase migration up
   ```

### Step 2: Verify Tables Created

After running the migration, verify in Supabase Dashboard:

1. **Check Tables**:
   - Click **Table Editor** (left sidebar)
   - Verify `lucidflow_leads` table exists with all columns
   - Verify `admin_allowlist` table exists (empty initially)

2. **Check RLS Enabled**:
   - Click `lucidflow_leads` table
   - Click **RLS** toggle (should be **enabled**)
   - Verify policies listed: "Deny all by default", "Admin can read all leads", "Admin can update management fields"

3. **Check Indexes**:
   - In `lucidflow_leads`, verify indexes on `created_at`, `status`, `work_email`, `preferred_engagement`

---

## Supabase Auth Configuration

### Step 1: Create Admin User

1. **Go to Supabase Dashboard**
   - Navigate to your project
   - Click **Authentication** (left sidebar)
   - Click **Users**

2. **Create New User**
   - Click **Create User** button (top right)
   - Fill in:
     - **Email**: Use the admin email (e.g., `admin@example.com`)
     - **Password**: Generate a strong, unique password (16+ characters with mix of upper, lower, numbers, special)
   - Click **Create User**

3. **Copy User UUID**
   - Find the newly created user in the list
   - Click on the user row to expand details
   - Copy the **User ID** (UUID, format: `550e8400-e29b-41d4-a716-446655440000`)

### Step 2: Add User to Admin Allowlist

1. **Open SQL Editor**
   - In Supabase Dashboard → **SQL Editor**
   - Click **New Query**

2. **Insert User UUID**
   ```sql
   SELECT add_admin_user('PASTE-UUID-HERE');
   ```
   Replace `PASTE-UUID-HERE` with the UUID copied above.

3. **Run Query**
   - Click **Run**
   - You should see: `"success": true, "message": "Admin user added to allowlist."`

4. **Verify**
   - Go to **Table Editor**
   - Click `admin_allowlist` table
   - Verify the user_id is listed

### Step 3: Email Verification (if required)

If your Supabase project requires email confirmation:

1. The user will receive a confirmation email
2. The user must click the link in the email to confirm their account
3. Only then can they sign in

If you want to disable this requirement:

1. **Go to Authentication > Providers > Email**
2. **Disable "Confirm email"** toggle
3. Users can sign in immediately without confirming email

### Step 4: Configure Password Reset URL

The admin panel includes a password reset flow. Configure the redirect URL:

1. **Go to Authentication > URL Configuration**

2. **Redirect URLs** section:
   - Add **Allowed redirect URLs** for password reset:
     - Development: `http://localhost:5173/admin-panel/reset-password`
     - Production: `https://YOUR_FINAL_DOMAIN/admin-panel/reset-password`

   - Click **Save**

---

## Local Development Setup

### Step 1: Environment Variables

1. **Copy `.env.example` to `.env`** (if not already done):
   ```bash
   cp .env.example .env
   ```

2. **Update `.env` with admin email**:
   ```bash
   VITE_ADMIN_EMAIL=admin@example.com
   ```
   
   Replace `admin@example.com` with the exact email used to create the Auth user.

3. **Verify other required variables**:
   ```bash
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=eyJ...
   VITE_LUCIDFLOW_ENQUIRY_ENDPOINT=https://your-project.supabase.co/functions/v1/lucidflow-enquiry
   ```

### Step 2: Start Development Server

```bash
npm run dev
```

Server starts at `http://localhost:5173`

### Step 3: Test Admin Panel

1. **Visit login page**: `http://localhost:5173/admin-panel`

2. **Sign in with**:
   - Email: The email you created in Supabase
   - Password: The password you created

3. **Expected behavior**:
   - ✅ Sign in succeeds → redirects to dashboard
   - ✅ Dashboard shows metrics
   - ✅ Leads page shows any submitted leads (if any)
   - ✅ Can search, filter, and view lead details
   - ✅ Can edit lead status, notes, follow-up dates
   - ✅ Can export leads to CSV
   - ✅ Logout works and returns to login page

4. **Test authorization rejection**:
   - Create another Supabase Auth user (without adding to allowlist)
   - Try to sign in with that user
   - ✅ Sign in should fail with generic error

---

## Production Deployment

### Step 1: Environment Variables

Set in your hosting provider's environment variable settings:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJ...
VITE_LUCIDFLOW_ENQUIRY_ENDPOINT=https://your-project.supabase.co/functions/v1/lucidflow-enquiry
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_ADMIN_EMAIL=admin@example.com
```

**Important**: Do NOT add passwords or service-role keys to environment variables.

### Step 2: Supabase Configuration

1. **Site URL**: Set your production domain
   - Go to **Authentication > URL Configuration**
   - Set **Site URL** to your production domain: `https://lucidflow.yourdomain.com`

2. **Redirect URLs**: Add production password reset URL
   - Add to **Allowed redirect URLs**: `https://lucidflow.yourdomain.com/admin-panel/reset-password`

3. **HTTPS**: Ensure your domain has valid SSL certificate
   - Most hosting providers provide this automatically

### Step 3: Deployment

Deploy to your hosting provider (Vercel, Netlify, etc.):

```bash
# Build
npm run build

# Test build locally
npm run preview

# Deploy
# (Follow your hosting provider's deployment process)
```

### Step 4: Post-Deployment Testing

1. **Visit production admin panel**: `https://lucidflow.yourdomain.com/admin-panel`

2. **Sign in and verify**:
   - ✅ Dashboard loads and shows metrics
   - ✅ Can access leads, view details, edit, export
   - ✅ Logout works
   - ✅ Forgot password sends reset email
   - ✅ Password reset link works

3. **Verify no secrets exposed**:
   - Open browser DevTools
   - Go to Sources tab
   - Search built files for: `service_role`, `.supabase.co`, API keys
   - ✅ Should find no secrets

---

## Usage Guide

### Admin Dashboard

**URL**: `/admin-panel/dashboard`

**Displays**:
- Total leads count
- New leads today
- New leads this week
- New leads this month
- Leads by status breakdown
- Recent 5 leads

### Leads List

**URL**: `/admin-panel/leads`

**Features**:
- **Search**: Find leads by name, email, phone, company
- **Filter by status**: New, Contacted, Qualified, Meeting Scheduled, Proposal Sent, Won, Lost
- **Filter by engagement**: Scan, Demo, Annual SaaS, Customer Hosted, Advisory
- **Pagination**: Navigate through leads 20 per page
- **Export CSV**: Download filtered leads as CSV file

**CSV Columns**:
- Submitted Date
- Full Name
- Work Email
- Phone
- Company
- Role
- Preferred Engagement
- Source Section
- Consent Given
- Consented At
- Status
- First Contacted
- Next Follow-up
- Admin Notes

### Lead Detail

**URL**: `/admin-panel/leads/:id`

**Read-only Fields** (original submission):
- Full Name
- Work Email
- Phone
- Company
- Role
- Message
- Source Section
- Preferred Engagement
- Consent status
- Submission timestamp

**Editable Fields** (admin management):
- **Status**: Change lead status through pipeline
- **Admin Notes**: Add internal notes about the lead
- **First Contacted**: Date admin first reached out
- **Next Follow-up**: Scheduled follow-up date

**Save Changes**:
- Edit any management field
- Click "Save Changes" button
- Success message appears
- updated_at timestamp is auto-updated

### Forgot Password Flow

1. **At login page**: Click "Forgot password?"
2. **Enter email**: Provide admin email address
3. **Confirm**: Check email for reset link
4. **Click link**: Link redirects to reset-password page with token
5. **New password**: Enter strong password, confirm
6. **Update**: Click "Update Password"
7. **Sign in**: Use new password to sign in

---

## Security Checklist

Use this checklist before deploying to production:

### Database Security

- [ ] RLS enabled on `lucidflow_leads` table
- [ ] RLS enabled on `admin_allowlist` table
- [ ] Admin user added to `admin_allowlist` table
- [ ] Anonymous users cannot SELECT leads (RLS policy enforces)
- [ ] Anonymous users cannot UPDATE or DELETE leads
- [ ] Only allowlisted users can access lead data
- [ ] Service-role key is NOT in frontend code or env variables

### Authentication

- [ ] Admin user created in Supabase Auth
- [ ] Admin email matches `VITE_ADMIN_EMAIL`
- [ ] Password is strong and unique (16+ characters)
- [ ] Email confirmation (if required) is complete
- [ ] Password reset URL configured in Supabase

### Frontend Security

- [ ] `.env` file is in `.gitignore` (never committed)
- [ ] `.env.local` and `.env.*.local` are in `.gitignore`
- [ ] No service-role keys in `VITE_*` variables
- [ ] No passwords or secrets in source code
- [ ] No hardcoded admin email (uses `VITE_ADMIN_EMAIL` env var)
- [ ] Protected routes check authorization before rendering

### Configuration

- [ ] HTTPS enabled on production domain
- [ ] Site URL configured in Supabase Authentication
- [ ] Password reset redirect URL configured
- [ ] Environment variables set in hosting provider
- [ ] No console logs expose PII or credentials

### Testing

- [ ] Unauthenticated users redirected to login
- [ ] Authenticated but unauthorized users rejected
- [ ] Login succeeds with correct credentials
- [ ] Login fails with incorrect credentials
- [ ] Forgot password flow sends email
- [ ] Password reset completes successfully
- [ ] Logout clears session
- [ ] Can view, search, filter, and export leads
- [ ] Can edit lead management fields
- [ ] CSV export is properly escaped (no formula injection)

### Post-Deployment

- [ ] Visit production admin panel
- [ ] Test login, logout, navigation
- [ ] Test lead search, filter, export
- [ ] Check DevTools Sources for exposed secrets
- [ ] Monitor Supabase logs for errors
- [ ] Monitor GA4 for absence of admin-panel tracking

---

## Adding More Admin Users (Future)

To add another administrator:

1. **Create Auth user** in Supabase Dashboard (Authentication > Users)
2. **Copy the UUID** of the new user
3. **Run SQL in Editor**:
   ```sql
   SELECT add_admin_user('NEW-USER-UUID-HERE');
   ```
4. **Update `.env`** (if needed for environment variable) or inform them of the email
5. **User can now sign in** with their email and password

**Note**: Currently, `VITE_ADMIN_EMAIL` allows only one email to sign in. To support multiple admins without changing the code:
- Remove the email check from `adminAuthService.ts` (line with `if (configuredEmail && user.email.toLowerCase()...`)
- Rely solely on `admin_allowlist` RLS policy for authorization
- Update environment variable name or allow multiple emails via configuration

---

## Troubleshooting

### Issue: "Invalid email or password" on correct credentials

**Possible causes**:
1. User not confirmed in email (if confirmation is required)
2. User not in `admin_allowlist` table
3. Email doesn't match `VITE_ADMIN_EMAIL`

**Solution**:
1. Check Supabase Auth user list → verify user status
2. Check `admin_allowlist` table → verify user UUID is listed
3. Verify email in `.env` matches exactly (case-insensitive)

### Issue: Admin panel shows blank/loading forever

**Possible causes**:
1. Session check failing
2. Supabase connection issue
3. Auth state change listener not working

**Solution**:
1. Check browser DevTools Console for errors
2. Verify `VITE_SUPABASE_URL` and key are correct
3. Check Supabase project status page for outages
4. Try refresh page or clear browser cache

### Issue: Leads not appearing in dashboard

**Possible causes**:
1. No leads submitted via form yet
2. Leads inserted via other method (not visible via Edge Function)
3. RLS policy blocking read access

**Solution**:
1. Submit a test form from public site
2. Check `lucidflow_leads` table directly in Table Editor
3. Verify user is in `admin_allowlist`
4. Check Supabase logs for RLS policy violations

### Issue: CSV export fails or shows garbage characters

**Possible causes**:
1. Special characters in lead data (quotes, commas, newlines)
2. Formula injection characters at start of values

**Solution**:
- Expected behavior: CSV utility escapes all special characters and adds BOM
- Open CSV in Excel/Sheets → should display correctly with UTF-8 BOM
- Verify file is not corrupted: open in text editor to inspect

### Issue: Forgot password email not received

**Possible causes**:
1. Email went to spam/junk folder
2. Email provider rejected the email
3. Password reset redirect URL not configured

**Solution**:
1. Check spam/junk folder
2. Check Supabase Email Logs (if available)
3. Verify redirect URL in Authentication > URL Configuration
4. Try again after 5 minutes

### Issue: Password reset link expired or invalid

**Possible causes**:
1. Link older than 24 hours
2. Link used multiple times
3. Token invalid

**Solution**:
1. Request a new password reset link
2. Use the link within 24 hours
3. Use link only once

---

## Support & Escalation

If issues persist:

1. **Check Supabase Status Page**: https://status.supabase.com
2. **Review Supabase Logs**: Go to project → Logs → check for errors
3. **Check RLS Policies**: Table Editor → select table → RLS section
4. **Review this documentation**: Search for your specific issue above
5. **Contact Supabase Support**: For infrastructure or Auth issues

---

## References

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Row-Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [SQL Editor Guide](https://supabase.com/docs/guides/database/quickstarts/sql-editor)
- [Email Configuration](https://supabase.com/docs/guides/auth/auth-smtp)
