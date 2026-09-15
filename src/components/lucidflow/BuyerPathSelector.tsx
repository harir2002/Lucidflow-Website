import { useEnquiry } from "./EnquiryProvider";
import { trackCtaClick } from "@/hooks/useAnalytics";
import type { BuyerStage, PreferredEngagement } from "@/lib/types";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { motionConfig } from "@/lib/motion";

const CARDS = [
  {
    title: "We are still establishing our assessment.",
    text: "Start with visibility across the journeys that matter most.",
    cta: "Start With Visibility",
    buyerStage: "still_assessing" as BuyerStage,
    preferredEngagement: "scan" as PreferredEngagement,
  },
  {
    title: "We have completed a review and need to sustain control.",
    text: "Keep releases, campaigns, add-ons and remediation on track.",
    cta: "Keep Every Release Clean",
    buyerStage: "assessment_complete" as BuyerStage,
    preferredEngagement: "annual_saas" as PreferredEngagement,
  },
];

export function BuyerPathSelector() {
  const { openEnquiry } = useEnquiry();

  return (
    <section id="buyer-path" className="section-space">
      <div className="container-lf">
        <h2 className="section-heading">Where are you today?</h2>
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {CARDS.map((card, index) => (
            <ScrollReveal key={card.cta} delay={index * motionConfig.staggerFast}>
              <button
                type="button"
                className="group relative h-full overflow-hidden rounded-lg border border-white/12 bg-gradient-to-br from-dark-surface to-[#0a0a0a] p-8 text-left transition-all duration-300 hover:-translate-y-2 hover:border-red-border hover:shadow-xl sm:p-10 flex flex-col"
                onClick={() => {
                  trackCtaClick({
                    ctaLabel: card.cta,
                    ctaLocation: "buyer-path",
                    preferredEngagement: card.preferredEngagement,
                    buyerStage: card.buyerStage,
                  });
                  openEnquiry({
                    buyerStage: card.buyerStage,
                    preferredEngagement: card.preferredEngagement,
                    sourceSection: "buyer-path",
                    ctaLabel: card.cta,
                    heading: card.cta,
                  });
                }}
              >
                {/* Animated gradient overlay on hover */}
                <div
                  className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background: "radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(231, 0, 11, 0.08) 0%, transparent 80%)",
                  }}
                  aria-hidden
                />

                {/* Animated corner accent - top left */}
                <div
                  className="absolute top-0 left-0 w-12 h-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  aria-hidden
                >
                  <div className="absolute inset-0 border-t-2 border-l-2 border-crimson" />
                </div>

                {/* Animated corner accent - bottom right */}
                <div
                  className="absolute bottom-0 right-0 w-12 h-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  aria-hidden
                >
                  <div className="absolute inset-0 border-b-2 border-r-2 border-crimson" />
                </div>

                {/* Content container with flex growth */}
                <div className="relative z-10 flex flex-col h-full">
                  <h3 className="font-display text-lg font-semibold tracking-tight text-light-text sm:text-xl leading-tight">
                    {card.title}
                  </h3>
                  <p className="mt-4 text-sm leading-6 text-muted-grey sm:text-base flex-1">
                    {card.text}
                  </p>
                  
                  {/* CTA with icon indicator - fixed at bottom */}
                  <div className="mt-8 flex items-center justify-between">
                    <span className="text-sm font-semibold text-light-text transition-colors duration-200 group-hover:text-crimson">
                      {card.cta}
                    </span>
                    <div className="h-8 w-8 rounded-full border border-white/20 flex items-center justify-center transition-all duration-300 group-hover:bg-crimson group-hover:border-crimson">
                      <svg
                        className="w-4 h-4 text-light-text transition-all duration-300 group-hover:text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </button>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
