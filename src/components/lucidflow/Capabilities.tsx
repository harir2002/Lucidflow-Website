import {
  Camera,
  ClipboardCheck,
  Radar,
  RefreshCw,
  ScanLine,
  ShieldCheck,
} from "lucide-react";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { motionConfig } from "@/lib/motion";

const CAPABILITIES = [
  { title: "Scan live journeys", icon: ScanLine },
  { title: "Detect potential risk", icon: Radar },
  { title: "Capture evidence", icon: Camera },
  { title: "Create CAP templates", icon: ClipboardCheck },
  { title: "Revalidate fixes", icon: RefreshCw },
  { title: "Govern continuously", icon: ShieldCheck },
];

export function Capabilities() {
  return (
    <section id="capabilities" className="section-space">
      <div className="container-lf">
        <h2 className="section-heading">Turn potential risk into a repeatable control.</h2>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {CAPABILITIES.map((item, index) => {
            const Icon = item.icon;
            return (
              <ScrollReveal key={item.title} delay={index * motionConfig.staggerBase}>
                <article
                  className="group relative overflow-hidden border border-white/10 bg-dark-surface p-7 transition-all duration-300 hover:-translate-y-1 hover:border-red-border hover:shadow-lg"
                >
                  {/* Animated left accent line */}
                  <span
                    className="absolute inset-y-0 left-0 w-0.5 origin-top scale-y-0 bg-crimson transition-transform duration-300 group-hover:scale-y-100"
                    aria-hidden
                  />

                  {/* Animated top accent line */}
                  <span
                    className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-crimson transition-transform duration-300 group-hover:scale-x-100"
                    aria-hidden
                  />

                  {/* Icon with rotation on hover */}
                  <Icon className="h-5 w-5 text-muted-grey transition-all duration-300 group-hover:text-crimson group-hover:rotate-4 group-hover:scale-110" />

                  <h3 className="font-display mt-6 text-lg font-semibold tracking-tight text-light-text transition-colors duration-300">
                    {item.title}
                  </h3>
                </article>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
