"use client";

import { forwardRef, useId } from "react";
import type { SelectHTMLAttributes } from "react";
import { FiChevronDown } from "react-icons/fi";
import { cn } from "@/lib/utils";
import FieldWrapper, { describedBy } from "./FieldWrapper";
import { controlClasses } from "./styles";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
  wrapperClassName?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "py-2 text-xs",
  md: "py-3 text-sm",
  lg: "py-4 text-base",
};

/**
 * A native <select>, themed to match the rest of the form kit. Uses a real
 * <select> (rather than a custom listbox) so it keeps free OS-level
 * accessibility, keyboard support and mobile picker behavior — the right
 * choice whenever a single choice from a short-to-medium list is needed.
 * For choosing multiple values, use MultiSelect instead.
 */
const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    id,
    label,
    error,
    helperText,
    required,
    options,
    placeholder,
    wrapperClassName,
    className,
    disabled,
    size = "md",
    defaultValue,
    ...props
  },
  ref
) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;

  return (
    <FieldWrapper
      id={fieldId}
      label={label}
      required={required}
      error={error}
      helperText={helperText}
      className={wrapperClassName}
    >
      <div className="relative">
        <select
          ref={ref}
          id={fieldId}
          disabled={disabled}
          required={required}
          defaultValue={defaultValue ?? (placeholder ? "" : undefined)}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy(fieldId, error, helperText)}
          className={cn(
            controlClasses({ hasError: Boolean(error), disabled }),
            sizeClasses[size],
            "appearance-none pl-11 pr-4",
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled} className="bg-deep-2 text-cream">
              {option.label}
            </option>
          ))}
        </select>

        <FiChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-cream/40"
        />
      </div>
    </FieldWrapper>
  );
});

export default Select;
