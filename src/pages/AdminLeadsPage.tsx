/**
 * Admin Leads List Page
 * 
 * Display all leads with search, filter, and pagination
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { adminAuthService } from '@/services/adminAuthService';
import { leadsService } from '@/services/leadsService';
import { exportLeadsToCSV } from '@/lib/csvExport';
import { LEAD_STATUSES } from '@/lib/admin-types';
import type { AdminUser, LucidFlowLead, LeadSearchFilter } from '@/lib/admin-types';

export function AdminLeadsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [leads, setLeads] = useState<LucidFlowLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Filters and search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [engagementFilter, setEngagementFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalLeads, setTotalLeads] = useState(0);

  const limit = 20;

  useEffect(() => {
    const checkAuthAndLoadUser = async () => {
      // Check authorization first
      const authState = await adminAuthService.getAuthState();
      if (!authState.isAuthenticated || !authState.isAuthorized) {
        navigate('/admin-panel', { replace: true });
        return;
      }

      const currentUser = await adminAuthService.getCurrentUser();
      setUser(currentUser);
    };

    checkAuthAndLoadUser();
  }, [navigate]);

  useEffect(() => {
    const loadLeads = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const filter: LeadSearchFilter = {
          query: searchQuery,
          status: statusFilter as any,
          preferred_engagement: engagementFilter,
          page,
          limit,
        };

        const result = await leadsService.getLeads(filter);

        if (result) {
          setLeads(result.data);
          setTotalPages(result.total_pages);
          setTotalLeads(result.total);
        } else {
          setError('Failed to load leads. Please try again.');
        }
      } catch (err) {
        console.error('[AdminLeads] Error loading leads:', err);
        setError('Failed to load leads. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadLeads();
  }, [searchQuery, statusFilter, engagementFilter, page]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(1);
  };

  const handleExport = async () => {
    setIsExporting(true);

    try {
      const filter: LeadSearchFilter = {
        query: searchQuery,
        status: statusFilter as any,
        preferred_engagement: engagementFilter,
      };

      const allLeads = await leadsService.getLeadsForExport(filter);

      if (allLeads) {
        exportLeadsToCSV(allLeads);
      } else {
        alert('Failed to export leads. Please try again.');
      }
    } catch (err) {
      console.error('[AdminLeads] Export error:', err);
      alert('Failed to export leads. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const content = (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Leads</h1>
        <p className="mt-2 text-muted-grey">
          {totalLeads > 0 ? `Showing ${(page - 1) * limit + 1} to ${Math.min(page * limit, totalLeads)} of ${totalLeads} leads` : 'No leads'}
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded text-red-300 text-sm">
          {error}
          <button
            onClick={() => window.location.reload()}
            className="ml-2 underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-dark-surface border border-white/10 rounded-lg p-6 space-y-4">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-grey" />
            <input
              type="text"
              placeholder="Search by name, email, phone, or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10 w-full"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-crimson text-white font-medium rounded hover:bg-crimson/90 transition-colors"
          >
            Search
          </button>
        </form>

        {/* Status and Engagement Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="field-label">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="input-field"
            >
              <option value="">All statuses</option>
              {LEAD_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="field-label">Preferred Engagement</label>
            <select
              value={engagementFilter}
              onChange={(e) => {
                setEngagementFilter(e.target.value);
                setPage(1);
              }}
              className="input-field"
            >
              <option value="">All engagements</option>
              <option value="scan">Scan</option>
              <option value="demo">Demo</option>
              <option value="annual_saas">Annual SaaS</option>
              <option value="annual_enterprise">Customer Hosted</option>
              <option value="advisory">Advisory</option>
            </select>
          </div>

          <div>
            <button
              onClick={handleExport}
              disabled={isExporting || leads.length === 0}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-crimson/10 text-crimson border border-crimson/30 font-medium rounded hover:bg-crimson/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed h-10 mt-6"
            >
              <Download className="h-4 w-4" />
              {isExporting ? 'Exporting...' : 'Export CSV'}
            </button>
          </div>
        </div>

        {/* Clear Filters */}
        {(searchQuery || statusFilter || engagementFilter) && (
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('');
              setEngagementFilter('');
              setPage(1);
            }}
            className="text-sm text-crimson hover:text-crimson/80"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Leads Table */}
      <div className="bg-dark-surface border border-white/10 rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <div className="inline-block h-8 w-8 border-4 border-crimson/20 border-t-crimson rounded-full animate-spin" />
          </div>
        ) : leads.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-muted-grey">No leads found. Try adjusting your filters.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-black/30">
                    <th className="text-left py-4 px-4 font-semibold text-white">Name</th>
                    <th className="text-left py-4 px-4 font-semibold text-white">Email</th>
                    <th className="text-left py-4 px-4 font-semibold text-white">Phone</th>
                    <th className="text-left py-4 px-4 font-semibold text-white">Company</th>
                    <th className="text-left py-4 px-4 font-semibold text-white">Status</th>
                    <th className="text-left py-4 px-4 font-semibold text-white">Engagement</th>
                    <th className="text-left py-4 px-4 font-semibold text-white">Submitted</th>
                    <th className="text-left py-4 px-4 font-semibold text-white" />
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                      onClick={() => navigate(`/admin-panel/leads/${lead.id}`)}
                    >
                      <td className="py-4 px-4 text-white">{lead.full_name}</td>
                      <td className="py-4 px-4 text-muted-grey text-xs">{lead.work_email}</td>
                      <td className="py-4 px-4 text-muted-grey">{lead.phone || '-'}</td>
                      <td className="py-4 px-4 text-muted-grey">{lead.company}</td>
                      <td className="py-4 px-4 text-muted-grey">
                        <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded">
                          {lead.status || 'New'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-muted-grey text-xs">
                        {lead.preferred_engagement || '-'}
                      </td>
                      <td className="py-4 px-4 text-muted-grey text-xs">
                        {new Date(lead.submitted_at).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin-panel/leads/${lead.id}`);
                          }}
                          className="text-crimson hover:text-crimson/80 text-xs font-medium"
                        >
                          Open →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-white/10 px-4 py-4">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-white/5 border border-white/10 rounded hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>

                <span className="text-sm text-muted-grey">
                  Page {page} of {totalPages}
                </span>

                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-white/5 border border-white/10 rounded hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  return (
    <AdminLayout user={user}>{content}</AdminLayout>
  );
}
