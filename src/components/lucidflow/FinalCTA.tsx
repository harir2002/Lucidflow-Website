import { CONTACT } from "@/data/lucidflowContent";
import { trackCtaClick, trackEmailClick, trackPhoneClick } from "@/hooks/useAnalytics";
import { Button } from "./Button";
import { useEnquiry } from "./EnquiryProvider";
import { useRef, useEffect, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";

export function FinalCTA() {
  const { openEnquiry } = useEnquiry();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const prefersReduced = prefersReducedMotion();

  useEffect(() => {
    if (!containerRef.current || prefersReduced) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [prefersReduced]);

  return (
    <section id="final-cta" className="relative overflow-hidden section-space" ref={containerRef}>
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {/* Animated journey line entry from left */}
        <svg
          viewBox="0 0 1200 240"
          className="absolute inset-x-0 bottom-0 h-full w-full"
          fill="none"
        >
          <defs>
            <linearGradient id="mesh-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(231,0,11,0.08)" />
              <stop offset="50%" stopColor="rgba(231,0,11,0.04)" />
              <stop offset="100%" stopColor="rgba(231,0,11,0.02)" />
            </linearGradient>
            <linearGradient id="mesh-gradient-2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(44,123,255,0.06)" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>

          {/* Large curved shapes */}
          <circle cx="100" cy="180" r="120" fill="url(#mesh-gradient-1)" />
          <circle cx="1100" cy="120" r="140" fill="url(#mesh-gradient-2)" />

          {/* Animated journey line - slides in from left */}
          <path
            d="M 0 180 Q 300 140, 600 160 T 1200 140"
            stroke="rgba(231,0,11,0.12)"
            strokeWidth="2"
            fill="none"
            strokeDasharray={isInView && !prefersReduced ? "0" : "500"}
            style={{
              transition: prefersReduced ? "none" : "stroke-dasharray 1.5s ease-out",
            }}
          />

          <path
            d="M 0 200 Q 400 160, 800 180 T 1200 160"
            stroke="rgba(44,123,255,0.08)"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray={isInView && !prefersReduced ? "0" : "400"}
            style={{
              transition: prefersReduced ? "none" : "stroke-dasharray 1.7s ease-out 0.1s",
            }}
          />

          {/* Animated risk node - transitions from risk to validated state */}
          <g opacity={isInView && !prefersReduced ? 1 : 0.5}>
            {/* Risk node pulse ring */}
            <circle
              cx="250"
              cy="160"
              r="8"
              fill="none"
              stroke="rgba(231,0,11,0.3)"
              strokeWidth="1"
              style={{
                animation: isInView && !prefersReduced ? "pulseGlow 2.5s ease-in-out infinite" : "none",
              }}
            />
            {/* Center dot - transitions color from red to validated white */}
            <circle
              cx="250"
              cy="160"
              r="3"
              fill={isInView && !prefersReduced ? "#E7000B" : "#ffffff"}
              style={{
                animation: isInView && !prefersReduced ? "fastPulse 2s ease-in-out infinite" : "none",
                transition: prefersReduced ? "none" : "fill 0.6s ease-out",
              }}
            />
          </g>

          {/* Check icon at validated node - appears on completion */}
          {isInView && !prefersReduced && (
            <g
              opacity={0.7}
              style={{
                animation: "fadeInScale 0.8s ease-out 1s forwards",
                animationFillMode: "backwards",
              }}
            >
              <path
                d="M 246 160 L 249 163 L 253 157"
                stroke="#ffffff"
                strokeWidth="1.2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          )}

          {/* Decorative dots */}
          <circle cx="950" cy="140" r="3" fill="rgba(44,123,255,0.25)" />
          <circle cx="600" cy="190" r="2" fill="rgba(247,247,247,0.2)" />
        </svg>

        {/* Add fadeInScale animation */}
        <style>{`
          @keyframes fadeInScale {
            from {
              opacity: 0;
              transform: scale(0.5);
            }
            to {
              opacity: 0.7;
              transform: scale(1);
            }
          }
        `}</style>
      </div>

      <div className="container-lf relative text-center">
        <h2 className="mx-auto max-w-4xl text-3xl font-bold tracking-[-0.03em] text-light-text sm:text-4xl lg:text-5xl">
          Make compliance visible across every customer journey.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-grey sm:text-lg">
          Start with one journey. Build the evidence. Decide the right path forward.
        </p>
        <div className="mt-8">
          <Button
            onClick={() => {
              trackCtaClick({
                ctaLabel: "Request a Journey Assurance Scan",
                ctaLocation: "final-cta",
                preferredEngagement: "scan",
              });
              openEnquiry({
                preferredEngagement: "scan",
                sourceSection: "final-cta",
                heading: "Request a Journey Assurance Scan",
              });
            }}
          >
            Request a Journey Assurance Scan
          </Button>
        </div>
        <p className="mt-8 text-sm text-muted-grey">
          <a
            href={`mailto:${CONTACT.email}`}
            className="inline-flex min-h-11 items-center hover:text-light-text"
            onClick={() => trackEmailClick("final-cta")}
          >
            {CONTACT.email}
          </a>
          <span className="mx-2" aria-hidden>
            |
          </span>
          <a
            href={`tel:${CONTACT.phoneTel}`}
            className="inline-flex min-h-11 items-center hover:text-light-text"
            onClick={() => trackPhoneClick("final-cta")}
          >
            {CONTACT.phoneDisplay}
          </a>
        </p>
      </div>
    </section>
  );
}
