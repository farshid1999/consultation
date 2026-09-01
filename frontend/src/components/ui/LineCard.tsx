"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FiLayers, FiArrowRight, FiMoreHorizontal, FiFileText } from "react-icons/fi";
import type { Line } from "@/types";

interface LineCardProps {
  line: Line;
}

export default function LineCard({ line }: LineCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // بستن منو اگر کاربر بیرون از آن کلیک کرد
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="group relative overflow-hidden rounded-3xl bg-[#0b2622] border border-white/5 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold/30 hover:shadow-[0_20px_40px_-10px_rgba(201,162,77,0.15)]">

      {/* افکت نوری پس‌زمینه */}
      <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-gold/5 blur-3xl transition-all duration-500 group-hover:bg-gold/10"></div>

      {/* هدر کارت */}
      <div className="relative flex items-start justify-between mb-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 text-gold border border-gold/20">
          <FiLayers size={24} />
        </div>

        {/* دکمه عملیات بیشتر */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-full p-2 text-cream/40 hover:bg-white/5 hover:text-gold transition-colors focus:outline-none"
          >
            <FiMoreHorizontal size={20} />
          </button>

          {/* دراپ‌داون منو */}
          {isOpen && (
            <div className="absolute left-0 top-full mt-2 w-48 rounded-xl border border-cream/10 bg-[#1a3c34] shadow-xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <Link
                href={`/member/lines/${line.id}/contents`}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm text-cream/70 hover:bg-gold/10 hover:text-gold transition-colors"
              >
                <FiFileText size={16} />
                مشاهده محتواهای این بخش
              </Link>

              {/* می‌توانید لینک‌های دیگر را اینجا اضافه کنید */}
              {/* <Link href="#" className="...">گزینه دیگر</Link> */}
            </div>
          )}
        </div>
      </div>

      {/* محتوا */}
      <div className="relative">
        <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{line.title}</h3>
        <p className="text-sm text-cream/60 leading-relaxed line-clamp-2 min-h-[2.5rem]">
          {line.descriptions || "بدون توضیحات"}
        </p>
      </div>

      {/* فوتر و دکمه ورود */}
      <div className="relative mt-6 flex items-center justify-between border-t border-white/5 pt-4">
        <div className="text-xs text-gold/80 font-medium">
          {line.children.length > 0 ? `${line.children.length} زیرمجموعه` : "لاین اصلی"}
        </div>

        <Link
          href={`/member/lines/${line.id}`}
          className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-[#0b2622] transition-all hover:bg-gold hover:text-white shadow-lg shadow-black/20"
        >
          ورود به بخش
          <FiArrowRight size={16} className="rotate-180" />
        </Link>
      </div>
    </div>
  );
}