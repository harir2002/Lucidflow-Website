import { Button } from "./Button";
import { useEnquiry } from "./EnquiryProvider";
import { trackCtaClick } from "@/hooks/useAnalytics";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { motionConfig } from "@/lib/motion";

const PLANS = [
  {
    title: "One-Time Project - baseline assessment, report, verification and advisory.",
  },
  {
    title:
      "Annual SaaS, SBA Hosted - continuous self-service monitoring, dashboard and one baseline validation cycle.",
  },
  {
    title:
      "Annual Enterprise, Customer Hosted - customer environment deployment for private-cloud/data-residency needs.",
  },
];

export function EngagementModels() {
  const { openEnquiry } = useEnquiry();

  const openAdvisory = () => {
    trackCtaClick({
      ctaLabel: "Discuss the Right Model",
      ctaLocation: "models",
      preferredEngagement: "advisory",
    });
    openEnquiry({
      preferredEngagement: "advisory",
      sourceSection: "models",
      heading: "Discuss the Right Model",
    });
  };

  return (
    <section id="models" className="section-space">
      <div className="container-lf">
        <h2 className="section-heading">Choose the operating model that fits your maturity.</h2>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {PLANS.map((plan, index) => (
            <ScrollReveal key={plan.title} delay={index * motionConfig.staggerBase}>
              <button
                type="button"
                className={`relative overflow-hidden border bg-dark-surface p-7 h-[160px] flex items-center transition-all duration-300 cursor-pointer group border-white/10 hover:border-crimson hover:shadow-lg hover:shadow-red-600/20`}
              >
                <p className="text-base leading-7 text-light-text text-left">
                  {plan.title}
                </p>
              </button>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={PLANS.length * motionConfig.staggerBase + 100}>
          <div className="mt-6 flex flex-col gap-5 border border-white/10 bg-elevated px-6 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div>
              <h3 className="font-display text-xl font-semibold text-light-text">Professional Services</h3>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-grey">
                governance reporting, developer/CI-CD integration, remediation advisory, managed
                governance/certification.
              </p>
            </div>
            <Button onClick={openAdvisory}>Discuss the Right Model</Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
