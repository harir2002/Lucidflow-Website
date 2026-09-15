import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
  children: ReactNode;
};

const variants = {
  primary:
    "bg-crimson text-white hover:bg-[#c40009] hover:-translate-y-px hover:shadow-lift",
  secondary:
    "border border-white bg-near-black text-white hover:border-crimson hover:-translate-y-px",
  ghost: "bg-transparent text-white hover:bg-white/5",
};

const sizes = {
  sm: "min-h-11 px-4 text-sm",
  md: "min-h-12 px-5 text-sm sm:min-h-[52px] sm:px-6",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-sm font-semibold tracking-tight transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
