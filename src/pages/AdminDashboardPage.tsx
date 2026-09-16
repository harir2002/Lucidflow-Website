/**
 * Admin Dashboard Page
 * 
 * Shows lead metrics and recent leads
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Mail, Clock, CheckCircle } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { adminAuthService } from '@/services/adminAuthService';
import { leadsService } from '@/services/leadsService';
import type { AdminUser, LeadMetrics, LucidFlowLead } from '@/lib/admin-types';

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [metrics, setMetrics] = useState<LeadMetrics | null>(null);
  const [recentLeads, setRecentLeads] = useState<LucidFlowLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Check authorization
        const authState = await adminAuthService.getAuthState();
        if (!authState.isAuthenticated || !authState.isAuthorized) {
          setIsAuthorized(false);
          navigate('/admin-panel', { replace: true });
          return;
        }

        console.log('[AdminDashboard] Auth check passed, loading data...');

        // Get current user
        const currentUser = await adminAuthService.getCurrentUser();
        console.log('[AdminDashboard] Got user:', currentUser?.email);
        setUser(currentUser);

        // Get metrics
        console.log('[AdminDashboard] Fetching metrics...');
        const metricsData = await leadsService.getLeadMetrics();
        console.log('[AdminDashboard] Metrics:', metricsData);
        setMetrics(metricsData);

        // Get recent leads (latest 5)
        console.log('[AdminDashboard] Fetching recent leads...');
        const leadsData = await leadsService.getLeads({ limit: 5 });
        console.log('[AdminDashboard] Recent leads:', leadsData);
        setRecentLeads(leadsData?.data || []);
      } catch (err) {
        console.error('[AdminDashboard] Error loading data:', err);
        setError('Failed to load dashboard. Please refresh the page.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  const content = (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="mt-2 text-muted-grey">Welcome back, {user?.email}</p>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Leads */}
        <div className="bg-dark-surface border border-white/10 rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-grey mb-1">Total Leads</p>
              <p className="text-3xl font-bold text-white">
                {isLoading ? '-' : metrics?.total_leads || 0}
              </p>
            </div>
            <div className="p-3 bg-blue-500/10 rounded">
              <Mail className="h-6 w-6 text-blue-400" />
            </div>
          </div>
        </div>

        {/* New Today */}
        <div className="bg-dark-surface border border-white/10 rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-grey mb-1">New Today</p>
              <p className="text-3xl font-bold text-white">
                {isLoading ? '-' : metrics?.new_leads_today || 0}
              </p>
            </div>
            <div className="p-3 bg-green-500/10 rounded">
              <TrendingUp className="h-6 w-6 text-green-400" />
            </div>
          </div>
        </div>

        {/* This Week */}
        <div className="bg-dark-surface border border-white/10 rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-grey mb-1">This Week</p>
              <p className="text-3xl font-bold text-white">
                {isLoading ? '-' : metrics?.new_leads_this_week || 0}
              </p>
            </div>
            <div className="p-3 bg-purple-500/10 rounded">
              <Clock className="h-6 w-6 text-purple-400" />
            </div>
          </div>
        </div>

        {/* This Month */}
        <div className="bg-dark-surface border border-white/10 rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-grey mb-1">This Month</p>
              <p className="text-3xl font-bold text-white">
                {isLoading ? '-' : metrics?.new_leads_this_month || 0}
              </p>
            </div>
            <div className="p-3 bg-orange-500/10 rounded">
              <CheckCircle className="h-6 w-6 text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Status Breakdown */}
      {metrics && (
        <div className="bg-dark-surface border border-white/10 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Leads by Status</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {Object.entries(metrics.leads_by_status).map(([status, count]) => (
              <div key={status} className="text-center">
                <p className="text-2xl font-bold text-white">{count}</p>
                <p className="text-xs text-muted-grey mt-1">{status}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Leads */}
      <div className="bg-dark-surface border border-white/10 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Recent Leads</h2>
          <a href="/admin-panel/leads" className="text-sm text-crimson hover:text-crimson/80">
            View all →
          </a>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 border-4 border-crimson/20 border-t-crimson rounded-full animate-spin" />
          </div>
        ) : recentLeads.length === 0 ? (
          <p className="text-center text-muted-grey py-8">No leads yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 font-semibold text-white">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-white">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-white">Company</th>
                  <th className="text-left py-3 px-4 font-semibold text-white">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-white">Submitted</th>
                  <th className="text-left py-3 px-4 font-semibold text-white" />
                </tr>
              </thead>
              <tbody>
                {recentLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-3 px-4 text-white">{lead.full_name}</td>
                    <td className="py-3 px-4 text-muted-grey text-xs">{lead.work_email}</td>
                    <td className="py-3 px-4 text-muted-grey">{lead.company}</td>
                    <td className="py-3 px-4">
                      <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded">
                        {lead.status || 'New'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-grey text-xs">
                      {new Date(lead.submitted_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => navigate(`/admin-panel/leads/${lead.id}`)}
                        className="text-crimson hover:text-crimson/80 text-xs font-medium"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <AdminLayout user={user}>{content}</AdminLayout>
  );
}
