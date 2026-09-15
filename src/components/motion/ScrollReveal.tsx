import { useEffect, useRef, ReactNode } from "react";
import { motionConfig, prefersReducedMotion } from "@/lib/motion";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

/**
 * ScrollReveal: Reveals content when it enters the viewport
 * Animated upward with fade-in, respects reduced-motion preference
 */
export function ScrollReveal({
  children,
  delay = 0,
  className = "",
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = prefersReducedMotion();

  useEffect(() => {
    if (prefersReduced || !ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.setAttribute("data-reveal", "true");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [prefersReduced]);

  return (
    <div
      ref={ref}
      className={className}
      style={
        prefersReduced
          ? {}
          : {
              opacity: 0,
              transform: "translateY(14px)",
              transition: `opacity ${motionConfig.base}ms ease-out, transform ${motionConfig.base}ms ease-out`,
              transitionDelay: `${delay}ms`,
            }
      }
      data-reveal={prefersReduced ? "true" : "false"}
    >
      {/* Apply styles when revealed */}
      <style>{`
        [data-reveal="true"] {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
      {children}
    </div>
  );
}
