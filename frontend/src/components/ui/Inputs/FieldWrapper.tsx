import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface FieldWrapperProps {
  /** Unique id — must match the control's id/htmlFor pairing. */
  id: string;
  label?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
  children: ReactNode;
  /** Right-aligned inline element next to the label, e.g. a "چند تا مونده" counter. */
  labelExtra?: ReactNode;
}

/**
 * Wraps any form control with a consistent label / helper-text / error-text
 * treatment matching the site's theme. Every field component in this folder
 * (Input, Textarea, Select, MultiSelect, Checkbox, RadioGroup) is built on
 * top of this so spacing, typography and error styling never drift between
 * them.
 */
export default function FieldWrapper({
  id,
  label,
  required,
  error,
  helperText,
  className,
  children,
  labelExtra,
}: FieldWrapperProps) {
  const helperId = `${id}-helper`;
  const errorId = `${id}-error`;

  return (
    <div className={cn("w-full text-right", className)}>
      {label && (
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <label htmlFor={id} className="block text-xs font-medium text-cream/60">
            {label}
            {required && (
              <span className="mr-1 text-gold" aria-hidden="true">
                *
              </span>
            )}
          </label>
          {labelExtra}
        </div>
      )}

      {children}

      <div className="min-h-[1.1rem] mt-1.5">
        {error ? (
          <p id={errorId} role="alert" className="text-xs text-red-400">
            {error}
          </p>
        ) : helperText ? (
          <p id={helperId} className="text-xs text-cream/40">
            {helperText}
          </p>
        ) : null}
      </div>
    </div>
  );
}

/**
 * Builds the `aria-describedby` value for a control given its id and
 * whether it currently has an error/helper text — keeps that logic
 * identical across every field type.
 */
export function describedBy(id: string, error?: string, helperText?: string): string | undefined {
  if (error) return `${id}-error`;
  if (helperText) return `${id}-helper`;
  return undefined;
}
