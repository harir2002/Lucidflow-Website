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
        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {CARDS.map((card, index) => (
            <ScrollReveal key={card.cta} delay={index * motionConfig.staggerFast}>
              <button
                type="button"
                className="group relative overflow-hidden rounded-[6px] border border-white/12 bg-dark-surface p-7 text-left transition-all duration-200 hover:-translate-y-1 hover:border-red-border hover:shadow-lg sm:p-9"
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
                {/* Animated top border line */}
                <span
                  className="absolute inset-x-0 top-0 h-px bg-transparent transition-all duration-300 group-hover:h-0.5 group-hover:bg-crimson"
                  aria-hidden
                />

                {/* Animated left border line */}
                <span
                  className="absolute inset-y-0 left-0 w-px bg-transparent transition-all duration-300 group-hover:w-0.5 group-hover:bg-crimson"
                  aria-hidden
                />

                <h3 className="font-display max-w-md text-xl font-semibold tracking-tight text-light-text sm:text-[1.65rem] sm:leading-snug">
                  {card.title}
                </h3>
                <p className="mt-4 max-w-md text-sm leading-7 text-muted-grey sm:text-base">
                  {card.text}
                </p>
                <span className="mt-8 inline-flex min-h-11 items-center text-sm font-semibold text-light-text transition-colors duration-200 group-hover:text-crimson">
                  {card.cta}
                </span>
              </button>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
