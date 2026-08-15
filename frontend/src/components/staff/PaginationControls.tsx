"use client";

import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { toPersianDigits } from "@/lib/jalaali";

const PAGE_SIZE_FALLBACK = 10;

interface PaginationControlsProps {
  page: number;
  count: number;
  hasNext: boolean;
  hasPrevious: boolean;
  onPageChange: (page: number) => void;
  pageSize?: number;
}

export default function PaginationControls({
  page,
  count,
  hasNext,
  hasPrevious,
  onPageChange,
  pageSize = PAGE_SIZE_FALLBACK,
}: PaginationControlsProps) {
  const totalPages = Math.max(1, Math.ceil(count / pageSize));

  return (
    <div className="flex items-center justify-between border-t border-cream/10 pt-4">
      <p className="text-xs text-cream/40">
        صفحه {toPersianDigits(page)} از {toPersianDigits(totalPages)} · {toPersianDigits(count)} نتیجه
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={!hasPrevious}
          onClick={() => onPageChange(page - 1)}
          aria-label="صفحه‌ی قبل"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/15 text-cream/60 transition-colors hover:border-gold/40 hover:text-gold disabled:cursor-not-allowed disabled:opacity-30"
        >
          <FiChevronRight aria-hidden="true" />
        </button>
        <button
          type="button"
          disabled={!hasNext}
          onClick={() => onPageChange(page + 1)}
          aria-label="صفحه‌ی بعد"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/15 text-cream/60 transition-colors hover:border-gold/40 hover:text-gold disabled:cursor-not-allowed disabled:opacity-30"
        >
          <FiChevronLeft aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
