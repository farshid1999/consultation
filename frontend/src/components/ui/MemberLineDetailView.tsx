"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FiArrowRight,
  FiFile,
  FiLayers,
  FiBox,
  FiChevronLeft,
  FiFileText,
  FiClock,
  FiCheckCircle,
  FiX,
} from "react-icons/fi";
import { useMemberAssignments } from "@/hooks/useAssignment";
import { formatJalaliDateTime } from "@/lib/jalaali";
import type { LineDetail, Feature, LineChild } from "@/types";

/* ------------------------------------------------------------------ */
/* رنگ‌های اختصاصی هر بخش/آیتم — متنوع اما هماهنگ با تم سبز-طلایی      */
/* ------------------------------------------------------------------ */
const ACCENTS = [
  {
    icon: "text-gold",
    iconBg: "bg-gradient-to-br from-gold/25 to-gold/5",
    ring: "border-gold/25",
    glow: "bg-gold/10",
  },
  {
    icon: "text-[#8fae7d]",
    iconBg: "bg-gradient-to-br from-[#8fae7d]/25 to-[#8fae7d]/5",
    ring: "border-[#8fae7d]/25",
    glow: "bg-[#8fae7d]/10",
  },
  {
    icon: "text-[#c9814d]",
    iconBg: "bg-gradient-to-br from-[#c9814d]/25 to-[#c9814d]/5",
    ring: "border-[#c9814d]/25",
    glow: "bg-[#c9814d]/10",
  },
  {
    icon: "text-[#c97d95]",
    iconBg: "bg-gradient-to-br from-[#c97d95]/25 to-[#c97d95]/5",
    ring: "border-[#c97d95]/25",
    glow: "bg-[#c97d95]/10",
  },
  {
    icon: "text-[#5fa0c9]",
    iconBg: "bg-gradient-to-br from-[#5fa0c9]/25 to-[#5fa0c9]/5",
    ring: "border-[#5fa0c9]/25",
    glow: "bg-[#5fa0c9]/10",
  },
];

