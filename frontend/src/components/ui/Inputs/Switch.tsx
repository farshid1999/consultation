"use client";

import { forwardRef, useId } from "react";
import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: string;
  description?: string;
  wrapperClassName?: string;
}

/**
 * A themed boolean toggle for settings-style rows ("یادآوری جلسات فعال باشد؟").
 * Register-compatible like Checkbox; use for anything that isn't a form
 * "field" so much as an on/off preference.
 */
const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { id, label, description, wrapperClassName, className, disabled, ...props },
  ref
) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;

  return (
    <div className={cn("flex items-center justify-between gap-4", wrapperClassName)}>
      {(label || description) && (
        <div>
          {label && (
            <label htmlFor={fieldId} className="block text-sm font-medium text-cream/80">
              {label}
            </label>
          )}
          {description && <p className="mt-0.5 text-xs text-cream/45">{description}</p>}
        </div>
      )}

      <span className="relative inline-flex h-6 w-11 shrink-0 items-center">
        <input
          ref={ref}
          id={fieldId}
          type="checkbox"
          disabled={disabled}
          className={cn("peer absolute inset-0 h-full w-full cursor-pointer opacity-0", className)}
          {...props}
        />
        <span
          aria-hidden="true"
          className={cn(
            "h-6 w-11 rounded-full bg-cream/15 transition-colors duration-200",
            "peer-checked:bg-gold",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-gold/50 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-deep",
            disabled && "cursor-not-allowed opacity-40"
          )}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-[3px] h-[18px] w-[18px] rounded-full bg-cream shadow-sm transition-transform duration-200 peer-checked:-translate-x-[calc(100%+2px)]"
        />
      </span>
    </div>
  );
});

export default Switch;
