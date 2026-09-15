import { useRef, useEffect, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";

const STAGES = [
  { label: "Quote", risk: false },
  { label: "Add-ons", risk: true },
  { label: "Consent", risk: true },
  { label: "Payment", risk: false },
  { label: "Renewal", risk: false },
  { label: "Claims", risk: false },
  { label: "Cancellation", risk: true },
] as const;

export function JourneyMap() {
  const prefersReduced = prefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

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
    <div ref={containerRef}>
      {/* Desktop journey map */}
      <ol className="relative hidden lg:grid lg:grid-cols-7" aria-label="Journey stages">
        {/* Animated connecting line */}
        <span
          className="absolute left-[7%] right-[7%] top-[11px] h-px bg-gradient-to-r from-transparent via-white to-transparent transition-opacity duration-1000"
          style={{
            opacity: isInView && !prefersReduced ? 1 : 0.25,
            animation: isInView && !prefersReduced ? "none" : "none",
          }}
          aria-hidden
        />

        {/* Traveling glow along the line */}
        {isInView && !prefersReduced && (
          <div
            className="absolute top-[10px] h-px w-24 bg-gradient-to-r from-transparent via-white to-transparent opacity-60 pointer-events-none"
            style={{
              animation: "travelGlow 4s ease-in-out infinite",
              left: "7%",
              right: "auto",
            }}
            aria-hidden
          />
        )}

        {STAGES.map((stage, index) => (
          <li
            key={stage.label}
            className="relative flex flex-col items-center transition-all duration-500"
            style={{
              opacity: isInView && !prefersReduced ? 1 : 0.5,
              transform: isInView && !prefersReduced ? "translateY(0)" : "translateY(4px)",
              transitionDelay: `${index * 50}ms`,
            }}
          >
            {/* Risk node with pulsing ring */}
            {stage.risk && !prefersReduced && (
              <span
                className="absolute h-[34px] w-[34px] rounded-full border border-crimson/40"
                style={{
                  animation: "pulseGlow 3s ease-in-out infinite",
                  top: "-6px",
                }}
                aria-hidden
              />
            )}

            {/* Stage dot */}
            <span
              className={`relative z-10 h-[22px] w-[22px] rounded-full transition-all duration-300 ${
                stage.risk
                  ? "bg-crimson"
                  : "bg-light-text"
              }`}
              style={{
                animation: stage.risk && !prefersReduced ? "fastPulse 2.5s ease-in-out infinite" : "none",
              }}
            />

            <p className="mt-5 text-sm font-medium text-light-text">{stage.label}</p>
          </li>
        ))}
      </ol>

      {/* Mobile journey map - vertical */}
      <ol className="space-y-5 lg:hidden" aria-label="Journey stages">
        {STAGES.map((stage, index) => (
          <li
            key={stage.label}
            className="relative flex items-center gap-4 transition-all duration-500"
            style={{
              opacity: isInView && !prefersReduced ? 1 : 0.5,
              transform: isInView && !prefersReduced ? "translateX(0)" : "translateX(-8px)",
              transitionDelay: `${index * 40}ms`,
            }}
          >
            {/* Vertical connector line */}
            {index < STAGES.length - 1 && (
              <span
                className="absolute bottom-[-20px] left-[10px] top-5 w-px bg-gradient-to-b from-white/20 to-transparent"
                aria-hidden
              />
            )}

            {/* Risk pulse ring */}
            {stage.risk && !prefersReduced && (
              <span
                className="absolute h-[28px] w-[28px] rounded-full border border-crimson/40 left-[3px]"
                style={{
                  animation: "pulseGlow 3s ease-in-out infinite",
                }}
                aria-hidden
              />
            )}

            {/* Stage dot */}
            <span
              className={`relative z-10 h-[22px] w-[22px] shrink-0 rounded-full transition-all ${
                stage.risk ? "bg-crimson" : "bg-light-text"
              }`}
              style={{
                animation: stage.risk && !prefersReduced ? "fastPulse 2.5s ease-in-out infinite" : "none",
              }}
            />

            <p className="text-sm font-medium text-light-text">{stage.label}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
