import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FAQ } from '@/components/lucidflow/FAQ';
import '@testing-library/jest-dom';

describe('FAQ Component - Accessibility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Accordion Structure', () => {
    it('should render as a section with id "faq"', () => {
      const { container } = render(<FAQ />);
      const section = container.querySelector('section#faq');
      expect(section).toBeInTheDocument();
    });

    it('should render all FAQ items', () => {
      render(<FAQ />);
      expect(screen.getByText(/Does LucidFlow replace legal advice/i)).toBeInTheDocument();
      expect(screen.getByText(/Can it certify compliance/i)).toBeInTheDocument();
      expect(screen.getByText(/What does the scan cover/i)).toBeInTheDocument();
      expect(screen.getByText(/Can it work with our existing adviser/i)).toBeInTheDocument();
      expect(screen.getByText(/Can we start small/i)).toBeInTheDocument();
      expect(screen.getByText(/Is customer-hosted deployment available/i)).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation', () => {
    it('should allow toggle accordion using mouse', async () => {
      render(<FAQ />);
      const firstButton = screen.getByRole('button', { 
        name: /Does LucidFlow replace legal advice/i 
      });

      // Initially closed
      expect(firstButton).toHaveAttribute('aria-expanded', 'false');

      // Click to open
      await userEvent.click(firstButton);
      expect(firstButton).toHaveAttribute('aria-expanded', 'true');

      // Click to close
      await userEvent.click(firstButton);
      expect(firstButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('should allow toggle accordion using keyboard (Enter)', async () => {
      render(<FAQ />);
      const firstButton = screen.getByRole('button', { 
        name: /Does LucidFlow replace legal advice/i 
      });

      firstButton.focus();
      await userEvent.keyboard('{Enter}');

      expect(firstButton).toHaveAttribute('aria-expanded', 'true');

      await userEvent.keyboard('{Enter}');
      expect(firstButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('should allow toggle accordion using keyboard (Space)', async () => {
      render(<FAQ />);
      const firstButton = screen.getByRole('button', { 
        name: /Does LucidFlow replace legal advice/i 
      });

      firstButton.focus();
      await userEvent.keyboard(' ');

      expect(firstButton).toHaveAttribute('aria-expanded', 'true');

      await userEvent.keyboard(' ');
      expect(firstButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('should be keyboard focusable for all accordion buttons', () => {
      render(<FAQ />);
      const buttons = screen.getAllByRole('button');

      buttons.forEach(button => {
        button.focus();
        expect(button).toHaveFocus();
      });
    });
  });

  describe('ARIA Attributes', () => {
    it('should have aria-expanded attribute on accordion buttons', () => {
      render(<FAQ />);
      const firstButton = screen.getByRole('button', { 
        name: /Does LucidFlow replace legal advice/i 
      });

      expect(firstButton).toHaveAttribute('aria-expanded');
    });

    it('should update aria-expanded when toggled', async () => {
      render(<FAQ />);
      const firstButton = screen.getByRole('button', { 
        name: /Does LucidFlow replace legal advice/i 
      });

      expect(firstButton).toHaveAttribute('aria-expanded', 'false');

      await userEvent.click(firstButton);
      expect(firstButton).toHaveAttribute('aria-expanded', 'true');
    });

    it('should have aria-controls pointing to content panel', () => {
      render(<FAQ />);
      const firstButton = screen.getByRole('button', { 
        name: /Does LucidFlow replace legal advice/i 
      });

      const controlsId = firstButton.getAttribute('aria-controls');
      expect(controlsId).toBeDefined();
      expect(controlsId).not.toBe('');
    });
  });

  describe('Content Visibility', () => {
    it('should hide accordion content initially', () => {
      render(<FAQ />);
      const firstButton = screen.getByRole('button', { 
        name: /Does LucidFlow replace legal advice/i 
      });
      const contentId = firstButton.getAttribute('aria-controls');
      const content = document.getElementById(contentId!);

      expect(content).toHaveAttribute('hidden');
    });

    it('should show accordion content when expanded', async () => {
      render(<FAQ />);
      const firstButton = screen.getByRole('button', { 
        name: /Does LucidFlow replace legal advice/i 
      });
      const contentId = firstButton.getAttribute('aria-controls');
      const content = document.getElementById(contentId!);

      await userEvent.click(firstButton);

      // Hidden attribute should be removed
      expect(content).not.toHaveAttribute('hidden');
    });

    it('should display answer text when expanded', async () => {
      render(<FAQ />);
      const firstButton = screen.getByRole('button', { 
        name: /Does LucidFlow replace legal advice/i 
      });

      await userEvent.click(firstButton);

      expect(screen.getByText(
        /LucidFlow helps teams monitor, document, prioritise and revalidate potential journey risks/i
      )).toBeTruthy();
    });
  });

  describe('Only One Accordion Open', () => {
    it('should close previously opened accordion when opening new one', async () => {
      render(<FAQ />);
      const firstButton = screen.getByRole('button', { 
        name: /Does LucidFlow replace legal advice/i 
      });
      const secondButton = screen.getByRole('button', { 
        name: /Can it certify compliance/i 
      });

      // Open first
      await userEvent.click(firstButton);
      expect(firstButton).toHaveAttribute('aria-expanded', 'true');

      // Open second
      await userEvent.click(secondButton);
      expect(firstButton).toHaveAttribute('aria-expanded', 'false');
      expect(secondButton).toHaveAttribute('aria-expanded', 'true');
    });
  });

  describe('Visual Indicators', () => {
    it('should have proper button semantics (h2 > button)', () => {
      const { container } = render(<FAQ />);
      const h2s = container.querySelectorAll('h2');
      expect(h2s.length).toBeGreaterThan(0);

      h2s.forEach(h2 => {
        const button = h2.querySelector('button');
        expect(button).toBeInTheDocument();
      });
    });

    it('should have aria-hidden on decorative icons', () => {
      const { container } = render(<FAQ />);
      const icons = container.querySelectorAll('[aria-hidden="true"]');
      // Should have aria-hidden decorative elements (Plus/Minus icons)
      expect(icons.length).toBeGreaterThan(0);
    });
  });

  describe('Content Structure', () => {
    it('should render all FAQ answers', async () => {
      render(<FAQ />);
      const buttons = screen.getAllByRole('button');

      // Open all accordions
      for (const button of buttons) {
        await userEvent.click(button);
      }

      // Verify all answers are in the DOM (visibility varies with accordion state)
      expect(screen.getByText(/legal, compliance and advisory professionals/i)).toBeTruthy();
      expect(screen.getByText(/does not independently provide legal opinions/i)).toBeTruthy();
      expect(screen.getByText(/Journey Assurance Scan covers one agreed critical journey/i)).toBeTruthy();
      expect(screen.getByText(/complement internal teams and external legal/i)).toBeTruthy();
      expect(screen.getByText(/Start with one critical journey/i)).toBeTruthy();
      expect(screen.getByText(/Annual Enterprise model/i)).toBeTruthy();
    });
  });
});
