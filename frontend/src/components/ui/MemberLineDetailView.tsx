"use client";

import Link from "next/link";
import { FiArrowRight, FiFile, FiLayers, FiBox, FiChevronLeft } from "react-icons/fi";
import type { LineDetail, Feature, LineChild } from "@/types";

// کامپوننت کارت ویژگی (Feature Card) - استایل شیشه‌ای
function MemberFeatureCard({ feature }: { feature: Feature }) {
  return (
    <div className="group relative p-6 rounded-2xl bg-deep-2/40 border border-white/5 hover:border-gold/30 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      {/* افکت هاور */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <h4 className="text-lg font-bold text-white mb-3 relative z-10">{feature.title}</h4>
      {feature.text && (
        <p className="text-sm text-cream/70 leading-relaxed mb-4 relative z-10">{feature.text}</p>
      )}

      {feature.media?.file && (
        <a
          href={feature.media.file}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs font-medium text-gold bg-gold/10 px-3 py-1.5 rounded-lg hover:bg-gold/20 transition-colors border border-gold/20 relative z-10"
        >
          <FiFile size={14} />
          دانلود فایل
        </a>
      )}
    </div>
  );
}

// کامپوننت کارت زیرمجموعه (Child Card) - استایل مدرن
function MemberChildCard({ child }: { child: LineChild }) {
  return (
    <Link href={`/dashboard/member/lines/${child.id}`}>
      <div className="group block h-full p-6 rounded-2xl bg-[#0b2622] border border-white/5 hover:border-gold/40 transition-all duration-300 hover:shadow-[0_10px_30px_-10px_rgba(201,162,77,0.1)]">
        <div className="flex items-start justify-between mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 text-gold border border-gold/20">
            <FiLayers size={20} />
          </div>
          <FiChevronLeft className="text-cream/20 group-hover:text-gold group-hover:-translate-x-1 transition-all" />
        </div>

        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gold transition-colors">{child.title}</h3>
        <p className="text-sm text-cream/60 line-clamp-2">
          {child.descriptions || "برای مشاهده جزئیات کلیک کنید..."}
        </p>
      </div>
    </Link>
  );
}

export default function MemberLineDetailView({ line }: { line: LineDetail }) {
  return (
    <div className="flex flex-col gap-12 pb-20">

      {/* هدر سینمایی و لوکس */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#0b2622] via-[#1a3c34] to-[#0b2622] border border-gold/20 shadow-2xl p-8 md:p-12 text-center md:text-right">
        {/* المان‌های تزئینی پس‌زمینه */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 max-w-4xl mx-auto md:mx-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gold/80 mb-6 backdrop-blur-md">
            <FiBox size={12} />
            <span>بخش اختصاصی</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-cream to-gold mb-6 leading-tight">
            {line.title}
          </h1>

          {line.descriptions && (
            <p className="text-lg text-cream/70 leading-loose max-w-2xl mx-auto md:mx-0">
              {line.descriptions}
            </p>
          )}
        </div>
      </div>

      {/* بخش ویژگی‌ها */}
      {line.features.length > 0 && (
        <section>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-bold text-white">ویژگی‌ها و امکانات</h2>
            <div className="h-px flex-1 bg-gradient-to-l from-white/10 to-transparent" />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {line.features.map((feature) => (
              <MemberFeatureCard key={feature.id} feature={feature} />
            ))}
          </div>
        </section>
      )}

      {/* بخش زیرمجموعه‌ها */}
      {line.children.length > 0 && (
        <section>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-bold text-white">زیرمجموعه‌های مرتبط</h2>
            <div className="h-px flex-1 bg-gradient-to-l from-white/10 to-transparent" />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {line.children.map((child) => (
              <MemberChildCard key={child.id} child={child} />
            ))}
          </div>
        </section>
      )}

      {/* حالت خالی */}
      {line.features.length === 0 && line.children.length === 0 && (
        <div className="text-center py-20 bg-deep-2/20 rounded-3xl border border-dashed border-gold/10 backdrop-blur-sm">
          <FiLayers size={48} className="text-gold/20 mx-auto mb-4" />
          <p className="text-cream/50 text-lg">اطلاعات تکمیلی برای این بخش ثبت نشده است.</p>
        </div>
      )}

    </div>
  );
}