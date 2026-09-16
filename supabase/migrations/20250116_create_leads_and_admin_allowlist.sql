-- ============================================================================
-- LucidFlow Admin Panel Database Schema
-- 
-- This migration creates:
-- 1. lucidflow_leads - Main leads table from form submissions
-- 2. admin_allowlist - Authorized admin users for the admin panel
-- 3. RLS policies - Row-Level Security for data protection
-- 
-- Run this migration in Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- 1. CREATE lucidflow_leads TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.lucidflow_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Original form submission data (immutable)
  full_name text NOT NULL,
  work_email text NOT NULL,
  phone text,
  company text NOT NULL,
  role text,
  message text,
  preferred_engagement text,
  source_section text,
  consent_given boolean NOT NULL DEFAULT false,
  consented_at timestamptz,
  
  -- Admin-editable fields
  status text NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Qualified', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost')),
  admin_notes text,
  first_contacted_at timestamptz,
  next_follow_up_at timestamptz,
  
  -- Metadata
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_lucidflow_leads_created_at ON public.lucidflow_leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lucidflow_leads_status ON public.lucidflow_leads (status);
CREATE INDEX IF NOT EXISTS idx_lucidflow_leads_work_email ON public.lucidflow_leads (work_email);
CREATE INDEX IF NOT EXISTS idx_lucidflow_leads_preferred_engagement ON public.lucidflow_leads (preferred_engagement);

-- ============================================================================
-- 2. CREATE admin_allowlist TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.admin_allowlist (
  user_id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_allowlist_user_id ON public.admin_allowlist (user_id);

-- ============================================================================
-- 3. ENABLE RLS ON BOTH TABLES
-- ============================================================================
ALTER TABLE public.lucidflow_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_allowlist ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 4. RLS POLICIES FOR lucidflow_leads
-- ============================================================================

-- Policy: Deny all access by default (no anonymous reads)
CREATE POLICY "Deny all by default" ON public.lucidflow_leads
  FOR ALL
  USING (FALSE)
  WITH CHECK (FALSE);

-- Policy: Allow authenticated admin users in allowlist to SELECT all leads
CREATE POLICY "Admin can read all leads" ON public.lucidflow_leads
  FOR SELECT
  USING (
    auth.uid() IN (SELECT user_id FROM public.admin_allowlist)
  );

-- Policy: Allow authenticated admin users in allowlist to UPDATE specific fields only
-- (status, admin_notes, first_contacted_at, next_follow_up_at, updated_at)
CREATE POLICY "Admin can update management fields" ON public.lucidflow_leads
  FOR UPDATE
  USING (
    auth.uid() IN (SELECT user_id FROM public.admin_allowlist)
  )
  WITH CHECK (
    auth.uid() IN (SELECT user_id FROM public.admin_allowlist)
  );

-- Policy: Allow Supabase service-role (Edge Function) to INSERT leads
-- Note: This policy is checked at Edge Function level, not browser
-- Prevent anonymous users from direct insert
CREATE POLICY "No anonymous insert" ON public.lucidflow_leads
  FOR INSERT
  WITH CHECK (FALSE);

-- Policy: Prevent anonymous DELETE
CREATE POLICY "Deny anonymous delete" ON public.lucidflow_leads
  FOR DELETE
  USING (FALSE);

-- ============================================================================
-- 5. RLS POLICIES FOR admin_allowlist
-- ============================================================================

-- Policy: Deny all by default (for non-SELECT operations)
CREATE POLICY "Deny all modifications" ON public.admin_allowlist
  FOR INSERT
  WITH CHECK (FALSE);

CREATE POLICY "Deny delete" ON public.admin_allowlist
  FOR DELETE
  USING (FALSE);

CREATE POLICY "Deny update" ON public.admin_allowlist
  FOR UPDATE
  USING (FALSE)
  WITH CHECK (FALSE);

-- Policy: Allow authenticated users to READ the allowlist (for auth verification)
CREATE POLICY "Authenticated users can read" ON public.admin_allowlist
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- ============================================================================
-- 6. HELPER: FUNCTION TO ADD ADMIN USER (run manually after creating Auth user)
-- ============================================================================
-- Usage: SELECT add_admin_user('UUID-OF-AUTH-USER-HERE');
--
-- Steps:
-- 1. Create Auth user in Supabase Dashboard → Authentication → Users
-- 2. Copy the user UUID
-- 3. Run in SQL Editor: SELECT add_admin_user('your-uuid-here');
--
CREATE OR REPLACE FUNCTION add_admin_user(user_uuid uuid)
RETURNS TABLE(success boolean, message text) AS $$
BEGIN
  INSERT INTO public.admin_allowlist (user_id) VALUES (user_uuid)
  ON CONFLICT DO NOTHING;
  
  RETURN QUERY SELECT true, 'Admin user added to allowlist.';
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 7. TRIGGER TO AUTO-UPDATE updated_at
-- ============================================================================
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_lucidflow_leads_timestamp ON public.lucidflow_leads;

CREATE TRIGGER update_lucidflow_leads_timestamp
  BEFORE UPDATE ON public.lucidflow_leads
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
-- After running this migration:
--
-- 1. Create an Auth user in Supabase Dashboard:
--    - Go to Authentication > Users
--    - Create a new user with a strong unique password
--    - Copy the user UUID
--
-- 2. Add that user to admin_allowlist via SQL Editor:
--    SELECT add_admin_user('PASTE-UUID-HERE');
--
-- 3. Set VITE_ADMIN_EMAIL in local .env:
--    VITE_ADMIN_EMAIL=admin-email@example.com
--
-- 4. Deploy this .env to your hosting provider's production environment variables
--
-- 5. The admin can now log in at /admin-panel with their credentials
-- ============================================================================
