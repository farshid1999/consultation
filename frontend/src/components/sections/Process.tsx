"use client";

import { motion, useScroll } from "framer-motion";
import { useRef } from "react";
import { processSteps } from "@/data/content";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

export default function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.4"] });

  return (
    <section id="process" dir="rtl" className="relative px-6 py-28 md:px-10 lg:px-16">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <RevealOnScroll direction="fade">
            <span className="text-caption font-semibold text-gold">فرآیند مشاوره</span>
          </RevealOnScroll>
          <RevealOnScroll direction="up" delay={0.08}>
            <h2 className="mx-auto mt-4 max-w-xl text-h2 font-extrabold text-cream">
              مسیری چهار مرحله‌ای، شفاف از ابتدا تا میدان مسابقه
            </h2>
          </RevealOnScroll>
        </div>

        <div ref={ref} className="relative mt-20">
          {/* progress spine */}
          <div className="absolute right-6 top-0 h-full w-px bg-cream/10 md:right-1/2 md:translate-x-1/2" aria-hidden="true">
            <motion.div
              style={{ scaleY: scrollYProgress }}
              className="h-full w-full origin-top bg-gradient-to-b from-gold to-gold/20"
            />
          </div>

          <div className="flex flex-col gap-16">
            {processSteps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;
              return (
                <RevealOnScroll
                  key={step.id}
                  direction={isEven ? "right" : "left"}
                  delay={0.05}
                  className="relative"
                >
                  <div
                    className={`flex items-start gap-6 md:w-1/2 ${
                      isEven ? "md:mr-auto md:pl-10 md:text-right" : "md:ml-auto md:pr-10"
                    }`}
                  >
                    <span className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-gold/30 bg-deep text-xl text-gold shadow-soft">
                      <Icon aria-hidden="true" />
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
