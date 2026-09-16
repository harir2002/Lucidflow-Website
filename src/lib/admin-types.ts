/**
 * Admin Panel Type Definitions
 * 
 * Shared types for admin authentication, leads, and dashboard
 */

export interface LucidFlowLead {
  id: string;
  lead_reference: string;
  full_name: string;
  work_email: string;
  phone: string | null;
  company: string;
  role: string | null;
  message: string | null;
  consent_given: boolean;
  consent_timestamp: string | null;
  submitted_at: string;
  // Admin panel fields (optional, may be added later)
  status?: 'New' | 'Contacted' | 'Qualified' | 'Meeting Scheduled' | 'Proposal Sent' | 'Won' | 'Lost';
  admin_notes?: string | null;
  first_contacted_at?: string | null;
  next_follow_up_at?: string | null;
  preferred_engagement?: string | null;
  source_section?: string | null;
}

export interface AdminUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
}

export interface AdminAuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  isAuthorized: boolean; // Authenticated AND in allowlist
  user: AdminUser | null;
  error: string | null;
}

export interface LeadSearchFilter {
  query?: string; // Search name, email, phone, company
  status?: LucidFlowLead['status'];
  preferred_engagement?: string;
  date_range?: {
    start: string; // ISO date
    end: string; // ISO date
  };
  page?: number;
  limit?: number;
}

export interface PaginatedLeads {
  data: LucidFlowLead[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface LeadMetrics {
  total_leads: number;
  new_leads_today: number;
  new_leads_this_week: number;
  new_leads_this_month: number;
  leads_by_status: Record<LucidFlowLead['status'], number>;
}

export const LEAD_STATUSES = ['New', 'Contacted', 'Qualified', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'] as const;

export const STATUS_COLORS: Record<LucidFlowLead['status'], string> = {
  'New': 'text-blue-600',
  'Contacted': 'text-yellow-600',
  'Qualified': 'text-purple-600',
  'Meeting Scheduled': 'text-indigo-600',
  'Proposal Sent': 'text-orange-600',
  'Won': 'text-green-600',
  'Lost': 'text-red-600',
};

export const STATUS_BG_COLORS: Record<LucidFlowLead['status'], string> = {
  'New': 'bg-blue-100',
  'Contacted': 'bg-yellow-100',
  'Qualified': 'bg-purple-100',
  'Meeting Scheduled': 'bg-indigo-100',
  'Proposal Sent': 'bg-orange-100',
  'Won': 'bg-green-100',
  'Lost': 'bg-red-100',
};
