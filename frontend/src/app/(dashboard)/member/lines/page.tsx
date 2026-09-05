"use client";

import { useMemo, useState } from "react";
import { FiSearch, FiLayers, FiFolder, FiUsers } from "react-icons/fi";
import { useMyLines } from "@/hooks/useLines";
import LineCard from "@/components/ui/LineCard";
import type { Line } from "@/types";
import NeuralBackground from "@/components/background/NeuralBackground";

// شکلی که مستقیما از API می‌آید: لیست فلت از همه‌ی لاین‌هایی که کاربر بهشان دسترسی دارد
// (هم اصلی‌ها و هم زیرمجموعه‌ها، همه هم‌سطح). فیلد children آن قابل اعتماد نیست/استفاده نمی‌شود.
type RawLine = Omit<Line, "children"> & {
  parent?: string | null;
};

/**
 * درخت واقعی لاین‌ها را از روی لیست فلت دریافتی می‌سازد.
 * هر آیتم بر اساس id والدش (parent) داخل children همان والد قرار می‌گیرد؛
 * اگر والدش در همین دیتای دریافتی نباشد (مثلا کاربر فقط عضو همان زیرمجموعه است)
 * به‌عنوان یک لاین ریشه نمایش داده می‌شود تا چیزی گم نشود.
 */
function buildLineTree(rawLines: RawLine[]): Line[] {
  const byId = new Map<string, Line>();

  rawLines.forEach((raw) => {
    byId.set(raw.id, { ...raw, children: [] } as Line);
  });

  const roots: Line[] = [];

  rawLines.forEach((raw) => {
    const node = byId.get(raw.id)!;
    const parentId = raw.parent ?? null;

    if (parentId && byId.has(parentId)) {
      byId.get(parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
}

export default function UserDashboardPage() {
  const [search, setSearch] = useState("");
  const { data: rawLines, isLoading } = useMyLines({ search: search || undefined });

  // به‌جای اعتماد به children ای که سرور می‌فرستد، خودمان بر اساس id/parent می‌چینیم
  const lines = useMemo(
    () => buildLineTree((rawLines ?? []) as RawLine[]),
    [rawLines]
  );

  const stats = useMemo(() => {
    const total = lines.length;
    const withChildren = lines.filter((l) => l.children.length > 0).length;
    const totalChildren = lines.reduce((sum, l) => sum + l.children.length, 0);
    return { total, withChildren, totalChildren };
  }, [lines]);

  return (

    <main dir="rtl" className="relative min-h-screen overflow-hidden rounded-2xl bg-[#061815]">
      <NeuralBackground />
      {/* بافت نوری پس‌زمینه‌ی کل صفحه */}
      <div className="pointer-events-none absolute -top-40 right-1/4 h-[28rem] w-[28rem] rounded-full bg-gold/[0.06] blur-[120px]" />
      <div className="pointer-events-none absolute top-1/3 left-0 h-96 w-96 rounded-full bg-[#5fa0c9]/[0.05] blur-[120px]" />

      <div className="relative mx-auto max-w-6xl px-6 py-14">
        {/* هدر داشبورد */}
        <div className="mb-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="text-xs font-bold tracking-wide text-gold/70">پنل کاربری</span>
            <h1 className="mt-2 text-4xl font-extrabold text-white md:text-5xl">کارتابل من</h1>
            <p className="mt-3 max-w-md text-cream/50">
              دسترسی سریع به بخش‌های عملیاتی، قراردادها و زیرمجموعه‌های شما
            </p>
          </div>

          {/* جستجو در داشبورد */}
          <div className="relative w-full lg:w-96">
            <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/30" />
            <input
              type="text"
              placeholder="جست‌وجوی بخش‌ها..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-[#0b2622]/60 py-3.5 pr-12 pl-4 text-sm text-white placeholder:text-cream/30 backdrop-blur-md transition-all focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/50"
            />
          </div>
        </div>

        {/* نوار آمار کلی — سه بخش با نقش و رنگ متفاوت، نه سه باکس یکسان */}
        {!isLoading && lines.length > 0 && (
          <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-gold/15 bg-gradient-to-br from-gold/10 to-transparent p-6">
              <div className="flex items-center gap-3 text-gold">
                <FiLayers size={20} />
                <span className="text-sm font-bold">لاین‌های اصلی</span>
              </div>
              <p className="mt-4 text-3xl font-extrabold text-white">{stats.total}</p>
            </div>
            <div className="rounded-3xl border border-white/5 bg-[#0b2622]/60 p-6">
              <div className="flex items-center gap-3 text-[#8fae7d]">
                <FiFolder size={20} />
                <span className="text-sm font-bold">دارای زیرمجموعه</span>
              </div>
              <p className="mt-4 text-3xl font-extrabold text-white">{stats.withChildren}</p>
            </div>
            <div className="rounded-3xl border border-white/5 bg-[#0b2622]/60 p-6">
              <div className="flex items-center gap-3 text-[#5fa0c9]">
                <FiUsers size={20} />
                <span className="text-sm font-bold">مجموع زیرمجموعه‌ها</span>
              </div>
              <p className="mt-4 text-3xl font-extrabold text-white">{stats.totalChildren}</p>
            </div>
          </div>
        )}

        {/* فهرست لاین‌ها — چیدمان عمودی و کامل‌عرض به‌جای شبکه‌ی باکس‌های یکسان،
            چون هر کارت ممکن است با باز شدن زیرمجموعه‌ها ارتفاع متفاوتی بگیرد */}
        {isLoading ? (
          <div className="flex flex-col gap-5">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-36 animate-pulse rounded-[28px] border border-white/5 bg-[#0b2622]/50"
              />
            ))}
          </div>
        ) : lines.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[28px] border border-dashed border-white/10 bg-[#0b2622]/30 py-24 text-center">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-white/5 text-cream/20">
              <FiSearch size={32} />
            </div>
            <h3 className="text-xl font-bold text-white">بخشی یافت نشد</h3>
            <p className="mt-2 text-cream/50">شما هنوز عضو هیچ بخشی نشده‌اید.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {lines.map((line, i) => (
              <LineCard key={line.id} line={line} index={i} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}