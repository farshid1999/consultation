"use client";

import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { Input } from "@/components/ui/inputs";
import { useMyLines } from "@/hooks/useLines";
import LineCard from "@/components/ui/LineCard";

export default function UserDashboardPage() {
  const [search, setSearch] = useState("");
  const { data: lines, isLoading } = useMyLines({ search: search || undefined });

  return (
    <main dir="rtl" className="mx-auto max-w-7xl px-6 py-12">

      {/* هدر داشبورد */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            کارتابل من
          </h1>
          <p className="mt-2 text-cream/50 text-lg">
            دسترسی سریع به بخش‌های عملیاتی و زیرمجموعه‌های شما
          </p>
        </div>

        {/* جستجو در داشبورد */}
        <div className="w-full md:w-80">
          <div className="relative">
            <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/30" />
            <input
              type="text"
              placeholder="جست‌وجوی بخش‌ها..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-[#0b2622]/50 py-3 pr-12 pl-4 text-sm text-white placeholder:text-cream/30 focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/50 backdrop-blur-md transition-all"
            />
          </div>
        </div>
      </div>

      {/* گرید کارت‌ها */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 rounded-3xl bg-[#0b2622]/50 animate-pulse border border-white/5"></div>
          ))}
        </div>
      ) : lines?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/5 text-cream/20">
            <FiSearch size={32} />
          </div>
          <h3 className="text-xl font-bold text-white">بخشی یافت نشد</h3>
          <p className="mt-2 text-cream/50">شما هنوز عضو هیچ بخشی نشده‌اید.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lines?.map((line) => (
            <LineCard key={line.id} line={line} />
          ))}
        </div>
      )}

    </main>
  );
}