/**
 * Admin Lead Detail Page
 * 
 * View and edit lead information
 */

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { adminAuthService } from '@/services/adminAuthService';
import { leadsService } from '@/services/leadsService';
import { LEAD_STATUSES } from '@/lib/admin-types';
import type { AdminUser, LucidFlowLead } from '@/lib/admin-types';

export function AdminLeadDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [user, setUser] = useState<AdminUser | null>(null);
  const [lead, setLead] = useState<LucidFlowLead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form state
  const [status, setStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [firstContactedAt, setFirstContactedAt] = useState('');
  const [nextFollowUpAt, setNextFollowUpAt] = useState('');

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
    const loadLead = async () => {
      if (!id) {
        setError('Invalid lead ID');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const leadData = await leadsService.getLeadById(id);

        if (!leadData) {
          setError('Lead not found');
          return;
        }

        setLead(leadData);
        setStatus(leadData.status || 'New');
        setAdminNotes(leadData.admin_notes || '');
        setFirstContactedAt(leadData.first_contacted_at?.split('T')[0] || '');
        setNextFollowUpAt(leadData.next_follow_up_at?.split('T')[0] || '');
      } catch (err) {
        console.error('[AdminLeadDetail] Error loading lead:', err);
        setError('Failed to load lead. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadLead();
  }, [id]);

  const handleSave = async () => {
    if (!id || !lead) return;

    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const updates: Partial<Pick<LucidFlowLead, 'status' | 'admin_notes' | 'first_contacted_at' | 'next_follow_up_at'>> = {
        status: status as LucidFlowLead['status'],
        admin_notes: adminNotes || null,
        first_contacted_at: firstContactedAt ? `${firstContactedAt}T00:00:00Z` : null,
        next_follow_up_at: nextFollowUpAt ? `${nextFollowUpAt}T00:00:00Z` : null,
      };

      const result = await leadsService.updateLead(id, updates);

      if (result.success) {
        // Update local state
        setLead({
          ...lead,
          ...updates,
        });
        setSaveSuccess(true);

        // Clear success message after 3 seconds
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setError(result.error || 'Failed to save. Please try again.');
      }
    } catch (err) {
      console.error('[AdminLeadDetail] Error saving lead:', err);
      setError('Failed to save. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const content = (
    <div className="space-y-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/admin-panel/leads')}
        className="flex items-center gap-2 text-muted-grey hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to leads
      </button>

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Success State */}
      {saveSuccess && (
        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded text-green-300 text-sm">
          Lead updated successfully
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="inline-block h-8 w-8 border-4 border-crimson/20 border-t-crimson rounded-full animate-spin" />
        </div>
      ) : !lead ? (
        <div className="p-6 bg-dark-surface border border-white/10 rounded-lg text-center text-muted-grey">
          Lead not found
        </div>
      ) : (
        <>
          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-bold text-white">{lead.full_name}</h1>
            <p className="mt-2 text-muted-grey">{lead.work_email}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Original Lead Information (Read-only) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <div className="bg-dark-surface border border-white/10 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-white mb-6">Contact Information</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-grey mb-2">Full Name</p>
                    <p className="text-white">{lead.full_name}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-grey mb-2">Work Email</p>
                    <p className="text-white break-all">{lead.work_email}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-grey mb-2">Phone</p>
                    <p className="text-white">{lead.phone || '-'}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-grey mb-2">Company</p>
                    <p className="text-white">{lead.company}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-grey mb-2">Role</p>
                    <p className="text-white">{lead.role || '-'}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-grey mb-2">Preferred Engagement</p>
                    <p className="text-white">{lead.preferred_engagement || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Message and Consent */}
              <div className="bg-dark-surface border border-white/10 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-white mb-6">Submission Details</h2>

                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-muted-grey mb-2">Message</p>
                    <p className="text-white whitespace-pre-wrap">{lead.message || '-'}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-grey mb-2">Source Section</p>
                    <p className="text-white">{lead.source_section || '-'}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-grey mb-2">Consent</p>
                      <p className="text-white">{lead.consent_given ? '✓ Yes' : '✗ No'}</p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-grey mb-2">Consent Timestamp</p>
                      <p className="text-white">
                        {lead.consent_timestamp
                          ? new Date(lead.consent_timestamp).toLocaleDateString()
                          : '-'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-grey mb-2">Submitted</p>
                    <p className="text-white">
                      {new Date(lead.submitted_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Management Fields (Editable) */}
            <div className="lg:col-span-1">
              <div className="bg-dark-surface border border-white/10 rounded-lg p-6 sticky top-[100px]">
                <h2 className="text-lg font-semibold text-white mb-6">Management</h2>

                <div className="space-y-6">
                  {/* Status */}
                  <div>
                    <label className="field-label">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="input-field"
                    >
                      {LEAD_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* First Contacted */}
                  <div>
                    <label className="field-label">First Contacted</label>
                    <input
                      type="date"
                      value={firstContactedAt}
                      onChange={(e) => setFirstContactedAt(e.target.value)}
                      className="input-field"
                    />
                  </div>

                  {/* Next Follow-up */}
                  <div>
                    <label className="field-label">Next Follow-up</label>
                    <input
                      type="date"
                      value={nextFollowUpAt}
                      onChange={(e) => setNextFollowUpAt(e.target.value)}
                      className="input-field"
                    />
                  </div>

                  {/* Admin Notes */}
                  <div>
                    <label className="field-label">Admin Notes</label>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      className="input-field min-h-[120px] resize-y"
                      placeholder="Add internal notes about this lead..."
                    />
                  </div>

                  {/* Save Button */}
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-crimson text-white font-medium rounded hover:bg-crimson/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="h-4 w-4" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <AdminLayout user={user}>{content}</AdminLayout>
  );
}
