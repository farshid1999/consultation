"use client";

import { forwardRef, useId, useState } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { cn } from "@/lib/utils";
import FieldWrapper, { describedBy } from "./FieldWrapper";
import { controlClasses } from "./styles";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  helperText?: string;
  /** Icon rendered on the leading (right, in RTL) edge of the field. */
  leftIcon?: ReactNode;
  /** Icon rendered on the trailing (left, in RTL) edge of the field. */
  rightIcon?: ReactNode;
  wrapperClassName?: string;
  /** Visual size of the control. Defaults to "md". */
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "py-2 text-xs",
  md: "py-3 text-sm",
  lg: "py-4 text-base",
};

/**
 * The single, reusable text-style input for the whole site — covers text,
 * email, tel, number, url, search and password (with a built-in visibility
 * toggle). Every visual state (default / hover / focus / error / disabled)
 * is themed to match the deep-teal / cream / gold palette out of the box,
 * so callers only ever pass semantic props.
 *
 * Fully compatible with react-hook-form's `register()` via spread, since it
 * forwards its ref like a native <input>:
 *
 *   <Input label="ایمیل" type="email" {...register("email")} error={errors.email?.message} />
 */
const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    id,
    label,
    error,
    helperText,
    required,
    leftIcon,
    rightIcon,
    wrapperClassName,
    className,
    size = "md",
    type = "text",
    disabled,
    ...props
  },
  ref
) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const resolvedType = isPassword ? (showPassword ? "text" : "password") : type;

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
        {leftIcon && (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-cream/40">
            {leftIcon}
          </span>
        )}

        <input
          ref={ref}
          id={fieldId}
          type={resolvedType}
          disabled={disabled}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy(fieldId, error, helperText)}
          className={cn(
            controlClasses({ hasError: Boolean(error), disabled }),
            sizeClasses[size],
            leftIcon && "pr-11",
            (rightIcon || isPassword) && "pl-11",
            className
          )}
          {...props}
        />

        {isPassword ? (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            tabIndex={-1}
            aria-label={showPassword ? "پنهان کردن رمز عبور" : "نمایش رمز عبور"}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cream/40 transition-colors duration-200 hover:text-gold"
          >
            {showPassword ? <FiEyeOff aria-hidden="true" /> : <FiEye aria-hidden="true" />}
          </button>
        ) : (
          rightIcon && (
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-cream/40">
              {rightIcon}
            </span>
          )
        )}
      </div>
    </FieldWrapper>
  );
});

export default Input;
