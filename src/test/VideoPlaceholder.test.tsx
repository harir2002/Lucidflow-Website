import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VideoPlaceholder } from '@/components/lucidflow/VideoPlaceholder';
import * as analytics from '@/hooks/useAnalytics';
import '@testing-library/jest-dom';

// Mock analytics
vi.mock('@/hooks/useAnalytics');

// Mock VideoPlayer component
vi.mock('@/components/video/VideoPlayer', () => ({
  VideoPlayer: ({ 
    title, 
    onFallback, 
    posterSrc 
  }: { 
    title: string
    onFallback: () => void
    posterSrc: string
  }) => (
    <div data-testid="video-player">
      <button 
        onClick={onFallback}
        aria-label={title}
      >
        Play Video
      </button>
      <img src={posterSrc} alt="Video poster" data-testid="video-poster" />
    </div>
  ),
}));

describe('VideoPlaceholder Component - Accessibility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Play Button Accessibility', () => {
    it('should have accessible play button with proper aria-label', () => {
      render(<VideoPlaceholder />);
      const playButton = screen.getByRole('button', { 
        name: /Play LucidFlow product overview video/i 
      });
      expect(playButton).toBeInTheDocument();
    });

    it('should be keyboard accessible (focusable)', () => {
      render(<VideoPlaceholder />);
      const playButton = screen.getByRole('button', { 
        name: /Play LucidFlow product overview video/i 
      });
      
      playButton.focus();
      expect(playButton).toHaveFocus();
    });

    it('should respond to Enter key', async () => {
      render(<VideoPlaceholder />);
      const playButton = screen.getByRole('button', { 
        name: /Play LucidFlow product overview video/i 
      });
      
      playButton.focus();
      await userEvent.keyboard('{Enter}');

      expect(analytics.trackCtaClick).toHaveBeenCalled();
    });

    it('should respond to Space key', async () => {
      render(<VideoPlaceholder />);
      const playButton = screen.getByRole('button', { 
        name: /Play LucidFlow product overview video/i 
      });
      
      playButton.focus();
      await userEvent.keyboard(' ');

      expect(analytics.trackCtaClick).toHaveBeenCalled();
    });
  });

  describe('Video Modal and Poster', () => {
    it('should render video poster image', () => {
      render(<VideoPlaceholder />);
      const poster = screen.getByTestId('video-poster');
      expect(poster).toHaveAttribute('src', '/images/lucidflow-video-poster.png');
    });

    it('should have proper video player component', () => {
      render(<VideoPlaceholder />);
      const player = screen.getByTestId('video-player');
      expect(player).toBeInTheDocument();
    });
  });

  describe('Analytics Tracking', () => {
    it('should track CTA click when play button is clicked', async () => {
      render(<VideoPlaceholder />);
      const playButton = screen.getByRole('button', { 
        name: /Play LucidFlow product overview video/i 
      });

      await userEvent.click(playButton);

      expect(analytics.trackCtaClick).toHaveBeenCalledWith(
        expect.objectContaining({
          ctaLabel: 'Request a Platform Walkthrough',
          ctaLocation: 'video',
          preferredEngagement: 'demo',
        })
      );
    });
  });

  describe('Semantic Structure', () => {
    it('should be within a section element', () => {
      const { container } = render(<VideoPlaceholder />);
      const section = container.querySelector('section#video');
      expect(section).toBeInTheDocument();
    });

    it('should have proper container nesting', () => {
      const { container } = render(<VideoPlaceholder />);
      const section = container.querySelector('section#video');
      const container_div = section?.querySelector('.container-lf');
      expect(container_div).toBeInTheDocument();
    });
  });
});
