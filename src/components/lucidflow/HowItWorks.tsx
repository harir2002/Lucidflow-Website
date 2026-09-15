import { Button } from "./Button";
import { useEnquiry } from "./EnquiryProvider";
import { trackCtaClick } from "@/hooks/useAnalytics";
import { useState, useRef, useEffect } from "react";
import { motionConfig, prefersReducedMotion } from "@/lib/motion";

const STEPS = [
  {
    number: 1,
    title: "Configure scope",
  },
  {
    number: 2,
    title: "Scan journey",
  },
  {
    number: 3,
    title: "Review evidence",
  },
  {
    number: 4,
    title: "Prioritize finding",
  },
  {
    number: 5,
    title: "Create corrective-action record",
  },
  {
    number: 6,
    title: "Re-scan and validate closure",
  },
];

export function HowItWorks() {
  const { openEnquiry } = useEnquiry();
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
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
      { threshold: 0.3 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [prefersReduced]);

  const openWalkthrough = () => {
    trackCtaClick({
      ctaLabel: "Request a Platform Walkthrough",
      ctaLocation: "how-it-works",
      preferredEngagement: "demo",
    });
    openEnquiry({
      preferredEngagement: "demo",
      sourceSection: "how-it-works",
      heading: "Request a Platform Walkthrough",
    });
  };

  return (
    <section id="how-it-works" className="section-space relative overflow-hidden bg-black">
      <div className="container-lf" ref={containerRef}>
        <h2 className="font-display section-heading text-white mb-16">From live journey to verified corrective action.</h2>

        {/* Animated flow diagram */}
        <div className="mb-16">
          {/* Desktop view - Horizontal flow */}
          <div className="hidden lg:block">
            <div className="relative">
              {/* Animated connecting line with draw effect */}
              <svg
                className="absolute left-0 right-0 top-6 h-0.5 w-full"
                viewBox="0 0 1000 2"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <line
                  x1="0"
                  y1="1"
                  x2="1000"
                  y2="1"
                  stroke="white"
                  strokeWidth="1"
                  strokeDasharray={isInView && !prefersReduced ? "0" : "1000"}
                  style={{
                    transition: prefersReduced ? "none" : "stroke-dasharray 1.2s ease-out",
                    transitionDelay: "0ms",
                  }}
                />
              </svg>
              
              {/* Steps grid with staggered reveal */}
              <div className="relative grid grid-cols-6 gap-4">
                {STEPS.map((step, index) => {
                  const isActive = activeStep === step.number;
                  const staggerDelay = index * 100;

                  return (
                    <div
                      key={step.number}
                      className="group relative"
                      style={{
                        opacity: isInView && !prefersReduced ? 1 : 0,
                        transform: isInView && !prefersReduced ? "translateY(0)" : "translateY(8px)",
                        transition: prefersReduced ? "none" : `all ${motionConfig.base}ms ease-out ${staggerDelay}ms`,
                      }}
                    >
                      <button
                        onClick={() => setActiveStep(isActive ? null : step.number)}
                        className="w-full flex flex-col items-center transition-all duration-300"
                      >
                        {/* Step number circle - RED */}
                        <div
                          className={`relative mb-4 h-12 w-12 rounded-full bg-[#e7000b] flex items-center justify-center transition-all duration-300 transform ${
                            isActive ? "scale-125 shadow-lg shadow-red-600" : "hover:scale-110"
                          }`}
                        >
                          <span className="text-sm font-bold text-white">
                            {step.number}
                          </span>
                        </div>

                        {/* Step title */}
                        <h3 className={`font-display text-sm font-semibold text-center transition-colors duration-300 ${
                          isActive ? "text-[#e7000b]" : "text-white group-hover:text-[#e7000b]"
                        }`}>
                          {step.title}
                        </h3>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Mobile view - Vertical accordion */}
          <div className="lg:hidden space-y-3">
            {STEPS.map((step, index) => {
              const isActive = activeStep === step.number;
              const staggerDelay = index * 80;

              return (
                <div
                  key={step.number}
                  style={{
                    opacity: isInView && !prefersReduced ? 1 : 0,
                    transform: isInView && !prefersReduced ? "translateX(0)" : "translateX(-12px)",
                    transition: prefersReduced ? "none" : `all ${motionConfig.base}ms ease-out ${staggerDelay}ms`,
                  }}
                >
                  <button
                    onClick={() => setActiveStep(isActive ? null : step.number)}
                    className="w-full group"
                  >
                    <div className={`relative overflow-hidden rounded-lg border transition-all duration-300 ${
                      isActive
                        ? "border-[#e7000b] bg-[#e7000b]/10"
                        : "border-white/20 bg-black hover:border-[#e7000b]/50"
                    }`}>
                      <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-[#e7000b] flex items-center justify-center flex-shrink-0">
                            <span className="font-bold text-white text-sm">{step.number}</span>
                          </div>
                          <h3 className="font-display font-semibold text-white text-sm text-left">
                            {step.title}
                          </h3>
                        </div>
                        <div className={`text-[#e7000b] transition-transform duration-300 ${isActive ? "rotate-180" : ""}`}>
                          ▼
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex justify-start">
          <Button onClick={openWalkthrough} className="bg-[#e7000b] hover:bg-red-700 text-white px-8">
            Request a Platform Walkthrough
          </Button>
        </div>
      </div>
    </section>
  );
}

