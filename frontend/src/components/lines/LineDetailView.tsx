"use client";

import Link from "next/link";
import { FiArrowRight, FiFile, FiLayers } from "react-icons/fi";
import type { LineDetail, Feature, LineChild } from "@/types";

// کامپوننت کمکی برای نمایش هر فیچر
function FeatureCard({ feature }: { feature: Feature }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-[#c9a24d]/30 transition-colors">
      <h4 className="font-bold text-slate-800 mb-2">{feature.title}</h4>
      {feature.text && <p className="text-sm text-slate-600 leading-relaxed mb-3">{feature.text}</p>}

      {feature.media?.file && (
        <a
          href={feature.media.file}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs font-medium text-[#c9a24d] hover:text-[#b08d3e] bg-[#c9a24d]/10 px-3 py-1.5 rounded-lg transition-colors"
        >
          <FiFile size={14} />
          مشاهده فایل پیوست
        </a>
      )}
    </div>
  );
}

// کامپوننت کمکی برای نمایش فرزندان (Children)
function ChildLineCard({ child }: { child: LineChild }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6">
      <div className="flex items-center gap-3 mb-4 border-b border-slate-200 pb-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0b2622] text-white text-xs font-bold">
          <FiLayers size={14} />
        </span>
        <h3 className="font-bold text-slate-800 text-lg">{child.title}</h3>
      </div>

      {child.descriptions && (
        <p className="text-sm text-slate-600 mb-6 leading-relaxed">{child.descriptions}</p>
      )}

      {child.features.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {child.features.map((f) => (
            <FeatureCard key={f.id} feature={f} />
          ))}
        </div>
      ) : (
        <p className="text-xs text-slate-400 italic">ویژگی ثبت شده‌ای ندارد.</p>
      )}
    </div>
  );
}

export default function LineDetailView({ line }: { line: LineDetail }) {
  return (
    <div className="flex flex-col gap-8">

      {/* هدر اصلی لاین */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-sm p-8">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#c9a24d] to-[#e0c070]"></div>

        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
              {/*<span>شناسه: {line.id}</span>*/}
              {line.parent && (
                <>
                  <span>/</span>
                  <Link href={`/lines/${line.parent}`} className="hover:text-[#c9a24d] transition-colors">
                    والد: #{line.parent}
                  </Link>
                </>
              )}
            </div>
            <h1 className="text-3xl font-extrabold text-[#0b2622] mb-3">{line.title}</h1>
            {line.descriptions && (
              <p className="text-slate-600 leading-relaxed max-w-3xl">{line.descriptions}</p>
            )}
          </div>

          <Link
            href="/line"
            className="shrink-0 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#0b2622] transition-colors bg-slate-100 px-4 py-2 rounded-xl"
          >
            بازگشت به لیست
            <FiArrowRight size={16} className="rotate-180" />
          </Link>
        </div>
      </div>

      {/* بخش ویژگی‌های اصلی (Features) */}
      {line.features.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#c9a24d]"></span>
            ویژگی‌های اصلی
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {line.features.map((feature) => (
              <FeatureCard key={feature.id} feature={feature} />
            ))}
          </div>
        </section>
      )}

      {/* بخش زیرمجموعه‌ها (Children) */}
      {line.children.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#0b2622]"></span>
            زیرمجموعه‌ها ({line.children.length})
          </h2>
          <div className="flex flex-col gap-6">
            {line.children.map((child) => (
              <ChildLineCard key={child.id} child={child} />
            ))}
          </div>
        </section>
      )}

      {line.features.length === 0 && line.children.length === 0 && (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <p className="text-slate-500">اطلاعات تکمیلی یا زیرمجموعه‌ای برای این بخش ثبت نشده است.</p>
        </div>
      )}

    </div>
  );
}