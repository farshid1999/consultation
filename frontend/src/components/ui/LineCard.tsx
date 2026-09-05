"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  FiLayers,
  FiFolder,
  FiChevronDown,
  FiArrowUpLeft,
  FiMoreHorizontal,
  FiFileText,
  FiUsers,
} from "react-icons/fi";
import type { Line } from "@/types";

interface LineCardProps {
  line: Line;
  /** برای انتخاب رنگ متفاوت هر لاین از پالت */
  index?: number;
  /** سطح تو‌رفتگی — ۰ برای لاین اصلی، بیشتر از ۰ برای زیرمجموعه‌ها */
  depth?: number;
}

// پالت رنگی متنوع ولی هماهنگ با تم سبز-طلایی؛ هر لاین بر اساس ترتیبش یکی از این رنگ‌ها را می‌گیرد
const ACCENTS = [
  {
    icon: "text-gold",
    iconBg: "bg-gradient-to-br from-gold/25 to-gold/5",
    ring: "border-gold/25",
    chip: "bg-gold/10 text-gold border-gold/20",
    glow: "bg-gold/10",
  },
  {
    icon: "text-[#8fae7d]",
    iconBg: "bg-gradient-to-br from-[#8fae7d]/25 to-[#8fae7d]/5",
    ring: "border-[#8fae7d]/25",
    chip: "bg-[#8fae7d]/10 text-[#8fae7d] border-[#8fae7d]/20",
    glow: "bg-[#8fae7d]/10",
  },
  {
    icon: "text-[#c9814d]",
    iconBg: "bg-gradient-to-br from-[#c9814d]/25 to-[#c9814d]/5",
    ring: "border-[#c9814d]/25",
    chip: "bg-[#c9814d]/10 text-[#c9814d] border-[#c9814d]/20",
    glow: "bg-[#c9814d]/10",
  },
  {
    icon: "text-[#c97d95]",
    iconBg: "bg-gradient-to-br from-[#c97d95]/25 to-[#c97d95]/5",
    ring: "border-[#c97d95]/25",
    chip: "bg-[#c97d95]/10 text-[#c97d95] border-[#c97d95]/20",
    glow: "bg-[#c97d95]/10",
  },
  {
    icon: "text-[#5fa0c9]",
    iconBg: "bg-gradient-to-br from-[#5fa0c9]/25 to-[#5fa0c9]/5",
    ring: "border-[#5fa0c9]/25",
    chip: "bg-[#5fa0c9]/10 text-[#5fa0c9] border-[#5fa0c9]/20",
    glow: "bg-[#5fa0c9]/10",
  },
];

