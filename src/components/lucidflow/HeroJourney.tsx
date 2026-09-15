import { useReducedMotion } from "framer-motion";

export function HeroJourney() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative min-h-[480px] w-full lg:min-h-[560px]" aria-hidden>
      {/* Ambient glow effects */}
      <div className="pointer-events-none absolute left-[12%] top-[-8%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(231,0,11,0.095)_0%,transparent_70%)] blur-2xl" />
      <div className="pointer-events-none absolute right-[6%] top-[22%] h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.032)_0%,transparent_74%)] blur-xl" />

      {/* Main journey path visualization */}
      <svg
        viewBox="0 0 700 320"
        className="absolute inset-0 h-full w-full overflow-visible"
        fill="none"
      >
        {/* Primary flowing path */}
        <path
          d="M-60 240 Q 50 240, 100 180 T 220 160 Q 280 150, 340 100 T 480 140 Q 540 160, 600 100 T 760 120"
          stroke="rgba(247,247,247,0.18)"
          strokeWidth="1.5"
          fill="none"
        />
        {/* Animated risk indicator path */}
        <path
          d="M-60 240 Q 50 240, 100 180 T 220 160 Q 280 150, 340 100 T 480 140 Q 540 160, 600 100 T 760 120"
          stroke="#E7000B"
          strokeWidth="1.5"
          strokeDasharray="10 28"
          className={reduceMotion ? "" : "animate-lucid-dash"}
          opacity="0.7"
          fill="none"
        />

        {/* Secondary subtle path */}
        <path
          d="M-40 160 Q 80 155, 140 110 T 280 120 Q 360 125, 420 80 T 560 110 Q 640 125, 720 85"
          stroke="rgba(247,247,247,0.08)"
          strokeWidth="1"
          fill="none"
        />

        {/* Journey stage nodes */}
        {/* Start node */}
        <circle cx="100" cy="180" r="4" fill="#F7F7F7" opacity="0.9" />
        
        {/* Risk nodes with glow */}
        <circle cx="220" cy="160" r="18" fill="rgba(231,0,11,0.14)" className={reduceMotion ? "" : "animate-lucid-glow"} />
        <circle cx="220" cy="160" r="6" fill="#E7000B" />
        
        <circle cx="340" cy="100" r="20" fill="rgba(231,0,11,0.16)" className={reduceMotion ? "" : "animate-lucid-glow"} />
        <circle cx="340" cy="100" r="6.5" fill="#E7000B" />
        
        {/* Standard nodes */}
        <circle cx="480" cy="140" r="4" fill="#F7F7F7" opacity="0.9" />
        <circle cx="600" cy="100" r="4" fill="#F7F7F7" opacity="0.9" />
      </svg>

      {/* Floating abstract cards */}
      <div
        className={`absolute left-8 top-[56%] h-[92px] w-[176px] border border-white/10 bg-elevated/85 shadow-float backdrop-blur-sm ${
          reduceMotion ? "" : "animate-lucid-float"
        }`}
      />
      <div
        className={`absolute right-12 top-12 h-[78px] w-[156px] border border-white/10 bg-elevated/85 shadow-float backdrop-blur-sm ${
          reduceMotion ? "" : "animate-lucid-float-slow"
        }`}
        style={{ animationDelay: "1.2s" }}
      />
      <div
        className={`absolute bottom-8 right-20 h-[68px] w-[138px] border border-red-border/75 bg-[#1a0606]/90 shadow-panel backdrop-blur-sm ${
          reduceMotion ? "" : "animate-lucid-float"
        }`}
        style={{ animationDelay: "2.4s" }}
      />
    </div>
  );
}

export function HeroJourneyMobile() {
  const reduceMotion = useReducedMotion();
  const nodes = [false, true, true, false, false];

  return (
    <div className="flex items-center justify-between px-2" aria-hidden>
      {nodes.map((risk, index) => (
        <span key={index} className="relative flex flex-1 items-center">
          <span
            className={`relative z-10 h-2.5 w-2.5 rounded-full ${
              risk ? "bg-crimson" : "bg-light-text"
            } ${risk && !reduceMotion ? "animate-lucid-glow" : ""}`}
          />
          {index < nodes.length - 1 ? (
            <span className="h-px flex-1 bg-white/20" />
          ) : null}
        </span>
      ))}
    </div>
  );
}
