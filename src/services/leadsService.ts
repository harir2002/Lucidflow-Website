/**
 * Leads Service
 * 
 * Handles querying, updating, and exporting leads from Supabase.
 * All queries respect RLS policies - only authorized admins can access lead data.
 */

import { getSupabaseClient } from '@/lib/supabase';
import type { LucidFlowLead, LeadSearchFilter, PaginatedLeads, LeadMetrics } from '@/lib/admin-types';

class LeadsService {
  private supabase = getSupabaseClient();

  /**
   * Get paginated leads with optional search and filters
   */
  async getLeads(filter: LeadSearchFilter = {}): Promise<PaginatedLeads | null> {
    if (!this.supabase) return null;

    try {
      const { query, status, preferred_engagement, date_range, page = 1, limit = 20 } = filter;

      // First, get the count separately to avoid RLS issues
      const countQuery = this.supabase
        .from('lucidflow_leads')
        .select('*', { count: 'exact', head: true });

      const { count: totalCount } = await countQuery;

      let supabaseQuery = this.supabase
        .from('lucidflow_leads')
        .select('*')
        .order('submitted_at', { ascending: false });

      // Apply search filters
      if (query && query.trim()) {
        const q = `%${query.trim()}%`;
        supabaseQuery = supabaseQuery.or(
          `full_name.ilike.${q},work_email.ilike.${q},phone.ilike.${q},company.ilike.${q}`
        );
      }

      // Apply status filter
      if (status) {
        supabaseQuery = supabaseQuery.eq('status', status);
      }

      // Apply engagement filter
      if (preferred_engagement) {
        supabaseQuery = supabaseQuery.eq('preferred_engagement', preferred_engagement);
      }

      // Apply date range filter
      if (date_range) {
        supabaseQuery = supabaseQuery
          .gte('submitted_at', `${date_range.start}T00:00:00Z`)
          .lte('submitted_at', `${date_range.end}T23:59:59Z`);
      }

      // Apply pagination
      const offset = (page - 1) * limit;
      supabaseQuery = supabaseQuery.range(offset, offset + limit - 1);

      const { data, error } = await supabaseQuery;

      if (error) {
        console.error('[LeadsService] Query error:', error);
        throw error;
      }

      console.log('[LeadsService] Successfully fetched leads:', { count: totalCount, dataLength: data?.length });

      return {
        data: (data as LucidFlowLead[]) || [],
        total: totalCount || 0,
        page,
        limit,
        total_pages: totalCount ? Math.ceil(totalCount / limit) : 0,
      };
    } catch (error) {
      console.error('[LeadsService] Error getting leads:', error);
      return null;
    }
  }

  /**
   * Get a single lead by ID
   */
  async getLeadById(id: string): Promise<LucidFlowLead | null> {
    if (!this.supabase) return null;

    try {
      const { data, error } = await this.supabase
        .from('lucidflow_leads')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return data as LucidFlowLead;
    } catch (error) {
      console.error('[LeadsService] Error getting lead:', error);
      return null;
    }
  }

  /**
   * Update lead management fields
   * Can only update: status, admin_notes, first_contacted_at, next_follow_up_at
   */
  async updateLead(
    id: string,
    updates: {
      status?: string;
      admin_notes?: string | null;
      first_contacted_at?: string | null;
      next_follow_up_at?: string | null;
    }
  ): Promise<{ success: boolean; error?: string }> {
    if (!this.supabase) {
      return { success: false, error: 'Supabase not configured' };
    }

    try {
      // Cast to any to work around Supabase type strictness with Partial updates
      const result = await this.supabase
        .from('lucidflow_leads')
        // @ts-ignore - Supabase typing issue with partial updates
        .update(updates)
        .eq('id', id);

      const { error } = result;

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('[LeadsService] Error updating lead:', error);
      return {
        success: false,
        error: 'Failed to update lead. Please try again.',
      };
    }
  }

  /**
   * Get lead metrics and statistics
   */
  async getLeadMetrics(): Promise<LeadMetrics | null> {
    if (!this.supabase) return null;

    try {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

      // Get total leads
      const { count: totalCount } = await this.supabase
        .from('lucidflow_leads')
        .select('*', { count: 'exact', head: true });

      // Get new leads today
      const { count: todayCount } = await this.supabase
        .from('lucidflow_leads')
        .select('*', { count: 'exact', head: true })
        .gte('submitted_at', today.toISOString());

      // Get new leads this week
      const { count: weekCount } = await this.supabase
        .from('lucidflow_leads')
        .select('*', { count: 'exact', head: true })
        .gte('submitted_at', weekAgo.toISOString());

      // Get new leads this month
      const { count: monthCount } = await this.supabase
        .from('lucidflow_leads')
        .select('*', { count: 'exact', head: true })
        .gte('submitted_at', monthAgo.toISOString());

      // Get leads by status
      const { data: statusData } = await this.supabase
        .from('lucidflow_leads')
        .select('status');

      const leads_by_status: Record<string, number> = {
        'New': 0,
        'Contacted': 0,
        'Qualified': 0,
        'Meeting Scheduled': 0,
        'Proposal Sent': 0,
        'Won': 0,
        'Lost': 0,
      };

      (statusData as Array<{ status?: string }> | null)?.forEach((lead) => {
        if (lead.status && lead.status in leads_by_status) {
          leads_by_status[lead.status]++;
        }
      });

      return {
        total_leads: totalCount || 0,
        new_leads_today: todayCount || 0,
        new_leads_this_week: weekCount || 0,
        new_leads_this_month: monthCount || 0,
        leads_by_status: leads_by_status as Record<string, number>,
      };
    } catch (error) {
      console.error('[LeadsService] Error getting metrics:', error);
      return null;
    }
  }

  /**
   * Get leads for CSV export with applied filters
   */
  async getLeadsForExport(filter: LeadSearchFilter = {}): Promise<LucidFlowLead[] | null> {
    if (!this.supabase) return null;

    try {
      const { query, status, preferred_engagement, date_range } = filter;

      let supabaseQuery = this.supabase
        .from('lucidflow_leads')
        .select('*')
        .order('submitted_at', { ascending: false });

      // Apply search filters
      if (query && query.trim()) {
        const q = `%${query.trim()}%`;
        supabaseQuery = supabaseQuery.or(
          `full_name.ilike.${q},work_email.ilike.${q},phone.ilike.${q},company.ilike.${q}`
        );
      }

      // Apply status filter
      if (status) {
        supabaseQuery = supabaseQuery.eq('status', status);
      }

      // Apply engagement filter
      if (preferred_engagement) {
        supabaseQuery = supabaseQuery.eq('preferred_engagement', preferred_engagement);
      }

      // Apply date range filter
      if (date_range) {
        supabaseQuery = supabaseQuery
          .gte('submitted_at', `${date_range.start}T00:00:00Z`)
          .lte('submitted_at', `${date_range.end}T23:59:59Z`);
      }

      // Limit to reasonable amount (10k max for export)
      supabaseQuery = supabaseQuery.limit(10000);

      const { data, error } = await supabaseQuery;

      if (error) throw error;

      return (data as LucidFlowLead[]) || [];
    } catch (error) {
      console.error('[LeadsService] Error getting leads for export:', error);
      return null;
    }
  }
}

export const leadsService = new LeadsService();
