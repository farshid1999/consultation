"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FiSearch, FiArrowRight, FiUsers } from "react-icons/fi";
import NeuralBackground from "@/components/background/NeuralBackground";
import StaffCard from "@/components/staff/StaffCard";
import FeaturedSlider from "@/components/staff/FeaturedSlider";
import { usePublicStaffList } from "@/hooks/usePublicStaff";

const FEATURED_COUNT = 6;

export default function ExpertsPage() {
  const [search, setSearch] = useState("");
  const [lineId, setLineId] = useState<string>("");

  const { data, isLoading, isError } = usePublicStaffList({ search, line_id: lineId });
  const { data: all } = usePublicStaffList(); // برای ساخت فیلتر بخش‌ها

  const lines = useMemo(() => {
    const map = new Map<string, string>();
    (all ?? []).forEach((s) => s.lines.forEach((l) => map.set(l.id, l.title)));
    return Array.from(map, ([id, title]) => ({ id, title }));
  }, [all]);

  const staff = data ?? [];
  const isFiltering = Boolean(search || lineId);
  const featured = isFiltering ? [] : staff.slice(0, FEATURED_COUNT);
  const rest = isFiltering ? staff : staff.slice(FEATURED_COUNT);

  return (
    <main dir="rtl" className="relative min-h-screen overflow-x-hidden bg-deep text-cream">
      <NeuralBackground />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-12">
        {/* هدر */}
        <header className="mb-12 space-y-5 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-xs text-gold/60 transition-colors hover:text-gold">
            <FiArrowRight size={12} /> بازگشت به صفحه‌ی اصلی
          </Link>
          <h1 className="text-4xl font-extrabold md:text-5xl">
            با <span className="bg-gradient-to-l from-gold to-gold-soft bg-clip-text text-transparent">کارشناسان</span> ما آشنا شوید
          </h1>
          <p className="mx-auto max-w-xl text-sm leading-7 text-cream/50">
            تیمی از متخصصان باتجربه که در کنار شما هستند. روی هر کارشناس بزنید تا سوابق و تخصص‌هایش را ببینید.
          </p>
          <div className="mx-auto h-[3px] w-16 rounded-full bg-gradient-to-l from-gold to-gold/10" />
        </header>

        {/* جستجو و فیلتر */}
        <div className="mb-12 flex flex-col items-stretch gap-4 md:flex-row md:items-center md:justify-between">
          <div className="group relative w-full md:w-80">
            <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/50 transition-colors group-focus-within:text-gold" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جست‌وجوی نام یا تخصص..."
              className="w-full rounded-2xl border border-gold/20 bg-deep-2/40 py-3 pr-12 pl-4 text-sm text-cream outline-none backdrop-blur-md transition-all placeholder:text-cream/30 focus:border-gold focus:ring-1 focus:ring-gold/50"
            />
          </div>

          {lines.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <FilterChip active={!lineId} onClick={() => setLineId("")}>همه</FilterChip>
              {lines.map((l) => (
                <FilterChip key={l.id} active={lineId === l.id} onClick={() => setLineId(l.id)}>
                  {l.title}
                </FilterChip>
              ))}
            </div>
          )}
        </div>

        {/* وضعیت‌ها */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[4/5] animate-pulse rounded-3xl border border-white/5 bg-deep-2/30" />
            ))}
          </div>
        ) : isError ? (
          <p className="py-20 text-center text-sm text-red-400">دریافت اطلاعات با خطا مواجه شد.</p>
        ) : staff.length === 0 ? (
          <div className="flex flex-col items-center rounded-[2rem] border border-dashed border-gold/10 bg-deep-2/20 py-20 text-center">
            <FiUsers size={40} className="mb-4 text-gold/20" />
            <h3 className="text-lg font-bold">کارشناسی یافت نشد</h3>
            <p className="mt-2 text-sm text-cream/50">عبارت جست‌وجو یا فیلتر را تغییر دهید.</p>
          </div>
        ) : (
          <div className="space-y-16">
            {featured.length > 0 && (
              <section className="space-y-6">
                <SectionTitle title="کارشناسان برگزیده" />
                <FeaturedSlider items={featured} />
              </section>
            )}

            {rest.length > 0 && (
              <section className="space-y-6">
                <SectionTitle title={isFiltering ? "نتایج" : "سایر کارشناسان"} />
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {rest.map((s) => (
                    <StaffCard key={s.id} staff={s} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-4">
      <h2 className="text-xl font-extrabold text-cream">{title}</h2>
      <div className="h-px flex-1 bg-gradient-to-l from-gold/30 to-transparent" />
    </div>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-all ${
        active
          ? "border-gold bg-gold text-deep"
          : "border-cream/10 bg-cream/5 text-cream/60 hover:border-gold/30 hover:text-gold"
      }`}
    >
      {children}
    </button>
  );
}