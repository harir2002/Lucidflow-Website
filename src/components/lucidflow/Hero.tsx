import { Shield } from "lucide-react";
import { Button } from "./Button";
import { useEnquiry } from "./EnquiryProvider";
import { trackCtaClick } from "@/hooks/useAnalytics";
import { useState, useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

const HERO_IMAGE = "/images/lucidflow-13-dark-patterns-hero.png";
const HERO_ALT =
  "Abstract LucidFlow visualization of digital journey monitoring and potential dark-pattern risk signals.";

export function Hero() {
  const { openEnquiry } = useEnquiry();
  const [imageFailed, setImageFailed] = useState(false);
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const imageRef = useRef<HTMLImageElement>(null);

  const prefersReduced = prefersReducedMotion();

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Parallax effect on scroll and cursor movement
  useEffect(() => {
    if (prefersReduced || !isDesktop || !imageRef.current) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = imageRef.current?.parentElement?.offsetHeight || 600;
      if (scrollY < heroHeight) {
        const offset = scrollY * 0.03; // Subtle parallax
        setParallaxOffset(offset);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!imageRef.current) return;
      const rect = imageRef.current.getBoundingClientRect();
      if (rect.top > window.innerHeight) return;

      const x = (e.clientX / window.innerWidth - 0.5) * 10;
      const y = (e.clientY / window.innerHeight - 0.5) * 10;
      
      if (imageRef.current) {
        imageRef.current.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [prefersReduced, isDesktop]);

  const openScan = () => {
    trackCtaClick({
      ctaLabel: "Request a Journey Assurance Scan",
      ctaLocation: "hero",
      preferredEngagement: "scan",
    });
    openEnquiry({
      preferredEngagement: "scan",
      sourceSection: "hero",
      ctaLabel: "Request a Journey Assurance Scan",
      heading: "Request a Journey Assurance Scan",
    });
  };

  const seeHowItWorks = () => {
    trackCtaClick({
      ctaLabel: "See How LucidFlow Works",
      ctaLocation: "hero",
    });
    // Scroll to video section
    setTimeout(() => {
      document.getElementById("video")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <section id="hero" className="relative w-full overflow-hidden bg-[#050505] min-h-[600px] sm:min-h-[700px] lg:min-h-[600px]">
      {/* Background Image with parallax */}
      {!imageFailed ? (
        <img
          ref={imageRef}
          src={HERO_IMAGE}
          alt={HERO_ALT}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-75"
          style={{
            transform: prefersReduced ? "none" : `translateY(${parallaxOffset * -1}px)`,
          }}
          onError={() => setImageFailed(true)}
        />
      ) : null}

      {/* Decorative journey line - subtle curved path */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden="true"
        viewBox="0 0 1440 600"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <style>{`
            @keyframes journeyPulse {
              0%, 100% { opacity: 0.15; }
              50% { opacity: 0.3; }
            }
          `}</style>
        </defs>
        {/* Curved journey line in lower right */}
        <path
          d="M 800 400 Q 950 300, 1200 250"
          stroke="rgba(231, 0, 11, 0.2)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          style={prefersReduced ? {} : { animation: "journeyPulse 3s ease-in-out infinite" }}
        />
      </svg>

      {/* Risk node indicators */}
      {!prefersReduced && (
        <>
          <div
            className="pointer-events-none absolute"
            style={{ right: "12%", top: "35%", width: "32px", height: "32px" }}
            aria-hidden="true"
          >
            {/* Pulsing ring */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 32 32"
              preserveAspectRatio="xMidYMid meet"
            >
              <circle
                cx="16"
                cy="16"
                r="14"
                fill="none"
                stroke="rgba(231, 0, 11, 0.4)"
                strokeWidth="1.5"
                style={{
                  animation: "pulseGlow 3s ease-in-out infinite",
                }}
              />
            </svg>
            {/* Center dot */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                animation: "fastPulse 2.5s ease-in-out infinite",
              }}
            >
              <div className="w-2 h-2 rounded-full bg-[#e7000b]" />
            </div>
          </div>

          <div
            className="pointer-events-none absolute"
            style={{ right: "28%", top: "25%", width: "24px", height: "24px" }}
            aria-hidden="true"
          >
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 24 24"
              preserveAspectRatio="xMidYMid meet"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                fill="none"
                stroke="rgba(231, 0, 11, 0.3)"
                strokeWidth="1"
                style={{
                  animation: "pulseGlow 3.5s ease-in-out infinite 0.3s",
                }}
              />
            </svg>
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                animation: "fastPulse 2.8s ease-in-out infinite 0.2s",
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#e7000b]" />
            </div>
          </div>

          <div
            className="pointer-events-none absolute"
            style={{ right: "18%", top: "55%", width: "28px", height: "28px" }}
            aria-hidden="true"
          >
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 28 28"
              preserveAspectRatio="xMidYMid meet"
            >
              <circle
                cx="14"
                cy="14"
                r="12"
                fill="none"
                stroke="rgba(231, 0, 11, 0.35)"
                strokeWidth="1.2"
                style={{
                  animation: "pulseGlow 2.8s ease-in-out infinite 0.5s",
                }}
              />
            </svg>
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                animation: "fastPulse 2.6s ease-in-out infinite 0.3s",
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#e7000b]" />
            </div>
          </div>
        </>
      )}

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/70 to-transparent" aria-hidden />
      
      {/* Bottom gradient fade */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#050505] to-transparent" aria-hidden />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-5 py-16 sm:px-6 sm:py-20 lg:px-12 lg:py-28 xl:px-[72px]">
        <div className="max-w-2xl">
          <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/80 sm:text-xs">
            <span className="h-px w-8 bg-crimson" aria-hidden />
            LUCIDFLOW™ BY SBA INFO SOLUTIONS
          </p>
          <h1 className="mt-5 text-[clamp(42px,8vw,52px)] font-bold leading-[0.96] tracking-[-0.04em] text-white sm:mt-6 sm:text-[3.75rem] lg:text-[clamp(3.4rem,4.6vw,5.2rem)]">
            From Assessment
            <br />
            to Assurance.
          </h1>
          <p className="mt-5 max-w-[540px] text-lg leading-[1.5] text-white sm:text-xl lg:text-[20px]">
            Continuous dark-pattern monitoring for insurance and banking digital journeys.
          </p>
          <p className="mt-4 text-[17px] font-semibold text-white sm:text-[19px]">
            See the journey. Fix the risk. Keep it clean.
          </p>
          <div className="mt-6 flex flex-col gap-3 min-[480px]:flex-row min-[480px]:gap-4">
            <Button 
              onClick={openScan} 
              className="min-h-[44px] rounded-[6px] sm:min-h-[52px] sm:px-7 relative overflow-hidden group"
            >
              <span className="relative z-10">Request a Journey Assurance Scan</span>
              {/* Hover sheen effect */}
              <div className="absolute inset-0 -top-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              </div>
            </Button>
            <Button
              variant="secondary"
              onClick={seeHowItWorks}
              className="min-h-[44px] rounded-[6px] border-white/25 bg-transparent text-white hover:border-white/50 hover:bg-white/5 sm:min-h-[52px] sm:px-7"
            >
              See How LucidFlow Works
            </Button>
          </div>
          <p className="mt-6 flex max-w-[520px] items-start gap-2.5 text-[0.8125rem] leading-[1.6] text-white sm:text-sm">
            <Shield className="mt-0.5 h-4 w-4 shrink-0 text-crimson" aria-hidden />
            Built to complement compliance, legal and advisory teams, not replace final
            regulatory interpretation.
          </p>
        </div>
      </div>
    </section>
  );
}
