/**
 * Motion utilities for premium animations across LucidFlow
 * All animations respect prefers-reduced-motion
 */

export const motionConfig = {
  // Standard transition durations
  fast: 180,
  base: 300,
  slow: 500,
  
  // Stagger intervals for sequential reveals
  staggerFast: 60,
  staggerBase: 80,
  staggerSlow: 120,
};

/**
 * CSS animations for scroll reveals and ambient effects
 */
export const motionStyles = `
  @keyframes scrollRevealUp {
    from {
      opacity: 0;
      transform: translateY(14px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulseGlow {
    0%, 100% {
      opacity: 0.4;
      transform: scale(1);
    }
    50% {
      opacity: 0.8;
      transform: scale(1.1);
    }
  }

  @keyframes fastPulse {
    0%, 100% {
      opacity: 0.6;
      transform: scale(1);
    }
    50% {
      opacity: 1;
      transform: scale(1.08);
    }
  }

  @keyframes lineDraw {
    from {
      stroke-dashoffset: var(--dash-offset);
    }
    to {
      stroke-dashoffset: 0;
    }
  }

  @keyframes travelGlow {
    0% {
      offset-distance: 0%;
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    90% {
      opacity: 1;
    }
    100% {
      offset-distance: 100%;
      opacity: 0;
    }
  }

  @keyframes slideInLine {
    from {
      scaleX(0);
    }
    to {
      scaleX(1);
    }
  }

  @keyframes cornerLine {
    from {
      opacity: 0;
      stroke-dashoffset: 24;
    }
    to {
      opacity: 1;
      stroke-dashoffset: 0;
    }
  }

  @keyframes scanLine {
    0%, 100% {
      transform: translateX(-100%);
      opacity: 0;
    }
    50% {
      opacity: 0.4;
    }
  }

  @keyframes ambientGlow {
    0%, 100% {
      opacity: 0.15;
      transform: scale(1);
    }
    50% {
      opacity: 0.25;
      transform: scale(1.05);
    }
  }

  @keyframes journeyFlow {
    0% {
      offset-distance: 0%;
    }
    100% {
      offset-distance: 100%;
    }
  }

  /* Reduced motion overrides */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

/**
 * Calculate staggered animation delay
 */
export function getStaggerDelay(index: number, interval: number): number {
  return index * interval;
}

/**
 * Utility to check if reduced motion is preferred
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Get animation properties respecting reduced motion
 */
export function getAnimationProps(
  animationName: string,
  duration: number,
  delay: number = 0,
  iterationCount: string = "1"
) {
  const prefersReduced = prefersReducedMotion();
  
  return {
    animation: prefersReduced ? "none" : `${animationName} ${duration}ms ease-out ${delay}ms ${iterationCount}`,
  };
}
