"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FiArrowRight,
  FiFile,
  FiLayers,
  FiUsers,
  FiBriefcase,
  FiPlus,
  FiFileText,
  FiClipboard,
  FiCheckCircle,
  FiX,
} from "react-icons/fi";
import type { LineDetail, Feature, LineChild } from "@/types";

/* ------------------------------------------------------------------ */
/* پالت رنگی برای تفکیک بصری دسترسی‌های سریع و زیرمجموعه‌ها             */
/* ------------------------------------------------------------------ */
const ACCENTS = [
  { icon: "text-gold", iconBg: "bg-gold/10 border border-gold/20" },
  { icon: "text-[#8fae7d]", iconBg: "bg-[#8fae7d]/10 border border-[#8fae7d]/20" },
  { icon: "text-[#5fa0c9]", iconBg: "bg-[#5fa0c9]/10 border border-[#5fa0c9]/20" },
  { icon: "text-purple-400", iconBg: "bg-purple-400/10 border border-purple-400/20" },
  { icon: "text-[#c97d95]", iconBg: "bg-[#c97d95]/10 border border-[#c97d95]/20" },
];

const FILE_ACCENTS: Record<string, { label: string; classes: string }> = {
  pdf: { label: "PDF", classes: "bg-[#c97d95]/10 text-[#c97d95] border-[#c97d95]/25" },
  doc: { label: "Word", classes: "bg-[#5fa0c9]/10 text-[#5fa0c9] border-[#5fa0c9]/25" },
  docx: { label: "Word", classes: "bg-[#5fa0c9]/10 text-[#5fa0c9] border-[#5fa0c9]/25" },
  xls: { label: "Excel", classes: "bg-[#8fae7d]/10 text-[#8fae7d] border-[#8fae7d]/25" },
  xlsx: { label: "Excel", classes: "bg-[#8fae7d]/10 text-[#8fae7d] border-[#8fae7d]/25" },
  zip: { label: "فشرده", classes: "bg-gold/10 text-gold border-gold/25" },
  rar: { label: "فشرده", classes: "bg-gold/10 text-gold border-gold/25" },
};

const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "webp", "avif", "bmp", "svg"];

function getFileExtension(url?: string | null) {
  if (!url) return "";
  const clean = url.split("?")[0];
  const parts = clean.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";
}

function isImageUrl(url?: string | null) {
  return IMAGE_EXTENSIONS.includes(getFileExtension(url));
}

function getFileAccent(ext: string) {
  return (
    FILE_ACCENTS[ext] ?? {
      label: ext ? ext.toUpperCase() : "فایل",
      classes: "bg-gold/10 text-gold border-gold/25",
    }
  );
}

