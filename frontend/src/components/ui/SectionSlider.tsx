"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { PublicSliderImage } from "@/types";

interface ImageSliderProps {
  images: PublicSliderImage[];
  intervalSeconds: number;
}

/**
 * اسلایدر تصویر با کراس‌فید، کپشن، نقطه‌های ناوبری و سوایپ.
 * کل فضای والد (relative + overflow-hidden) را پر می‌کند.
 */
export default function SectionSlider({
  images,
  intervalSeconds,
}: ImageSliderProps) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const count = images.length;
  const current = index < count ? index : 0;

  const goTo = useCallback(
    (i: number) => setIndex(((i % count) + count) % count),
    [count],
  );

  // تعویض خودکار؛ با هر تغییر اسلاید (حتی دستی) تایمر از نو شروع می‌شود
  useEffect(() => {
    if (count < 2 || paused || reduced) return;
    const timer = setTimeout(
      () => goTo(current + 1),
      Math.max(intervalSeconds, 1) * 1000,
    );
    return () => clearTimeout(timer);
  }, [count, paused, reduced, intervalSeconds, current, goTo]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    // سایت RTL است: کشیدن به راست = اسلاید بعدی
    if (info.offset.x > 50) goTo(current + 1);
    else if (info.offset.x < -50) goTo(current - 1);
  };

  const active = images[current];
  if (!active) return null;

  const hasCaption = Boolean(active.caption_title || active.caption_text);

  return (
    <div
      className="absolute inset-0"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* تصاویر روی هم، کراس‌فید با opacity */}
      {images.map((img, i) => (
        <motion.img
          key={img.id}
          src={img.image}
          alt={img.caption_title || ""}
          aria-hidden={i !== current}
          draggable={false}
          loading={i === 0 ? "eager" : "lazy"}
          initial={false}
          animate={{ opacity: i === current ? 1 : 0 }}
          transition={{ duration: reduced ? 0 : 0.9, ease: "easeInOut" }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ))}

      {/* گرادیان پایین برای خوانایی کپشن
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-deep/80 to-transparent" /> */}

      {/* لایه‌ی سوایپ (اسکرول عمودی صفحه مختل نمی‌شود) */}
      {count > 1 && (
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={handleDragEnd}
          style={{ touchAction: "pan-y" }}
          className="absolute inset-0 z-[1] cursor-grab active:cursor-grabbing"
        />
      )}

      {/* کپشن */}
      {hasCaption && (
        <div className="pointer-events-none absolute inset-x-8 bottom-8 z-[2]">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: reduced ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduced ? 0 : -8 }}
              transition={{ duration: reduced ? 0 : 0.4 }}
              className="rounded-2xl border border-white/25 bg-white/10 p-5 shadow-[0_8px_32px_rgba(0,0,0,0.25)] backdrop-blur-md"
            >
              {active.caption_title && (
                <p className="text-caption font-semibold text-gold [text-shadow:0_1px_6px_rgba(0,0,0,0.55)]">
                  {active.caption_title}
                </p>
              )}
              {active.caption_text && (
                <p className="mt-1 text-body text-cream [text-shadow:0_1px_6px_rgba(0,0,0,0.55)]">
                  {active.caption_text}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* نقطه‌های ناوبری */}
      {count > 1 && (
        <div className="absolute inset-x-0 top-5 z-[3] flex justify-center gap-2">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`اسلاید ${i + 1}`}
              aria-current={i === current}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === current
                  ? "w-6 bg-gold"
                  : "w-1.5 bg-cream/40 hover:bg-cream/70",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
