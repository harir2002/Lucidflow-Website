import { useReducedMotion } from "framer-motion";
import { EvidenceCard } from "./EvidenceCard";

const HERO_STAGES = ["Quote", "Product", "Add-ons", "Consent", "Payment", "Renewal"] as const;
const RISK_STAGES = new Set(["Add-ons", "Consent"]);

export function ComplianceDashboard() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className="relative isolate overflow-hidden border border-white/12 bg-[#0A0A0A] shadow-panel"
      aria-hidden={false}
      aria-label="LucidFlow journey monitoring preview"
    >
      <div className="flex items-center gap-2 border-b border-white/10 bg-[#101010] px-3 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" aria-hidden />
        <p className="ml-2 truncate text-[11px] text-muted-grey">
          lucidflow / journey-assurance / quote-to-buy
        </p>
      </div>

      <div className="relative overflow-hidden p-4 sm:p-5 lg:p-6">
        <div className="pointer-events-none absolute inset-0 bg-tech-grid bg-tech-grid" aria-hidden />
        {!reduceMotion ? (
          <div
            className="scan-line animate-lucid-scan pointer-events-none absolute inset-x-0 h-24"
            aria-hidden
          />
        ) : null}

        <div className="relative">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-soft-grey">
              Customer journey
            </p>
            <span className="border border-white/10 px-2 py-1 text-[10px] uppercase tracking-wider text-muted-grey">
              Live scan
            </span>
          </div>

          <ol className="mt-5 grid grid-cols-6 gap-1.5 sm:gap-2">
            {HERO_STAGES.map((stage, index) => {
              const isRisk = RISK_STAGES.has(stage);
              return (
                <li key={stage} className="relative text-center">
                  {index < HERO_STAGES.length - 1 ? (
                    <span
                      className="absolute left-[58%] top-2.5 hidden h-px w-[84%] bg-white/15 sm:block"
                      aria-hidden
                    />
                  ) : null}
                  <span
                    className={`relative z-10 mx-auto flex h-5 w-5 items-center justify-center rounded-full border ${
                      isRisk ? "border-crimson bg-crimson/20" : "border-white/20 bg-elevated"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        isRisk
                          ? `bg-crimson ${reduceMotion ? "" : "animate-pulse"}`
                          : "bg-white/70"
                      }`}
                    />
                  </span>
                  <p className="mt-2 text-[10px] font-medium text-soft-grey sm:text-[11px]">
                    {stage}
                  </p>
                </li>
              );
            })}
          </ol>

          <div className="mt-5 h-16 overflow-hidden border border-white/10 bg-[#0C0C0C] px-3 py-2">
            <div className="flex h-full items-end gap-1.5" aria-hidden>
              {[28, 40, 22, 54, 36, 62, 31, 48, 26, 58, 44, 70].map((height, index) => (
                <span
                  key={index}
                  className="flex-1 rounded-sm"
                  style={{
                    height: `${height}%`,
                    background:
                      index === 3 || index === 7
                        ? "rgba(231,0,11,0.72)"
                        : "rgba(44,123,255,0.55)",
                  }}
                />
              ))}
            </div>
          </div>

          <div className="relative mt-5 grid gap-3 sm:grid-cols-[1.15fr_0.85fr]">
            <EvidenceCard compact />
            <article className="border border-white/12 bg-[#101010] p-3.5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-soft-grey">
                Journey Status
              </p>
              <p className="mt-2 text-sm font-semibold text-white">6 stages scanned</p>
              <p className="mt-1 text-xs text-soft-grey">2 signals require review</p>
              <p className="mt-3 text-[11px] text-muted-grey">Last scan: Today</p>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
}
