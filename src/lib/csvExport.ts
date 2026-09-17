/**
 * CSV Export Utility
 * 
 * Exports leads to CSV with proper escaping and formula-injection protection
 */

import type { LucidFlowLead } from './admin-types';

/**
 * Escape CSV value to prevent formula injection and handle special characters
 */
function escapeCSVValue(value: string | null | undefined): string {
  if (value === null || value === undefined) {
    return '';
  }

  const str = String(value);

  // Protect against formula injection: prefix with single quote if starts with =, +, -, or @
  if (str.match(/^[=+\-@]/)) {
    return `"'${str.replace(/"/g, '""')}"`;
  }

  // Quote value if it contains comma, newline, or quote
  if (str.includes(',') || str.includes('\n') || str.includes('"')) {
    return `"${str.replace(/"/g, '""')}"`;
  }

  return str;
}

/**
 * Format date for CSV
 */
function formatDateForCSV(dateString: string | null | undefined): string {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  } catch {
    return '';
  }
}

/**
 * Export leads to CSV file
 */
export function exportLeadsToCSV(leads: LucidFlowLead[]): void {
  const headers = [
    'Submitted Date',
    'Full Name',
    'Work Email',
    'Phone',
    'Company',
    'Role',
    'Preferred Engagement',
    'Source Section',
    'Consent Given',
    'Consented At',
    'Status',
    'First Contacted',
    'Next Follow-up',
    'Admin Notes',
  ];

  // Build CSV content
  const csvContent = [
    headers.map(escapeCSVValue).join(','),
    ...leads.map((lead) =>
      [
        formatDateForCSV(lead.submitted_at),
        escapeCSVValue(lead.full_name),
        escapeCSVValue(lead.work_email),
        escapeCSVValue(lead.phone),
        escapeCSVValue(lead.company),
        escapeCSVValue(lead.role),
        escapeCSVValue(lead.preferred_engagement),
        escapeCSVValue(lead.source_section),
        lead.consent_given ? 'Yes' : 'No',
        formatDateForCSV(lead.consent_timestamp),
        escapeCSVValue(lead.status),
        formatDateForCSV(lead.first_contacted_at),
        formatDateForCSV(lead.next_follow_up_at),
        escapeCSVValue(lead.admin_notes),
      ]
        .map(escapeCSVValue)
        .join(',')
    ),
  ].join('\n');

  // Add BOM for Excel UTF-8 compatibility
  const bom = '\uFEFF';
  const csvWithBOM = bom + csvContent;

  // Create blob and download
  const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute(
    'download',
    `lucidflow-leads-${new Date().toISOString().split('T')[0]}.csv`
  );
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up
  URL.revokeObjectURL(url);
}
