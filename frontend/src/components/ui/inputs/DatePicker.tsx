"use client";

import { forwardRef, useEffect, useId, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiCalendar, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { cn } from "@/lib/utils";
import {
  JALALI_MONTH_NAMES,
  JALALI_WEEKDAY_LABELS,
  formatJalali,
  isSameJalaliDay,
  jalaliMonthLength,
  toGregorian,
  toJalali,
  toPersianDigits,
  toSaturdayFirstWeekday,
} from "@/lib/jalaali";
import FieldWrapper, { describedBy } from "./FieldWrapper";

export interface DatePickerProps {
  id?: string;
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  wrapperClassName?: string;
  className?: string;
  placeholder?: string;
  /** Selected date as a native Date (Gregorian under the hood, displayed as Jalali). */
  value: Date | null;
  onChange: (date: Date | null) => void;
  onBlur?: () => void;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  /** Renders a "امروز" quick-select button in the popover footer. Defaults to true. */
  showTodayButton?: boolean;
}

function isBeforeDay(a: Date, b: Date) {
  return (
    a.getFullYear() < b.getFullYear() ||
    (a.getFullYear() === b.getFullYear() && a.getMonth() < b.getMonth()) ||
    (a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() < b.getDate())
  );
}

/**
 * A fully Persian (Jalali/Shamsi) date picker. Internally stores and emits a
 * plain `Date` object (so it stays trivial to send to a backend or compare),
 * while every visible label — month names, weekday headers, the grid of
 * days — is Jalali. Built as a controlled component so it plugs into
 * react-hook-form via `Controller`, exactly like MultiSelect / RadioGroup.
 */
const DatePicker = forwardRef<HTMLButtonElement, DatePickerProps>(function DatePicker(
  {
    id,
    label,
    error,
    helperText,
    required,
    wrapperClassName,
    className,
    placeholder = "انتخاب تاریخ",
    value,
    onChange,
    onBlur,
    disabled,
    minDate,
    maxDate,
    showTodayButton = true,
  },
  ref
) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const initialView = useMemo(() => toJalali(value ?? new Date()), [value]);
  const [viewYear, setViewYear] = useState(initialView.jy);
  const [viewMonth, setViewMonth] = useState(initialView.jm);

  useEffect(() => {
    if (open) {
      const v = toJalali(value ?? new Date());
      setViewYear(v.jy);
      setViewMonth(v.jm);
    }
  }, [open, value]);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
        onBlur?.();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onBlur]);

  const goToPrevMonth = () => {
    if (viewMonth === 1) {
      setViewMonth(12);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const goToNextMonth = () => {
    if (viewMonth === 12) {
      setViewMonth(1);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const days = useMemo(() => {
    const firstOfMonth = toGregorian(viewYear, viewMonth, 1);
    const leadingBlanks = toSaturdayFirstWeekday(firstOfMonth.getDay());
    const length = jalaliMonthLength(viewYear, viewMonth);
    const cells: Array<{ jd: number; date: Date } | null> = [];
    for (let i = 0; i < leadingBlanks; i += 1) cells.push(null);
    for (let jd = 1; jd <= length; jd += 1) {
      cells.push({ jd, date: toGregorian(viewYear, viewMonth, jd) });
    }
    return cells;
  }, [viewYear, viewMonth]);

  const today = new Date();

  const handleSelectDay = (date: Date) => {
    if (disabled) return;
    if (minDate && isBeforeDay(date, minDate)) return;
    if (maxDate && isBeforeDay(maxDate, date)) return;
    // Preserve any existing time-of-day if the value already had one (useful when DateTimePicker composes this).
    const next = new Date(date);
    if (value) {
      next.setHours(value.getHours(), value.getMinutes(), 0, 0);
    }
    onChange(next);
    setOpen(false);
  };

  return (
    <FieldWrapper
      id={fieldId}
      label={label}
      required={required}
      error={error}
      helperText={helperText}
      className={wrapperClassName}
    >
      <div ref={containerRef} className="relative">
        <button
          ref={ref}
          type="button"
          id={fieldId}
          disabled={disabled}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy(fieldId, error, helperText)}
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "flex w-full items-center justify-between gap-2 rounded-xl border bg-deep/60 px-4 py-3 text-right text-sm text-cream transition-colors duration-200",
            "focus:outline-none focus:ring-1",
            error
              ? "border-red-400/50 focus:border-red-400/70 focus:ring-red-400/40"
              : "border-cream/15 focus:border-gold/60 focus:ring-gold/40",
            disabled && "cursor-not-allowed opacity-50",
            open && "border-gold/60 ring-1 ring-gold/40",
            className
          )}
        >
          <span className={value ? "text-cream" : "text-cream/30"}>
            {value ? formatJalali(value) : placeholder}
          </span>
          <FiCalendar className={cn("shrink-0 text-cream/40", open && "text-gold")} aria-hidden="true" />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
              role="dialog"
              aria-label="انتخاب تاریخ"
              className="absolute z-30 mt-2 w-72 overflow-hidden rounded-2xl border border-cream/10 bg-deep-2/95 p-4 shadow-soft backdrop-blur-xl"
            >
              {/* header: month/year nav */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={goToNextMonth}
                  aria-label="ماه بعد"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-cream/60 transition-colors hover:bg-cream/[0.08] hover:text-gold"
                >
                  <FiChevronRight aria-hidden="true" />
                </button>
                <p className="text-sm font-bold text-cream">
                  {JALALI_MONTH_NAMES[viewMonth - 1]} {toPersianDigits(viewYear)}
                </p>
                <button
                  type="button"
                  onClick={goToPrevMonth}
                  aria-label="ماه قبل"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-cream/60 transition-colors hover:bg-cream/[0.08] hover:text-gold"
                >
                  <FiChevronLeft aria-hidden="true" />
                </button>
              </div>

              {/* weekday header */}
              <div className="mt-3 grid grid-cols-7 gap-1 text-center">
                {JALALI_WEEKDAY_LABELS.map((label) => (
                  <span key={label} className="text-[0.65rem] text-cream/35">
                    {label}
                  </span>
                ))}
              </div>

              {/* day grid */}
              <div className="mt-1.5 grid grid-cols-7 gap-1">
                {days.map((cell, index) => {
                  if (!cell) return <span key={`blank-${index}`} />;
                  const isSelected = isSameJalaliDay(value, cell.date);
                  const isToday = isSameJalaliDay(today, cell.date);
                  const isDisabled =
                    (minDate && isBeforeDay(cell.date, minDate)) ||
                    (maxDate && isBeforeDay(maxDate, cell.date));

                  return (
                    <button
                      key={cell.jd}
                      type="button"
                      disabled={Boolean(isDisabled)}
                      onClick={() => handleSelectDay(cell.date)}
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full text-xs transition-colors duration-150",
                        isSelected
                          ? "bg-gold text-deep font-bold"
                          : isToday
                          ? "border border-gold/50 text-gold"
                          : "text-cream/70 hover:bg-cream/[0.08]",
                        isDisabled && "cursor-not-allowed opacity-30 hover:bg-transparent"
                      )}
                    >
                      {toPersianDigits(cell.jd)}
                    </button>
                  );
                })}
              </div>

              {showTodayButton && (
                <div className="mt-3 flex justify-center border-t border-cream/10 pt-3">
                  <button
                    type="button"
                    onClick={() => handleSelectDay(new Date())}
                    className="text-xs font-medium text-gold hover:underline"
                  >
                    امروز
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </FieldWrapper>
  );
});

export default DatePicker;
