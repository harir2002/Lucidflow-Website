import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { EnquiryForm } from '@/components/lucidflow/EnquiryForm';
import * as enquiryService from '@/services/enquiryService';
import '@testing-library/jest-dom';

// Mock the enquiry service
vi.mock('@/services/enquiryService');

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function renderForm() {
  return render(
    <BrowserRouter>
      <EnquiryForm />
    </BrowserRouter>
  );
}

describe('Enquiry Form Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
  });

  describe('Form Validation Display', () => {
    it('should display accessible error when full name is missing', async () => {
      renderForm();
      const submitButton = screen.getByRole('button', { name: /Schedule a Demo Today/i });
      
      await userEvent.click(submitButton);

      await waitFor(() => {
        const errors = screen.getAllByRole('alert');
        expect(errors.some(e => e.textContent?.includes('full name'))).toBe(true);
      });
    });

    it('should display accessible error when work email is missing', async () => {
      renderForm();
      const fullNameInput = screen.getByLabelText(/Full name/i);
      const submitButton = screen.getByRole('button', { name: /Schedule a Demo Today/i });

      await userEvent.type(fullNameInput, 'John Doe');
      await userEvent.click(submitButton);

      await waitFor(() => {
        const errors = screen.getAllByRole('alert');
        expect(errors.some(e => e.textContent?.includes('email'))).toBe(true);
      });
    });

    it('should display accessible error when work email is invalid', async () => {
      renderForm();
      const emailInput = screen.getByLabelText(/Work email/i);
      const submitButton = screen.getByRole('button', { name: /Schedule a Demo Today/i });

      await userEvent.type(emailInput, 'not-an-email');
      await userEvent.click(submitButton);

      await waitFor(() => {
        const errors = screen.getAllByRole('alert');
        expect(errors.some(e => e.textContent?.includes('email'))).toBe(true);
      });
    });

    it('should display accessible error when company is missing', async () => {
      renderForm();
      const fullNameInput = screen.getByLabelText(/Full name/i);
      const emailInput = screen.getByLabelText(/Work email/i);
      const submitButton = screen.getByRole('button', { name: /Schedule a Demo Today/i });

      await userEvent.type(fullNameInput, 'John Doe');
      await userEvent.type(emailInput, 'john@example.com');
      await userEvent.click(submitButton);

      await waitFor(() => {
        const errors = screen.getAllByRole('alert');
        expect(errors.some(e => e.textContent?.includes('company'))).toBe(true);
      });
    });

    it('should display accessible error when consent is unchecked', async () => {
      renderForm();
      const fullNameInput = screen.getByLabelText(/Full name/i);
      const emailInput = screen.getByLabelText(/Work email/i);
      const companyInput = screen.getByLabelText(/Company/i);
      const submitButton = screen.getByRole('button', { name: /Schedule a Demo Today/i });

      await userEvent.type(fullNameInput, 'John Doe');
      await userEvent.type(emailInput, 'john@example.com');
      await userEvent.type(companyInput, 'Test Co');
      await userEvent.click(submitButton);

      await waitFor(() => {
        const errors = screen.getAllByRole('alert');
        expect(errors.some(e => e.textContent?.includes('Consent'))).toBe(true);
      });
    });
  });

  describe('Optional Fields', () => {
    it('should allow submission with blank phone, role, and message', async () => {
      vi.mocked(enquiryService.submitEnquiry).mockResolvedValueOnce({
        ok: true,
        message: 'Success',
      });

      renderForm();
      const fullNameInput = screen.getByLabelText(/Full name/i);
      const emailInput = screen.getByLabelText(/Work email/i);
      const companyInput = screen.getByLabelText(/Company/i);
      const consentCheckbox = screen.getByRole('checkbox');
      const submitButton = screen.getByRole('button', { name: /Schedule a Demo Today/i });

      await userEvent.type(fullNameInput, 'John Doe');
      await userEvent.type(emailInput, 'john@example.com');
      await userEvent.type(companyInput, 'Test Co');
      await userEvent.click(consentCheckbox);
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(enquiryService.submitEnquiry).toHaveBeenCalled();
      });
    });
  });

  describe('Form Field Labels', () => {
    it('should have visible label for full name', () => {
      renderForm();
      expect(screen.getByLabelText(/Full name/i)).toBeTruthy();
    });

    it('should have visible label for work email', () => {
      renderForm();
      expect(screen.getByLabelText(/Work email/i)).toBeTruthy();
    });

    it('should have visible label for company', () => {
      renderForm();
      expect(screen.getByLabelText(/Company/i)).toBeTruthy();
    });

    it('should have visible label for consent checkbox', () => {
      renderForm();
      expect(screen.getByText(/I agree that SBA Info Solutions may contact me regarding LucidFlow/i)).toBeTruthy();
    });
  });

  describe('Submit Button Keyboard Access', () => {
    it('should be keyboard accessible (focusable)', async () => {
      renderForm();
      const submitButton = screen.getByRole('button', { name: /Schedule a Demo Today/i });

      // Button should be focusable
      submitButton.focus();
      expect(document.activeElement).toBe(submitButton);
    });

    it('should respond to Enter key', async () => {
      vi.mocked(enquiryService.submitEnquiry).mockResolvedValueOnce({
        ok: true,
        message: 'Success',
      });

      renderForm();
      const fullNameInput = screen.getByLabelText(/Full name/i);
      const emailInput = screen.getByLabelText(/Work email/i);
      const companyInput = screen.getByLabelText(/Company/i);
      const consentCheckbox = screen.getByRole('checkbox');

      await userEvent.type(fullNameInput, 'John Doe');
      await userEvent.type(emailInput, 'john@example.com');
      await userEvent.type(companyInput, 'Test Co');
      await userEvent.click(consentCheckbox);

      const submitButton = screen.getByRole('button', { name: /Schedule a Demo Today/i });
      submitButton.focus();
      await userEvent.keyboard('{Enter}');

      await waitFor(() => {
        expect(enquiryService.submitEnquiry).toHaveBeenCalled();
      });
    });
  });

  describe('Form Submit Behavior', () => {
    it('should show loading state while request is pending', async () => {
      vi.mocked(enquiryService.submitEnquiry).mockImplementationOnce(
        () => new Promise(resolve => setTimeout(() => resolve({ ok: true, message: 'Success' }), 100))
      );

      renderForm();
      const fullNameInput = screen.getByLabelText(/Full name/i);
      const emailInput = screen.getByLabelText(/Work email/i);
      const companyInput = screen.getByLabelText(/Company/i);
      const consentCheckbox = screen.getByRole('checkbox');
      const submitButton = screen.getByRole('button', { name: /Schedule a Demo Today/i });

      await userEvent.type(fullNameInput, 'John Doe');
      await userEvent.type(emailInput, 'john@example.com');
      await userEvent.type(companyInput, 'Test Co');
      await userEvent.click(consentCheckbox);
      await userEvent.click(submitButton);

      // Button should show loading state
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Sending/i })).toBeTruthy();
      });
    });

    it('should prevent duplicate submissions while pending', async () => {
      vi.mocked(enquiryService.submitEnquiry).mockImplementationOnce(
        () => new Promise(resolve => setTimeout(() => resolve({ ok: true, message: 'Success' }), 200))
      );

      renderForm();
      const fullNameInput = screen.getByLabelText(/Full name/i);
      const emailInput = screen.getByLabelText(/Work email/i);
      const companyInput = screen.getByLabelText(/Company/i);
      const consentCheckbox = screen.getByRole('checkbox');
      const submitButton = screen.getByRole('button', { name: /Schedule a Demo Today/i });

      await userEvent.type(fullNameInput, 'John Doe');
      await userEvent.type(emailInput, 'john@example.com');
      await userEvent.type(companyInput, 'Test Co');
      await userEvent.click(consentCheckbox);
      await userEvent.click(submitButton);

      // Button should be disabled during submission
      await waitFor(() => {
        expect(submitButton.hasAttribute('disabled')).toBe(true);
      });
    });

    it('should redirect to thank-you page on successful submission', async () => {
      vi.mocked(enquiryService.submitEnquiry).mockResolvedValueOnce({
        ok: true,
        message: 'Success',
      });

      renderForm();
      const fullNameInput = screen.getByLabelText(/Full name/i);
      const emailInput = screen.getByLabelText(/Work email/i);
      const companyInput = screen.getByLabelText(/Company/i);
      const consentCheckbox = screen.getByRole('checkbox');
      const submitButton = screen.getByRole('button', { name: /Schedule a Demo Today/i });

      await userEvent.type(fullNameInput, 'John Doe');
      await userEvent.type(emailInput, 'john@example.com');
      await userEvent.type(companyInput, 'Test Co');
      await userEvent.click(consentCheckbox);
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/lucidflow/thank-you');
      });
    });

    it('should keep form data visible and show error on failure', async () => {
      vi.mocked(enquiryService.submitEnquiry).mockResolvedValueOnce({
        ok: false,
        message: 'We could not submit your enquiry right now. Please try again.',
      });

      renderForm();
      const fullNameInput = screen.getByLabelText(/Full name/i) as HTMLInputElement;
      const emailInput = screen.getByLabelText(/Work email/i) as HTMLInputElement;
      const companyInput = screen.getByLabelText(/Company/i) as HTMLInputElement;
      const consentCheckbox = screen.getByRole('checkbox') as HTMLInputElement;
      const submitButton = screen.getByRole('button', { name: /Schedule a Demo Today/i });

      await userEvent.type(fullNameInput, 'John Doe');
      await userEvent.type(emailInput, 'john@example.com');
      await userEvent.type(companyInput, 'Test Co');
      await userEvent.click(consentCheckbox);
      await userEvent.click(submitButton);

      await waitFor(() => {
        // Form data should still be visible
        expect(fullNameInput.value).toBe('John Doe');
        expect(emailInput.value).toBe('john@example.com');
        expect(companyInput.value).toBe('Test Co');
        expect(consentCheckbox.checked).toBe(true);

        // Error message should be shown
        expect(screen.getByText(/We could not submit your enquiry right now/i)).toBeTruthy();
      });
    });

    it('should show exact generic error message on failure', async () => {
      vi.mocked(enquiryService.submitEnquiry).mockResolvedValueOnce({
        ok: false,
        message: 'We could not submit your enquiry right now. Please try again.',
      });

      renderForm();
      const fullNameInput = screen.getByLabelText(/Full name/i);
      const emailInput = screen.getByLabelText(/Work email/i);
      const companyInput = screen.getByLabelText(/Company/i);
      const consentCheckbox = screen.getByRole('checkbox');
      const submitButton = screen.getByRole('button', { name: /Schedule a Demo Today/i });

      await userEvent.type(fullNameInput, 'John Doe');
      await userEvent.type(emailInput, 'john@example.com');
      await userEvent.type(companyInput, 'Test Co');
      await userEvent.click(consentCheckbox);
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/We could not submit your enquiry right now. Please try again./)).toBeTruthy();
      });
    });
  });
});
