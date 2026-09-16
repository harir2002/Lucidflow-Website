/**
 * AI Automation Section
 * 
 * Highlights LucidFlow as an AI-Based Automation Dark Pattern Finder
 */

import { Zap, Brain, Gauge } from "lucide-react";

export function AIAutomationSection() {
  return (
    <section className="relative w-full bg-near-black py-16 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-6 lg:px-12 xl:px-[72px]">
        {/* Section Header */}
        <div className="mb-12 text-center lg:mb-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60 sm:text-xs">
            POWERED BY AI & AUTOMATION
          </p>
          <h2 className="font-display mt-4 text-[clamp(36px,6vw,48px)] font-bold leading-[0.96] tracking-[-0.04em] text-white sm:mt-6">
            AI-Based Automation
            <br />
            Dark Pattern Finder
          </h2>
          <p className="mt-5 mx-auto max-w-[600px] text-lg leading-[1.5] text-white/80 sm:text-xl">
            Intelligent detection and automated monitoring of dark patterns in digital journeys for insurance and banking.
          </p>
        </div>

        {/* Three Feature Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:gap-8">
          {/* Card 1: AI Detection */}
          <div className="group rounded-lg border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:border-crimson/50 hover:bg-white/10 sm:p-8">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-crimson/10">
              <Brain className="h-6 w-6 text-crimson" />
            </div>
            <h3 className="text-lg font-semibold text-white">AI Detection</h3>
            <p className="mt-3 text-sm leading-[1.6] text-white/70">
              Machine learning models identify dark patterns with precision, catching behavioral nudges and manipulative design patterns automatically.
            </p>
          </div>

          {/* Card 2: Automated Monitoring */}
          <div className="group rounded-lg border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:border-crimson/50 hover:bg-white/10 sm:p-8">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-crimson/10">
              <Zap className="h-6 w-6 text-crimson" />
            </div>
            <h3 className="text-lg font-semibold text-white">Continuous Automation</h3>
            <p className="mt-3 text-sm leading-[1.6] text-white/70">
              Automated workflows monitor digital journeys 24/7, flagging risks in real-time without manual intervention or delays.
            </p>
          </div>

          {/* Card 3: Instant Insights */}
          <div className="group rounded-lg border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:border-crimson/50 hover:bg-white/10 sm:p-8">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-crimson/10">
              <Gauge className="h-6 w-6 text-crimson" />
            </div>
            <h3 className="text-lg font-semibold text-white">Instant Insights</h3>
            <p className="mt-3 text-sm leading-[1.6] text-white/70">
              Get actionable recommendations instantly. Automated analysis translates complex patterns into clear, compliance-ready reports.
            </p>
          </div>
        </div>

        {/* Bottom Highlight */}
        <div className="mt-12 rounded-lg border border-crimson/30 bg-crimson/5 p-6 text-center lg:mt-16 sm:p-8">
          <p className="text-base font-semibold text-white sm:text-lg">
            <span className="text-crimson">Identify</span> dark patterns with AI precision, 
            <span className="text-crimson"> Automate</span> compliance workflows, and 
            <span className="text-crimson"> Assure</span> regulatory confidence.
          </p>
        </div>
      </div>
    </section>
  );
}
