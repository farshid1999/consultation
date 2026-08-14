"use client";

import { forwardRef, useId, useState } from "react";
import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import FieldWrapper, { describedBy } from "./FieldWrapper";
import { controlClasses } from "./styles";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  wrapperClassName?: string;
  /** Shows a live "used / max" counter in the label row. Pass maxLength to enable. */
  showCounter?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    id,
    label,
    error,
    helperText,
    required,
    wrapperClassName,
    className,
    disabled,
    maxLength,
    showCounter,
    onChange,
    defaultValue,
    ...props
  },
  ref
) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const [length, setLength] = useState(
    typeof defaultValue === "string" ? defaultValue.length : 0
  );

  return (
    <FieldWrapper
      id={fieldId}
      label={label}
      required={required}
      error={error}
      helperText={helperText}
      className={wrapperClassName}
      labelExtra={
        showCounter && maxLength ? (
          <span className="text-[0.65rem] text-cream/35">
            {length} / {maxLength}
          </span>
        ) : undefined
      }
    >
      <textarea
        ref={ref}
        id={fieldId}
        disabled={disabled}
        required={required}
        maxLength={maxLength}
        defaultValue={defaultValue}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy(fieldId, error, helperText)}
        onChange={(e) => {
          setLength(e.target.value.length);
          onChange?.(e);
        }}
        className={cn(
          controlClasses({ hasError: Boolean(error), disabled }),
          "min-h-[120px] resize-y leading-relaxed",
          className
        )}
        {...props}
      />
    </FieldWrapper>
  );
});

export default Textarea;
