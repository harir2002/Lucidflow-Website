import { useState } from "react";

type LogoProps = {
  className?: string;
  compact?: boolean;
};

export function Logo({ className = "", compact = false }: LogoProps) {
  const [failed, setFailed] = useState(false);

  if (!failed) {
    return (
      <img
        src="/lucidflow-logo.png"
        alt="LucidFlow by SBA Info Solutions"
        width={compact ? 240 : 300}
        height={compact ? 60 : 72}
        className={`h-[48px] w-auto max-w-[240px] object-contain object-left sm:h-[56px] lg:h-[70px] lg:max-w-[300px] ${className}`}
        loading="eager"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <span className={`block leading-tight ${className}`}>
      {/* Fallback text logo if image fails to load */}
      <span className="block text-[16px] font-bold tracking-[0.18em] text-white sm:text-lg">
        LUCIDFLOW
      </span>
      <span className="mt-0.5 block text-[10px] font-medium tracking-[0.16em] text-muted-grey">
        BY SBA INFO SOLUTIONS
      </span>
    </span>
  );
}
