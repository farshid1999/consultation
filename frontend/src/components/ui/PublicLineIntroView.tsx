"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowUpLeft, FiChevronLeft, FiFile, FiLayers, FiX } from "react-icons/fi";
import Button from "@/components/ui/Button";
import type { LineDetail, Feature, LineChild } from "@/types";

/* ------------------------------------------------------------------ */
/* تشخیص فایل تصویری                                                   */
/* ------------------------------------------------------------------ */
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

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

/* ------------------------------------------------------------------ */
/* یک آیتم از بخش ویژگی‌ها — چیدمان masonry (ستونی)، اندازه‌ی هرکدوم    */
/* طبیعتاً از حجم محتوایش میاد، نه از یک قالب یکسان                    */
/* ------------------------------------------------------------------ */
function FeatureItem({ feature, index }: { feature: Feature; index: number }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const fileUrl = feature.media?.file || null;
  const image = isImageUrl(fileUrl);

  const wrapperMotion = {
    variants: fadeUp,
    initial: "hidden",
    whileInView: "show",
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.5, delay: (index % 6) * 0.05, ease: [0.16, 1, 0.3, 1] },
  } as const;

  // آیتم تصویری — تنها موردی که واقعا شکل «کارت» دارد، چون تصویر نیاز به قاب دارد
  if (image && fileUrl) {
    return (
      <motion.div {...wrapperMotion} className="mb-6 break-inside-avoid">
        <button onClick={() => setLightboxOpen(true)} className="group block w-full text-right">
          <div className="overflow-hidden rounded-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={fileUrl}
              alt={feature.title}
              className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </div>
          <div className="mt-3">
            <h4 className="font-bold text-cream">{feature.title}</h4>
            {feature.text && (
              <p className="mt-1 text-sm leading-relaxed text-cream/55 line-clamp-2">
                {feature.text}
              </p>
            )}
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
      </motion.div>
    );
  }

  // آیتم متنی — بدون باکس و بوردر، فقط یک خط جداکننده‌ی ظریف بالا؛ سبک و مینیمال
  return (
    <motion.div {...wrapperMotion} className="mb-6 break-inside-avoid border-t border-cream/10 pt-5">
      <span className="mb-3 block text-xs font-bold text-gold/60">
        {String(index + 1).padStart(2, "0")}
      </span>
      <h4 className="mb-1.5 font-bold text-cream">{feature.title}</h4>
      {feature.text && (
        <p className="text-sm leading-relaxed text-cream/55">{feature.text}</p>
      )}
      {fileUrl && (
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-gold/80 transition-colors hover:text-gold"
        >
          <FiFile size={13} />
          مشاهده فایل پیوست
        </a>
      )}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* ردیف زیرمجموعه — لیست مینیمال به‌جای شبکه‌ی کارت‌های یکسان            */
/* ------------------------------------------------------------------ */
function ChildLineRow({ child, index }: { child: LineChild; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="border-b border-cream/10 first:border-t"
    >
      <Link
        href={`/line/${child.id}`}
        className="group flex items-center justify-between gap-6 py-5 transition-colors"
      >
        <div className="min-w-0">
          <h3 className="text-base font-bold text-cream transition-colors group-hover:text-gold md:text-lg">
            {child.title}
          </h3>
          {child.descriptions && (
            <p className="mt-1 max-w-lg truncate text-sm text-cream/45">{child.descriptions}</p>
          )}
        </div>

        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cream/10 text-cream/40 transition-all group-hover:border-gold/40 group-hover:text-gold group-hover:-translate-x-1">
          <FiChevronLeft size={16} />
        </span>
      </Link>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* نمای اصلی صفحه‌ی معرفی                                              */
/* ------------------------------------------------------------------ */
export default function PublicLineIntroView({ line }: { line: LineDetail }) {
  const [descExpanded, setDescExpanded] = useState(false);
  const description = line.descriptions?.trim() || "";
  const isLongDescription = description.length > 220;

  return (
    <div className="relative bg-deep pb-24 pt-28 md:pt-36">
      {/* یک نور بسیار ملایم پس‌زمینه، نه دو تا افکت رو هم */}
      <div className="pointer-events-none absolute -top-20 right-1/3 h-80 w-80 rounded-full bg-gold/[0.05] blur-[130px]" />

      <div className="relative mx-auto max-w-3xl px-6">
        {/* مسیر بازگشت */}
        <div className="mb-10 flex items-center gap-2 text-xs text-cream/35">
          <Link href="/" className="transition-colors hover:text-gold">
            صفحه اصلی
          </Link>
          <FiChevronLeft size={11} />
          <span className="text-cream/55">{line.title}</span>
        </div>

        {/* هدر معرفی — ساده، بدون بج بزرگ و بدون گرادیان روی متن */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {line.parent && (
            <div className="mb-4 flex items-center gap-2 text-xs font-medium text-gold/70">
              <span className="h-1 w-1 rounded-full bg-gold" />
              زیرمجموعه‌ی تخصصی
            </div>
          )}

          <h1 className="text-3xl font-extrabold leading-tight text-cream md:text-[2.75rem]">
            {line.title}
          </h1>

          {description && (
            <div className="mt-5 max-w-xl">
              <p
                className={`text-base leading-relaxed text-cream/55 ${
                  descExpanded ? "" : "line-clamp-3"
                }`}
              >
                {description}
              </p>
              {isLongDescription && (
                <button
                  onClick={() => setDescExpanded((v) => !v)}
                  className="mt-2 text-xs font-bold text-gold/70 transition-colors hover:text-gold"
                >
                  {descExpanded ? "نمایش کمتر" : "ادامه‌ی متن"}
                </button>
              )}
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-5">
            <Button variant="primary" className="px-6 py-3 text-sm">
              رزرو جلسه
              <FiArrowUpLeft className="mr-1" size={16} />
            </Button>

            {line.children.length > 0 && (
              <a
                href="#sub-lines"
                className="text-sm font-medium text-cream/50 underline decoration-cream/20 underline-offset-4 transition-colors hover:text-gold hover:decoration-gold/40"
              >
                مشاهده زیرمجموعه‌ها
              </a>
            )}
          </div>
        </motion.div>

        {/* ویژگی‌ها — چیدمان ستونی (masonry)، بدون قاب یکنواخت برای همه */}
        {line.features.length > 0 && (
          <section className="mt-20">
            <h2 className="mb-8 text-xs font-bold uppercase tracking-wider text-cream/40">
              آنچه در این مسیر همراه شماست
            </h2>

            <div className="columns-1 gap-6 sm:columns-2">
              {line.features.map((feature, i) => (
                <FeatureItem key={feature.id} feature={feature} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* زیرمجموعه‌ها — لیست ساده به‌جای شبکه‌ی کارت */}
        {line.children.length > 0 && (
          <section id="sub-lines" className="mt-20 scroll-mt-32">
            <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-cream/40">
              زیرمجموعه‌های این بخش
            </h2>
            <div>
              {line.children.map((child, i) => (
                <ChildLineRow key={child.id} child={child} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* حالت خالی */}
        {line.features.length === 0 && line.children.length === 0 && (
          <div className="mt-20 border-t border-cream/10 pt-10 text-center">
            <FiLayers size={26} className="mx-auto mb-3 text-cream/20" />
            <p className="text-sm text-cream/40">اطلاعات تکمیلی برای این بخش ثبت نشده است.</p>
          </div>
        )}
      </div>
    </div>
  );
}