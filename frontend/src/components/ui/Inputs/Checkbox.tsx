"use client";

import { forwardRef, useId } from "react";
import type { InputHTMLAttributes } from "react";
import { FiCheck } from "react-icons/fi";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: string;
  error?: string;
  wrapperClassName?: string;
}

/**
 * A fully custom-styled checkbox (the native checkbox is visually hidden
 * but stays in the DOM for correct semantics, focus and register()
 * compatibility). Works as a plain checkbox or, combined in a list, as a
 * "select several" group without the dropdown chrome of MultiSelect.
 */
const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { id, label, error, wrapperClassName, className, disabled, ...props },
  ref
) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;

  return (
    <div className={cn("w-full", wrapperClassName)}>
      <label
        htmlFor={fieldId}
        className={cn(
          "flex cursor-pointer items-center gap-2.5 text-sm text-cream/75",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        <span className="relative flex h-5 w-5 shrink-0 items-center justify-center">
          <input
            ref={ref}
            id={fieldId}
            type="checkbox"
            disabled={disabled}
            aria-invalid={Boolean(error)}
            className={cn("peer absolute inset-0 h-full w-full cursor-pointer opacity-0", className)}
            {...props}
          />
          <span
            aria-hidden="true"
            className={cn(
              "flex h-5 w-5 items-center justify-center rounded-md border transition-colors duration-150",
              "border-cream/25 peer-checked:border-gold peer-checked:bg-gold",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-gold/50 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-deep",
              error && "border-red-400/50"
            )}
          >
            <FiCheck className="text-xs text-deep opacity-0 transition-opacity duration-150 peer-checked:opacity-100" />
          </span>
        </span>
        {label}
      </label>
      {error && (
        <p role="alert" className="mt-1 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
});

export default Checkbox;
