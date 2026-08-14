"use client";

import { forwardRef, useEffect, useId, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiCalendar, FiChevronLeft, FiChevronRight, FiChevronUp, FiChevronDown } from "react-icons/fi";
import { cn } from "@/lib/utils";
import {
  JALALI_MONTH_NAMES,
  JALALI_WEEKDAY_LABELS,
  formatJalaliDateTime,
  isSameJalaliDay,
  jalaliMonthLength,
  toGregorian,
  toJalali,
  toPersianDigits,
  toSaturdayFirstWeekday,
} from "@/lib/jalaali";
import FieldWrapper, { describedBy } from "./FieldWrapper";

export interface DateTimePickerProps {
  id?: string;
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  wrapperClassName?: string;
  className?: string;
  placeholder?: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  onBlur?: () => void;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  /** Minute increment for the stepper buttons. Defaults to 5. */
  minuteStep?: number;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

function TimeStepper({
  value,
  max,
  step = 1,
  onChange,
  ariaLabel,
}: {
  value: number;
  max: number;
  step?: number;
  onChange: (next: number) => void;
  ariaLabel: string;
}) {
  const [raw, setRaw] = useState(String(value).padStart(2, "0"));

  useEffect(() => {
    setRaw(String(value).padStart(2, "0"));
  }, [value]);

  const commit = (n: number) => {
    const wrapped = ((n % (max + 1)) + (max + 1)) % (max + 1);
    onChange(wrapped);
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        type="button"
        aria-label={`افزایش ${ariaLabel}`}
        onClick={() => commit(value + step)}
        className="flex h-6 w-9 items-center justify-center rounded-md text-cream/40 transition-colors hover:bg-cream/[0.08] hover:text-gold"
      >
        <FiChevronUp aria-hidden="true" />
      </button>
      <input
        type="text"
        inputMode="numeric"
        aria-label={ariaLabel}
        value={toPersianDigits(raw)}
        onChange={(e) => {
          const digits = e.target.value.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)));
          const cleaned = digits.replace(/[^0-9]/g, "").slice(0, 2);
          setRaw(cleaned);
        }}
        onBlur={() => {
          const n = clamp(Number(raw || 0), 0, max);
          onChange(n);
          setRaw(String(n).padStart(2, "0"));
        }}
        className="h-9 w-9 rounded-lg border border-cream/15 bg-deep/60 text-center text-sm text-cream focus:border-gold/60 focus:outline-none focus:ring-1 focus:ring-gold/40"
      />
      <button
        type="button"
        aria-label={`کاهش ${ariaLabel}`}
        onClick={() => commit(value - step)}
        className="flex h-6 w-9 items-center justify-center rounded-md text-cream/40 transition-colors hover:bg-cream/[0.08] hover:text-gold"
      >
        <FiChevronDown aria-hidden="true" />
      </button>
    </div>
  );
}

/**
 * Same Jalali calendar as DatePicker, extended with an hour/minute stepper
 * row so a single control can capture both the date and the time of day —
 * e.g. booking a specific consultation slot. Still emits a plain `Date`.
 */
const DateTimePicker = forwardRef<HTMLButtonElement, DateTimePickerProps>(function DateTimePicker(
  {
    id,
    label,
    error,
    helperText,
    required,
    wrapperClassName,
    className,
    placeholder = "انتخاب تاریخ و ساعت",
    value,
    onChange,
    onBlur,
    disabled,
    minDate,
    maxDate,
    minuteStep = 5,
  },
  ref
) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const baseDate = value ?? new Date();
  const initialView = useMemo(() => toJalali(baseDate), [baseDate]);
  const [viewYear, setViewYear] = useState(initialView.jy);
  const [viewMonth, setViewMonth] = useState(initialView.jm);
  const [hour, setHour] = useState(baseDate.getHours());
  const [minute, setMinute] = useState(baseDate.getMinutes());
  const [selectedDay, setSelectedDay] = useState<Date>(baseDate);

  useEffect(() => {
    if (open) {
      const b = value ?? new Date();
      const v = toJalali(b);
      setViewYear(v.jy);
      setViewMonth(v.jm);
      setHour(b.getHours());
      setMinute(b.getMinutes());
      setSelectedDay(b);
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

  const applyAndClose = (day: Date, h: number, m: number) => {
    const next = new Date(day);
    next.setHours(h, m, 0, 0);
    onChange(next);
  };

  const handleSelectDay = (date: Date) => {
    setSelectedDay(date);
    applyAndClose(date, hour, minute);
  };

  const handleConfirm = () => {
    applyAndClose(selectedDay, hour, minute);
    setOpen(false);
  };

  const today = new Date();

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
            {value ? formatJalaliDateTime(value) : placeholder}
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
              aria-label="انتخاب تاریخ و ساعت"
              className="absolute z-30 mt-2 w-80 overflow-hidden rounded-2xl border border-cream/10 bg-deep-2/95 p-4 shadow-soft backdrop-blur-xl"
            >
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

              <div className="mt-3 grid grid-cols-7 gap-1 text-center">
                {JALALI_WEEKDAY_LABELS.map((wLabel) => (
                  <span key={wLabel} className="text-[0.65rem] text-cream/35">
                    {wLabel}
                  </span>
                ))}
              </div>

              <div className="mt-1.5 grid grid-cols-7 gap-1">
                {days.map((cell, index) => {
                  if (!cell) return <span key={`blank-${index}`} />;
                  const isSelected = isSameJalaliDay(selectedDay, cell.date);
                  const isToday = isSameJalaliDay(today, cell.date);
                  const minBound = minDate ? new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate()) : null;
                  const maxBound = maxDate ? new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate()) : null;
                  const isDisabled = (minBound && cell.date < minBound) || (maxBound && cell.date > maxBound);

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

              <div className="mt-4 flex items-center justify-center gap-3 border-t border-cream/10 pt-4">
                <TimeStepper value={hour} max={23} onChange={setHour} ariaLabel="ساعت" />
                <span className="pb-5 text-lg font-bold text-cream/40">:</span>
                <TimeStepper value={minute} max={59} step={minuteStep} onChange={setMinute} ariaLabel="دقیقه" />
              </div>

              <button
                type="button"
                onClick={handleConfirm}
                className="mt-4 w-full rounded-xl bg-gold py-2.5 text-sm font-bold text-deep transition-opacity hover:opacity-90"
              >
                تأیید
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </FieldWrapper>
  );
});

export default DateTimePicker;
