import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

declare global {
  namespace Vi {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveAttribute(name: string, value?: string): R;
      toHaveFocus(): R;
      toBeDisabled(): R;
      toBeVisible(): R;
    }
  }
}

// Mock window.matchMedia for prefers-reduced-motion
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock window.gtag
(globalThis.window as any).gtag = vi.fn();

// Mock import.meta.env - must be done before any modules import it
const testEnv = {
  DEV: false,
  VITE_GA_MEASUREMENT_ID: 'G-TEST123',
  VITE_LUCIDFLOW_ENQUIRY_ENDPOINT: 'https://test-endpoint.example.com/enquiry',
};

Object.defineProperty(import.meta, 'env', {
  value: testEnv,
  writable: true,
  configurable: true,
});
