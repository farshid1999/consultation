"use client";

import Link from "next/link";
import { FiArrowRight, FiFile, FiLayers } from "react-icons/fi";
import type { LineDetail, Feature, LineChild } from "@/types";

// کامپوننت کمکی برای نمایش هر فیچر با استایل تاریک
function FeatureCard({ feature }: { feature: Feature }) {
  return (
    <div className="rounded-xl border border-cream/10 bg-deep-2/30 p-5 hover:border-gold/30 transition-colors">
      <h4 className="font-bold text-cream mb-2">{feature.title}</h4>
      {feature.text && <p className="text-sm text-cream/70 leading-relaxed mb-3">{feature.text}</p>}

      {feature.media?.file && (
        <a
          href={feature.media.file}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs font-medium text-gold hover:text-gold-soft bg-gold/10 px-3 py-1.5 rounded-lg transition-colors border border-gold/20"
        >
          <FiFile size={14} />
          مشاهده فایل پیوست
        </a>
      )}
    </div>
  );
}

// کامپوننت کمکی برای نمایش فرزندان (Children) با استایل تاریک
function ChildLineCard({ child }: { child: LineChild }) {
  return (
    <div className="rounded-2xl border border-cream/10 bg-deep-2/20 p-6">
      <div className="flex items-center gap-3 mb-4 border-b border-cream/10 pb-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0b2622] text-gold text-xs font-bold border border-gold/20">
          <FiLayers size={14} />
        </span>
        <h3 className="font-bold text-cream text-lg">{child.title}</h3>
      </div>

      {child.descriptions && (
        <p className="text-sm text-cream/70 mb-6 leading-relaxed">{child.descriptions}</p>
      )}

      {child.features.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {child.features.map((f) => (
            <FeatureCard key={f.id} feature={f} />
          ))}
        </div>
      ) : (
        <p className="text-xs text-cream/30 italic">ویژگی ثبت شده‌ای ندارد.</p>
      )}
    </div>
  );
}

export default function LineDetailView({ line }: { line: LineDetail }) {
  return (
    <div className="flex flex-col gap-8">

      {/* هدر اصلی بخش با استایل تاریک */}
      <div className="relative overflow-hidden rounded-3xl bg-deep-2/30 border border-cream/10 shadow-lg p-8">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold to-gold-soft"></div>

        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-cream/40 mb-2">
              {line.parent && (
                <>
                  <span>/</span>
                  <Link href={`/line/${line.parent}`} className="hover:text-gold transition-colors">
                    والد: #{line.parent}
                  </Link>
                </>
              )}
            </div>
            <h1 className="text-3xl font-extrabold text-cream mb-3">{line.title}</h1>
            {line.descriptions && (
              <p className="text-cream/70 leading-relaxed max-w-3xl">{line.descriptions}</p>
            )}
          </div>

          <Link
            href="/line"
            className="shrink-0 flex items-center gap-2 text-sm font-medium text-cream/60 hover:text-gold transition-colors bg-deep/50 border border-cream/10 px-4 py-2 rounded-xl hover:border-gold/30"
          >
            بازگشت به لیست
            <FiArrowRight size={16} className="rotate-180" />
          </Link>
        </div>
      </div>

      {/* بخش ویژگی‌های اصلی (Features) */}
      {line.features.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-cream mb-5 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-gold"></span>
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
          <h2 className="text-xl font-bold text-cream mb-5 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500"></span>
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
        <div className="text-center py-12 bg-deep-2/20 rounded-2xl border border-dashed border-cream/10">
          <p className="text-cream/40">اطلاعات تکمیلی یا زیرمجموعه‌ای برای این بخش ثبت نشده است.</p>
        </div>
      )}

    </div>
  );
}