const FILE_ACCENTS: Record<string, { label: string; classes: string }> = {
  pdf: { label: "PDF", classes: "bg-[#c97d95]/10 text-[#c97d95] border-[#c97d95]/25" },
  doc: { label: "Word", classes: "bg-[#5fa0c9]/10 text-[#5fa0c9] border-[#5fa0c9]/25" },
  docx: { label: "Word", classes: "bg-[#5fa0c9]/10 text-[#5fa0c9] border-[#5fa0c9]/25" },
  xls: { label: "Excel", classes: "bg-[#8fae7d]/10 text-[#8fae7d] border-[#8fae7d]/25" },
  xlsx: { label: "Excel", classes: "bg-[#8fae7d]/10 text-[#8fae7d] border-[#8fae7d]/25" },
  zip: { label: "فشرده", classes: "bg-[#c9814d]/10 text-[#c9814d] border-[#c9814d]/25" },
  rar: { label: "فشرده", classes: "bg-[#c9814d]/10 text-[#c9814d] border-[#c9814d]/25" },
  mp4: { label: "ویدیو", classes: "bg-gold/10 text-gold border-gold/25" },
  mp3: { label: "صوتی", classes: "bg-gold/10 text-gold border-gold/25" },
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
/* کارت ویژگی — اگر فایل پیوست عکس باشد به‌صورت تصویری و با لایت‌باکس   */
/* ------------------------------------------------------------------ */
function MemberFeatureCard({ feature, index }: { feature: Feature; index: number }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const fileUrl = feature.media?.file || null;
  const ext = getFileExtension(fileUrl);
  const image = isImageUrl(fileUrl);
  const fileAccent = getFileAccent(ext);
  const featured = index === 0;

  if (image && fileUrl) {
    return (
      <>
        <div
          style={{ animationDelay: `${index * 70}ms` }}
          className={`animate-riseIn group relative overflow-hidden rounded-3xl border border-white/5 bg-deep-2/40 opacity-0 ${
            featured ? "sm:col-span-2" : ""
          }`}
        >
          <button
            onClick={() => setLightboxOpen(true)}
            className="relative block aspect-[16/10] w-full overflow-hidden"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={fileUrl}
              alt={feature.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-right">
              <h4 className="text-lg font-bold text-white">{feature.title}</h4>
              {feature.text && (
                <p className="mt-1 text-xs text-cream/60 line-clamp-1">{feature.text}</p>
              )}
            </div>
          </button>
        </div>

        {lightboxOpen && (
          <div
            onClick={() => setLightboxOpen(false)}
            className="animate-fadeIn fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-6 backdrop-blur-sm"
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
    <div
      style={{ animationDelay: `${index * 70}ms` }}
      className={`animate-riseIn group relative overflow-hidden rounded-3xl border border-white/5 bg-deep-2/40 p-6 opacity-0 transition-all duration-300 hover:-translate-y-1 hover:border-gold/30 ${
        featured ? "sm:col-span-2" : ""
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="relative z-10">
        <h4 className="mb-3 text-lg font-bold text-white">{feature.title}</h4>
        {feature.text && (
          <p className="mb-4 text-sm leading-relaxed text-cream/70">{feature.text}</p>
        )}
        {fileUrl && (
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-bold transition-colors hover:brightness-110 ${fileAccent.classes}`}
          >
            <FiFile size={14} />
            دانلود {fileAccent.label}
          </a>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* کارت زیرمجموعه                                                      */
/* ------------------------------------------------------------------ */
function MemberChildCard({ child, index }: { child: LineChild; index: number }) {
  const accent = ACCENTS[index % ACCENTS.length];
  const featured = index === 0;

  return (
    <Link
      href={`/member/lines/${child.id}`}
      style={{ animationDelay: `${index * 70}ms` }}
      className={`animate-riseIn group relative block overflow-hidden rounded-3xl border border-white/5 bg-[#0b2622] p-6 opacity-0 transition-all duration-300 hover:-translate-y-1 hover:border-white/10 ${
        featured ? "sm:col-span-2" : ""
      }`}
    >
      <div
        className={`pointer-events-none absolute -top-8 left-0 h-32 w-32 rounded-full ${accent.glow} opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100`}
      />

      <div className="relative z-10 mb-4 flex items-start justify-between">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl border ${accent.ring} ${accent.iconBg} ${accent.icon}`}
        >
          <FiLayers size={20} />
        </div>
        <FiChevronLeft className="text-cream/20 transition-all group-hover:-translate-x-1 group-hover:text-gold" />
      </div>

      <h3 className="relative z-10 mb-2 text-xl font-bold text-white transition-colors group-hover:text-gold">
        {child.title}
      </h3>
      <p className="relative z-10 text-sm text-cream/60 line-clamp-2">
        {child.descriptions || "برای مشاهده جزئیات کلیک کنید..."}
      </p>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* کارت تکلیف                                                          */
/* ------------------------------------------------------------------ */
function AssignmentCard({
  assignment,
  lineId,
  index,
  featured,
}: {
  assignment: any;
  lineId: string;
  index: number;
  featured?: boolean;
}) {
  return (
    <Link
      href={`/member/lines/${lineId}/assignments/${assignment.id}`}
      style={{ animationDelay: `${index * 70}ms` }}
      className={`animate-riseIn group relative block rounded-2xl border border-white/5 bg-gradient-to-br from-[#0b2622] to-[#0a1f1c] opacity-0 transition-all duration-300 hover:-translate-y-1 hover:border-gold/30 ${
        featured ? "p-7 sm:col-span-2" : "p-5"
      }`}
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gold/20 bg-gold/10 text-gold">
          <FiFileText size={18} />
        </div>
        <FiChevronLeft className="shrink-0 text-cream/20 transition-all group-hover:-translate-x-1 group-hover:text-gold" />
      </div>

      <h4
        className={`mb-2 font-bold text-white transition-colors group-hover:text-gold ${
          featured ? "text-xl line-clamp-1" : "line-clamp-1 text-base"
        }`}
      >
        {assignment.title}
      </h4>

      {assignment.description && (
        <p className={`mb-3 text-cream/50 ${featured ? "text-sm line-clamp-2" : "text-xs line-clamp-2"}`}>
          {assignment.description}
        </p>
      )}

      <div className="flex items-center gap-1.5 text-xs text-cream/40">
        <FiClock size={12} />
        <span>{formatJalaliDateTime(new Date(assignment.created_at))}</span>
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* بخش تکالیف                                                          */
/* ------------------------------------------------------------------ */
function AssignmentsSection({ lineId }: { lineId: string }) {
  const { data: assignmentsData, isLoading } = useMemberAssignments(lineId, {
    page: 1,
  });

  const assignments = assignmentsData?.results || [];
  const totalCount = assignmentsData?.pagination?.count || 0;
  const hasAssignments = totalCount > 0;

  if (isLoading) {
    return (
      <section>
        <SectionHeading title="تکالیف من" />
        <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-gold/10 bg-deep-2/20">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
        </div>
      </section>
    );
  }

  return (
    <section>
      <SectionHeading
        title="تکالیف من"
        badge={hasAssignments ? `${totalCount} تکلیف` : undefined}
        action={
          hasAssignments
            ? { label: "مشاهده همه", href: `/member/lines/${lineId}/assignments` }
            : undefined
        }
      />

      {hasAssignments ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {assignments.slice(0, 3).map((assignment, i) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              lineId={lineId}
              index={i}
              featured={i === 0}
            />
          ))}

          {totalCount > 3 && (
            <Link
              href={`/member/lines/${lineId}/assignments`}
              style={{ animationDelay: "210ms" }}
              className="animate-riseIn group flex min-h-[160px] items-center justify-center rounded-2xl border-2 border-dashed border-gold/20 bg-deep-2/20 opacity-0 transition-all hover:border-gold/40 hover:bg-gold/5"
            >
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-gold/20 bg-gold/10 text-gold transition-transform group-hover:scale-110">
                  <FiChevronLeft size={24} />
                </div>
                <p className="text-sm font-medium text-gold">
                  مشاهده {totalCount - 3} تکلیف دیگر
                </p>
              </div>
            </Link>
          )}
        </div>
      ) : (
        <EmptyPanel
          icon={<FiCheckCircle size={28} className="text-gold" />}
          title="تکلیفی برای شما تعریف نشده است"
          description="در حال حاضر تکلیفی برای این بخش ثبت نشده است. به محض تعریف تکلیف جدید، اینجا نمایش داده می‌شود."
        />
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* اجزای کمکی مشترک                                                    */
/* ------------------------------------------------------------------ */
function SectionHeading({
  title,
  badge,
  action,
}: {
  title: string;
  badge?: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        {badge && (
          <span className="rounded-full border border-gold/20 bg-gold/10 px-3 py-1 text-xs font-medium text-gold">
            {badge}
          </span>
        )}
        <div className="h-px w-12 bg-gradient-to-l from-white/10 to-transparent" />
      </div>

      {action && (
        <Link
          href={action.href}
          className="flex items-center gap-2 rounded-xl border border-gold/20 bg-gold/10 px-4 py-2 text-sm font-medium text-gold transition-all hover:border-gold/40 hover:bg-gold/20"
        >
          {action.label}
          <FiChevronLeft size={14} />
        </Link>
      )}
    </div>
  );
}

function EmptyPanel({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-gold/10 bg-deep-2/20 py-16 text-center backdrop-blur-sm">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-gold/20 bg-gold/10">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-bold text-white">{title}</h3>
      <p className="mx-auto max-w-md text-sm text-cream/50">{description}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* صفحه اصلی جزئیات                                                    */
/* ------------------------------------------------------------------ */
export default function MemberLineDetailView({ line }: { line: LineDetail }) {
  const filesCount = line.features.filter((f) => f.media?.file).length;
  const [descExpanded, setDescExpanded] = useState(false);
  const description = line.descriptions?.trim() || "";
  const isLongDescription = description.length > 220;

  return (
    <div className="flex flex-col gap-12 pb-20">
      {/* انیمیشن‌های اختصاصی این صفحه — یک‌بار تعریف، همه‌جا استفاده */}
      <style jsx global>{`
        @keyframes riseIn {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes spinSlow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-riseIn {
          animation: riseIn 0.55s ease-out forwards;
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
        .animate-spin-slow {
          animation: spinSlow 7s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-riseIn,
          .animate-fadeIn,
          .animate-spin-slow {
            animation: none !important;
            opacity: 1 !important;
          }
        }
      `}</style>

      {/* هدر مینیمال */}
      <div className="relative overflow-hidden rounded-[2rem] border border-white/5 bg-[#0b2622] p-7 md:p-10">
        <div className="absolute -top-20 right-0 h-56 w-56 rounded-full bg-gold/[0.06] blur-3xl" />

        <div className="relative z-10 max-w-2xl">
          <div className="mb-4 flex items-center gap-2 text-xs font-medium text-gold/70">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            بخش اختصاصی
          </div>

          <h1 className="text-2xl font-extrabold leading-snug text-white md:text-3xl">
            {line.title}
          </h1>

          {description && (
            <div className="mt-4">
              <p
                className={`text-sm leading-relaxed text-cream/55 md:text-[15px] ${
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
      </div>

      {/* نوار آمار — اندازه‌های نامتقارن به‌جای سه باکس یکسان */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="col-span-2 rounded-3xl border border-gold/15 bg-gradient-to-br from-gold/10 to-transparent p-6">
          <div className="flex items-center gap-3 text-gold">
            <FiLayers size={18} />
            <span className="text-sm font-bold">زیرمجموعه‌ها</span>
          </div>
          <p className="mt-4 text-3xl font-extrabold text-white">{line.children.length}</p>
        </div>
        <div className="rounded-3xl border border-white/5 bg-deep-2/40 p-6">
          <div className="flex items-center gap-3 text-[#8fae7d]">
            <FiBox size={18} />
            <span className="text-sm font-bold">ویژگی‌ها</span>
          </div>
          <p className="mt-4 text-3xl font-extrabold text-white">{line.features.length}</p>
        </div>
        <div className="rounded-3xl border border-white/5 bg-deep-2/40 p-6">
          <div className="flex items-center gap-3 text-[#5fa0c9]">
            <FiFile size={18} />
            <span className="text-sm font-bold">فایل‌ها</span>
          </div>
          <p className="mt-4 text-3xl font-extrabold text-white">{filesCount}</p>
        </div>
      </div>

      {/* بخش تکالیف */}
      <AssignmentsSection lineId={String(line.id)} />

      {/* بخش ویژگی‌ها */}
      {line.features.length > 0 && (
        <section>
          <SectionHeading title="ویژگی‌ها و امکانات" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {line.features.map((feature, i) => (
              <MemberFeatureCard key={feature.id} feature={feature} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* بخش زیرمجموعه‌ها */}
      {line.children.length > 0 && (
        <section>
          <SectionHeading title="زیرمجموعه‌های مرتبط" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {line.children.map((child, i) => (
              <MemberChildCard key={child.id} child={child} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* حالت خالی */}
      {line.features.length === 0 && line.children.length === 0 && (
        <EmptyPanel
          icon={<FiLayers size={28} className="text-gold/40" />}
          title="اطلاعات تکمیلی برای این بخش ثبت نشده است"
          description="به محض افزودن ویژگی یا زیرمجموعه جدید، اینجا نمایش داده می‌شود."
        />
      )}
    </div>
  );
}