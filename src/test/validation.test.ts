import { describe, it, expect } from 'vitest';
import { enquirySchema, type EnquiryFormInput } from '@/lib/validation';

describe('Enquiry Form Validation Schema', () => {
  describe('Full Name field', () => {
    it('should reject when full name is missing', () => {
      const data: EnquiryFormInput = {
        fullName: '',
        workEmail: 'test@example.com',
        company: 'Test Co',
        consent: true,
      };
      const result = enquirySchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.fullName).toBeDefined();
      }
    });

    it('should reject when full name is too short (less than 2 chars)', () => {
      const data: EnquiryFormInput = {
        fullName: 'A',
        workEmail: 'test@example.com',
        company: 'Test Co',
        consent: true,
      };
      const result = enquirySchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should accept a valid full name', () => {
      const data: EnquiryFormInput = {
        fullName: 'John Doe',
        workEmail: 'test@example.com',
        company: 'Test Co',
        consent: true,
      };
      const result = enquirySchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe('Work Email field', () => {
    it('should reject when work email is missing', () => {
      const data: EnquiryFormInput = {
        fullName: 'John Doe',
        workEmail: '',
        company: 'Test Co',
        consent: true,
      };
      const result = enquirySchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.workEmail).toBeDefined();
      }
    });

    it('should reject when work email is invalid format', () => {
      const data: EnquiryFormInput = {
        fullName: 'John Doe',
        workEmail: 'not-an-email',
        company: 'Test Co',
        consent: true,
      };
      const result = enquirySchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.workEmail).toBeDefined();
      }
    });

    it('should accept a valid email', () => {
      const data: EnquiryFormInput = {
        fullName: 'John Doe',
        workEmail: 'john@example.com',
        company: 'Test Co',
        consent: true,
      };
      const result = enquirySchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe('Company field', () => {
    it('should reject when company is missing', () => {
      const data: EnquiryFormInput = {
        fullName: 'John Doe',
        workEmail: 'test@example.com',
        company: '',
        consent: true,
      };
      const result = enquirySchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.company).toBeDefined();
      }
    });

    it('should accept a valid company name', () => {
      const data: EnquiryFormInput = {
        fullName: 'John Doe',
        workEmail: 'test@example.com',
        company: 'Acme Corp',
        consent: true,
      };
      const result = enquirySchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe('Consent field', () => {
    it('should reject when consent is unchecked', () => {
      const data: EnquiryFormInput = {
        fullName: 'John Doe',
        workEmail: 'test@example.com',
        company: 'Test Co',
        consent: false,
      };
      const result = enquirySchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.consent).toBeDefined();
      }
    });

    it('should reject when consent is undefined', () => {
      const data: EnquiryFormInput = {
        fullName: 'John Doe',
        workEmail: 'test@example.com',
        company: 'Test Co',
        consent: undefined as any,
      };
      const result = enquirySchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should accept when consent is true', () => {
      const data: EnquiryFormInput = {
        fullName: 'John Doe',
        workEmail: 'test@example.com',
        company: 'Test Co',
        consent: true,
      };
      const result = enquirySchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe('Optional fields', () => {
    it('should accept blank phone, role, and message', () => {
      const data: EnquiryFormInput = {
        fullName: 'John Doe',
        workEmail: 'test@example.com',
        phone: '',
        company: 'Test Co',
        role: '',
        message: '',
        consent: true,
      };
      const result = enquirySchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should accept with phone number', () => {
      const data: EnquiryFormInput = {
        fullName: 'John Doe',
        workEmail: 'test@example.com',
        phone: '+1-555-0123',
        company: 'Test Co',
        consent: true,
      };
      const result = enquirySchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should accept with role', () => {
      const data: EnquiryFormInput = {
        fullName: 'John Doe',
        workEmail: 'test@example.com',
        company: 'Test Co',
        role: 'Product Manager',
        consent: true,
      };
      const result = enquirySchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should accept with message', () => {
      const data: EnquiryFormInput = {
        fullName: 'John Doe',
        workEmail: 'test@example.com',
        company: 'Test Co',
        message: 'I am interested in learning more about LucidFlow.',
        consent: true,
      };
      const result = enquirySchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe('Complete valid submission', () => {
    it('should accept a complete valid form submission', () => {
      const data: EnquiryFormInput = {
        fullName: 'Jane Smith',
        workEmail: 'jane.smith@acme.com',
        phone: '+1-555-9876',
        company: 'Acme Corporation',
        role: 'Director of Operations',
        message: 'We are interested in implementing LucidFlow across our organization.',
        consent: true,
      };
      const result = enquirySchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.fullName).toBe('Jane Smith');
        expect(result.data.workEmail).toBe('jane.smith@acme.com');
        expect(result.data.company).toBe('Acme Corporation');
      }
    });
  });

  describe('Field trimming', () => {
    it('should trim whitespace from full name', () => {
      const data: EnquiryFormInput = {
        fullName: '  John Doe  ',
        workEmail: 'test@example.com',
        company: 'Test Co',
        consent: true,
      };
      const result = enquirySchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.fullName).toBe('John Doe');
      }
    });

    it('should trim and lowercase email', () => {
      const data: EnquiryFormInput = {
        fullName: 'John Doe',
        workEmail: '  TEST@EXAMPLE.COM  ',
        company: 'Test Co',
        consent: true,
      };
      const result = enquirySchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });
});
