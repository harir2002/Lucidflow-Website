import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom';

// Mock the trackEvent function BEFORE importing submitEnquiry
vi.mock('@/hooks/useAnalytics', () => ({
  trackEvent: vi.fn(),
}));

// Now import after mocks are set up
import { submitEnquiry } from '@/services/enquiryService';
import { trackEvent } from '@/hooks/useAnalytics';

describe('Enquiry Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  describe('submitEnquiry - Payload Format', () => {
    it('should POST to the configured endpoint', async () => {
      const mockFetch = vi.mocked(fetch);
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true }), { status: 201 })
      );

      const formData = {
        fullName: 'John Doe',
        workEmail: 'john@example.com',
        phone: '555-1234',
        company: 'Test Co',
        role: 'Manager',
        message: 'Test message',
        consent: true as const,
      };

      await submitEnquiry(formData);

      // Verify fetch was called with a URL (regardless of which one from env)
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('.supabase.co'),
        expect.any(Object)
      );
    });

    it('should use POST method', async () => {
      const mockFetch = vi.mocked(fetch);
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true }), { status: 201 })
      );

      const formData = {
        fullName: 'John Doe',
        workEmail: 'john@example.com',
        company: 'Test Co',
        consent: true as const,
      };

      await submitEnquiry(formData);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
        })
      );
    });

    it('should set Content-Type to application/json', async () => {
      const mockFetch = vi.mocked(fetch);
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true }), { status: 201 })
      );

      const formData = {
        fullName: 'John Doe',
        workEmail: 'john@example.com',
        company: 'Test Co',
        consent: true as const,
      };

      await submitEnquiry(formData);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );
    });

    it('should send exact payload format: snake_case fields only', async () => {
      const mockFetch = vi.mocked(fetch);
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true }), { status: 201 })
      );

      const formData = {
        fullName: 'John Doe',
        workEmail: 'john@example.com',
        phone: '+1-555-1234',
        company: 'Acme Corp',
        role: 'Director',
        message: 'Interested in learning more',
        consent: true as const,
      };

      await submitEnquiry(formData);

      const call = mockFetch.mock.calls[0];
      const bodyString = call[1]?.body as string;
      const payload = JSON.parse(bodyString);

      // Verify exact payload format (snake_case)
      expect(payload).toEqual({
        full_name: 'John Doe',
        work_email: 'john@example.com',
        phone: '+1-555-1234',
        company: 'Acme Corp',
        role: 'Director',
        message: 'Interested in learning more',
        consent_given: true,
      });

      // Verify no removed fields are present
      expect(payload).not.toHaveProperty('industry');
      expect(payload).not.toHaveProperty('buyer_stage');
      expect(payload).not.toHaveProperty('priority_journey');
      expect(payload).not.toHaveProperty('preferred_engagement');
      expect(payload).not.toHaveProperty('utm_source');
      expect(payload).not.toHaveProperty('utm_medium');
      expect(payload).not.toHaveProperty('utm_campaign');
    });

    it('should trim and lowercase email in payload', async () => {
      const mockFetch = vi.mocked(fetch);
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true }), { status: 201 })
      );

      const formData = {
        fullName: 'John Doe',
        workEmail: '  TEST@EXAMPLE.COM  ',
        company: 'Test Co',
        consent: true as const,
      };

      await submitEnquiry(formData);

      const call = mockFetch.mock.calls[0];
      const bodyString = call[1]?.body as string;
      const payload = JSON.parse(bodyString);

      expect(payload.work_email).toBe('test@example.com');
    });

    it('should convert empty optional fields to empty strings', async () => {
      const mockFetch = vi.mocked(fetch);
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true }), { status: 201 })
      );

      const formData = {
        fullName: 'John Doe',
        workEmail: 'john@example.com',
        phone: '',
        company: 'Test Co',
        role: '',
        message: '',
        consent: true as const,
      };

      await submitEnquiry(formData);

      const call = mockFetch.mock.calls[0];
      const bodyString = call[1]?.body as string;
      const payload = JSON.parse(bodyString);

      expect(payload.phone).toBe('');
      expect(payload.role).toBe('');
      expect(payload.message).toBe('');
    });
  });

  describe('submitEnquiry - Success Handling', () => {
    it('should handle HTTP 201 as success', async () => {
      const mockFetch = vi.mocked(fetch);
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true }), { status: 201 })
      );

      const formData = {
        fullName: 'John Doe',
        workEmail: 'john@example.com',
        company: 'Test Co',
        consent: true as const,
      };

      const result = await submitEnquiry(formData);

      expect(result.ok).toBe(true);
    });

    it('should handle response with { success: true }', async () => {
      const mockFetch = vi.mocked(fetch);
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true, message: 'Lead created' }), { status: 200 })
      );

      const formData = {
        fullName: 'John Doe',
        workEmail: 'john@example.com',
        company: 'Test Co',
        consent: true as const,
      };

      const result = await submitEnquiry(formData);

      expect(result.ok).toBe(true);
    });

    it('should track non-PII analytics events on success', async () => {
      const mockFetch = vi.mocked(fetch);
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true }), { status: 201 })
      );

      const formData = {
        fullName: 'John Doe',
        workEmail: 'john@example.com',
        company: 'Test Co',
        consent: true as const,
      };

      await submitEnquiry(formData);

      expect(trackEvent).toHaveBeenCalledWith('generate_lead', {
        submission_status: 'success',
      });

      expect(trackEvent).toHaveBeenCalledWith('lucidflow_form_submit', {
        success: true,
      });
    });
  });

  describe('submitEnquiry - Error Handling', () => {
    it('should handle non-OK response with generic error', async () => {
      const mockFetch = vi.mocked(fetch);
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ error: 'Invalid input' }), { status: 400 })
      );

      const formData = {
        fullName: 'John Doe',
        workEmail: 'john@example.com',
        company: 'Test Co',
        consent: true as const,
      };

      const result = await submitEnquiry(formData);

      expect(result.ok).toBe(false);
      expect(result.message).toBe(
        'We could not submit your enquiry right now. Please try again.'
      );
    });

    it('should handle network failure with generic error', async () => {
      const mockFetch = vi.mocked(fetch);
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const formData = {
        fullName: 'John Doe',
        workEmail: 'john@example.com',
        company: 'Test Co',
        consent: true as const,
      };

      const result = await submitEnquiry(formData);

      expect(result.ok).toBe(false);
      expect(result.message).toBe(
        'We could not submit your enquiry right now. Please try again.'
      );
    });

    it('should not expose PII in error messages', async () => {
      const mockFetch = vi.mocked(fetch);
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const formData = {
        fullName: 'John Doe',
        workEmail: 'secret@example.com',
        company: 'Secret Corp',
        consent: true as const,
      };

      const result = await submitEnquiry(formData);

      expect(result.message).not.toContain('John Doe');
      expect(result.message).not.toContain('secret@example.com');
      expect(result.message).not.toContain('Secret Corp');
    });

    it('should track failure event (non-PII only)', async () => {
      const mockFetch = vi.mocked(fetch);
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const formData = {
        fullName: 'John Doe',
        workEmail: 'john@example.com',
        company: 'Test Co',
        consent: true as const,
      };

      await submitEnquiry(formData);

      expect(trackEvent).toHaveBeenCalledWith('lucidflow_form_submit', {
        success: false,
      });
    });
  });

  describe('submitEnquiry - Validation', () => {
    it('should validate data with Zod schema before sending', async () => {
      const mockFetch = vi.mocked(fetch);

      const invalidData = {
        fullName: '',
        workEmail: 'john@example.com',
        company: 'Test Co',
        consent: true as const,
      };

      const result = await submitEnquiry(invalidData as any);

      // Should not call fetch if validation fails
      expect(mockFetch).not.toHaveBeenCalled();
      expect(result.ok).toBe(false);
    });
  });
});
