import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export default function GlassCard({ children, className, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-cream/10 bg-cream/[0.06] shadow-glass backdrop-blur-xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
