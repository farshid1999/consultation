"use client";

import { forwardRef, useEffect, useId, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiCheck, FiChevronDown, FiSearch, FiX } from "react-icons/fi";
import { cn } from "@/lib/utils";
import FieldWrapper, { describedBy } from "./FieldWrapper";

export interface MultiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface MultiSelectProps {
  id?: string;
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  wrapperClassName?: string;
  className?: string;
  placeholder?: string;
  options: MultiSelectOption[];
  /** Currently selected option values. */
  value: string[];
  onChange: (value: string[]) => void;
  onBlur?: () => void;
  name?: string;
  disabled?: boolean;
  /** Shows a filter input inside the dropdown. Defaults to true. */
  searchable?: boolean;
  /** Optional cap on how many options can be selected at once. */
  maxSelected?: number;
  noResultsText?: string;
}

/**
 * A themed multi-selection control: click to open a searchable dropdown,
 * pick any number of options, each shows as a removable chip inside the
 * trigger. Built as a fully controlled component (`value` / `onChange`) so
 * it drops straight into react-hook-form via `Controller`:
 *
 *   <Controller
 *     name="sports"
 *     control={control}
 *     defaultValue={[]}
 *     render={({ field, fieldState }) => (
 *       <MultiSelect
 *         label="رشته‌های مورد علاقه"
 *         options={sportsOptions}
 *         value={field.value}
 *         onChange={field.onChange}
 *         onBlur={field.onBlur}
 *         ref={field.ref}
 *         error={fieldState.error?.message}
 *       />
 *     )}
 *   />
 */
const MultiSelect = forwardRef<HTMLButtonElement, MultiSelectProps>(function MultiSelect(
  {
    id,
    label,
    error,
    helperText,
    required,
    wrapperClassName,
    className,
    placeholder = "انتخاب کنید",
    options,
    value,
    onChange,
    onBlur,
    disabled,
    searchable = true,
    maxSelected,
    noResultsText = "موردی یافت نشد",
  },
  ref
) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;
    const q = search.trim().toLowerCase();
    return options.filter((option) => option.label.toLowerCase().includes(q));
  }, [options, search]);

  const selectedOptions = useMemo(
    () => options.filter((option) => value.includes(option.value)),
    [options, value]
  );

  const atMax = typeof maxSelected === "number" && value.length >= maxSelected;

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
        setSearch("");
        onBlur?.();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onBlur]);

  useEffect(() => {
    if (open && searchable) {
      searchInputRef.current?.focus();
    }
  }, [open, searchable]);

  const toggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      if (atMax) return;
      onChange([...value, optionValue]);
    }
  };

  const removeChip = (optionValue: string) => {
    onChange(value.filter((v) => v !== optionValue));
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " " || event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
    }
    if (event.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <FieldWrapper
      id={fieldId}
      label={label}
      required={required}
      error={error}
      helperText={helperText}
      className={wrapperClassName}
      labelExtra={
        maxSelected ? (
          <span className="text-[0.65rem] text-cream/35">
            {value.length} / {maxSelected}
          </span>
        ) : undefined
      }
    >
      <div ref={containerRef} className="relative">
        <button
          ref={ref}
          type="button"
          id={fieldId}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy(fieldId, error, helperText)}
          onClick={() => setOpen((v) => !v)}
          onKeyDown={handleTriggerKeyDown}
          className={cn(
            "flex min-h-[3.1rem] w-full flex-wrap items-center gap-2 rounded-xl border bg-deep/60 px-3.5 py-2.5 text-right text-sm transition-colors duration-200",
            "focus:outline-none focus:ring-1",
            error
              ? "border-red-400/50 focus:border-red-400/70 focus:ring-red-400/40"
              : "border-cream/15 focus:border-gold/60 focus:ring-gold/40",
            disabled && "cursor-not-allowed opacity-50",
            open && "border-gold/60 ring-1 ring-gold/40",
            className
          )}
        >
          {selectedOptions.length === 0 && (
            <span className="px-0.5 text-cream/30">{placeholder}</span>
          )}

          {selectedOptions.map((option) => (
            <span
              key={option.value}
              className="flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 py-1 pr-1 pl-2.5 text-xs text-gold"
            >
              {option.label}
              <span
                role="button"
                tabIndex={-1}
                aria-label={`حذف ${option.label}`}
                onClick={(e) => {
                  e.stopPropagation();
                  removeChip(option.value);
                }}
                className="flex h-4 w-4 items-center justify-center rounded-full text-gold/70 transition-colors hover:bg-gold/20 hover:text-gold"
              >
                <FiX className="text-[0.65rem]" aria-hidden="true" />
              </span>
            </span>
          ))}

          <FiChevronDown
            aria-hidden="true"
            className={cn(
              "mr-auto shrink-0 text-cream/40 transition-transform duration-200",
              open && "rotate-180 text-gold"
            )}
          />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
              role="listbox"
              aria-multiselectable="true"
              className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-cream/10 bg-deep-2/95 shadow-soft backdrop-blur-xl"
            >
              {searchable && (
                <div className="relative border-b border-cream/10 p-2">
                  <FiSearch className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-cream/30" aria-hidden="true" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="جست‌وجو..."
                    className="w-full rounded-lg bg-transparent py-2 pr-9 pl-3 text-sm text-cream placeholder:text-cream/30 focus:outline-none"
                  />
                </div>
              )}

              <ul className="max-h-56 overflow-y-auto p-1.5">
                {filteredOptions.length === 0 && (
                  <li className="px-4 py-3 text-center text-xs text-cream/35">{noResultsText}</li>
                )}
                {filteredOptions.map((option) => {
                  const isSelected = value.includes(option.value);
                  const isDisabled = option.disabled || (!isSelected && atMax);
                  return (
                    <li key={option.value}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        disabled={isDisabled}
                        onClick={() => toggleOption(option.value)}
                        className={cn(
                          "flex w-full items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-right text-sm transition-colors duration-150",
                          isSelected ? "bg-gold/10 text-gold" : "text-cream/75 hover:bg-cream/[0.06]",
                          isDisabled && "cursor-not-allowed opacity-40"
                        )}
                      >
                        {option.label}
                        {isSelected && <FiCheck className="shrink-0" aria-hidden="true" />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </FieldWrapper>
  );
});

export default MultiSelect;
