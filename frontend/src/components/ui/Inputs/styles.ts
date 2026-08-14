import { cn } from "@/lib/utils";

/**
 * Base classes shared by every themed control (input, textarea, select
 * trigger, multiselect trigger). Kept in one place so a future palette
 * tweak only has to happen here.
 */
export function controlClasses(opts: { hasError?: boolean; disabled?: boolean; className?: string } = {}) {
  const { hasError, disabled, className } = opts;
  return cn(
    "w-full rounded-xl border bg-deep/60 px-4 py-3 text-sm text-cream transition-colors duration-200",
    "placeholder:text-cream/30",
    "focus:outline-none focus:ring-1",
    hasError
      ? "border-red-400/50 focus:border-red-400/70 focus:ring-red-400/40"
      : "border-cream/15 focus:border-gold/60 focus:ring-gold/40",
    disabled && "cursor-not-allowed opacity-50",
    className
  );
}
