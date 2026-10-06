"use client";

import { useRef } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import StaffCard from "./StaffCard";
import type { PublicStaff } from "@/types/publicStaff";

export default function FeaturedSlider({ items }: { items: PublicStaff[] }) {
  const ref = useRef<HTMLDivElement>(null);

  // در RTL مقدار scrollBy برعکس است؛ با علامت اصلاح می‌کنیم
  const scroll = (dir: "next" | "prev") => {
    const el = ref.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    const sign = dir === "next" ? -1 : 1;
    el.scrollBy({ left: sign * amount, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={ref}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((s) => (
          <div key={s.id} className="w-[70%] shrink-0 snap-start sm:w-[42%] lg:w-[28%]">
            <StaffCard staff={s} />
          </div>
        ))}
      </div>

      <div className="mt-2 flex justify-center gap-3">
        <button
          onClick={() => scroll("prev")}
          aria-label="قبلی"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/20 bg-deep-2/60 text-gold transition-all hover:bg-gold hover:text-deep"
        >
          <FiChevronRight size={20} />
        </button>
        <button
          onClick={() => scroll("next")}
          aria-label="بعدی"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/20 bg-deep-2/60 text-gold transition-all hover:bg-gold hover:text-deep"
        >
          <FiChevronLeft size={20} />
        </button>
      </div>
    </div>
  );
}