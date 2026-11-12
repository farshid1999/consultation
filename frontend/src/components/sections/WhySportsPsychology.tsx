"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { PiBrainDuotone } from "react-icons/pi";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import ImageSlider from "@/components/ui/ImageSlider";
import { usePublicSlider } from "@/hooks/useSliders";
import SectionSlider from "@/components/ui/SectionSlider";
import { useLang } from "@/components/providers/LanguageProvider";

const SLIDER_KEY = "why-sports-psychology";

export default function WhySportsPsychology() {
  const { t } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const { data: slider } = usePublicSlider(SLIDER_KEY);
  const hasSlides = !!slider && slider.images.length > 0;

  return (
    <section
      id="why"
      ref={ref}
      className="relative px-6 py-28 md:px-10 lg:px-16"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
        <div>
          <RevealOnScroll direction="right">
            <span className="text-caption font-semibold text-gold">
              {t.why.eyebrow}
            </span>
          </RevealOnScroll>
          <RevealOnScroll direction="right" delay={0.08}>
            <h2 className="mt-4 max-w-lg text-h2 font-extrabold text-cream">
              {t.why.title}
            </h2>
          </RevealOnScroll>

          <div className="mt-10 flex flex-col gap-8">
            {t.why.points.map((point, index) => (
              <RevealOnScroll
                key={point.title}
                direction="up"
                delay={0.15 + index * 0.1}
              >
                <div className="border-s-2 border-gold/30 ps-6">
                  <h3 className="text-h3 font-bold text-cream">
                    {point.title}
                  </h3>
                  <p className="mt-2 max-w-md text-body text-cream/60">
                    {point.text}
                  </p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>

        <motion.div
          style={{ y: imageY }}
          className="relative mx-auto w-full max-w-md"
        >
          <RevealOnScroll direction="scale" duration={1.1}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] border border-cream/10 bg-gradient-to-br from-deep-2 via-deep-3 to-deep shadow-soft">
              {/* لایه‌ی پایه: طراحی اصلی؛ همیشه هست و اسلایدر روی آن می‌نشیند */}
              <div className="absolute inset-0 flex items-center justify-center">
                <PiBrainDuotone
                  className="text-[9rem] text-gold/25"
                  aria-hidden="true"
                />
              </div>

              {hasSlides ? (
                <SectionSlider
                  images={slider.images}
                  intervalSeconds={slider.interval_seconds}
                />
              ) : (
                <div className="absolute inset-x-8 bottom-8 rounded-2xl border border-cream/10 bg-deep/70 p-5 backdrop-blur-xl">
                  <p className="text-caption text-gold">{t.why.fallbackStatTitle}</p>
                  <p className="mt-1 text-body text-cream/70">
                    {t.why.fallbackStatText}
                  </p>
                </div>
              )}
            </div>
          </RevealOnScroll>
        </motion.div>
      </div>
    </section>
  );
}