/* ------------------------------------------------------------------ */
/* کارت ویژگی — عکس‌ها به‌صورت تصویری با لایت‌باکس، بقیه به‌صورت فایل   */
/* ------------------------------------------------------------------ */
function FeatureCard({ feature }: { feature: Feature }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const fileUrl = feature.media?.file || null;
  const image = isImageUrl(fileUrl);
  const fileAccent = getFileAccent(getFileExtension(fileUrl));

  if (image && fileUrl) {
    return (
      <>
        <button
          onClick={() => setLightboxOpen(true)}
          className="group relative block aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/5"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={fileUrl}
            alt={feature.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-4 text-right">
            <h4 className="text-sm font-bold text-white">{feature.title}</h4>
          </div>
        </button>

        {lightboxOpen && (
          <div
            onClick={() => setLightboxOpen(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-6 backdrop-blur-sm"
          >
            <button
              onClick={() => setLightboxOpen(false)}
              aria-label="بستن"
              className="absolute left-6 top-6 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            >
              <FiX size={20} />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={fileUrl}
              alt={feature.title}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] max-w-full rounded-2xl shadow-2xl"
            />
          </div>
        )}
      </>
    );
  }

  return (
    <div className="rounded-2xl border border-white/5 bg-deep-2/30 p-5 transition-colors hover:border-gold/30">
      <h4 className="mb-2 font-bold text-cream">{feature.title}</h4>
      {feature.text && (
        <p className="mb-3 text-sm leading-relaxed text-cream/70">{feature.text}</p>
      )}
      {fileUrl && (
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors hover:brightness-110 ${fileAccent.classes}`}
        >
          <FiFile size={14} />
          دانلود {fileAccent.label}
        </a>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* کارت زیرمجموعه به همراه ویژگی‌های خودش                              */
/* ------------------------------------------------------------------ */
function ChildLineCard({ child, index }: { child: LineChild; index: number }) {
  const accent = ACCENTS[index % ACCENTS.length];

  return (
    <div className="rounded-3xl border border-white/5 bg-deep-2/20 p-6">
      <div className="mb-4 flex items-center gap-3 border-b border-white/5 pb-4">
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${accent.iconBg} ${accent.icon}`}
        >
          <FiLayers size={16} />
        </span>
        <h3 className="text-lg font-bold text-cream">{child.title}</h3>
      </div>

      {child.descriptions && (
        <p className="mb-6 text-sm leading-relaxed text-cream/70">{child.descriptions}</p>
      )}

      {child.features.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {child.features.map((f) => (
            <FeatureCard key={f.id} feature={f} />
          ))}
        </div>
      ) : (
        <p className="text-xs italic text-cream/30">ویژگی ثبت شده‌ای ندارد.</p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* دسترسی سریع — به‌جای دراپ‌داون، یک ردیف کاشی‌های ساده و همیشه نمایان */
/* ------------------------------------------------------------------ */
function QuickAction({
  href,
  icon: Icon,
  label,
  accent,
}: {
  href: string;
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  accent: { icon: string; iconBg: string };
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-2xl border border-white/5 bg-deep-2/30 px-4 py-3 transition-all hover:-translate-y-0.5 hover:border-white/10"
    >
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${accent.iconBg} ${accent.icon}`}>
        <Icon size={16} />
      </span>
      <span className="text-sm font-bold text-cream/85 transition-colors group-hover:text-white">
        {label}
      </span>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* نمای اصلی                                                           */
/* ------------------------------------------------------------------ */
export default function LineDetailView({ line }: { line: LineDetail }) {
  const [descExpanded, setDescExpanded] = useState(false);
  const description = line.descriptions?.trim() || "";
  const isLongDescription = description.length > 220;

  const quickActions = [
    { href: `/staff/line/${line.id}/members`, icon: FiUsers, label: "اعضای بخش" },
    { href: `/staff/line/${line.id}/staff`, icon: FiBriefcase, label: "کارمندان بخش" },
    { href: `/staff/line/${line.id}/content/create`, icon: FiPlus, label: "ایجاد محتوا" },
    { href: `/staff/line/${line.id}/content`, icon: FiFileText, label: "آرشیو محتوا" },
    { href: `/staff/line/${line.id}/consultation`, icon: FiClipboard, label: "فرم‌ها و قراردادها" },
    { href: `/staff/line/${line.id}/assignments`, icon: FiCheckCircle, label: "مدیریت تکالیف" },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* هدر مینیمال */}
      <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-deep-2/30 p-7 md:p-9">
        <div className="absolute -top-16 left-0 h-48 w-48 rounded-full bg-gold/[0.06] blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-2xl">
            {line.parent && (
              <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-cream/50">
                زیرمجموعه
              </span>
            )}

            <h1 className="text-2xl font-extrabold leading-snug text-cream md:text-3xl">
              {line.title}
            </h1>

            {description && (
              <div className="mt-3">
                <p
                  className={`text-sm leading-relaxed text-cream/60 ${
                    descExpanded ? "" : "line-clamp-3"
                  }`}
                >
                  {description}
                </p>
                {isLongDescription && (
                  <button
                    onClick={() => setDescExpanded((v) => !v)}
                    className="mt-2 text-xs font-bold text-gold/80 transition-colors hover:text-gold"
                  >
                    {descExpanded ? "نمایش کمتر" : "نمایش کامل توضیحات"}
                  </button>
                )}
              </div>
            )}
          </div>

          <Link
            href="/line"
            className="flex shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-deep/50 px-4 py-2 text-sm font-medium text-cream/60 transition-colors hover:border-gold/30 hover:text-gold"
          >
            بازگشت به لیست
            <FiArrowRight size={16} className="rotate-180" />
          </Link>
        </div>
      </div>

      {/* دسترسی سریع به صفحات مرتبط */}
      <div className="flex flex-wrap gap-3">
        {quickActions.map((action, i) => (
          <QuickAction key={action.href} {...action} accent={ACCENTS[i % ACCENTS.length]} />
        ))}
      </div>

      {/* ویژگی‌های اصلی */}
      {line.features.length > 0 && (
        <section>
          <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-cream">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            ویژگی‌های اصلی
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {line.features.map((feature) => (
              <FeatureCard key={feature.id} feature={feature} />
            ))}
          </div>
        </section>
      )}

      {/* زیرمجموعه‌ها */}
      {line.children.length > 0 && (
        <section>
          <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-cream">
            <span className="h-1.5 w-1.5 rounded-full bg-[#8fae7d]" />
            زیرمجموعه‌ها
            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] font-medium text-cream/50">
              {line.children.length}
            </span>
          </h2>
          <div className="flex flex-col gap-5">
            {line.children.map((child, i) => (
              <ChildLineCard key={child.id} child={child} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* حالت خالی */}
      {line.features.length === 0 && line.children.length === 0 && (
        <div className="rounded-3xl border border-dashed border-white/10 bg-deep-2/20 py-14 text-center">
          <FiLayers size={32} className="mx-auto mb-3 text-cream/20" />
          <p className="text-sm text-cream/40">
            اطلاعات تکمیلی یا زیرمجموعه‌ای برای این بخش ثبت نشده است.
          </p>
        </div>
      )}
    </div>
  );
}