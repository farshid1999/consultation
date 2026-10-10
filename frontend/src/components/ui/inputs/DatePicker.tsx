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

type ViewMode = "days" | "months" | "years";

const YEARS_PER_PAGE = 12;

function isBeforeDay(a: Date, b: Date) {
  return (
    a.getFullYear() < b.getFullYear() ||
    (a.getFullYear() === b.getFullYear() && a.getMonth() < b.getMonth()) ||
    (a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() < b.getDate())
  );
}

function yearPageStartFor(year: number) {
  return Math.floor(year / YEARS_PER_PAGE) * YEARS_PER_PAGE;
}

/**
 * A fully Persian (Jalali/Shamsi) date picker. Internally stores and emits a
 * plain `Date` object, while every visible label is Jalali.
 *
 * The popover has three views:
 *  - days   : grid of days; arrows move month by month
 *  - months : grid of 12 months; arrows move year by year
 *  - years  : grid of 12 years; arrows move page by page
 * Click the "month year" title to go days → months → years.
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

  const [viewYear, setViewYear] = useState(() => toJalali(value ?? new Date()).jy);
  const [viewMonth, setViewMonth] = useState(() => toJalali(value ?? new Date()).jm);
  const [mode, setMode] = useState<ViewMode>("days");
  const [yearPageStart, setYearPageStart] = useState(() => yearPageStartFor(toJalali(value ?? new Date()).jy));

  // Keep the latest value/onBlur in refs so the effects below only react to
  // `open` changing — otherwise a parent re-render with a fresh Date object
  // would snap the calendar back to the selected month while navigating.
  const valueRef = useRef(value);
  valueRef.current = value;
  const onBlurRef = useRef(onBlur);
  onBlurRef.current = onBlur;

  useEffect(() => {
    if (!open) return;
    const v = toJalali(valueRef.current ?? new Date());
    setViewYear(v.jy);
    setViewMonth(v.jm);
    setYearPageStart(yearPageStartFor(v.jy));
    setMode("days");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
        onBlurRef.current?.();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const minYear = minDate ? toJalali(minDate).jy : undefined;
  const maxYear = maxDate ? toJalali(maxDate).jy : undefined;

  const goPrev = () => {
    if (mode === "days") {
      if (viewMonth === 1) {
        setViewMonth(12);
        setViewYear((y) => y - 1);
      } else {
        setViewMonth((m) => m - 1);
      }
    } else if (mode === "months") {
      setViewYear((y) => y - 1);
    } else {
      setYearPageStart((s) => s - YEARS_PER_PAGE);
    }
  };

  const goNext = () => {
    if (mode === "days") {
      if (viewMonth === 12) {
        setViewMonth(1);
        setViewYear((y) => y + 1);
      } else {
        setViewMonth((m) => m + 1);
      }
    } else if (mode === "months") {
      setViewYear((y) => y + 1);
    } else {
      setYearPageStart((s) => s + YEARS_PER_PAGE);
    }
  };

  const handleTitleClick = () => {
    if (mode === "days") {
      setMode("months");
    } else if (mode === "months") {
      setYearPageStart(yearPageStartFor(viewYear));
      setMode("years");
    } else {
      setMode("days");
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
  const selectedJalali = value ? toJalali(value) : null;
  const todayJalali = toJalali(today);

  const handleSelectDay = (date: Date) => {
    if (disabled) return;
    if (minDate && isBeforeDay(date, minDate)) return;
    if (maxDate && isBeforeDay(maxDate, date)) return;
    const next = new Date(date);
    if (value) {
      next.setHours(value.getHours(), value.getMinutes(), 0, 0);
    }
    onChange(next);
    setOpen(false);
  };

  const isMonthDisabled = (month: number) => {
    if (minDate) {
      const m = toJalali(minDate);
      if (viewYear < m.jy || (viewYear === m.jy && month < m.jm)) return true;
    }
    if (maxDate) {
      const m = toJalali(maxDate);
      if (viewYear > m.jy || (viewYear === m.jy && month > m.jm)) return true;
    }
    return false;
  };

  const isYearDisabled = (year: number) =>
    (minYear !== undefined && year < minYear) || (maxYear !== undefined && year > maxYear);

  const title =
    mode === "days"
      ? `${JALALI_MONTH_NAMES[viewMonth - 1]} ${toPersianDigits(viewYear)}`
      : mode === "months"
      ? toPersianDigits(viewYear)
      : `${toPersianDigits(yearPageStart)} - ${toPersianDigits(yearPageStart + YEARS_PER_PAGE - 1)}`;

  const navBtn =
    "flex h-8 w-8 items-center justify-center rounded-full text-cream/60 transition-colors hover:bg-cream/[0.08] hover:text-gold";

  const gridBtn = (active: boolean, current: boolean, isDisabled: boolean) =>
    cn(
      "flex h-9 items-center justify-center rounded-xl text-xs transition-colors duration-150",
      active
        ? "bg-gold text-deep font-bold"
        : current
        ? "border border-gold/50 text-gold"
        : "text-cream/70 hover:bg-cream/[0.08]",
      isDisabled && "cursor-not-allowed opacity-30 hover:bg-transparent"
    );

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
              {/* header: nav + clickable title */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={goNext}
                  aria-label={mode === "days" ? "ماه بعد" : mode === "months" ? "سال بعد" : "صفحه بعد"}
                  className={navBtn}
                >
                  <FiChevronRight aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={handleTitleClick}
                  aria-label="تغییر ماه و سال"
                  className="rounded-lg px-3 py-1 text-sm font-bold text-cream transition-colors hover:bg-cream/[0.08] hover:text-gold"
                >
                  {title}
                </button>
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label={mode === "days" ? "ماه قبل" : mode === "months" ? "سال قبل" : "صفحه قبل"}
                  className={navBtn}
                >
                  <FiChevronLeft aria-hidden="true" />
                </button>
              </div>

              {mode === "days" && (
                <>
                  <div className="mt-3 grid grid-cols-7 gap-1 text-center">
                    {JALALI_WEEKDAY_LABELS.map((l) => (
                      <span key={l} className="text-[0.65rem] text-cream/35">
                        {l}
                      </span>
                    ))}
                  </div>

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
                </>
              )}

              {mode === "months" && (
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {JALALI_MONTH_NAMES.map((name, i) => {
                    const m = i + 1;
                    const isDisabled = isMonthDisabled(m);
                    return (
                      <button
                        key={name}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => {
                          setViewMonth(m);
                          setMode("days");
                        }}
                        className={gridBtn(
                          selectedJalali?.jy === viewYear && selectedJalali?.jm === m,
                          todayJalali.jy === viewYear && todayJalali.jm === m,
                          isDisabled
                        )}
                      >
                        {name}
                      </button>
                    );
                  })}
                </div>
              )}

              {mode === "years" && (
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {Array.from({ length: YEARS_PER_PAGE }, (_, i) => yearPageStart + i).map((y) => {
                    const isDisabled = isYearDisabled(y);
                    return (
                      <button
                        key={y}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => {
                          setViewYear(y);
                          setMode("months");
                        }}
                        className={gridBtn(selectedJalali?.jy === y, todayJalali.jy === y, isDisabled)}
                      >
                        {toPersianDigits(y)}
                      </button>
                    );
                  })}
                </div>
              )}

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