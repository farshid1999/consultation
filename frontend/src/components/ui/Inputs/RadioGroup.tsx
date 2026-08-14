"use client";

import { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";
import FieldWrapper, { describedBy } from "./FieldWrapper";

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  id?: string;
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  wrapperClassName?: string;
  name: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  /** "list" stacks options vertically; "row" lays simple pill-style options inline. */
  layout?: "list" | "row";
}

/**
 * A themed, card-style radio group (not bare native radios) — each option
 * is a clickable, keyboard-navigable card that highlights in gold when
 * selected. Fully controlled, so it plugs into react-hook-form via
 * `Controller` the same way MultiSelect does.
 */
const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup(
  {
    id,
    label,
    error,
    helperText,
    required,
    wrapperClassName,
    name,
    options,
    value,
    onChange,
    onBlur,
    disabled,
    layout = "list",
  },
  ref
) {
  const generatedId = useId();
  const groupId = id ?? generatedId;

  return (
    <FieldWrapper
      id={groupId}
      label={label}
      required={required}
      error={error}
      helperText={helperText}
      className={wrapperClassName}
    >
      <div
        ref={ref}
        role="radiogroup"
        aria-labelledby={label ? undefined : undefined}
        aria-describedby={describedBy(groupId, error, helperText)}
        onBlur={onBlur}
        className={cn(
          "flex gap-2.5",
          layout === "list" ? "flex-col" : "flex-wrap"
        )}
      >
        {options.map((option) => {
          const optionId = `${groupId}-${option.value}`;
          const isSelected = value === option.value;
          const isDisabled = disabled || option.disabled;
          return (
            <label
              key={option.value}
              htmlFor={optionId}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 text-sm transition-colors duration-150",
                layout === "row" && "items-center",
                isSelected
                  ? "border-gold/60 bg-gold/10 text-cream"
                  : "border-cream/12 text-cream/70 hover:border-cream/25",
                isDisabled && "cursor-not-allowed opacity-40"
              )}
            >
              <input
                id={optionId}
                type="radio"
                name={name}
                value={option.value}
                checked={isSelected}
                disabled={isDisabled}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              <span
                aria-hidden="true"
                className={cn(
                  "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors duration-150",
                  isSelected ? "border-gold" : "border-cream/30"
                )}
              >
                {isSelected && <span className="h-2 w-2 rounded-full bg-gold" />}
              </span>
              <span>
                <span className="block font-medium">{option.label}</span>
                {option.description && (
                  <span className="mt-0.5 block text-xs text-cream/45">{option.description}</span>
                )}
              </span>
            </label>
          );
        })}
      </div>
    </FieldWrapper>
  );
});

export default RadioGroup;
