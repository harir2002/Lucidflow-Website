import { useId, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { prefersReducedMotion } from "@/lib/motion";

const FAQS = [
  {
    question: "Does LucidFlow replace legal advice?",
    answer:
      "No. LucidFlow helps teams monitor, document, prioritise and revalidate potential journey risks. Legal, compliance and advisory professionals continue to provide final regulatory interpretation and advice.",
  },
  {
    question: "Can it certify compliance?",
    answer:
      "LucidFlow provides evidence-led monitoring, potential-risk detection and corrective-action workflows. It does not independently provide legal opinions or regulatory certification.",
  },
  {
    question: "What does the scan cover?",
    answer:
      "A Journey Assurance Scan covers one agreed critical journey and up to two representative pages or screens. It includes potential findings, screenshot and journey evidence, severity context, CAP templates and an SBA walkthrough.",
  },
  {
    question: "Can it work with our existing adviser?",
    answer:
      "Yes. LucidFlow is designed to complement internal teams and external legal, audit, compliance and advisory partners by operationalising monitoring and evidence collection.",
  },
  {
    question: "Can we start small?",
    answer:
      "Yes. Start with one critical journey through a Journey Assurance Scan, then decide whether a broader project or continuous monitoring model is appropriate.",
  },
  {
    question: "Is customer-hosted deployment available?",
    answer:
      "Yes. The Annual Enterprise model is intended for organisations with private-cloud, security or data-residency requirements.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const baseId = useId();
  const prefersReduced = prefersReducedMotion();

  return (
    <section id="faq" className="section-space">
      <div className="container-lf">
        <div className="mx-auto max-w-3xl divide-y divide-white/10 border-y border-white/10">
          {FAQS.map((item, index) => {
            const isOpen = openIndex === index;
            const buttonId = `${baseId}-button-${index}`;
            const panelId = `${baseId}-panel-${index}`;
            return (
              <div
                key={item.question}
                className="relative transition-colors duration-300"
              >
                {/* Red left indicator for open state */}
                <div
                  className="absolute inset-y-0 left-0 w-1 bg-crimson transition-opacity duration-300"
                  style={{ opacity: isOpen ? 1 : 0 }}
                  aria-hidden
                />

                <h2>
                  <button
                    id={buttonId}
                    type="button"
                    className="flex min-h-14 w-full items-center justify-between gap-4 py-5 pl-4 text-left transition-all duration-300 hover:bg-white/5 sm:pl-5"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                  >
                    <span className="text-base font-semibold text-light-text transition-colors duration-300 sm:text-lg">
                      {item.question}
                    </span>
                    {isOpen ? (
                      <Minus
                        className="h-5 w-5 shrink-0 text-crimson transition-transform duration-300"
                        aria-hidden
                        style={{
                          transform: prefersReduced ? "none" : "rotate(0deg)",
                        }}
                      />
                    ) : (
                      <Plus
                        className="h-5 w-5 shrink-0 text-muted-grey transition-all duration-300 group-hover:text-crimson"
                        aria-hidden
                      />
                    )}
                  </button>
                </h2>

                {/* Smooth accordion content */}
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!isOpen}
                  style={{
                    maxHeight: isOpen ? "1000px" : "0",
                    opacity: isOpen ? 1 : 0,
                    overflow: "hidden",
                    transition: prefersReduced
                      ? "none"
                      : "max-height 300ms ease-out, opacity 300ms ease-out",
                  }}
                >
                  <div className="pb-5 pl-4 sm:pl-5">
                    <p className="max-w-3xl text-sm leading-7 text-muted-grey sm:text-base">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
