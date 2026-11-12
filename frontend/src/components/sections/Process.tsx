"use client";

import { motion, useScroll } from "framer-motion";
import { useRef } from "react";
import { processIcons } from "@/data/content";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import { useLang } from "@/components/providers/LanguageProvider";

export default function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { t, isRtl } = useLang();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.4"] });

  return (
    <section id="process" className="relative px-6 py-28 md:px-10 lg:px-16">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <RevealOnScroll direction="fade">
            <span className="text-caption font-semibold text-gold">{t.process.eyebrow}</span>
          </RevealOnScroll>
          <RevealOnScroll direction="up" delay={0.08}>
            <h2 className="mx-auto mt-4 max-w-xl text-h2 font-extrabold text-cream">
              {t.process.title}
            </h2>
          </RevealOnScroll>
        </div>

        <div ref={ref} className="relative mt-20">
          {/* progress spine */}
          <div className="absolute start-6 top-0 h-full w-px bg-cream/10 md:start-1/2 md:ltr:-translate-x-1/2 md:rtl:translate-x-1/2" aria-hidden="true">
            <motion.div
              style={{ scaleY: scrollYProgress }}
              className="h-full w-full origin-top bg-gradient-to-b from-gold to-gold/20"
            />
          </div>

          <div className="flex flex-col gap-16">
            {t.process.steps.map((step, index) => {
              const Icon = processIcons[step.id];
              const isEven = index % 2 === 0;
              // جهت ورود انیمیشن با زبان عوض می‌شود (در LTR مرحله‌ی اول از چپ می‌آید)
              const enterFrom = isEven === isRtl ? "right" : "left";
              return (
                <RevealOnScroll
                  key={step.id}
                  direction={enterFrom}
                  delay={0.05}
                  className="relative"
                >
                  <div
                    className={`flex items-start gap-6 md:w-1/2 ${
                      isEven ? "md:ms-auto md:pe-10 md:text-start" : "md:me-auto md:ps-10"
                    }`}
                  >
                    <span className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-gold/30 bg-deep text-xl text-gold shadow-soft">
                      {Icon && <Icon aria-hidden="true" />}
                    </span>
                    <div>
                      <p className="text-caption text-gold/70">{step.order}</p>
                      <h3 className="mt-1 text-h3 font-bold text-cream">{step.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-cream/60">{step.description}</p>
                    </div>
                  </div>
                </RevealOnScroll>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
