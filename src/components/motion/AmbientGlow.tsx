import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

interface AmbientGlowProps {
  color?: "crimson" | "white" | "subtle";
  intensity?: "low" | "medium" | "high";
  size?: "small" | "medium" | "large";
  className?: string;
}

/**
 * AmbientGlow: Subtle pulsing radial glow effect
 * Non-interactive decorative element for depth
 */
export function AmbientGlow({
  color = "subtle",
  intensity = "low",
  size = "large",
  className = "",
}: AmbientGlowProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = prefersReducedMotion();

  useEffect(() => {
    if (prefersReduced || !ref.current) return;

    // Trigger animation after mount
    ref.current.setAttribute("data-active", "true");
  }, [prefersReduced]);

  const colorMap = {
    crimson: "rgb(231, 0, 11)",
    white: "rgb(255, 255, 255)",
    subtle: "rgb(100, 100, 100)",
  };

  const sizeMap = {
    small: "200px",
    medium: "400px",
    large: "600px",
  };

  const opacityMap = {
    low: "0.08",
    medium: "0.15",
    high: "0.25",
  };

  return (
    <div
      ref={ref}
      className={`pointer-events-none absolute rounded-full blur-3xl ${className}`}
      aria-hidden="true"
      style={
        prefersReduced
          ? { opacity: 0 }
          : {
              width: sizeMap[size],
              height: sizeMap[size],
              background: `radial-gradient(circle, ${colorMap[color]}, transparent)`,
              opacity: opacityMap[intensity],
              animation: prefersReduced
                ? "none"
                : `ambientGlow 4s ease-in-out infinite`,
            }
      }
    />
  );
}
