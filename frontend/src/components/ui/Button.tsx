"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useMagnetic } from "@/hooks/useMagnetic";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  icon?: ReactNode;
  children: ReactNode;
}

export default function Button({
  variant = "primary",
  icon,
  children,
  className,
  ...props
}: ButtonProps) {
  const { ref, onMouseMove, onMouseLeave } = useMagnetic<HTMLButtonElement>(0.18);

  return (
    <button
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={cn(
        "group relative inline-flex items-center gap-3 rounded-full px-8 py-4 text-body font-medium transition-[transform,box-shadow] duration-300 ease-out will-change-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-deep",
        variant === "primary" &&
          "bg-gradient-to-b from-gold-soft to-gold text-deep shadow-gold hover:shadow-[0_16px_50px_-8px_rgba(201,162,77,0.6)]",
        variant === "secondary" &&
          "border border-cream/25 text-cream hover:border-gold/60 hover:text-gold",
        className
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      {icon && (
        <span className="relative z-10 transition-transform duration-300 group-hover:-translate-x-1">
          {icon}
        </span>
      )}
    </button>
  );
}
