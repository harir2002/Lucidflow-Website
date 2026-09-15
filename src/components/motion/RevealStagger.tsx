import { ReactNode, Children } from "react";
import { ScrollReveal } from "./ScrollReveal";
import { motionConfig } from "@/lib/motion";

interface RevealStaggerProps {
  children: ReactNode;
  interval?: number;
  className?: string;
}

/**
 * RevealStagger: Staggered scroll reveal for multiple children
 * Each child is revealed sequentially with a set interval
 */
export function RevealStagger({
  children,
  interval = motionConfig.staggerBase,
  className = "",
}: RevealStaggerProps) {
  return (
    <div className={className}>
      {Children.map(children, (child, index) => (
        <ScrollReveal key={index} delay={index * interval}>
          {child}
        </ScrollReveal>
      ))}
    </div>
  );
}