export default function LineCard({ line, index = 0, depth = 0 }: LineCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const accent = ACCENTS[index % ACCENTS.length];
  const hasChildren = line.children && line.children.length > 0;

  // بستن منو اگر کاربر بیرون از آن کلیک کرد
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // نسخه‌ی جمع‌وجورتر برای ردیف‌های زیرمجموعه، با خط اتصال برای نمایش سلسله‌مراتب
  if (depth > 0) {
    return (
      <div className="relative pr-6">
        <span className="absolute right-0 top-0 bottom-0 w-px bg-cream/10" aria-hidden />
        <span className="absolute right-0 top-6 h-px w-4 bg-cream/10" aria-hidden />
        <div className="group flex flex-col gap-3">
          <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/5 bg-white/[0.02] px-5 py-4 transition-colors hover:border-white/10 hover:bg-white/[0.04]">
            <div className="flex min-w-0 items-center gap-3">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${accent.iconBg} ${accent.icon}`}
              >
                <FiFolder size={16} />
              </div>
              <div className="min-w-0">
                <h4 className="truncate text-sm font-bold text-white">{line.title}</h4>
                <p className="truncate text-xs text-cream/50">
                  {line.descriptions || "بدون توضیحات"}
                </p>
              </div>
            </div>
            <Link
              href={`/member/lines/${line.id}`}
              className="flex shrink-0 items-center gap-1.5 rounded-full border border-cream/15 px-3 py-1.5 text-xs font-bold text-cream/80 transition-colors hover:border-gold/40 hover:text-gold"
            >
              ورود
              <FiArrowUpLeft size={13} />
            </Link>
          </div>

          {/* پشتیبانی از زیرمجموعه در سطوح عمیق‌تر، در صورت وجود */}
          {line.children?.length > 0 && (
            <div className="flex flex-col gap-3 pr-2">
              {line.children.map((child, i) => (
                <LineCard key={child.id} line={child} index={i} depth={depth + 1} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="group relative overflow-hidden rounded-[28px] border border-white/5 bg-[#0b2622] transition-all duration-300 hover:border-white/10">
      {/* افکت نوری پس‌زمینه، هماهنگ با رنگ اختصاصی لاین */}
      <div
        className={`pointer-events-none absolute -top-10 left-0 h-40 w-40 rounded-full ${accent.glow} blur-3xl transition-opacity duration-500 group-hover:opacity-150`}
      />

      <div className="relative flex flex-col gap-5 p-6 md:p-7">
        {/* هدر کارت */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-4">
            <div
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border ${accent.ring} ${accent.iconBg} ${accent.icon}`}
            >
              <FiLayers size={26} />
            </div>
            <div className="min-w-0 pt-0.5">
              <h3 className="truncate text-xl font-extrabold text-white">{line.title}</h3>
              <p className="mt-1.5 max-w-md text-sm leading-relaxed text-cream/55 line-clamp-2">
                {line.descriptions || "بدون توضیحات"}
              </p>
            </div>
          </div>

          {/* دکمه عملیات بیشتر */}
          <div className="relative flex shrink-0 items-center gap-2" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen((v) => !v)}
              aria-label="عملیات بیشتر"
              className="rounded-full p-2 text-cream/40 transition-colors hover:bg-white/5 hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50"
            >
              <FiMoreHorizontal size={20} />
            </button>

            {isMenuOpen && (
              <div className="absolute left-0 top-full z-20 mt-2 w-52 overflow-hidden rounded-xl border border-cream/10 bg-[#123832] shadow-2xl shadow-black/30">
                <Link
                  href={`/member/lines/${line.id}/contents`}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-cream/70 transition-colors hover:bg-gold/10 hover:text-gold"
                >
                  <FiFileText size={16} />
                  مشاهده محتواهای این بخش
                </Link>
                <Link
                  href={`/member/lines/${line.id}/consultation`}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-cream/70 transition-colors hover:bg-gold/10 hover:text-gold"
                >
                  <FiFileText size={16} />
                  قرارداد‌ها و فرم‌ها
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* نوار پایین: دکمه‌ی نمایش زیرمجموعه + ورود به بخش */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-5">
          {hasChildren ? (
            <button
              onClick={() => setIsExpanded((v) => !v)}
              aria-expanded={isExpanded}
              className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-bold transition-colors ${accent.chip}`}
            >
              <FiUsers size={14} />
              {line.children.length} زیرمجموعه
              <FiChevronDown
                size={14}
                className={`transition-transform duration-300 motion-reduce:transition-none ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </button>
          ) : (
            <span className="text-xs font-medium text-cream/40">لاین اصلی · بدون زیرمجموعه</span>
          )}

          <Link
            href={`/member/lines/${line.id}`}
            className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#0b2622] shadow-lg shadow-black/20 transition-colors hover:bg-gold hover:text-white"
          >
            ورود به بخش
            <FiArrowUpLeft size={16} />
          </Link>
        </div>

        {/* بدنه‌ی باز شونده: زیرمجموعه‌ها داخل خود کارت نمایش داده می‌شوند */}
        {hasChildren && (
          <div
            className={`grid overflow-hidden transition-all duration-300 ease-out motion-reduce:transition-none ${
              isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="min-h-0">
              <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-white/10 bg-black/10 p-4 md:p-5">
                {line.children.map((child, i) => (
                  <LineCard key={child.id} line={child} index={i} depth={depth + 1} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}